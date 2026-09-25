"use client";

import React, { useMemo, useState } from "react";
import { MdOutlineStarPurple500 } from "react-icons/md";
import { LuMessageSquare, LuStar } from "react-icons/lu";
import ReviewCard from "@/components/card/ReviewCard";

interface WorkerReviewsSectionProps {
  reviews: any[];
  workerRating?: number;
  title?: string;
  subtitle?: string;
  emptyTitle?: string;
  emptySubtitle?: string;
  isOwnProfile?: boolean;
  defaultReviewerRole?: string;
}

const WorkerReviewsSection: React.FC<WorkerReviewsSectionProps> = ({
  reviews = [],
  workerRating,
  title,
  subtitle,
  emptyTitle,
  emptySubtitle,
  isOwnProfile = false,
  defaultReviewerRole,
}) => {
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | "all">("all");

  const safeReviews = useMemo(() => {
    return Array.isArray(reviews) ? reviews : [];
  }, [reviews]);

  const count = safeReviews.length;

  const avgRating = useMemo(() => {
    if (count > 0) {
      const sum = safeReviews.reduce(
        (acc, curr) => acc + (Number(curr?.rating) || 5),
        0
      );
      return (sum / count).toFixed(1);
    }
    return workerRating ? Number(workerRating).toFixed(1) : "5.0";
  }, [safeReviews, count, workerRating]);

  // Star breakdown calculation (5, 4, 3, 2, 1)
  const ratingDistribution = useMemo(() => {
    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    safeReviews.forEach((r) => {
      const rounded = Math.min(5, Math.max(1, Math.round(Number(r?.rating) || 5)));
      counts[rounded] = (counts[rounded] || 0) + 1;
    });
    return counts;
  }, [safeReviews]);

  const filteredReviews = useMemo(() => {
    if (selectedRatingFilter === "all") return safeReviews;
    return safeReviews.filter((r) => {
      const star = Math.min(5, Math.max(1, Math.round(Number(r?.rating) || 5)));
      return star === selectedRatingFilter;
    });
  }, [safeReviews, selectedRatingFilter]);

  const resolvedTitle =
    title || (isOwnProfile ? "My Reviews & Ratings" : "Client Reviews & Ratings");
  const resolvedSubtitle =
    subtitle ||
    (isOwnProfile
      ? "Feedback and ratings provided by employers who booked you"
      : "Feedback from employers who booked this worker");
  const resolvedEmptyTitle =
    emptyTitle || "No Reviews Yet";
  const resolvedEmptySubtitle =
    emptySubtitle ||
    (isOwnProfile
      ? "You haven't received any employer reviews yet. Once you complete jobs for employers, feedback and ratings will appear here."
      : "This worker hasn't received any client reviews yet. Reviews and ratings will be shown here once bookings are completed.");

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
              {resolvedTitle}
            </h3>
            <p className="text-xs text-gray-500">
              {resolvedSubtitle}
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

      {/* Rating Breakdown & Stats Card (when reviews exist) */}
      {count > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Left Score Summary */}
            <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-4 bg-amber-50/40 rounded-xl border border-amber-100/70">
              <span className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
                {avgRating}
              </span>
              <div className="flex items-center gap-1 my-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <MdOutlineStarPurple500
                    key={star}
                    className={`size-5 ${
                      star <= Math.round(Number(avgRating))
                        ? "text-amber-500 fill-amber-500"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs font-medium text-gray-600">
                Based on {count} {count === 1 ? "review" : "reviews"}
              </p>
            </div>

            {/* Right Distribution Bars */}
            <div className="md:col-span-8 space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const starCount = ratingDistribution[star] || 0;
                const percentage = count > 0 ? (starCount / count) * 100 : 0;
                const isSelected = selectedRatingFilter === star;

                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() =>
                      setSelectedRatingFilter((prev) =>
                        prev === star ? "all" : star
                      )
                    }
                    className={`w-full flex items-center gap-3 text-xs group cursor-pointer p-1 rounded-lg transition-colors ${
                      isSelected
                        ? "bg-amber-50 font-bold"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <span className="w-12 text-left font-semibold text-gray-700 flex items-center gap-1 shrink-0">
                      {star}{" "}
                      <LuStar className="size-3 text-amber-500 fill-amber-500 inline" />
                    </span>

                    <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all duration-300 group-hover:bg-amber-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <span className="w-10 text-right text-gray-500 shrink-0 font-medium">
                      {starCount}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filter Chips when more than 1 review */}
          {count > 1 && (
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-gray-500 mr-1">Filter:</span>
              <button
                type="button"
                onClick={() => setSelectedRatingFilter("all")}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedRatingFilter === "all"
                    ? "bg-brandClr1 text-white shadow-xs"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                All ({count})
              </button>
              {[5, 4, 3, 2, 1].map((star) => {
                const starCount = ratingDistribution[star] || 0;
                if (starCount === 0) return null;
                const isSelected = selectedRatingFilter === star;
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() =>
                      setSelectedRatingFilter((prev) =>
                        prev === star ? "all" : star
                      )
                    }
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                      isSelected
                        ? "bg-amber-500 text-white shadow-xs"
                        : "bg-amber-50 text-amber-900 border border-amber-200/60 hover:bg-amber-100"
                    }`}
                  >
                    <span>{star}</span>
                    <MdOutlineStarPurple500 className="size-3 fill-current" />
                    <span>({starCount})</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Reviews Grid or Empty State */}
      {count > 0 ? (
        filteredReviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredReviews.map((item: any, index: number) => (
              <ReviewCard
                key={item?._id || index}
                item={item}
                defaultReviewerRole={defaultReviewerRole}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center space-y-2">
            <p className="text-sm font-semibold text-gray-700">
              No reviews match this filter.
            </p>
            <button
              type="button"
              onClick={() => setSelectedRatingFilter("all")}
              className="text-xs font-bold text-brandClr1 hover:underline cursor-pointer"
            >
              Show all reviews
            </button>
          </div>
        )
      ) : (
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-8 sm:p-10 text-center space-y-3">
          <div className="size-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 mx-auto">
            <LuMessageSquare className="size-7" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-gray-900 text-base">{resolvedEmptyTitle}</h4>
            <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto">
              {resolvedEmptySubtitle}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export { WorkerReviewsSection as JobReviewsSection };
export default WorkerReviewsSection;
