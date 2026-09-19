"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { MdOutlineStarPurple500 } from 'react-icons/md';
import { LuUser } from 'react-icons/lu';
import { formatUrl } from '@/utils/formatUrl';
import { relativeTime } from '@/utils/relativeTimes';

interface ReviewCardProps {
  item: Record<string, any>;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ item }) => {
  const [imgError, setImgError] = useState(false);
  const now = new Date();

  const reviewer = item?.reviewer || {};
  const hasProfile = Boolean(
    reviewer?.profile &&
    reviewer.profile !== "undefined" &&
    reviewer.profile !== "null" &&
    !imgError
  );

  const rating = Number(item?.rating || 5);
  const timeStr = item?.updatedAt || item?.createdAt ? relativeTime(item?.updatedAt || item?.createdAt, { now }) : null;

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow duration-200 space-y-3">
      {/* Top row: Reviewer info & Star rating */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="size-11 sm:size-12 rounded-full overflow-hidden bg-slate-100 ring-2 ring-gray-100 flex items-center justify-center shrink-0">
            {hasProfile ? (
              <Image
                src={formatUrl(reviewer.profile)}
                width={48}
                height={48}
                alt={reviewer?.name || "Reviewer"}
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                <LuUser className="size-6" />
              </div>
            )}
          </div>

          <div>
            <h4 className="font-bold text-sm sm:text-base text-gray-900 line-clamp-1">
              {reviewer?.name || "Client"}
            </h4>
            {timeStr && (
              <p className="text-xs text-gray-500">{timeStr}</p>
            )}
          </div>
        </div>

        {/* Rating Pill */}
        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200/70 shrink-0">
          <MdOutlineStarPurple500 className="text-amber-500 fill-amber-500 size-4" />
          <span className="text-xs font-extrabold text-amber-900">
            {rating.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Review Text */}
      {item?.review && (
        <p className="text-sm text-gray-700 leading-relaxed bg-gray-50/60 p-3.5 rounded-xl border border-gray-100/80">
          &ldquo;{item.review}&rdquo;
        </p>
      )}
    </div>
  );
};

export default ReviewCard;