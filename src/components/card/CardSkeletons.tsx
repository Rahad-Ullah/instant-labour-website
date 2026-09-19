import React from 'react';

export const JobCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden flex flex-col h-full animate-pulse">
      {/* 1. Header Media Banner */}
      <div className="w-full h-48 sm:h-52 bg-slate-200 shrink-0 relative">
        <div className="absolute top-3 left-3 h-5 w-24 rounded-full bg-slate-300" />
        <div className="absolute top-3 right-3 h-5 w-16 rounded-full bg-slate-300" />
      </div>

      {/* 2. Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-slate-200 rounded-md w-3/4" />
              <div className="h-3.5 bg-slate-100 rounded w-1/2" />
            </div>
            <div className="h-7 w-20 bg-slate-200 rounded-xl shrink-0" />
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="h-3 bg-slate-100 rounded w-full" />
            <div className="h-3 bg-slate-100 rounded w-4/5" />
          </div>

          <div className="flex gap-1.5 pt-1">
            <div className="h-5 w-16 bg-slate-100 rounded-md" />
            <div className="h-5 w-16 bg-slate-100 rounded-md" />
            <div className="h-5 w-14 bg-slate-100 rounded-md" />
          </div>
        </div>

        {/* 3. Bottom Meta & Action */}
        <div className="space-y-3 pt-3 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <div className="h-3.5 bg-slate-100 rounded w-28" />
            <div className="h-3.5 bg-slate-100 rounded w-16" />
          </div>
          <div className="h-10 bg-slate-200 rounded-xl w-full" />
        </div>
      </div>
    </div>
  );
};

export const WorkerCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden flex flex-col h-full animate-pulse">
      {/* 1. Banner */}
      <div className="w-full h-36 sm:h-40 bg-slate-200 shrink-0 relative">
        <div className="absolute top-3 left-3 h-5 w-24 rounded-full bg-slate-300" />
        <div className="absolute top-3 right-3 h-5 w-16 rounded-full bg-slate-300" />
      </div>

      {/* 2. Avatar & Content */}
      <div className="p-4 sm:p-5 pt-0 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-end justify-between gap-3 -mt-10 sm:-mt-11 mb-3">
            <div className="size-20 sm:size-22 rounded-2xl bg-slate-300 ring-4 ring-white shadow-md shrink-0" />
            <div className="h-7 w-24 bg-slate-200 rounded-xl shrink-0 pb-1" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-5 bg-slate-200 rounded-md w-1/2" />
              <div className="h-4 w-14 bg-slate-100 rounded-md" />
            </div>
            <div className="h-3.5 bg-slate-100 rounded w-1/3" />
          </div>

          <div className="space-y-2 pt-3">
            <div className="h-3.5 bg-slate-100 rounded w-2/3" />
            <div className="h-3.5 bg-slate-100 rounded w-1/2" />
          </div>
        </div>

        {/* 3. Bottom Action */}
        <div className="space-y-3 pt-3 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <div className="h-3.5 bg-slate-100 rounded w-24" />
            <div className="h-3.5 bg-slate-100 rounded w-12" />
          </div>
          <div className="h-10 bg-slate-200 rounded-xl w-full" />
        </div>
      </div>
    </div>
  );
};
