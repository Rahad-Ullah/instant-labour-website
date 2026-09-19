"use client";

import React from "react";
import {
  MdOutlineStarPurple500,
  MdOutlineVerifiedUser,
} from "react-icons/md";
import {
  LuUser,
  LuBriefcase,
  LuWrench,
  LuCheck,
  LuMapPin,
  LuClock,
  LuDollarSign,
  LuLayers2,
} from "react-icons/lu";
import { BsExclamationCircle } from "react-icons/bs";
import { CustomModal } from "@/components/modal/CustomModal";

interface WorkerDetailsBodyProps {
  workerDetails: any;
  jobType?: string;
}

const WorkerDetailsBody: React.FC<WorkerDetailsBodyProps> = ({
  workerDetails,
  jobType,
}) => {
  const isVerified = Boolean(
    workerDetails?.isAccountVerified ?? workerDetails?.verified
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

  const hasSalary =
    typeof workerDetails?.salary === "number"
      ? workerDetails.salary > 0
      : Boolean(workerDetails?.salary);

  return (
    <div className="space-y-6">
      {/* ------------------- Profile Header Row ------------------- */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          {/* Name & Verification */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="font-extrabold text-2xl sm:text-3xl text-gray-900 tracking-tight">
              {workerDetails?.name || "Worker Profile"}
            </h1>

            {isVerified ? (
              <CustomModal
                title="ID Verified"
                trigger={
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
                  >
                    <MdOutlineVerifiedUser className="size-4 text-emerald-600" />
                    <span>ID Verified</span>
                    <BsExclamationCircle className="size-3 text-emerald-600 opacity-70" />
                  </button>
                }
              >
                <div className="space-y-2 text-sm text-gray-600 leading-relaxed">
                  <p className="font-bold text-gray-900">
                    Government ID Verified
                  </p>
                  <p>
                    This user has provided valid government ID to confirm they are
                    a real person. Instantlabour has not performed background,
                    criminal, or Right to Work checks.
                  </p>
                </div>
              </CustomModal>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500 border border-gray-200">
                <MdOutlineVerifiedUser className="size-4 text-gray-400" />
                <span>Unverified</span>
              </span>
            )}

            {/* Rating pill */}
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 font-bold text-xs">
              <MdOutlineStarPurple500 className="size-3.5 text-amber-500 fill-amber-500" />
              <span>
                {workerDetails?.rating
                  ? Number(workerDetails.rating).toFixed(1)
                  : "5.0"}
              </span>
            </div>
          </div>

          {/* Subtitle & Trade */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 flex-wrap">
            {workerDetails?.category && (
              <span className="font-semibold text-brandClr1">
                {workerDetails.category}
              </span>
            )}
            {workerDetails?.subCategory && (
              <>
                <span className="text-gray-300">•</span>
                <span>{workerDetails.subCategory}</span>
              </>
            )}
            {workerDetails?.yearsOfExperience ? (
              <>
                <span className="text-gray-300">•</span>
                <span>{workerDetails.yearsOfExperience} years experience</span>
              </>
            ) : null}
            {jobType && (
              <>
                <span className="text-gray-300">•</span>
                <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-medium text-xs">
                  {jobType}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Rate Box */}
        <div className="shrink-0 self-start md:self-auto">
          {hasSalary ? (
            <div className="px-4 py-2.5 bg-emerald-50 border border-emerald-200/80 rounded-2xl flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-900">
                £{workerDetails.salary}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-emerald-700">
                /{formatSalaryUnit(workerDetails.salaryType)}
              </span>
            </div>
          ) : (
            <div className="px-4 py-2 bg-gray-100 rounded-xl text-xs font-semibold text-gray-600">
              Rate Negotiable
            </div>
          )}
        </div>
      </div>

      {/* ------------------- Two-Column Content Grid ------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Bio & Experience */}
        <div className="lg:col-span-2 space-y-6">
          {/* About Me Card */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
              <div className="size-8 rounded-lg bg-blue-50 flex items-center justify-center text-brandClr1">
                <LuUser className="size-4" />
              </div>
              <h2 className="font-bold text-lg text-gray-900">About Me</h2>
            </div>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line">
              {workerDetails?.about ||
                "This worker has not provided a personal biography yet."}
            </p>
          </div>

          {/* Work Experience & Portfolio Card */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
              <div className="size-8 rounded-lg bg-blue-50 flex items-center justify-center text-brandClr1">
                <LuBriefcase className="size-4" />
              </div>
              <h2 className="font-bold text-lg text-gray-900">
                Portfolio & Work Experience
              </h2>
            </div>

            {workerDetails?.workExperiences &&
            workerDetails.workExperiences.length > 0 ? (
              <div className="space-y-3">
                {workerDetails.workExperiences.map(
                  (item: any, index: number) => (
                    <div
                      key={index}
                      className="p-4 rounded-xl bg-gray-50/80 border border-gray-100 hover:border-gray-200 transition-colors space-y-1.5"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="size-6 rounded-full bg-brandClr1 text-white text-xs font-bold flex items-center justify-center shrink-0">
                          {index + 1}
                        </span>
                        <h4 className="font-bold text-sm sm:text-base text-gray-900">
                          {item?.title || "Work Experience"}
                        </h4>
                      </div>
                      {item?.description && (
                        <p className="text-xs sm:text-sm text-gray-600 pl-8 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>
                  )
                )}
              </div>
            ) : (
              <p className="text-xs sm:text-sm text-gray-500 italic">
                No previous portfolio or experience items listed.
              </p>
            )}
          </div>
        </div>

        {/* Right Column (1 Col): Overview & Core Skills */}
        <div className="lg:col-span-1 space-y-6">
          {/* Overview Attributes Card */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
              <div className="size-8 rounded-lg bg-blue-50 flex items-center justify-center text-brandClr1">
                <LuLayers2 className="size-4" />
              </div>
              <h3 className="font-bold text-base text-gray-900">
                Worker Overview
              </h3>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm">
              {/* Rate */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-gray-500">
                  <LuDollarSign className="size-4 text-gray-400 shrink-0" />
                  <span>Wage Rate</span>
                </div>
                <span className="font-bold text-emerald-800">
                  {hasSalary
                    ? `£${workerDetails.salary}/${formatSalaryUnit(
                        workerDetails.salaryType
                      )}`
                    : "Negotiable"}
                </span>
              </div>

              {/* Experience */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-gray-500">
                  <LuClock className="size-4 text-gray-400 shrink-0" />
                  <span>Experience</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {workerDetails?.yearsOfExperience
                    ? `${workerDetails.yearsOfExperience} Years`
                    : "Not specified"}
                </span>
              </div>

              {/* Category */}
              {workerDetails?.category && (
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-gray-500">
                    <LuBriefcase className="size-4 text-gray-400 shrink-0" />
                    <span>Category</span>
                  </div>
                  <span className="font-semibold text-gray-900 text-right truncate max-w-[55%]">
                    {workerDetails.category}
                  </span>
                </div>
              )}

              {/* Location */}
              {(workerDetails?.address || workerDetails?.location) && (
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-gray-500">
                    <LuMapPin className="size-4 text-gray-400 shrink-0" />
                    <span>Location</span>
                  </div>
                  <span className="font-semibold text-gray-900 text-right truncate max-w-[55%]">
                    {workerDetails.address || workerDetails.location}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Core Skills Card */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
              <div className="size-8 rounded-lg bg-blue-50 flex items-center justify-center text-brandClr1">
                <LuWrench className="size-4" />
              </div>
              <h3 className="font-bold text-base text-gray-900">Core Skills</h3>
            </div>

            {workerDetails?.coreSkills &&
            workerDetails.coreSkills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {workerDetails.coreSkills.map((skill: string, index: number) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-gray-800 text-xs font-semibold hover:bg-slate-100 transition-colors"
                  >
                    <LuCheck className="size-3.5 text-emerald-600 shrink-0" />
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs sm:text-sm text-gray-500 italic">
                No core skills specified.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerDetailsBody;