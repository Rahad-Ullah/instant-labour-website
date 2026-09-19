"use client";

import { Input } from "@/components/ui/input";
import { FaRegImages } from "react-icons/fa";
import { PiPaperPlaneRightFill } from "react-icons/pi";
import { IoClose } from "react-icons/io5";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface ChatInputProps {
  onSendMessage: (text: string, images: File[]) => Promise<void>;
}

const ChatInput = ({ onSendMessage }: ChatInputProps) => {
  const [msgText, setMsgText] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImages((prev) => [
        ...prev,
        ...Array.from(e.target.files as FileList),
      ]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    if (!msgText.trim() && selectedImages.length === 0) return;
    setIsLoading(true);
    try {
      await onSendMessage(msgText, selectedImages);
      setMsgText("");
      setSelectedImages([]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isLoading) {
      handleSend();
    }
  };

  return (
    <div className="bg-white border-t p-4">
      {/* Image Preview */}
      {selectedImages.length > 0 && (
        <div className="flex gap-2 overflow-x-auto mb-2 py-2 px-1">
          {selectedImages.map((file, index) => (
            <div key={index} className="relative group shrink-0">
              <Image
                src={URL.createObjectURL(file)}
                alt="preview"
                width={64}
                height={64}
                className="w-16 h-16 object-cover rounded-lg border border-gray-200 shadow-sm"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
              >
                <IoClose size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="flex items-center gap-3">
        <div className="flex-1 bg-gray-50 rounded-full border border-gray-200 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all duration-300 flex items-center px-4">
          <Input
            type="text"
            placeholder="Type a message..."
            value={msgText}
            onChange={(e) => setMsgText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none shadow-none focus-visible:ring-0 placeholder:text-gray-400 h-12"
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="file"
            multiple
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-full transition-all duration-300 cursor-pointer"
            title="Attach images"
          >
            <FaRegImages className="text-xl" />
          </button>

          <button
            onClick={handleSend}
            disabled={
              isLoading || (!msgText.trim() && selectedImages.length === 0)
            }
            className={`p-3 rounded-full transition-all duration-300 shadow-md flex items-center justify-center cursor-pointer ${!msgText.trim() && selectedImages.length === 0
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-primary text-white hover:bg-primary/90 hover:shadow-lg hover:scale-105"
              }`}
          >
            <PiPaperPlaneRightFill className="text-xl ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
