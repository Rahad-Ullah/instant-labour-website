import JobDetailsBody from '@/components/cui/JobDetailsBody';
import JobDetailsTop from '@/components/cui/JobDetailsTop';
import { APPLICATION_STATUS } from '@/types/jobTypes';
import { myFetch } from '@/utils/myFetch';
import Link from 'next/link';
import React from 'react';
import BoostJobButton from '@/components/cui/BoostJobButton';
import { LuPencil, LuUsers, LuUserCheck, LuBriefcase } from 'react-icons/lu';

const PostedJobDetails = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  const res = await myFetch(`/job/${id}`);
  const jobDetails = res?.data || null;

  if (!jobDetails) {
    return (
      <div className="maxWidth pt-12 pb-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Job Not Found</h2>
        <p className="text-gray-500 text-sm">The job posting you are looking for does not exist or has been removed.</p>
        <Link
          href="/employer/posted-jobs"
          className="inline-block px-5 py-2.5 rounded-xl bg-brandClr2 text-gray-900 font-semibold text-sm shadow-sm"
        >
          Back to Posted Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="maxWidth pt-4 pb-20 space-y-6">
      {/* --------------------- Job Header --------------------- */}
      <JobDetailsTop jobDetails={jobDetails} hideApplyButton />

      {/* ------------ Employer Management Action Bar ------------ */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 sm:p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-blue-50 flex items-center justify-center text-brandClr1 shrink-0 border border-blue-100">
            <LuBriefcase className="size-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm sm:text-base">Employer Actions</h3>
            <p className="text-xs text-gray-500">Manage worker applications and post visibility</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            href={`/employer/posted-jobs/edit-job/${jobDetails._id}`}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-sm transition-all shadow-sm active:scale-[0.99]"
          >
            <LuPencil className="size-4 text-gray-600" />
            <span>Edit Post</span>
          </Link>

          <Link
            href={`/employer/posted-jobs/worker-list?type=${APPLICATION_STATUS.PENDING}&jobId=${jobDetails._id}`}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100/80 text-amber-900 border border-amber-200 font-semibold text-sm transition-all shadow-sm active:scale-[0.99]"
          >
            <LuUsers className="size-4 text-amber-600" />
            <span>Applied Workers</span>
          </Link>

          <Link
            href={`/employer/posted-jobs/worker-list?type=${APPLICATION_STATUS.APPROVED}&jobId=${jobDetails._id}`}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 text-emerald-900 border border-emerald-200 font-semibold text-sm transition-all shadow-sm active:scale-[0.99]"
          >
            <LuUserCheck className="size-4 text-emerald-600" />
            <span>Approved Workers</span>
          </Link>

          <BoostJobButton
            jobId={jobDetails._id}
            isBoosted={jobDetails?.boostWeight > 0}
            jobTitle={jobDetails?.title || jobDetails?.companyName}
          />
        </div>
      </div>

      {/* --------------------- Job body (description) --------------------- */}
      <JobDetailsBody jobDetails={jobDetails} />
    </div>
  );
};

export default PostedJobDetails;