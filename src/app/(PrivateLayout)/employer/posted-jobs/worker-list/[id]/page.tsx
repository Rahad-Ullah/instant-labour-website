import React from "react";
import Link from "next/link";
import { LuMessageSquare, LuUserX } from "react-icons/lu";
import { MdOutlineStarPurple500 } from "react-icons/md";
import ApplicationApproveDeclineButtons from "@/components/actions/ApplicationApproveDeclineButtons";
import TakeReview from "@/components/cui/TakeReview";
import WorkerDetailsBody from "@/components/cui/WorkerDetailsBody";
import WorkerDetailsTop from "@/components/cui/WorkerDetailsTop";
import WorkerReviewsSection from "@/components/cui/WorkerReviewsSection";
import { CustomModal } from "@/components/modal/CustomModal";
import { APPLICATION_STATUS } from "@/types/jobTypes";
import { myFetch } from "@/utils/myFetch";

interface WorkerDetailsPageProps {
  searchParams: Promise<{
    type?: string;
    jobId?: string;
    applicationId?: string;
  }>;
  params: Promise<{
    id: string;
  }>;
}

const ApproveAppliedWorkerDetails = async ({
  searchParams,
  params,
}: WorkerDetailsPageProps) => {
  const { type, jobId, applicationId } = await searchParams;
  const { id } = await params;

  const [resWorker, resReview] = await Promise.all([
    myFetch(`/user/workers/${id}`),
    myFetch(`/review/${id}`),
  ]);

  const workerDetails = resWorker?.data;
  const reviews = resReview?.data || [];

  if (!workerDetails) {
    return (
      <div className="maxWidth pt-16 pb-24 text-center space-y-4">
        <div className="size-16 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 mx-auto">
          <LuUserX className="size-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Worker Profile Not Found</h2>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          The requested worker profile could not be loaded or is no longer available.
        </p>
        <Link
          href={
            jobId
              ? `/employer/posted-jobs/worker-list?jobId=${jobId}`
              : "/employer/posted-jobs"
          }
          className="inline-block px-5 py-2.5 rounded-xl bg-brandClr2 hover:bg-[#f5be18] text-gray-950 font-bold text-sm shadow-sm transition-all"
        >
          Back to Workers List
        </Link>
      </div>
    );
  }

  const inboxUrl = `/inbox?chat_id=${workerDetails?.chatId || ""}&user_id=${
    workerDetails?._id || id || ""
  }&name=${encodeURIComponent(workerDetails?.name || "")}`;

  return (
    <div className="pb-16 space-y-6">
      {/* ------------------- Worker Cover & Avatar ------------------- */}
      <WorkerDetailsTop workerDetails={workerDetails} />

      <div className="maxWidth space-y-6">
        {/* ------------------- Pending Applicant Decision Bar ------------------- */}
        {type === APPLICATION_STATUS.PENDING && (
          <ApplicationApproveDeclineButtons
            applicationId={applicationId || workerDetails?._id}
            workerId={workerDetails?._id}
            jobId={jobId || ""}
          />
        )}

        {/* ------------------- Approved Worker Actions Bar ------------------- */}
        {type === APPLICATION_STATUS.APPROVED && (
          <div className="bg-white rounded-2xl border border-gray-200/80 p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Approved Worker for this Job</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500">
                This worker has been approved. You can message them directly or leave performance feedback.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap shrink-0">
              <Link
                href={inboxUrl}
                className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 rounded-xl bg-brandClr2 hover:bg-[#f5be18] text-gray-950 font-bold text-sm shadow-sm hover:shadow transition-all active:scale-[0.99]"
              >
                <LuMessageSquare className="size-4" />
                <span>Message</span>
              </Link>

              <CustomModal
                title="Leave Worker Feedback"
                trigger={
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 rounded-xl border-2 border-brandClr1 text-brandClr1 hover:bg-blue-50 font-bold text-sm shadow-sm transition-all active:scale-[0.99] cursor-pointer"
                  >
                    <MdOutlineStarPurple500 className="size-4.5 text-amber-500" />
                    <span>Feedback</span>
                  </button>
                }
              >
                <TakeReview id={id} />
              </CustomModal>
            </div>
          </div>
        )}

        {/* ------------------- Worker Details Body ------------------- */}
        <WorkerDetailsBody workerDetails={workerDetails} />

        {/* ------------------- Reviews Section ------------------- */}
        <WorkerReviewsSection reviews={reviews} workerRating={workerDetails?.rating} />
      </div>
    </div>
  );
};

export default ApproveAppliedWorkerDetails;