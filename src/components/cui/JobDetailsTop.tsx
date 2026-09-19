"use client";

import Image from 'next/image';
import React, { useState } from 'react';
import { LuLayers2, LuBuilding2, LuClock } from "react-icons/lu";
import { GrLocation } from "react-icons/gr";
import { MdArrowBack, MdOutlineStarPurple500, MdOutlineVerifiedUser } from 'react-icons/md';
import { HiSparkles } from 'react-icons/hi';
import { BsExclamationCircle } from 'react-icons/bs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';

import { getUserRoleEmployer, getUserRoleWorker } from '@/utils/getUserRoleClient';
import { CustomModal } from '../modal/CustomModal';
import TakeReview from './TakeReview';
import { formatUrl } from '@/utils/formatUrl';
import { relativeTime } from '@/utils/relativeTimes';
import { myFetch } from '@/utils/myFetch';
import { APPLICATION_STATUS } from '@/types/jobTypes';
import { brandLogo } from '@/assets/assets';

interface JobDetailsTopProps {
  jobDetails: any;
  hideApplyButton?: boolean;
}

const JobDetailsTop = ({ jobDetails, hideApplyButton = false }: JobDetailsTopProps) => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isEmployer, setIsEmployer] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [applying, setApplying] = useState(false);

  React.useEffect(() => {
    setMounted(true);
    setIsEmployer(getUserRoleEmployer());
  }, []);

  const hasImage = Boolean(
    jobDetails?.images &&
    Array.isArray(jobDetails.images) &&
    jobDetails.images.length > 0 &&
    jobDetails.images[0] &&
    !imageError
  );

  const companyName = jobDetails?.companyName || "Employer";
  const jobTitle = jobDetails?.title || jobDetails?.companyName || "Labour Position";

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

  const hasSalary = typeof jobDetails?.salary === "number" && jobDetails.salary > 0;

  const goBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push('/jobs');
    }
  };

  const handleApply = async () => {
    if (!getUserRoleWorker()) {
      toast.error("Please login as a worker first");
      return;
    }

    setApplying(true);
    try {
      const res = await myFetch(`/application/${jobDetails._id}`, {
        method: "POST",
      });

      if (res.success) {
        toast.success(res.message || "Applied successfully!");
        document.getElementById("cancel-apply-modal")?.click();
        router.refresh();
      } else {
        toast.error(res.message || "Failed to apply. Please try again.");
      }
    } catch {
      toast.error("An error occurred while submitting your application.");
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Back Navigation Button */}
      <div>
        <button
          onClick={goBack}
          className="inline-flex items-center gap-2.5 text-gray-600 hover:text-gray-900 transition-colors py-1.5 px-3 -ml-3 rounded-xl hover:bg-gray-100 font-medium text-sm group cursor-pointer"
        >
          <span className="size-8 bg-white border border-gray-200 rounded-full flex items-center justify-center group-hover:bg-gray-100 shadow-sm transition-colors">
            <MdArrowBack className="size-4" />
          </span>
          <span className="text-sm font-semibold">Back to Jobs</span>
        </button>
      </div>

      {/* Main Header Card */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 md:p-7 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          {/* 1. Media Area / Brand Fallback */}
          <div className="w-full lg:w-96 shrink-0">
            <div className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden bg-slate-50 border border-gray-100 shadow-inner flex items-center justify-center">
              {hasImage ? (
                <>
                  <Image
                    src={formatUrl(jobDetails.images[0])}
                    fill
                    sizes="(max-width: 1024px) 100vw, 400px"
                    alt={jobTitle}
                    className="object-cover"
                    onError={() => setImageError(true)}
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                </>
              ) : (
                /* Instant Labour logo fallback when no work image is uploaded */
                <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100/70">
                  <div className="size-28 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center p-4">
                    <Image
                      src={brandLogo}
                      alt="Instant Labour"
                      width={160}
                      height={55}
                      className="max-h-12 w-auto object-contain"
                    />
                  </div>
                </div>
              )}

              {/* Top badges */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 gap-2 pointer-events-none">
                {jobDetails?.category ? (
                  <span
                    className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm truncate max-w-[60%] ${
                      hasImage
                        ? "bg-white/95 backdrop-blur-md text-gray-800"
                        : "bg-white text-gray-700 border border-gray-200"
                    }`}
                  >
                    {jobDetails.category}
                  </span>
                ) : (
                  <span />
                )}

                <div className="flex items-center gap-1.5">
                  {jobDetails?.boostWeight > 0 && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-brandClr2 text-gray-900 shadow-sm">
                      <HiSparkles className="size-3 text-gray-900" /> Featured
                    </span>
                  )}
                  {jobDetails?.isExpired && (
                    <span className="inline-flex items-center text-[11px] font-bold px-2.5 py-1 rounded-full bg-rose-500 text-white shadow-sm">
                      Expired
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 2. Job Info & Attributes */}
          <div className="flex-1 w-full space-y-4">
            {/* Title & Salary Row */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1.5 min-w-0 flex-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
                  {jobTitle}
                </h1>
                <div className="flex items-center flex-wrap gap-2 text-sm text-gray-600 font-medium">
                  <span className="flex items-center gap-1.5 text-gray-800">
                    <LuBuilding2 className="size-4 text-gray-400 shrink-0" />
                    <span className="font-semibold">{companyName}</span>
                  </span>
                  {jobDetails?.subCategory && (
                    <>
                      <span className="text-gray-300">•</span>
                      <span className="text-gray-500">{jobDetails.subCategory}</span>
                    </>
                  )}
                  <span className="text-gray-300">•</span>
                  <div className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200/60">
                    <MdOutlineStarPurple500 className="text-amber-500 size-3.5" />
                    <span>4.5</span>
                  </div>
                </div>
              </div>

              {/* Highlighted Salary Box */}
              <div className="shrink-0 sm:text-right">
                {hasSalary ? (
                  <div className="inline-flex items-baseline gap-1 px-3.5 py-1.5 bg-emerald-50 border border-emerald-200/80 rounded-2xl text-emerald-900">
                    <span className="text-2xl sm:text-3xl font-black">£{jobDetails.salary}</span>
                    <span className="text-xs sm:text-sm font-semibold text-emerald-700">
                      /{formatSalaryUnit(jobDetails.salaryType)}
                    </span>
                  </div>
                ) : (
                  <div className="inline-flex px-3 py-1.5 bg-gray-100 rounded-xl text-xs font-semibold text-gray-600">
                    Negotiable Rate
                  </div>
                )}
              </div>
            </div>

            {/* Quick Meta Badges (Location, Date, Verified) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-sm text-gray-600">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                  <GrLocation className="size-4 text-gray-500" />
                </div>
                <span className="truncate font-medium">{jobDetails.address || "Flexible Location"}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                  <LuClock className="size-4 text-gray-500" />
                </div>
                <span className="truncate font-medium">
                  Posted {jobDetails?.createdAt ? relativeTime(jobDetails.createdAt) : "Recently"}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                  <LuLayers2 className="size-4 text-gray-500" />
                </div>
                <span className="truncate font-medium">
                  {jobDetails?.category || "General"} {jobDetails?.subCategory ? `(${jobDetails.subCategory})` : ""}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <div
                  className={`size-8 rounded-lg flex items-center justify-center shrink-0 ${
                    jobDetails?.createdBy?.isAccountVerified
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  <MdOutlineVerifiedUser className="size-4.5" />
                </div>
                {jobDetails?.createdBy?.isAccountVerified ? (
                  <CustomModal
                    title="ID Verified Employer"
                    trigger={
                      <button className="text-emerald-700 font-semibold text-sm flex items-center gap-1.5 cursor-pointer hover:underline">
                        <span>Identity Verified</span>
                        <BsExclamationCircle className="size-3 text-emerald-600" />
                      </button>
                    }
                  >
                    <p className="text-gray-600 leading-relaxed text-sm">
                      This job was posted by an employer who has verified their government-issued ID to confirm their identity. Instant Labour provides this badge to help create trust on our platform.
                    </p>
                  </CustomModal>
                ) : (
                  <span className="text-gray-500 text-sm font-medium">Identity Unverified</span>
                )}
              </div>
            </div>

            {/* Availability Pills */}
            {jobDetails?.availability && Array.isArray(jobDetails.availability) && jobDetails.availability.length > 0 && (
              <div className="pt-2 flex items-center flex-wrap gap-2">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Availability:</span>
                {jobDetails.availability.map((item: string, index: number) => (
                  <span
                    key={index}
                    className="text-xs font-semibold px-3 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200/70"
                  >
                    {item}
                  </span>
                ))}
              </div>
            )}

            {/* 3. Action Buttons for Workers */}
            {!hideApplyButton && mounted && !isEmployer && (
              <div className="pt-4 border-t border-gray-100">
                {jobDetails.isApplied ? (
                  <div>
                    {jobDetails.applicationStatus === APPLICATION_STATUS.APPROVED ? (
                      <div className="flex flex-wrap gap-3 items-center">
                        <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                          Application Approved
                        </div>
                        <Link
                          href={`/inbox?chat_id=${jobDetails?.chatId || ''}&user_id=${jobDetails?.createdBy?._id || ''}&name=${encodeURIComponent(
                            jobDetails?.createdBy?.name || jobDetails?.companyName || ''
                          )}`}
                          className="px-6 py-2.5 rounded-xl bg-brandClr2 hover:bg-brandClr2/90 text-gray-900 font-bold text-sm shadow-sm transition-all"
                        >
                          Contact Employer
                        </Link>
                        <CustomModal
                          title="Rate & Feedback"
                          trigger={
                            <button className="px-6 py-2.5 rounded-xl border border-brandClr1 text-brandClr1 hover:bg-brandClr1 hover:text-white font-semibold text-sm transition-all cursor-pointer">
                              Leave Feedback
                            </button>
                          }
                        >
                          <TakeReview id={jobDetails?.createdBy?._id} />
                        </CustomModal>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm font-medium">
                        <span className="size-2 rounded-full bg-amber-500 animate-pulse" />
                        <span>Application Status: <strong className="capitalize font-bold">{jobDetails.applicationStatus || "Pending"}</strong></span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex">
                    <CustomModal
                      title=""
                      trigger={
                        <button className="px-8 py-3 bg-brandClr2 hover:bg-[#f5be18] text-gray-950 font-bold rounded-xl text-base shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer active:scale-[0.99]">
                          Apply For This Job
                        </button>
                      }
                    >
                      <div className="p-2 text-center space-y-4">
                        <div className="size-14 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-brandClr2">
                          <HiSparkles className="size-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Confirm Your Application</h3>
                        <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
                          Are you sure you want to apply for <strong>{jobTitle}</strong> at <strong>{companyName}</strong>?
                        </p>
                        <div className="flex gap-3 justify-center pt-2">
                          <button
                            id="cancel-apply-modal"
                            onClick={() => document.getElementById("cancel")?.click()}
                            className="px-5 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-xl text-sm transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleApply}
                            disabled={applying}
                            className="px-6 py-2.5 bg-brandClr2 hover:bg-brandClr2/90 text-gray-900 font-bold rounded-xl text-sm transition-colors cursor-pointer disabled:opacity-50"
                          >
                            {applying ? "Submitting..." : "Yes, Apply Now"}
                          </button>
                        </div>
                      </div>
                    </CustomModal>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsTop;