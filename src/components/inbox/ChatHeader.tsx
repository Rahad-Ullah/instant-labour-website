"use client";

import { brandLogo } from "@/assets/assets";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { formatUrl } from "@/utils/formatUrl";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { TbMessageSearch } from "react-icons/tb";
import InboxSidebar from "./InboxSidebar";
import { useState } from "react";

interface ChatHeaderProps {
  selectedChat: any;
  chatList: any[]; // Needed for mobile sidebar
  onChatClick: (chat: any) => void;
  activeUserId?: string | null;
}

const ChatHeader = ({
  selectedChat,
  chatList,
  onChatClick,
  activeUserId,
}: ChatHeaderProps) => {
  const [openMessageMenu, setOpenMessageMenu] = useState(false);

  if (!selectedChat) return null;

  return (
    <div className="flex items-center justify-between p-4 bg-white border-b border-gray-100 sticky top-0 z-20 h-[72px]">
      <div className="flex items-center gap-3">
        {/* Mobile Sidebar Trigger */}
        <div className="md:hidden">
          <Sheet open={openMessageMenu} onOpenChange={setOpenMessageMenu}>
            <SheetTrigger asChild>
              <button className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                <TbMessageSearch className="size-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[320px] p-0">
              <SheetHeader className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <SheetTitle>
                    <Image
                      src={brandLogo}
                      alt="Brand Logo"
                      width={120}
                      height={40}
                      className="h-8 w-auto object-contain"
                    />
                  </SheetTitle>
                  <SheetClose>
                    <IoClose className="size-6 text-gray-500" />
                  </SheetClose>
                </div>
              </SheetHeader>
              <div className="h-full bg-gray-50">
                <InboxSidebar
                  chatList={chatList?.map((c) => c) || []} // Pass data properly
                  selectedChat={selectedChat}
                  onChatClick={(chat) => {
                    onChatClick(chat);
                    setOpenMessageMenu(false);
                  }}
                  activeUserId={activeUserId}
                  className="h-full border-0 !rounded-none shadow-none"
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3">
          <Image
            src={formatUrl(selectedChat?.participant?.profile)}
            alt={selectedChat?.participant?.name || "User"}
            width={40}
            height={40}
            className="size-10 object-cover rounded-full bg-gray-100 border border-gray-200"
          />
          <div>
            <h3 className="font-bold text-gray-800 text-sm md:text-base leading-tight">
              {selectedChat?.participant?.name || "User"}
            </h3>
          </div>
        </div>
      </div>

      {/* Header Actions removed as requested */}
    </div>
  );
};

export default ChatHeader;
