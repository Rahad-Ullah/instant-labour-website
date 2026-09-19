"use client";

import { formatUrl } from "@/utils/formatUrl";
import dayjs from "dayjs";
import Image from "next/image";
import { useEffect, useRef } from "react";

import { getUserIdClient } from "@/utils/getUserIdClient";

interface MessageListProps {
  messages: any[];
  isLoading: boolean;
  activeUserId?: string | null;
  clickedChat: any;
  currentUser?: any;
}

const MessageList = ({
  messages,
  isLoading,
  activeUserId,
  clickedChat,
  currentUser,
}: MessageListProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest",
    });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent bg-slate-50/50 p-4">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-full gap-3">
          <div className="size-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p className="text-gray-400 text-sm font-medium">
            Loading conversation...
          </p>
        </div>
      ) : messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full opacity-60">
          <Image
            src={formatUrl(clickedChat?.participant?.profile)}
            width={80}
            height={80}
            alt="User"
            className="size-20 rounded-full grayscale mb-4 object-cover"
          />
          <p className="text-gray-500">No messages yet. Say hello!</p>
        </div>
      ) : (
        <div className="flex flex-col-reverse gap-4 min-h-full">
          <div ref={bottomRef} />
          {messages.map((item) => {
            const myId = (
              activeUserId ||
              currentUser?._id ||
              currentUser?.id ||
              (typeof window !== "undefined" ? getUserIdClient() : null)
            )?.toString();

            const participantId = (
              clickedChat?.participant?._id ||
              clickedChat?.participant?.id ||
              clickedChat?.participant
            )?.toString();

            const myEmail = (currentUser?.email || "").trim().toLowerCase();
            const participantEmail = (clickedChat?.participant?.email || "").trim().toLowerCase();

            const receiverId = (
              item?.receiver?._id ||
              item?.receiver?.id ||
              (typeof item?.receiver === "string" ? item.receiver : null)
            )?.toString();

            const senderId = (
              item?.sender?._id ||
              item?.sender?.id ||
              (typeof item?.sender === "string" ? item.sender : null)
            )?.toString();

            const receiverEmail = (item?.receiver?.email || "").trim().toLowerCase();
            const senderEmail = (item?.sender?.email || "").trim().toLowerCase();

            // Determine if message was sent by the logged-in user (Me):
            let isMe = false;

            // 1. Direct sender checks:
            if (senderId && myId && senderId === myId) {
              isMe = true;
            } else if (senderEmail && myEmail && senderEmail === myEmail) {
              isMe = true;
            } else if (senderId && participantId && senderId === participantId) {
              isMe = false;
            } else if (senderEmail && participantEmail && senderEmail === participantEmail) {
              isMe = false;
            // 2. Direct receiver checks (if receiver is the participant, I sent it; if receiver is me, they sent it):
            } else if (receiverId && participantId && receiverId === participantId) {
              isMe = true;
            } else if (receiverEmail && participantEmail && receiverEmail === participantEmail) {
              isMe = true;
            } else if (receiverId && myId && receiverId === myId) {
              isMe = false;
            } else if (receiverEmail && myEmail && receiverEmail === myEmail) {
              isMe = false;
            // 3. Fallbacks when one ID is available:
            // If the receiver is NOT me in a 1-on-1 chat, then I sent it
            } else if (receiverId && myId && receiverId !== myId) {
              isMe = true;
            } else if (receiverEmail && myEmail && receiverEmail !== myEmail) {
              isMe = true;
            // If the receiver is NOT the other participant, then it was sent to me
            } else if (receiverId && participantId && receiverId !== participantId) {
              isMe = false;
            } else if (receiverEmail && participantEmail && receiverEmail !== participantEmail) {
              isMe = false;
            // 4. Sender fallbacks
            } else if (senderId && participantId && senderId !== participantId) {
              isMe = true;
            } else if (senderId && myId && senderId !== myId) {
              isMe = false;
            }

            return (
              <div
                key={item._id}
                className={`flex gap-3 max-w-[85%] ${
                  isMe ? "self-end flex-row-reverse" : "self-start flex-row"
                } group`}
              >
                {/* Avatar (only for them) */}
                {!isMe && (
                  <div className="shrink-0 self-end mb-1">
                    <Image
                      src={formatUrl(
                        clickedChat?.participant?.profile ||
                          item?.sender?.profile
                      )}
                      alt={clickedChat?.participant?.name || "User"}
                      width={28}
                      height={28}
                      className="size-7 rounded-full object-cover bg-gray-200"
                    />
                  </div>
                )}

                <div
                  className={`relative p-3.5 px-5 rounded-3xl break-words ${
                    isMe
                      ? "bg-gradient-to-br from-primary to-primary/90 text-white rounded-br-sm shadow-md shadow-primary/20"
                      : "bg-white text-gray-800 border border-gray-100 rounded-bl-sm shadow-md shadow-gray-100/50"
                  }`}
                >
                  {/* Images Attachment */}
                  {item.files && item.files.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {item.files.map((file: string, idx: number) => (
                        <Image
                          key={idx}
                          src={formatUrl(file)}
                          alt="attachment"
                          width={200}
                          height={200}
                          className="rounded-lg object-cover max-w-full h-auto max-h-[200px] border border-black/10"
                        />
                      ))}
                    </div>
                  )}

                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {item.message}
                  </p>

                  <span
                    className={`text-[10px] block mt-1.5 text-right font-medium opacity-80 ${
                      isMe ? "text-white/90" : "text-gray-500"
                    }`}
                  >
                    {dayjs(item?.createdAt).format("MMM D, h:mm A")}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MessageList;
