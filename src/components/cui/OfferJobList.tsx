"use client"
import { BOOKING_STATUS } from '@/types/jobTypes'
import { formatUrl } from '@/utils/formatUrl'
// import { employerDatas } from '@/data/employerDatas'
import { myFetch } from '@/utils/myFetch'
import dayjs from 'dayjs'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { toast } from 'sonner'



const OfferJobList = () => {
  const [employerDatas, setEmployerDatas] = React.useState<any>([]);
  const [chatList, setChatList] = React.useState<any[]>([]);

  const getEmployers = async () => {
    try {
      const [res, chatRes] = await Promise.all([
        myFetch(`/booking`),
        myFetch(`/chat`),
      ]);
      const employerDatas = res?.data || [];
      const chats = chatRes?.data || [];
      console.log("Booked employer datas : ", employerDatas);
      console.log("User chats : ", chats);
      setEmployerDatas(employerDatas);
      setChatList(chats);
    } catch (err) {
      console.error("Error fetching bookings/chats:", err);
    }
  };

  useEffect(() => {
    getEmployers();
  }, []);

  const getChatUrl = (item: any) => {
    const employerId = (item?.employer?._id || item?.employer)?.toString();
    const employerName = item?.employer?.name?.trim();

    // Find if chat exists in chatList for this employer
    const matchedChat = chatList?.find((c: any) => {
      const pId = (c.participant?._id || c.participant)?.toString();
      if (employerId && pId === employerId) return true;

      if (Array.isArray(c.participants)) {
        if (c.participants.some((p: any) => (p?._id || p)?.toString() === employerId)) {
          return true;
        }
      }

      const cEmpId = (c.employer?._id || c.employer)?.toString();
      if (employerId && cEmpId === employerId) return true;

      const cWorkId = (c.worker?._id || c.worker)?.toString();
      if (employerId && cWorkId === employerId) return true;

      if (employerName && c.participant?.name?.trim().toLowerCase() === employerName.toLowerCase()) {
        return true;
      }

      return false;
    });

    const params = new URLSearchParams();
    if (matchedChat?._id || matchedChat?._ids) {
      params.set("chat_id", String(matchedChat._ids || matchedChat._id));
    } else if (item?.chatId && item.chatId !== "undefined") {
      params.set("chat_id", item.chatId);
    }

    if (employerId) {
      params.set("user_id", employerId);
    }
    if (employerName) {
      params.set("name", employerName);
    }

    return `/inbox?${params.toString()}`;
  };

  const handleApproveDecline = async (id: any, status: string) => {
    const res = await myFetch(`/booking/${id}`, {
      method: "PATCH",
      body: {
        status: status
      }
    });
    //console.log("Approve res : ", res);
    if (res.success) {
      toast.success(res.message || `Job offer ${status} successfully!`);
      getEmployers();
    } else {
      toast.error(res.message || `Failed to ${status} job.`);
    }
  }


  return (
    <div className='w-full max-w-200 mx-auto'>
      {employerDatas.map((item: any) => (
        <div key={item?._id} className='flex items-center justify-between gap-4 mt-4 shadow-lg p-4 rounded-md bg-brandClr2/10'>
          <div className='flex gap-4'>
            <Image src={formatUrl(item?.employer?.profile)} width={200} height={200} alt="" className='w-25 h-25 rounded-md object-cover' />
            <div className='flex-1'>
              <p className='font-semibold text-gray-800'>{item?.employer?.name}</p>
              <p className='text-gray-500 text-sm'>{item?.employer?.address}</p>
              <p className='text-gray-500 text-sm'>{dayjs(item?.createdAt).format("DD, MMMM YYYY")}</p>
            </div>
          </div>
          {item.status === BOOKING_STATUS.APPROVED &&
            <div className='h-full flex items-end justify-end gap-4'>
              <Link href={getChatUrl(item)} className='w-25 bg-yellow-500 text-white hover:bg-yellow-600 transition-colors duration-200 cursor-pointer text-sm font-semibold px-3 py-2 rounded-md text-center'>Message</Link>
            </div>}
          {item.status === BOOKING_STATUS.PENDING && <div className='flex items-center flex-col gap-4'>
            <button onClick={() => handleApproveDecline(item?._id, BOOKING_STATUS.APPROVED)} className='w-25 bg-yellow-500 text-white hover:bg-yellow-600 transition-colors duration-200 cursor-pointer text-sm font-semibold px-3 py-2 rounded-md'>Approve</button>
            <button onClick={() => handleApproveDecline(item?._id, BOOKING_STATUS.DECLINED)} className='w-25 border border-red-500 text-red-500 text-sm font-semibold px-3 py-2 rounded-md cursor-pointer transition-colors hover:border-red-600 hover:text-red-600 hover:transition-colors duration-200'>Decline</button>
          </div>}
          {item.status === BOOKING_STATUS.DECLINED &&
            <div className='h-full flex items-end justify-end gap-4'>
              <p className='w-25 bg-red-500 text-white hover:bg-red-600 transition-colors duration-200 cursor-pointer text-sm font-semibold px-3 py-2 rounded-md text-center'>Declined</p>
            </div>}
        </div>
      ))}
    </div>
  )
}

export default OfferJobList