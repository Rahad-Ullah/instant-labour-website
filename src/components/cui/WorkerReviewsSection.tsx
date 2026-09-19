import React from "react";
import { MdOutlineStarPurple500 } from "react-icons/md";
import { LuMessageSquare } from "react-icons/lu";
import ReviewCard from "@/components/card/ReviewCard";

interface WorkerReviewsSectionProps {
  reviews: any[];
  workerRating?: number;
}

const WorkerReviewsSection: React.FC<WorkerReviewsSectionProps> = ({
  reviews = [],
  workerRating,
}) => {
  const count = reviews.length;
  const avgRating =
    count > 0
      ? (
          reviews.reduce((acc, curr) => acc + (Number(curr?.rating) || 5), 0) /
          count
        ).toFixed(1)
      : workerRating
      ? Number(workerRating).toFixed(1)
      : "5.0";

  return (
    <div className="space-y-4">
      {/* Section Header Card */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500 shrink-0">
            <MdOutlineStarPurple500 className="size-6 fill-amber-500" />
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg text-gray-900">
              Client Reviews & Ratings
            </h3>
            <p className="text-xs text-gray-500">
              Feedback from employers who booked this worker
            </p>
          </div>
        </div>

        {/* Rating Summary Badges */}
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-bold text-xs sm:text-sm">
            <MdOutlineStarPurple500 className="size-4 text-amber-500 fill-amber-500" />
            <span>{avgRating}</span>
            <span className="text-gray-400 font-normal">/ 5.0</span>
          </div>

          <span className="px-3 py-1.5 rounded-xl bg-gray-100 text-gray-700 text-xs sm:text-sm font-semibold">
            {count} {count === 1 ? "Review" : "Reviews"}
          </span>
        </div>
      </div>

      {/* Reviews Grid or Empty State */}
      {count > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((item: any, index: number) => (
            <ReviewCard key={item?._id || index} item={item} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-8 sm:p-10 text-center space-y-3">
          <div className="size-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 mx-auto">
            <LuMessageSquare className="size-7" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-gray-900 text-base">No Reviews Yet</h4>
            <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto">
              This worker hasn&apos;t received any client reviews yet. Reviews and ratings will be shown here once bookings are completed.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkerReviewsSection;
