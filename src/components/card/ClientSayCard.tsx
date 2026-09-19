"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FaQuoteRight } from "react-icons/fa";
import { LuUser } from "react-icons/lu";
import Rating from "../cui/Rating";
import { formatUrl } from "@/utils/formatUrl";

interface ClientSayCardProps {
  item: Record<string, any>;
}

const ClientSayCard: React.FC<ClientSayCardProps> = ({ item }) => {
  const [imgError, setImgError] = useState(false);
  const hasImage = Boolean(
    item?.image &&
    item.image !== "undefined" &&
    item.image !== "null" &&
    !imgError
  );

  return (
    <div className="group bg-white rounded-2xl border border-gray-200/80 hover:border-brandClr1/30 hover:shadow-xl p-6 sm:p-7 shadow-sm transition-all duration-300 flex flex-col justify-between h-full space-y-5 relative overflow-hidden w-full">
      {/* Decorative subtle background quote watermark */}
      <div className="absolute top-5 right-5 text-amber-100/70 pointer-events-none group-hover:text-amber-200/70 transition-colors">
        <FaQuoteRight className="size-8 sm:size-10" />
      </div>

      <div className="space-y-4 relative z-10">
        {/* Rating Stars */}
        <div className="flex items-center gap-1.5">
          <Rating value={Number(item?.rating) || 5} size={16} color="text-amber-400" />
        </div>

        {/* Testimonial Quote */}
        <p className="text-gray-700 text-sm sm:text-base leading-relaxed italic">
          &ldquo;{item?.description}&rdquo;
        </p>
      </div>

      {/* Author Profile Row */}
      <div className="pt-4 border-t border-gray-100 flex items-center gap-3.5 relative z-10">
        {/* Avatar */}
        <div className="size-12 sm:size-14 rounded-full overflow-hidden bg-slate-100 ring-2 ring-amber-200/80 shrink-0 shadow-xs flex items-center justify-center">
          {hasImage ? (
            <Image
              src={formatUrl(item.image)}
              alt={item?.name || "Client"}
              width={56}
              height={56}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
              <LuUser className="size-6 sm:size-7" />
            </div>
          )}
        </div>

        {/* Client Info */}
        <div className="min-w-0">
          <h4 className="font-bold text-base text-gray-900 group-hover:text-brandClr1 transition-colors truncate">
            {item?.name}
          </h4>
          <p className="text-xs sm:text-sm text-gray-500 font-medium truncate">
            {item?.designation}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientSayCard;