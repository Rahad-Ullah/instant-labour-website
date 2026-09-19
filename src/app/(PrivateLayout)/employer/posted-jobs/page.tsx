"use client";

import React, { Suspense } from 'react';
import PostedJobList from '@/components/cui/PostedJobList';
import BookingList from '@/components/cui/BookingList';
import CustomButton from '@/components/cui/CustomButton';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { JobCardSkeleton } from '@/components/card/CardSkeletons';

const profileSidebar = [
  {
    id: 1,
    title: "My Posted Jobs",
    query: "posted-job",
  },
  {
    id: 2,
    title: "My Bookings",
    query: "booking-list",
  },
];

function PostedJobPageSuspense() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const type = searchParams.get("type") || "posted-job";

  return (
    <div className="maxWidth flex flex-col gap-8 py-8 min-h-screen">
      <div className="flex flex-wrap gap-3 justify-between items-center">
        <ul className="flex flex-wrap gap-3">
          {profileSidebar?.map((item) => (
            <li
              onClick={() => router.push(`${pathname}?type=${item.query}`)}
              key={item.id}
              className={`py-2.5 px-5 cursor-pointer rounded-xl font-bold text-sm shadow-sm transition-all duration-200 border ${
                item.query === type
                  ? "bg-brandClr1 border-brandClr1 text-white shadow-md"
                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
              }`}
            >
              {item.title}
            </li>
          ))}
        </ul>

        {type === "posted-job" && (
          <div className="flex items-center justify-end">
            <CustomButton
              text="+ Post a Job"
              url="/employer/posted-jobs/post-job"
              variant="button01"
              className="border-2 border-brandClr2 rounded-xl shadow-sm hover:shadow-md"
            />
          </div>
        )}
      </div>

      <div className="w-full">
        {type === "posted-job" && <PostedJobList />}
        {type === "booking-list" && <BookingList />}
      </div>
    </div>
  );
}

const PageSkeleton = () => (
  <div className="maxWidth flex flex-col gap-8 py-8 min-h-screen">
    <div className="flex flex-wrap gap-3 justify-between items-center animate-pulse">
      <div className="flex flex-wrap gap-3">
        <div className="h-10 w-36 bg-slate-200 rounded-xl" />
        <div className="h-10 w-36 bg-slate-100 rounded-xl" />
      </div>
      <div className="h-10 w-32 bg-slate-200 rounded-xl" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <JobCardSkeleton key={i} />
      ))}
    </div>
  </div>
);

const PostedJobPage = () => {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <PostedJobPageSuspense />
    </Suspense>
  );
};

export default PostedJobPage;