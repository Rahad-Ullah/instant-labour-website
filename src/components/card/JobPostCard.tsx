"use client";

import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { LuBuilding2, LuClock } from 'react-icons/lu';
import { GrLocation } from 'react-icons/gr';
import { HiArrowNarrowRight, HiSparkles } from 'react-icons/hi';
import { formatUrl } from '@/utils/formatUrl';
import { relativeTime } from '@/utils/relativeTimes';
import { brandLogo } from '@/assets/assets';

interface JobPostCardProps {
  item: any;
  url: string;
}

const JobPostCard = ({ item, url }: JobPostCardProps) => {
  const [imageError, setImageError] = useState(false);

  const hasImage = Boolean(
    item?.images &&
    Array.isArray(item.images) &&
    item.images.length > 0 &&
    item.images[0] &&
    !imageError
  );

  const companyName = item?.companyName || "Employer";
  const jobTitle = item?.title || item?.companyName || "Job Position";

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

  const hasSalary = typeof item?.salary === "number" && item.salary > 0;

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-200/80 hover:border-brandClr1/40 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden h-full">
      {/* 1. Header Media / Banner */}
      <div className="relative w-full h-48 sm:h-52 overflow-hidden bg-slate-50 shrink-0 border-b border-gray-100">
        {hasImage ? (
          <>
            <Image
              src={formatUrl(item.images[0])}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              alt={jobTitle}
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              onError={() => setImageError(true)}
            />
            {/* Gradient overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
          </>
        ) : (
          /* Instant Labour logo fallback when employer doesn't upload image */
          <div className="relative w-full h-full flex items-center justify-center p-6 bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100/70">
            <div className="size-24 sm:size-28 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center p-3 transition-transform duration-300 group-hover:scale-105">
              <Image
                src={brandLogo}
                alt="Instant Labour"
                width={140}
                height={50}
                className="max-h-12 w-auto object-contain"
              />
            </div>
          </div>
        )}

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 gap-2 pointer-events-none">
          {item?.category ? (
            <span
              className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm truncate max-w-[60%] ${
                hasImage
                  ? "bg-white/90 backdrop-blur-md text-gray-800"
                  : "bg-white text-gray-700 border border-gray-200"
              }`}
            >
              {item.category}
            </span>
          ) : (
            <span />
          )}

          <div className="flex items-center gap-1.5">
            {item?.boostWeight > 0 && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-brandClr2 text-gray-900 shadow-sm">
                <HiSparkles className="size-3 text-gray-900" /> Featured
              </span>
            )}
            {item?.isExpired && (
              <span className="inline-flex items-center text-[11px] font-bold px-2.5 py-1 rounded-full bg-rose-500 text-white shadow-sm">
                Expired
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 2. Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          {/* Header Row: Title & Salary */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <Link href={url} className="block group-hover:text-brandClr1 transition-colors">
                <h3 className="font-bold text-lg sm:text-xl text-gray-900 line-clamp-1 leading-snug">
                  {jobTitle}
                </h3>
              </Link>
              <div className="flex items-center gap-1.5 text-sm text-gray-500 font-medium mt-0.5 line-clamp-1">
                <LuBuilding2 className="size-3.5 text-gray-400 shrink-0" />
                <span className="truncate">{companyName}</span>
                {item?.subCategory && (
                  <>
                    <span className="text-gray-300">•</span>
                    <span className="text-gray-400 text-xs truncate">{item.subCategory}</span>
                  </>
                )}
              </div>
            </div>

            {/* Salary Highlight Badge */}
            <div className="shrink-0 text-right">
              {hasSalary ? (
                <div className="inline-flex items-baseline gap-0.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200/70 rounded-xl text-emerald-800">
                  <span className="text-base sm:text-lg font-extrabold">£{item.salary}</span>
                  <span className="text-[11px] font-semibold text-emerald-600">
                    /{formatSalaryUnit(item.salaryType)}
                  </span>
                </div>
              ) : (
                <div className="inline-flex px-2 py-1 bg-gray-100 rounded-lg text-xs font-semibold text-gray-600">
                  Negotiable
                </div>
              )}
            </div>
          </div>

          {/* Job Overview Snippet */}
          {item?.overview && (
            <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 leading-relaxed">
              {item.overview}
            </p>
          )}

          {/* Availability / Tag Pills */}
          {item?.availability && Array.isArray(item.availability) && item.availability.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {item.availability.slice(0, 3).map((tag: string, idx: number) => (
                <span
                  key={idx}
                  className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/60"
                >
                  {tag}
                </span>
              ))}
              {item.availability.length > 3 && (
                <span className="text-[11px] font-medium px-1.5 py-0.5 rounded-md bg-slate-50 text-slate-400 border border-slate-100">
                  +{item.availability.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* 3. Bottom Meta & Action */}
        <div className="space-y-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500 font-medium gap-2">
            <div className="flex items-center gap-1.5 min-w-0 truncate">
              <GrLocation className="size-3.5 text-gray-400 shrink-0" />
              <span className="truncate">{item?.address || "Location on request"}</span>
            </div>
            <div className="flex items-center gap-1 shrink-0 text-gray-400 text-[11px]">
              <LuClock className="size-3" />
              <span>{item?.createdAt ? relativeTime(item.createdAt) : "Recently"}</span>
            </div>
          </div>

          {/* Button CTA */}
          <Link
            href={url}
            className="w-full py-2.5 px-4 bg-brandClr2 hover:bg-brandClr2/90 text-gray-900 font-semibold rounded-xl text-center text-sm shadow-sm hover:shadow-md flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer active:scale-[0.99]"
          >
            <span>View Details</span>
            <HiArrowNarrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobPostCard;