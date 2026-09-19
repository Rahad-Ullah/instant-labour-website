"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { LuMessageSquare, LuCalendarCheck, LuClock } from 'react-icons/lu';
import { MdOutlineStarPurple500 } from 'react-icons/md';

import { getUserRoleEmployer } from '@/utils/getUserRoleClient';
import { myFetch } from '@/utils/myFetch';
import { BOOKING_STATUS } from '@/types/jobTypes';
import { CustomModal } from '../modal/CustomModal';
import TakeReview from '../cui/TakeReview';

const BookMessageButtons = ({ workerDetails }: { workerDetails: any }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (!workerDetails) return null;

  const rawStatus = (workerDetails?.bookingStatus || workerDetails?.status || "").toLowerCase();
  const isApproved =
    rawStatus === BOOKING_STATUS.APPROVED.toLowerCase() ||
    rawStatus === "approved";
  const isPending =
    rawStatus === BOOKING_STATUS.PENDING.toLowerCase() ||
    rawStatus === "pending";

  const handleBooked = async () => {
    if (!getUserRoleEmployer()) {
      toast.error("Please login as an employer first");
      return;
    }

    setLoading(true);
    toast.loading("Sending booking request...", { id: "booking-req" });

    try {
      const res = await myFetch(`/booking/${workerDetails._id}`, {
        method: "POST",
      });

      if (res.success) {
        toast.success(res.message || "Booked successfully! Awaiting worker approval.", { id: "booking-req" });
        router.refresh();
      } else {
        toast.error(res.message || "Failed to send booking request.", { id: "booking-req" });
      }
    } catch {
      toast.error("An error occurred while booking.", { id: "booking-req" });
    } finally {
      setLoading(false);
    }
  };

  const inboxUrl = `/inbox?chat_id=${workerDetails?.chatId || ''}&user_id=${workerDetails?._id || ''}&name=${encodeURIComponent(workerDetails?.name || '')}`;

  return (
    <div className="maxWidth pb-8">
      {/* Approved State: Show Message & Review buttons (Book Now is removed) */}
      {isApproved ? (
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Booking Approved</span>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            {/* Message Button */}
            <Link
              href={inboxUrl}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-brandClr2 hover:bg-[#f5be18] text-gray-950 font-bold text-sm shadow-sm hover:shadow transition-all active:scale-[0.99]"
            >
              <LuMessageSquare className="size-4" />
              <span>Message</span>
            </Link>

            {/* Leave Review Button */}
            <CustomModal
              title="Leave a Review"
              trigger={
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border-2 border-brandClr1 text-brandClr1 hover:bg-blue-50 font-bold text-sm shadow-sm hover:shadow transition-all active:scale-[0.99] cursor-pointer"
                >
                  <MdOutlineStarPurple500 className="size-4.5 text-amber-500" />
                  <span>Leave Review</span>
                </button>
              }
            >
              <TakeReview id={workerDetails?._id} />
            </CustomModal>
          </div>
        </div>
      ) : isPending ? (
        /* Pending State: Worker has not yet accepted */
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs sm:text-sm font-semibold">
            <LuClock className="size-3.5 text-amber-600 animate-pulse" />
            <span>Booking Request Pending</span>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <button
              disabled
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gray-100 border border-gray-200 text-gray-400 font-semibold text-sm cursor-not-allowed"
            >
              <LuCalendarCheck className="size-4" />
              <span>Booking Requested</span>
            </button>

            <button
              onClick={() => toast.info("Messaging will be enabled once the worker approves your booking request.")}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gray-100 border border-gray-200 text-gray-400 font-semibold text-sm"
            >
              <LuMessageSquare className="size-4" />
              <span>Message</span>
            </button>
          </div>

          <p className="text-xs sm:text-sm text-gray-500 max-w-lg">
            You have already sent a booking request to this worker. Please wait for the worker to approve your request.
          </p>
        </div>
      ) : (
        /* Default / Unbooked State */
        <div className="flex flex-wrap gap-3 items-center">
          <button
            onClick={handleBooked}
            disabled={loading || Boolean(workerDetails?.isBooked)}
            className="inline-flex items-center justify-center gap-2 px-8 py-2.5 rounded-xl bg-brandClr2 hover:bg-[#f5be18] text-gray-950 font-bold text-sm shadow-sm hover:shadow transition-all active:scale-[0.99] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LuCalendarCheck className="size-4" />
            <span>{loading ? "Booking..." : "Book Now"}</span>
          </button>

          <button
            onClick={() => {
              if (workerDetails?.isBooked) {
                router.push(inboxUrl);
              } else {
                toast.info("Please book this worker first before starting a chat session.");
              }
            }}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold text-sm shadow-sm transition-all active:scale-[0.99] cursor-pointer"
          >
            <LuMessageSquare className="size-4" />
            <span>Message</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default BookMessageButtons;