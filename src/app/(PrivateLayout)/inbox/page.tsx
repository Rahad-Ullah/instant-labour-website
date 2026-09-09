import { myFetch } from "@/utils/myFetch";
import InboxClient from "./InboxClient";

const Inbox = async ({ searchParams }: { searchParams: any }) => {
  const { chat_id, searchChat } = await searchParams;
  const queryParams = new URLSearchParams();
  if (searchChat) queryParams.set("searchTerm", searchChat);

  const [getChatList, userProfileRes] = await Promise.all([
    myFetch(`/chat?${queryParams.toString()}`, {
      method: "GET",
      cache: "no-cache",
    }),
    myFetch("/user/profile", {
      method: "GET",
    }),
  ]);

  const currentUser = userProfileRes?.data;
  const currentUserId = currentUser?._id;

  const isCurrentUser = (p: any) => {
    if (!p) return false;
    const pId = (p._id || p)?.toString();
    return (
      (currentUserId && pId === currentUserId?.toString()) ||
      (currentUser?.name && p?.name === currentUser.name)
    );
  };

  let singleChat = null;
  const validChatId = chat_id && chat_id !== "undefined" ? chat_id : null;

  if (validChatId) {
    // 1. Try to find the chat in the chat list first (as GET /chat correctly formats the participant)
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

    if (singleChat) {
      // If participants array exists, ensure participant is the other person
      if (Array.isArray(singleChat.participants) && singleChat.participants.length > 0) {
        const otherPerson = singleChat.participants.find((p: any) => !isCurrentUser(p));
        if (otherPerson && typeof otherPerson === "object") {
          if (!singleChat.participant || isCurrentUser(singleChat.participant)) {
            singleChat.participant = otherPerson;
          }
        }
      }

      // If participant is still current user, check worker or employer
      if (isCurrentUser(singleChat.participant)) {
        if (singleChat.worker && !isCurrentUser(singleChat.worker)) {
          singleChat.participant = singleChat.worker;
        } else if (singleChat.employer && !isCurrentUser(singleChat.employer)) {
          singleChat.participant = singleChat.employer;
        }
      }
    }
  }

  return (
    <div className="mb-10">
      <InboxClient
        chatList={getChatList}
        singleChat={singleChat}
        currentUser={currentUser}
      />
    </div>
  );
};

export default Inbox;
