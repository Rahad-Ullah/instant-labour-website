import { myFetch } from "@/utils/myFetch";
import InboxClient from "./InboxClient";
import { getUserIdServer } from "@/utils/getUserIdServer";

const Inbox = async ({ searchParams }: { searchParams: any }) => {
  const { chat_id, user_id, name, searchChat } = await searchParams;
  const queryParams = new URLSearchParams();
  if (searchChat) queryParams.set("searchTerm", searchChat);

  const [getChatList, userProfileRes, tokenUserId] = await Promise.all([
    myFetch(`/chat?${queryParams.toString()}`, {
      method: "GET",
      cache: "no-cache",
    }),
    myFetch("/user/profile", {
      method: "GET",
    }),
    getUserIdServer(),
  ]);

  const currentUser = userProfileRes?.data;
  const currentUserId = currentUser?._id || currentUser?.id || tokenUserId;
  const effectiveCurrentUser = currentUser || (tokenUserId ? { _id: tokenUserId } : null);

  const isCurrentUser = (p: any) => {
    if (!p) return false;
    const pId = (p._id || p.id || p)?.toString();
    return (
      (currentUserId && pId === currentUserId?.toString()) ||
      (currentUser?.name && p?.name === currentUser.name)
    );
  };

  const matchesUser = (
    c: any,
    targetUserId?: string | null,
    targetName?: string | null
  ) => {
    if (!c) return false;

    if (targetUserId) {
      const tid = targetUserId.toString();
      const pId = (c.participant?._id || c.participant)?.toString();
      if (pId === tid) return true;

      if (Array.isArray(c.participants)) {
        if (
          c.participants.some(
            (p: any) => (p?._id || p)?.toString() === tid
          )
        ) {
          return true;
        }
      }

      const cEmpId = (c.employer?._id || c.employer)?.toString();
      if (cEmpId === tid) return true;

      const cWorkId = (c.worker?._id || c.worker)?.toString();
      if (cWorkId === tid) return true;
    }

    if (targetName) {
      const pName = c.participant?.name?.trim().toLowerCase();
      if (pName && pName === targetName.trim().toLowerCase()) {
        return true;
      }
    }

    return false;
  };

  let singleChat = null;
  const validChatId =
    chat_id && chat_id !== "undefined" && chat_id !== "" ? chat_id : null;
  const validUserId =
    user_id && user_id !== "undefined" && user_id !== "" ? user_id : null;
  const validName =
    name && name !== "undefined" && name !== ""
      ? decodeURIComponent(name)
      : null;

  // 1. If user_id or name is provided, search chat list for that specific user first
  if (validUserId || validName) {
    const foundByUser = getChatList?.data?.find((c: any) =>
      matchesUser(c, validUserId, validName)
    );
    if (foundByUser) {
      singleChat = { ...foundByUser };
    }
  }

  // 2. If singleChat not yet found and validChatId is provided
  if (!singleChat && validChatId) {
    // Check if chat is in the list
    const foundInList = getChatList?.data?.find(
      (c: any) => c._id === validChatId || c._ids === validChatId
    );

    if (foundInList) {
      singleChat = { ...foundInList };
    } else {
      const getChat = await myFetch(`/chat/${validChatId}`, {
        method: "GET",
      });
      if (getChat?.data) {
        singleChat = { ...getChat.data };
      }
    }
  }

  // 3. Ensure participant on singleChat is the OTHER person, not the current user
  if (singleChat) {
    if (
      Array.isArray(singleChat.participants) &&
      singleChat.participants.length > 0
    ) {
      const otherPerson = singleChat.participants.find(
        (p: any) => !isCurrentUser(p)
      );
      if (otherPerson && typeof otherPerson === "object") {
        if (!singleChat.participant || isCurrentUser(singleChat.participant)) {
          singleChat.participant = otherPerson;
        }
      }
    }

    if (isCurrentUser(singleChat.participant)) {
      if (singleChat.worker && !isCurrentUser(singleChat.worker)) {
        singleChat.participant = singleChat.worker;
      } else if (singleChat.employer && !isCurrentUser(singleChat.employer)) {
        singleChat.participant = singleChat.employer;
      }
    }
  }

  return (
    <div className="mb-10">
      <InboxClient
        chatList={getChatList}
        singleChat={singleChat}
        currentUser={effectiveCurrentUser}
      />
    </div>
  );
};

export default Inbox;
