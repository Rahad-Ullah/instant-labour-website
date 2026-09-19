"use client";

import { LuFileText, LuBadgeCheck } from 'react-icons/lu';
import { CircleCheck } from 'lucide-react';
import { HiSparkles } from 'react-icons/hi';

interface JobDetailsBodyProps {
  jobDetails: {
    overview?: string;
    responsibilities?: string[];
    skillRequirements?: string[];
    benefits?: string[];
    [key: string]: any;
  };
}

const JobDetailsBody = ({ jobDetails }: JobDetailsBodyProps) => {
  const hasResponsibilities = Array.isArray(jobDetails?.responsibilities) && jobDetails.responsibilities.length > 0;
  const hasSkills = Array.isArray(jobDetails?.skillRequirements) && jobDetails.skillRequirements.length > 0;
  const hasBenefits = Array.isArray(jobDetails?.benefits) && jobDetails.benefits.length > 0;

  return (
    <div className="space-y-6 pt-2">
      {/* 1. Job Overview Card */}
      {jobDetails?.overview && (
        <div className="bg-white rounded-2xl border border-gray-200/80 p-6 md:p-7 shadow-sm space-y-3">
          <div className="flex items-center gap-2.5 pb-2 border-b border-gray-100">
            <div className="size-8 rounded-lg bg-blue-50 flex items-center justify-center text-brandClr1">
              <LuFileText className="size-4.5" />
            </div>
            <h2 className="text-lg md:text-xl font-bold text-gray-900">Job Overview</h2>
          </div>
          <p className="text-gray-700 text-sm md:text-base leading-relaxed whitespace-pre-line">
            {jobDetails.overview}
          </p>
        </div>
      )}

      {/* 2. Responsibilities & Requirements Grid */}
      {(hasResponsibilities || hasSkills) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Key Responsibilities */}
          {hasResponsibilities && (
            <div className="bg-white rounded-2xl border border-gray-200/80 p-6 md:p-7 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
                  <div className="size-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <CircleCheck className="size-4.5" />
                  </div>
                  <h2 className="text-lg md:text-xl font-bold text-gray-900">Key Responsibilities</h2>
                </div>
                <div className="space-y-2.5 pt-3">
                  {jobDetails.responsibilities!.map((item: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-100 text-gray-700 hover:bg-slate-50 transition-colors"
                    >
                      <CircleCheck className="size-4 text-emerald-600 mt-1 shrink-0" />
                      <span className="text-sm md:text-base leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Skill Requirements */}
          {hasSkills && (
            <div className="bg-white rounded-2xl border border-gray-200/80 p-6 md:p-7 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
                  <div className="size-8 rounded-lg bg-blue-50 flex items-center justify-center text-brandClr1">
                    <LuBadgeCheck className="size-4.5" />
                  </div>
                  <h2 className="text-lg md:text-xl font-bold text-gray-900">Skill Requirements</h2>
                </div>
                <div className="space-y-2.5 pt-3">
                  {jobDetails.skillRequirements!.map((item: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-100 text-gray-700 hover:bg-slate-50 transition-colors"
                    >
                      <LuBadgeCheck className="size-4 text-brandClr1 mt-1 shrink-0" />
                      <span className="text-sm md:text-base leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. Benefits & Perks Card */}
      {hasBenefits && (
        <div className="bg-white rounded-2xl border border-gray-200/80 p-6 md:p-7 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
            <div className="size-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <HiSparkles className="size-4.5" />
            </div>
            <h2 className="text-lg md:text-xl font-bold text-gray-900">Benefits & Perks</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {jobDetails.benefits!.map((item: string, index: number) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-gradient-to-r from-amber-50/50 to-orange-50/30 border border-amber-200/50 text-gray-800"
              >
                <HiSparkles className="size-4 text-amber-500 mt-1 shrink-0" />
                <span className="text-sm md:text-base leading-relaxed font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetailsBody;