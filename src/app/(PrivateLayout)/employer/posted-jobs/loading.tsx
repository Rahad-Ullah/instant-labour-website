import React from 'react';
import { JobCardSkeleton } from '@/components/card/CardSkeletons';

export default function Loading() {
  return (
    <div className="maxWidth flex flex-col gap-8 py-8 min-h-screen">
      {/* Header bar skeleton */}
      <div className="flex flex-wrap gap-3 justify-between items-center animate-pulse">
        <div className="flex flex-wrap gap-3">
          <div className="h-10 w-36 bg-slate-200 rounded-xl" />
          <div className="h-10 w-36 bg-slate-100 rounded-xl" />
        </div>
        <div className="h-10 w-32 bg-slate-200 rounded-xl" />
      </div>

      {/* Grid of Skeleton Cards */}
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <JobCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
