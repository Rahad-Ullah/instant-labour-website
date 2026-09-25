"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { getCookie } from "cookies-next";
import { myFetch } from "@/utils/myFetch";
import { getUserIdClient } from "@/utils/getUserIdClient";

interface NotificationContextType {
  unreadCount: number;
  resetUnreadCount: () => void;
  unreadMessageCount: number;
  resetUnreadMessageCount: () => void;
  refreshUnreadMessageCount: (openChatId?: string | null) => void;
  activeChatId: string | null;
  setActiveChatId: (id: string | null, participantId?: string | null) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

// const SOCKET_URL = "http://10.10.7.50:5002/";
// const SOCKET_URL = "https://api.instantlabour.co.uk/";
const SOCKET_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const [userId, setUserId] = useState<string | null>(() => getUserIdClient());
  const [activeChatId, setActiveChatIdState] = useState<string | null>(null);
  const activeChatIdRef = useRef<string | null>(null);
  const activeParticipantIdRef = useRef<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  // 1. Initialize user ID synchronously from token if possible, then verify via profile
  useEffect(() => {
    const accessToken = getCookie("accessToken");
    if (!accessToken) {
      setUserId(null);
      setUnreadCount(0);
      setUnreadMessageCount(0);
      return;
    }

    const tokenUserId = getUserIdClient();
    if (tokenUserId) {
      setUserId((prev) => prev || tokenUserId);
    }

    const getProfile = async () => {
      try {
        const res = await myFetch("/user/profile", { method: "GET" });
        if (res.success && (res.data?._id || res.data?.id || res.data?.authId)) {
          const profileId = res.data._id || res.data.id || res.data.authId;
          setUserId(profileId);
        }
      } catch (err) {
        console.error("Failed to fetch profile for notifications:", err);
      }
    };
    getProfile();
  }, [pathname]);

