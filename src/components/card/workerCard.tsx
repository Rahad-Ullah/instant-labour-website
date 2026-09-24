"use client";

import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { LuLayers2, LuClock, LuUser } from 'react-icons/lu';
import { GrLocation } from 'react-icons/gr';
import { MdVerifiedUser, MdOutlineStarPurple500 } from 'react-icons/md';
import { HiArrowNarrowRight } from 'react-icons/hi';
import dayjs from 'dayjs';
import { formatUrl } from '@/utils/formatUrl';
import { brandLogo } from '@/assets/assets';

interface WorkerCardProps {
  item: any;
  url?: string;
  status?: string;
}

const WorkerCard: React.FC<WorkerCardProps> = ({ item, url, status }) => {
  const [profileError, setProfileError] = useState(false);
  const [coverError, setCoverError] = useState(false);

  const isVerified = Boolean(item?.isAccountVerified ?? item?.verified);
  const workerStatus = status || item?.status;

  const hasCover = Boolean(
    item?.cover &&
    item.cover !== "undefined" &&
    item.cover !== "null" &&
    !coverError
  );
  const hasProfile = Boolean(
    item?.profile &&
    item.profile !== "undefined" &&
    item.profile !== "null" &&
    !profileError
  );

  const formatSalaryUnit = (type?: string) => {
    if (!type) return "hr";
    const lower = type.toLowerCase();
    if (lower.includes("hour")) return "hr";
    if (lower.includes("day")) return "day";
    if (lower.includes("week")) return "wk";
    if (lower.includes("month")) return "mo";
    if (lower.includes("year") || lower.includes("annu")) return "yr";
    return lower;
  };

  const hasSalary = typeof item?.salary === "number" ? item.salary > 0 : Boolean(item?.salary);

  const getStatusBadge = (statusStr: string) => {
    const s = statusStr.toLowerCase();
    if (s.includes("approved") || s.includes("accept")) {
      return "bg-emerald-500 text-white";
    }
    if (s.includes("pending")) {
      return "bg-amber-500 text-white";
    }
    if (s.includes("reject") || s.includes("cancel")) {
      return "bg-rose-500 text-white";
    }
    return "bg-brandClr1 text-white";
  };

  const cardContent = (
    <div className="group relative bg-white rounded-2xl border border-gray-200/80 hover:border-brandClr1/40 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden h-full">
      {/* 1. Cover / Banner Area */}
      <div className="relative w-full h-36 sm:h-40 overflow-hidden bg-slate-50 shrink-0 border-b border-gray-100">
        {hasCover ? (
          <>
            <Image
              src={formatUrl(item.cover)}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              alt={item?.name || "Worker cover"}
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              onError={() => setCoverError(true)}
            />
            {/* Ambient dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </>
        ) : (
          /* Platform logo for card banner fallback */
          <div className="relative w-full h-full flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100/80">
            <div className="px-4 py-2.5 rounded-2xl bg-white shadow-sm border border-gray-200/70 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <Image
                src={brandLogo}
                alt="Instant Labour"
                width={130}
                height={42}
                className="max-h-8 sm:max-h-9 w-auto object-contain"
              />
            </div>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 gap-2 pointer-events-none">
          {item?.category ? (
            <span
              className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm truncate max-w-[65%] ${
                hasCover
                  ? "bg-white/95 backdrop-blur-md text-gray-800"
                  : "bg-white text-gray-700 border border-gray-200"
              }`}
            >
              {item.category}
            </span>
          ) : (
            <span />
          )}

          {workerStatus ? (
            <span
              className={`inline-flex items-center text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm capitalize ${getStatusBadge(
                workerStatus
              )}`}
            >
              {workerStatus}
            </span>
          ) : (
            <div
              className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm ${
                hasCover
                  ? "bg-white/95 backdrop-blur-md text-gray-900"
                  : "bg-white text-gray-800 border border-gray-200"
              }`}
            >
              <MdOutlineStarPurple500 className="text-amber-500 size-3.5" />
              <span>{item?.rating ? Number(item.rating).toFixed(1) : "5.0"}</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Avatar Overlap & Content Body */}
      <div className="p-4 sm:p-5 pt-0 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Avatar & Rate Row */}
          <div className="flex items-end justify-between gap-3 -mt-10 sm:-mt-11 mb-3">
            <div className="relative shrink-0">
              <div className="size-20 sm:size-22 rounded-2xl overflow-hidden ring-4 ring-white shadow-md bg-slate-100 flex items-center justify-center">
                {hasProfile ? (
                  <Image
                    src={formatUrl(item.profile)}
                    width={88}
                    height={88}
                    alt={item?.name || "Worker profile"}
                    className="w-full h-full object-cover"
                    onError={() => setProfileError(true)}
                  />
                ) : (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <LuUser className="size-10 sm:size-11" />
                  </div>
                )}
              </div>
              {/* Online / Active Indicator */}
              <span
                className="size-3.5 rounded-full absolute bottom-1 right-1 bg-emerald-500 ring-2 ring-white"
                title="Available for hire"
              />
            </div>

            {/* Salary / Rate Pill */}
            <div className="shrink-0 text-right pb-1">
              {hasSalary ? (
                <div className="inline-flex items-baseline gap-0.5 px-3 py-1 bg-emerald-50 border border-emerald-200/80 rounded-xl text-emerald-800">
                  <span className="text-base sm:text-lg font-extrabold">£{item.salary}</span>
                  <span className="text-[11px] font-semibold text-emerald-600">
                    /{formatSalaryUnit(item.salaryType)}
                  </span>
                </div>
              ) : (
                <div className="inline-flex px-2.5 py-1 bg-gray-100 rounded-lg text-xs font-semibold text-gray-600">
                  Negotiable
                </div>
              )}
            </div>
          </div>

          {/* Name & Verification */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-lg sm:text-xl text-gray-900 group-hover:text-brandClr1 transition-colors line-clamp-1">
                {item?.name || "Labour Professional"}
              </h3>

              {isVerified ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  <MdVerifiedUser className="size-3 text-emerald-600 shrink-0" />
                  <span>Verified</span>
                </span>
              ) : (
                <span className="inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-md bg-gray-100 text-gray-500">
                  Unverified
                </span>
              )}
            </div>

            {/* SubCategory or Experience tagline */}
            <p className="text-xs text-gray-500 font-medium line-clamp-1">
              {item?.subCategory ? (
                <>
                  <span>{item.subCategory}</span>
                  {item?.yearsOfExperience ? <span> • {item.yearsOfExperience} yrs exp</span> : null}
                </>
              ) : item?.yearsOfExperience ? (
                <span>{item.yearsOfExperience} years of experience</span>
              ) : (
                <span>Available Labour Specialist</span>
              )}
            </p>
          </div>

          {/* Metadata attributes */}
          <div className="space-y-1.5 pt-3 text-xs sm:text-sm text-gray-600">
            {item?.category && (
              <div className="flex items-center gap-2 text-gray-600">
                <LuLayers2 className="size-4 text-gray-400 shrink-0" />
                <span className="truncate">{item.category}</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-gray-600">
              <GrLocation className="size-4 text-gray-400 shrink-0" />
              <span className="truncate">{item?.location || item?.address || "Location on request"}</span>
            </div>
          </div>
        </div>

        {/* 3. Bottom Meta & Action */}
        <div className="space-y-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
            <div className="flex items-center gap-1">
              <LuClock className="size-3.5 text-gray-400 shrink-0" />
              <span>
                {item?.createdAt ? `Joined ${dayjs(item.createdAt).format("MMM YYYY")}` : "Available Now"}
              </span>
            </div>

            {item?.rating && (
              <div className="flex items-center gap-1 text-amber-600 font-semibold">
                <MdOutlineStarPurple500 className="size-3.5 text-amber-500" />
                <span>{Number(item.rating).toFixed(1)}</span>
              </div>
            )}
          </div>

          {/* CTA Action Bar */}
          <div className="w-full py-2.5 px-4 bg-brandClr2 hover:bg-[#f5be18] text-gray-950 font-bold rounded-xl text-center text-sm shadow-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.99]">
            <span>View Profile</span>
            <HiArrowNarrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );

  if (url) {
    return (
      <Link href={url} className="block h-full cursor-pointer focus:outline-none">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};

export default WorkerCard;