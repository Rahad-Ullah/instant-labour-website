import React from "react";
import Link from "next/link";
import { LuUserX } from "react-icons/lu";
import WorkerDetailsTop from "@/components/cui/WorkerDetailsTop";
import WorkerDetailsBody from "@/components/cui/WorkerDetailsBody";
import WorkerReviewsSection from "@/components/cui/WorkerReviewsSection";
import BookMessageButtons from "@/components/actions/BookMessageButtons";
import { myFetch } from "@/utils/myFetch";

interface SingleWorkerPageProps {
  params: Promise<{
    id: string;
  }>;
}

const SingleWorker = async ({ params }: SingleWorkerPageProps) => {
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
        <h2 className="text-2xl font-bold text-gray-900">Worker Not Found</h2>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          The worker profile you are looking for does not exist or has been removed.
        </p>
        <Link
          href="/employer/posted-jobs"
          className="inline-block px-5 py-2.5 rounded-xl bg-brandClr2 hover:bg-[#f5be18] text-gray-950 font-bold text-sm shadow-sm transition-all"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-16 space-y-6">
      {/* ------------------- Worker Cover & Avatar ------------------- */}
      <WorkerDetailsTop workerDetails={workerDetails} />

      <div className="maxWidth space-y-6">
        {/* ------------------- Booking & Message Action Bar ------------------- */}
        <BookMessageButtons workerDetails={workerDetails} />

        {/* ------------------- Worker Details Body ------------------- */}
        <WorkerDetailsBody workerDetails={workerDetails} />

        {/* ------------------- Client Reviews Section ------------------- */}
        <WorkerReviewsSection reviews={reviews} workerRating={workerDetails?.rating} />
      </div>
    </div>
  );
};

export default SingleWorker;