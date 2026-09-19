import React from "react";
import { myFetch } from "@/utils/myFetch";
import { APPLICATION_STATUS } from "@/types/jobTypes";
import WorkerListTabContainer from "@/components/cui/WorkerListTabContainer";
import Link from "next/link";
import { LuBriefcase } from "react-icons/lu";

interface WorkerListPageProps {
  searchParams: Promise<{
    type?: string;
    jobId?: string;
  }>;
}

const WorkerList = async ({ searchParams }: WorkerListPageProps) => {
  const resolvedSearchParams = await searchParams;
  const jobId = resolvedSearchParams?.jobId || "";
  const type = resolvedSearchParams?.type || APPLICATION_STATUS.PENDING;

  if (!jobId) {
    return (
      <div className="maxWidth pt-12 pb-20 text-center space-y-4">
        <div className="size-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mx-auto">
          <LuBriefcase className="size-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Job ID Missing</h2>
        <p className="text-gray-500 text-sm max-w-md mx-auto">
          Please select a job post from your dashboard to review its applied and approved workers.
        </p>
        <Link
          href="/employer/posted-jobs"
          className="inline-block px-5 py-2.5 rounded-xl bg-brandClr2 text-gray-950 font-semibold text-sm shadow-sm hover:bg-[#f5be18] transition-colors"
        >
          View Posted Jobs
        </Link>
      </div>
    );
  }

  // Fetch pending applications, approved applications, and job info in parallel
  const [pendingRes, approvedRes, jobRes] = await Promise.all([
    myFetch(`/application/${jobId}?status=${APPLICATION_STATUS.PENDING}`, {
      method: "GET",
    }),
    myFetch(`/application/${jobId}?status=${APPLICATION_STATUS.APPROVED}`, {
      method: "GET",
    }),
    myFetch(`/job/${jobId}`, {
      method: "GET",
    }),
  ]);

  const appliedWorkers = pendingRes?.data || [];
  const approvedWorkers = approvedRes?.data || [];
  const jobDetails = jobRes?.data || null;

  return (
    <div className="maxWidth pt-4 pb-20 min-h-screen">
      <WorkerListTabContainer
        jobId={jobId}
        initialTab={type === APPLICATION_STATUS.APPROVED ? "approved" : "pending"}
        appliedWorkers={appliedWorkers}
        approvedWorkers={approvedWorkers}
        jobDetails={jobDetails}
      />
    </div>
  );
};

export default WorkerList;