  // Fetch initial notifications count
  useEffect(() => {
    if (!userId) return;
    const fetchNotifications = async () => {
      try {
        const res = await myFetch("/notifications", { method: "GET" });
        if (res.success && Array.isArray(res.data)) {
          const unread = res.data.filter((n: any) => !n.isRead).length;
          setUnreadCount(unread);
        }
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };
    fetchNotifications();
  }, [userId]);

  // Fetch unread messages count (excluding currently open chat)
  const fetchMessagesCount = useCallback(
    async (openChatId?: string | null) => {
      const currentActiveId = (
        openChatId !== undefined ? openChatId : activeChatIdRef.current
      )?.toString()?.toLowerCase();
      const currentActivePartId = activeParticipantIdRef.current?.toString()?.toLowerCase();
      const currentUserId = userId || getUserIdClient();
      if (!currentUserId) return;
      try {
        const res = await myFetch("/chat", { method: "GET" });
        if (res.success && Array.isArray(res.data)) {
          let unread = 0;
          res.data.forEach((chat: any) => {
            const chatId = (chat?._id || chat?._ids || chat?.id)?.toString()?.toLowerCase();
            const participantId = (
              chat?.participant?._id ||
              chat?.participant?.id ||
              chat?.participant
            )?.toString()?.toLowerCase();

            // If the user currently has this chat open on screen, do NOT count it as unread!
            if (currentActiveId && chatId && chatId === currentActiveId) {
              return;
            }
            if (currentActivePartId && participantId && participantId === currentActivePartId) {
              return;
            }

            if (typeof chat?.unreadCount === "number" && chat.unreadCount > 0) {
              unread += chat.unreadCount;
            } else {
              const receiverId = (
                chat?.latestMessage?.receiver?._id ||
                chat?.latestMessage?.receiver?.id ||
                (typeof chat?.latestMessage?.receiver === "string" ? chat.latestMessage.receiver : null)
              )?.toString();
              const senderId = (
                chat?.latestMessage?.sender?._id ||
                chat?.latestMessage?.sender?.id ||
                (typeof chat?.latestMessage?.sender === "string" ? chat.latestMessage.sender : null)
              )?.toString();
              const pId = (
                chat?.participant?._id ||
                chat?.participant?.id ||
                (typeof chat?.participant === "string" ? chat.participant : null)
              )?.toString();

              let latestIsMe = false;
              if (senderId && currentUserId && senderId === currentUserId.toString()) {
                latestIsMe = true;
              } else if (receiverId && pId && receiverId === pId) {
                latestIsMe = true;
              } else if (receiverId && currentUserId && receiverId === currentUserId.toString()) {
                latestIsMe = false;
              } else if (senderId && pId && senderId === pId) {
                latestIsMe = false;
              } else if (receiverId && pId && receiverId !== pId) {
                latestIsMe = false;
              } else if (receiverId && currentUserId && receiverId !== currentUserId.toString()) {
                latestIsMe = true;
              }

              const isFromOther = !latestIsMe;
              if (
                chat?.latestMessage &&
                chat.latestMessage.isRead === false &&
                isFromOther
              ) {
                unread += 1;
              }
            }
          });
          setUnreadMessageCount(unread);
        }
      } catch (err) {
        console.error("Failed to fetch chats for unread count:", err);
      }
    },
    [userId]
  );

  // Fetch initial messages count when userId is set
  useEffect(() => {
    if (!userId) return;
    fetchMessagesCount();
  }, [userId, fetchMessagesCount]);

  // Set active chat ID and participant ID, and refresh unread count immediately
  const setActiveChatId = useCallback(
    (id: string | null, participantId?: string | null) => {
      setActiveChatIdState(id);
      activeChatIdRef.current = id;
      activeParticipantIdRef.current = participantId || null;
      fetchMessagesCount(id);
    },
    [fetchMessagesCount]
  );

  // 2. Socket Connection
  useEffect(() => {
    if (!userId) return;

    const accessToken = getCookie("accessToken");

    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      withCredentials: true,
      auth: {
        token: accessToken,
      },
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Global Notification/Chat Socket connected");
    });

    const handleNewNotification = (newNotification: any) => {
      console.log("New Notification received in Context:", newNotification);
      setUnreadCount((prev) => prev + 1);
    };

    socket.on(`notification::${userId}`, handleNewNotification);
    socket.on("notification::[object Object]", handleNewNotification);
    socket.on("notification", (newNotification: any) => {
      const targetTo = (
        newNotification?.to?._id ||
        newNotification?.to?.id ||
        newNotification?.to
      )?.toString();
      if (!targetTo || targetTo === userId || targetTo === "[object Object]") {
        handleNewNotification(newNotification);
      }
    });

    // Listen for new messages
    socket.on(`message::${userId}`, (newMessage: any) => {
      console.log("New Message received in Context:", newMessage);
      const incomingChatId = (
        newMessage?.chat?._id ||
        newMessage?.chat?.id ||
        newMessage?.chatId ||
        newMessage?.chat_id ||
        newMessage?.chat
      )?.toString()?.toLowerCase();

      const senderId = (
        newMessage?.sender?._id ||
        newMessage?.sender?.id ||
        newMessage?.sender
      )?.toString()?.toLowerCase();

      const receiverId = (
        newMessage?.receiver?._id ||
        newMessage?.receiver?.id ||
        newMessage?.receiver
      )?.toString()?.toLowerCase();

      // If user is currently inside this chat reading messages, do NOT mark as unread!
      const currentActiveId = activeChatIdRef.current?.toString()?.toLowerCase();
      const currentActivePartId = activeParticipantIdRef.current?.toString()?.toLowerCase();

      const isForActiveConversation = Boolean(
        (currentActiveId && incomingChatId && incomingChatId === currentActiveId) ||
        (currentActivePartId && senderId && senderId === currentActivePartId) ||
        (currentActivePartId && receiverId && receiverId === currentActivePartId)
      );

      if (isForActiveConversation) {
        console.log("Message is for active conversation on screen, skipping unread count increment");
        return;
      }

      const myId = (userId || getUserIdClient())?.toString()?.toLowerCase();

      let isSentByMe = false;
      if (senderId && myId && senderId === myId) {
        isSentByMe = true;
      } else if (receiverId && myId && receiverId !== myId) {
        isSentByMe = true;
      }

      if (!isSentByMe) {
        setUnreadMessageCount((prev) => prev + 1);
      }
    });

    // Listen for new chats
    socket.on(`newChat::${userId}`, (newChatData: any) => {
      console.log("New Chat received in Context:", newChatData);
      setUnreadMessageCount((prev) => prev + 1);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  const resetUnreadCount = () => {
    setUnreadCount(0);
  };

  const resetUnreadMessageCount = useCallback(() => {
    setUnreadMessageCount(0);
  }, []);

  const refreshUnreadMessageCount = useCallback(
    (openChatId?: string | null) => {
      fetchMessagesCount(openChatId);
    },
    [fetchMessagesCount]
  );

  return (
    <NotificationContext.Provider
      value={{
        unreadCount,
        resetUnreadCount,
        unreadMessageCount,
        resetUnreadMessageCount,
        refreshUnreadMessageCount,
        activeChatId,
        setActiveChatId,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    // Return default values if used outside provider (e.g. public pages)
    return {
      unreadCount: 0,
      resetUnreadCount: () => {},
      unreadMessageCount: 0,
      resetUnreadMessageCount: () => {},
      refreshUnreadMessageCount: () => {},
      activeChatId: null,
      setActiveChatId: () => {},
    };
  }
  return context;
};

export const useInbox = () => {
  const {
    unreadMessageCount,
    resetUnreadMessageCount,
    refreshUnreadMessageCount,
    activeChatId,
    setActiveChatId,
  } = useNotification();
  return {
    unreadMessageCount,
    resetUnreadMessageCount,
    refreshUnreadMessageCount,
    activeChatId,
    setActiveChatId,
  };
};


