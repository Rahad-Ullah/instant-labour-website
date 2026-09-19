"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import {
  LuUsers,
  LuUserCheck,
  LuUser,
  LuArrowLeft,
  LuSearch,
  LuMapPin,
  LuLayers2,
  LuClock,
  LuBriefcase,
  LuArrowRight,
  LuSparkles,
} from "react-icons/lu";
import { MdVerifiedUser, MdOutlineStarPurple500 } from "react-icons/md";
import { formatUrl } from "@/utils/formatUrl";

interface WorkerListTabContainerProps {
  jobId: string;
  initialTab?: string;
  appliedWorkers: any[];
  approvedWorkers: any[];
  jobDetails?: any;
}

const WorkerApplicantCard = ({
  item,
  tabType,
  jobId,
}: {
  item: any;
  tabType: "pending" | "approved";
  jobId: string;
}) => {
  const [imgError, setImgError] = useState(false);
  const applicant = item?.applicant || {};
  const isVerified = Boolean(applicant?.isAccountVerified ?? applicant?.verified);
  const hasProfile = Boolean(
    applicant?.profile &&
      applicant.profile !== "undefined" &&
      applicant.profile !== "null" &&
      !imgError
  );

  const appliedDate = item?.createdAt
    ? dayjs(item.createdAt).format("DD MMM YYYY")
    : null;

  return (
    <div className="group bg-white rounded-2xl border border-gray-200/85 hover:border-brandClr1/40 hover:shadow-xl transition-all duration-300 p-5 flex flex-col justify-between relative">
      {/* Top row: Avatar, Info, Status Badge */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="size-16 rounded-2xl overflow-hidden ring-2 ring-gray-100 bg-slate-100 flex items-center justify-center shadow-sm">
                {hasProfile ? (
                  <Image
                    src={formatUrl(applicant.profile)}
                    width={64}
                    height={64}
                    alt={applicant?.name || "Applicant"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <LuUser className="size-8" />
                  </div>
                )}
              </div>
            </div>

            {/* Name & Title */}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-bold text-base text-gray-900 group-hover:text-brandClr1 transition-colors truncate">
                  {applicant?.name || "Applicant"}
                </h3>
                {isVerified && (
                  <span
                    className="inline-flex text-emerald-600 shrink-0"
                    title="Verified Worker"
                  >
                    <MdVerifiedUser className="size-4" />
                  </span>
                )}
              </div>

              {applicant?.category && (
                <p className="text-xs font-semibold text-brandClr1/90 truncate mt-0.5">
                  {applicant.category}
                </p>
              )}

              {applicant?.rating ? (
                <div className="flex items-center gap-1 text-xs font-semibold text-amber-600 mt-1">
                  <MdOutlineStarPurple500 className="size-3.5 text-amber-500 fill-amber-500" />
                  <span>{Number(applicant.rating).toFixed(1)}</span>
                </div>
              ) : null}
            </div>
          </div>

          {/* Status Badge */}
          <div className="shrink-0">
            {tabType === "approved" ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                <LuUserCheck className="size-3 text-emerald-600" />
                <span>Approved</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200/80">
                <LuClock className="size-3 text-amber-600" />
                <span>Pending</span>
              </span>
            )}
          </div>
        </div>

        {/* Worker Details / Location */}
        <div className="pt-2 border-t border-gray-100 space-y-1.5 text-xs text-gray-600">
          {(applicant?.address || applicant?.location) && (
            <div className="flex items-center gap-2">
              <LuMapPin className="size-3.5 text-gray-400 shrink-0" />
              <span className="truncate">
                {applicant?.address || applicant?.location}
              </span>
            </div>
          )}

          {applicant?.subCategory && (
            <div className="flex items-center gap-2">
              <LuLayers2 className="size-3.5 text-gray-400 shrink-0" />
              <span className="truncate">{applicant.subCategory}</span>
            </div>
          )}

          {appliedDate && (
            <div className="flex items-center gap-2 text-gray-400">
              <LuClock className="size-3.5 text-gray-400 shrink-0" />
              <span>Applied on {appliedDate}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action CTA */}
      <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between gap-3">
        {tabType === "approved" ? (
          <Link
            href={`/employer/posted-jobs/worker-list/${applicant?._id}?type=approved&applicationId=${item?._id}&jobId=${jobId}`}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-all shadow-sm active:scale-[0.99]"
          >
            <span>View & Contact</span>
            <LuArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        ) : (
          <Link
            href={`/employer/posted-jobs/worker-list/${applicant?._id}?type=pending&applicationId=${item?._id}&jobId=${jobId}`}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brandClr2 hover:bg-[#f5be18] text-gray-950 font-bold text-sm transition-all shadow-sm active:scale-[0.99]"
          >
            <span>Review Application</span>
            <LuArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        )}
      </div>
    </div>
  );
};

export default function WorkerListTabContainer({
  jobId,
  initialTab = "pending",
  appliedWorkers = [],
  approvedWorkers = [],
  jobDetails,
}: WorkerListTabContainerProps) {
  // Active tab state: 'pending' or 'approved'
  const [activeTab, setActiveTab] = useState<"pending" | "approved">(
    initialTab === "approved" ? "approved" : "pending"
  );
  const [searchQuery, setSearchQuery] = useState("");

  const handleTabChange = (tab: "pending" | "approved") => {
    setActiveTab(tab);
    // Sync with URL query parameter without page reload
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("type", tab);
      window.history.replaceState(null, "", url.toString());
    }
  };

  const currentList = activeTab === "pending" ? appliedWorkers : approvedWorkers;

  // Real-time search filter
  const filteredList = useMemo(() => {
    if (!searchQuery.trim()) return currentList;
    const q = searchQuery.toLowerCase();
    return currentList.filter((item: any) => {
      const name = item?.applicant?.name?.toLowerCase() || "";
      const cat = item?.applicant?.category?.toLowerCase() || "";
      const sub = item?.applicant?.subCategory?.toLowerCase() || "";
      const addr = (item?.applicant?.address || item?.applicant?.location || "").toLowerCase();
      return name.includes(q) || cat.includes(q) || sub.includes(q) || addr.includes(q);
    });
  }, [currentList, searchQuery]);

  return (
    <div className="space-y-6">
      {/* --------------------- Header & Back Navigation --------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-200/80">
        <div className="flex items-center gap-3">
          <Link
            href={jobId ? `/employer/posted-jobs/posted-job-details/${jobId}` : `/employer/posted-jobs`}
            className="size-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-700 hover:text-brandClr1 hover:border-brandClr1/40 hover:shadow-sm transition-all shrink-0"
            title="Back to Job Details"
          >
            <LuArrowLeft className="size-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Applicants & Workers
              </h1>
              {jobDetails?.category && (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-brandClr1 border border-blue-100">
                  {jobDetails.category}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              {jobDetails?.title ? (
                <>
                  For <span className="font-semibold text-gray-800">{jobDetails.title}</span>
                </>
              ) : (
                "Review applicants and manage your approved workforce"
              )}
            </p>
          </div>
        </div>

        {/* Quick Link to Job */}
        {jobId && (
          <Link
            href={`/employer/posted-jobs/posted-job-details/${jobId}`}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
          >
            <LuBriefcase className="size-3.5 text-gray-500" />
            <span>View Job Post</span>
          </Link>
        )}
      </div>

      {/* --------------------- Tabs Navigation Bar --------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* The 2 Segmented Tabs */}
        <div className="inline-flex items-center p-1.5 rounded-2xl bg-gray-100/90 border border-gray-200/80 max-w-full overflow-x-auto">
          {/* Tab 1: Applied Workers */}
          <button
            type="button"
            onClick={() => handleTabChange("pending")}
            className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === "pending"
                ? "bg-white text-gray-900 shadow-sm border border-gray-200/60 font-bold"
                : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
            }`}
          >
            <LuUsers
              className={`size-4 ${
                activeTab === "pending" ? "text-amber-600" : "text-gray-400"
              }`}
            />
            <span>Applied Workers</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-bold transition-colors ${
                activeTab === "pending"
                  ? "bg-amber-100 text-amber-900"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {appliedWorkers.length}
            </span>
          </button>

          {/* Tab 2: Approved Workers */}
          <button
            type="button"
            onClick={() => handleTabChange("approved")}
            className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === "approved"
                ? "bg-white text-gray-900 shadow-sm border border-gray-200/60 font-bold"
                : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
            }`}
          >
            <LuUserCheck
              className={`size-4 ${
                activeTab === "approved" ? "text-emerald-600" : "text-gray-400"
              }`}
            />
            <span>Approved Workers</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-bold transition-colors ${
                activeTab === "approved"
                  ? "bg-emerald-100 text-emerald-900"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {approvedWorkers.length}
            </span>
          </button>
        </div>

        {/* Live Search Input */}
        {currentList.length > 0 && (
          <div className="relative w-full sm:w-72">
            <LuSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${
                activeTab === "pending" ? "applied" : "approved"
              } workers...`}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brandClr1/20 focus:border-brandClr1 transition-all"
            />
          </div>
        )}
      </div>

      {/* --------------------- Content Grid --------------------- */}
      {filteredList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredList.map((item: any, idx: number) => (
            <WorkerApplicantCard
              key={item?._id || idx}
              item={item}
              tabType={activeTab}
              jobId={jobId}
            />
          ))}
        </div>
      ) : searchQuery.trim() ? (
        /* Empty search results */
        <div className="bg-white rounded-2xl border border-gray-200/80 p-8 text-center space-y-3">
          <div className="size-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mx-auto">
            <LuSearch className="size-6" />
          </div>
          <h3 className="font-bold text-gray-800 text-base">No Matching Workers</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            No workers match the search term &ldquo;{searchQuery}&rdquo;. Try clearing your search.
          </p>
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="inline-block px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold transition-colors"
          >
            Clear Search
          </button>
        </div>
      ) : activeTab === "pending" ? (
        /* Empty Applied Workers state */
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-8 sm:p-12 text-center space-y-4">
          <div className="size-16 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mx-auto">
            <LuUsers className="size-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-gray-900 text-lg sm:text-xl">
              No Applications Pending
            </h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              You do not have any pending worker applications for this job right now.
              Workers who apply will appear here for your review.
            </p>
          </div>
          {jobId && (
            <div className="pt-2 flex items-center justify-center gap-3 flex-wrap">
              <Link
                href={`/employer/posted-jobs/posted-job-details/${jobId}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brandClr2 hover:bg-[#f5be18] text-gray-950 font-bold text-xs shadow-sm transition-all"
              >
                <LuSparkles className="size-3.5" />
                <span>Boost This Job</span>
              </Link>
            </div>
          )}
        </div>
      ) : (
        /* Empty Approved Workers state */
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-8 sm:p-12 text-center space-y-4">
          <div className="size-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mx-auto">
            <LuUserCheck className="size-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-gray-900 text-lg sm:text-xl">
              No Approved Workers Yet
            </h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              You haven&apos;t approved any applicants for this job yet. Switch to the
              Applied Workers tab to review and approve incoming applicants.
            </p>
          </div>
          {appliedWorkers.length > 0 && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleTabChange("pending")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100/80 text-amber-900 border border-amber-200/80 font-semibold text-xs transition-all shadow-sm"
              >
                <LuUsers className="size-4 text-amber-700" />
                <span>Review {appliedWorkers.length} Applied Workers</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
