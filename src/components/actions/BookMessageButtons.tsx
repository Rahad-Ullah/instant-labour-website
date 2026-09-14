"use client"
import React from 'react'
import { Button } from '../ui/button'
import { toast } from 'sonner';
import { getUserRoleEmployer } from '@/utils/getUserRoleClient';
import { myFetch } from '@/utils/myFetch';
import { useRouter } from 'next/navigation';
import { BOOKING_STATUS } from '@/types/jobTypes';

const BookMessageButtons = ({ workerDetails }: { workerDetails: any }) => {
  const router = useRouter();

  const handleBooked = async () => {
    if (getUserRoleEmployer()) {
      //console.log("Worker Id : ", workerDetails._id);
      const res = await myFetch(`/booking/${workerDetails._id}`, {
        method: "POST",
      })
      //console.log("Apply res : ", res);
      if (res.success) {
        toast.success("Booked Successfully");
        router.refresh();
      } else {
        toast.error(res.message);
      }
    } else {
      toast.error("Please login first");
    }
  }

  const isApproved =
    workerDetails?.bookingStatus?.toLowerCase() ===
    BOOKING_STATUS?.APPROVED?.toLowerCase();
  const isPending =
    workerDetails?.bookingStatus?.toLowerCase() ===
    BOOKING_STATUS?.PENDING?.toLowerCase();

  const handleMessage = () => {
    if (getUserRoleEmployer()) {
      if (isApproved) {
        const params = new URLSearchParams();
        if (workerDetails?.chatId) params.set("chat_id", workerDetails.chatId);
        if (workerDetails?._id) params.set("user_id", workerDetails._id);
        if (workerDetails?.name) params.set("name", workerDetails.name);
        router.push(`/inbox?${params.toString()}`);
      } else {
        toast.error("Booking not approved yet");
      }
    } else {
      toast.error("Please login first");
    }
  }


  return (
    <div className='maxWidth pb-8'>
      <div className='flex gap-2'>
        <div className=''>
          <Button onClick={handleBooked} disabled={workerDetails?.isBooked || isPending || isApproved} variant="yelloBtn" className='w-full text-gray-700 rounded-sm'>Book Now</Button>
        </div>
        <div className=''>
          <Button onClick={handleMessage} disabled={!workerDetails?.isBooked} variant="yelloBtn" className='w-full text-gray-600 rounded-sm'>Message</Button>
        </div>
      </div>
      <p className='text-gray-500 pt-4'>{isPending && "You have already sent a booking request to this worker. Please wait for the worker to approve your request."}</p>
    </div>
  )
}

export default BookMessageButtons