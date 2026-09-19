"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { LuBriefcase, LuPlus } from 'react-icons/lu';
import JobPostCard from '../card/JobPostCard';
import { JobCardSkeleton } from '../card/CardSkeletons';
import { myFetch } from '@/utils/myFetch';

const PostedJobList = () => {
  const [jobDatas, setJobDatas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getJobs = async () => {
      setLoading(true);
      try {
        const res = await myFetch(`/job/my-posted-jobs`);
        const newJobDatas = res?.data?.data || [];
        setJobDatas(newJobDatas);
      } catch (error) {
        console.error("Failed to load posted jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    getJobs();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <JobCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (jobDatas.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200/80 p-8 sm:p-14 text-center max-w-lg mx-auto space-y-4 shadow-sm my-6">
        <div className="size-16 rounded-2xl bg-blue-50 text-brandClr1 flex items-center justify-center mx-auto border border-blue-100">
          <LuBriefcase className="size-8" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-xl font-bold text-gray-900">No Posted Jobs Yet</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            You haven&apos;t posted any jobs yet. Create your first job posting to attract skilled workers.
          </p>
        </div>
        <Link
          href="/employer/posted-jobs/post-job"
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-brandClr2 hover:bg-[#f5be18] text-gray-950 font-bold text-sm shadow-sm transition-all active:scale-[0.99]"
        >
          <LuPlus className="size-4" />
          <span>Post a Job</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {jobDatas.map((item: any) => (
        <JobPostCard
          key={item._id}
          item={item}
          url={`/employer/posted-jobs/posted-job-details/${item._id}`}
        />
      ))}
    </div>
  );
};

export default PostedJobList;