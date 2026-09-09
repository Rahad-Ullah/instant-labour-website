/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { myFetch } from "@/utils/myFetch";
import { getCookie } from "cookies-next";
import { useState, useEffect, useRef } from "react";
import InboxSidebar from "@/components/inbox/InboxSidebar";
import ChatHeader from "@/components/inbox/ChatHeader";
import MessageList from "@/components/inbox/MessageList";
import ChatInput from "@/components/inbox/ChatInput";
import { brandLogo } from "@/assets/assets";
import Image from "next/image";
import { io, Socket } from "socket.io-client";

// interface InboxClientProps {
//   chatList: any;
// }

// const SOCKET_URL = "http://10.10.7.50:5002/";
// const SOCKET_URL = "https://api.instantlabour.co.uk/";

const InboxClient = ({
  chatList,
  singleChat,
  currentUser,
}: {
  chatList: any;
  singleChat?: any;
  currentUser?: any;
}) => {
  const [clickedChat, setClickedChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [isMsgLoading, setIsMsgLoading] = useState<boolean>(false);
  
  // Real-time state
  const [dynamicChatList, setDynamicChatList] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(currentUser?._id || null);
  const socketRef = useRef<Socket | null>(null);
  const selectedChatIdRef = useRef<string | null>(null);
  
  const SOCKET_URL = process.env.NEXT_PUBLIC_IMAGE_URL
  useEffect(()=>{
    if(chatList?.data){
      const sortedList = [...chatList.data].sort((a, b) => {
        const dateA = new Date(a?.latestMessage?.createdAt || a?.createdAt || 0).getTime();
        const dateB = new Date(b?.latestMessage?.createdAt || b?.createdAt || 0).getTime();
        return dateB - dateA; // Sort in descending order (newest first)
      });
      setDynamicChatList(sortedList);
    }else{
      setDynamicChatList([]);
    }
  },[chatList]);

  // 1. Fetch User ID
  useEffect(() => {
    if (userId) return;
    const getProfile = async () => {
      try {
        const res = await myFetch("/user/profile", { method: "GET" });
        if (res.success && res.data?._id) {
          setUserId(res.data._id);
        }
      } catch (err) {
        console.error("Failed to fetch profile for socket:", err);
      }
    };
    getProfile();
  }, [userId]);

  // 2. Socket Connection & Listeners
  useEffect(() => {
    if (!userId) return;

    const accessToken = getCookie("accessToken");

    // Connect
    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      withCredentials: true,
      auth: {
        token: accessToken,
      },
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      //console.log("Socket connected:", socket.id);
      // toast.success("Connected to chat server");
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    // Listen for new messages
    // Event format: message::{userId}
    socket.on(`message::${userId}`, (newMessage: any) => {
      //console.log("New Socket Message:", newMessage);

      // A. Update Active Chat Window if open
      // Use ref to get the current selected chat ID without stale closures
      if (selectedChatIdRef.current === newMessage.chat) {
        setMessages((prev) => {
          // Prevent duplicates
          if (prev.some((m) => m._id === newMessage._id)) return prev;
          return [newMessage, ...prev];
        });
      }

      // B. Update Sidebar List
      setDynamicChatList((prevList) => {
        const newList = [...prevList];
        const existingIndex = newList.findIndex(
          (c) => c._id === newMessage.chat
        );

        if (existingIndex !== -1) {
          // Update existing chat
          const updatedChat = { ...newList[existingIndex] };
          updatedChat.latestMessage = newMessage;

          // Move to top
          newList.splice(existingIndex, 1);
          newList.unshift(updatedChat);
          return newList;
        } else {
          // New chat logic handled by 'newChat' event usually, but if structure matches
          // we could fetch it. For now, we rely on 'newChat' event for purely new conversations.
          return prevList;
        }
      });
    });

    // Listen for New Chats
    socket.on(`newChat::${userId}`, (newChatData: any) => {
      //console.log("New Socket Chat:", newChatData);
      setDynamicChatList((prev) => [newChatData, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  // Helper to ensure the participant is the other party, not the logged-in user
  const resolveChatParticipant = (chat: any) => {
    if (!chat) return chat;
    const currentId = userId || currentUser?._id;

    const isCurrent = (p: any) => {
      if (!p) return false;
      const pid = (p._id || p)?.toString();
      return (
        (currentId && pid === currentId.toString()) ||
        (currentUser?.name && p?.name === currentUser.name)
      );
    };

    // 1. Check if dynamicChatList or chatList has this chat with a valid other participant
    const chatFromList =
      dynamicChatList.find((c) => c._id === chat._id || c._ids === chat._id) ||
      chatList?.data?.find((c: any) => c._id === chat._id || c._ids === chat._id);

    if (chatFromList?.participant && !isCurrent(chatFromList.participant)) {
      return {
        ...chat,
        ...chatFromList,
        participant: chatFromList.participant,
      };
    }

    let participant = chat.participant;

    // 2. Check participants array
    if (Array.isArray(chat.participants) && chat.participants.length > 0) {
      const other = chat.participants.find((p: any) => !isCurrent(p));
      if (other && typeof other === "object") {
        if (!participant || isCurrent(participant)) {
          participant = other;
        }
      }
    }

    // 3. Check worker or employer
    if (isCurrent(participant)) {
      if (chat.worker && !isCurrent(chat.worker)) {
        participant = chat.worker;
      } else if (chat.employer && !isCurrent(chat.employer)) {
        participant = chat.employer;
      }
    }

    return {
      ...chat,
      participant,
    };
  };

  // 3. Selection Handler
  const handleChatClick = async (item: any) => {
    const resolvedItem = resolveChatParticipant(item);
    setClickedChat(resolvedItem);
    selectedChatIdRef.current = resolvedItem._id; // Sync ref
    setMessages([]); // Clear previous messages immediately
    setIsMsgLoading(true);

    try {
      const res = await myFetch(
        `/message/${resolvedItem._ids || resolvedItem._id}?limit=100`,
        {
          method: "GET",
        }
      );
      if (res.success) {
        setMessages(res.data);

        // Mark sidebar chat as read locally
        setDynamicChatList((prev) =>
          prev.map((chat) => {
            if (chat._id === resolvedItem._id && chat.latestMessage) {
              return {
                ...chat,
                latestMessage: { ...chat.latestMessage, isRead: true },
              };
            }
            return chat;
          })
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsMsgLoading(false);
    }
  };

  useEffect(() => {
    if (singleChat && singleChat._id !== clickedChat?._id) {
      const chatToOpen = resolveChatParticipant(singleChat);
      handleChatClick(chatToOpen);

      setDynamicChatList((prevList) => {
        const newList = [...prevList];
        const existingIndex = newList.findIndex(
          (c) => c._id === singleChat._id
        );
        if (existingIndex !== -1) {
          const updatedChat = { ...newList[existingIndex], ...chatToOpen };
          newList.splice(existingIndex, 1);
          newList.unshift(updatedChat);
          return newList;
        } else {
          return [chatToOpen, ...newList];
        }
      });
    }
  }, [singleChat]);

  const handleSendMessage = async (text: string, images: File[]) => {
    if (!clickedChat) return;

    const formData = new FormData();
    formData.append("data", JSON.stringify({ message: text }));
    images.forEach((file) => {
      formData.append("images", file);
    });

    const res = await myFetch(`/message/${clickedChat._id}`, {
      method: "POST",
      body: formData,
    });

    if (res.success) {
      const sentMessage = res.data;
      setMessages((prev) => [sentMessage, ...prev]);

      setDynamicChatList((prevList) => {
        const newList = [...prevList];
        const existingIndex = newList.findIndex(
          (c) => c._id === clickedChat._id
        );
        if (existingIndex !== -1) {
          const updatedChat = { ...newList[existingIndex] };
          updatedChat.latestMessage = sentMessage;
          newList.splice(existingIndex, 1);
          newList.unshift(updatedChat);
          return newList;
        }
        return prevList;
      });
    } else {
      throw new Error(res.message || "Failed to send");
    }
  };

  return (
    <div className="maxWidth h-[calc(100vh-100px)] md:h-[calc(100vh-120px)] pb-4 md:pb-0">
      <div className="flex h-full gap-4 md:gap-6">
        {/* Sidebar */}
        <div className="hidden md:block w-[320px] lg:w-95 shrink-0 h-full">
          <InboxSidebar
            chatList={dynamicChatList}
            selectedChat={clickedChat}
            onChatClick={handleChatClick}
            activeUserId={userId}
          />
        </div>

        {/* Chat Window */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full relative">
          {clickedChat ? (
            <>
              <ChatHeader
                selectedChat={clickedChat}
                chatList={dynamicChatList}
                onChatClick={handleChatClick}
                activeUserId={userId || currentUser?._id}
              />
              <MessageList
                messages={messages}
                isLoading={isMsgLoading}
                clickedChat={clickedChat}
                activeUserId={userId || currentUser?._id}
              />
              <ChatInput onSendMessage={handleSendMessage} />
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-50/30">
              <div className="relative mb-6">
                <div className="size-32 bg-primary/5 rounded-full flex items-center justify-center animate-pulse">
                  <Image
                    src={brandLogo}
                    alt="Logo"
                    width={120}
                    height={40}
                    className="w-20 opacity-50 grayscale"
                  />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Welcome to Messages
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Select a conversation from the sidebar to continue chatting with
                your contacts.
              </p>

              <p className="md:hidden text-primary mt-6 text-sm font-semibold">
                Tap the menu icon in the sidebar to start
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InboxClient;
