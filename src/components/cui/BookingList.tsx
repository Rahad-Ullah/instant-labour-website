"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { LuCalendarCheck, LuSearch } from 'react-icons/lu';
import WorkerCard from '../card/workerCard';
import { WorkerCardSkeleton } from '../card/CardSkeletons';
import { myFetch } from '@/utils/myFetch';

const BookingList = () => {
  const [workerDatas, setWorkerDatas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getWorkers = async () => {
      setLoading(true);
      try {
        const res = await myFetch(`/booking`);
        const workerList = res?.data || [];

        const refineRes =
          workerList?.map((item: any) => {
            return {
              ...item?.worker,
              _id: item?.worker?._id,
              profile: item?.worker?.profile,
              name: item?.worker?.name,
              verified: item?.worker?.isAccountVerified ?? item?.worker?.verified,
              createdAt: item?.createdAt,
              category: item?.worker?.category,
              location: item?.worker?.address,
              salary: item?.worker?.salary,
              salaryType: item?.worker?.salaryType,
              status: item?.status,
            };
          }) || [];

        setWorkerDatas(refineRes);
      } catch (error) {
        console.error("Failed to load booked workers:", error);
      } finally {
        setLoading(false);
      }
    };
    getWorkers();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <WorkerCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (workerDatas.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200/80 p-8 sm:p-14 text-center max-w-lg mx-auto space-y-4 shadow-sm my-6">
        <div className="size-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-100">
          <LuCalendarCheck className="size-8" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-xl font-bold text-gray-900">No Bookings Yet</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            You have not booked any workers yet. Browse qualified labourers and specialists to book assistance.
          </p>
        </div>
        <Link
          href="/workers"
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-brandClr1 hover:bg-blue-700 text-white font-bold text-sm shadow-sm transition-all active:scale-[0.99]"
        >
          <LuSearch className="size-4" />
          <span>Browse Workers</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {workerDatas.map((item: any) => (
        <WorkerCard
          key={item._id}
          item={item}
          url={`/employer/posted-jobs/booking/${item?._id}`}
          status={item.status}
        />
      ))}
    </div>
  );
};

export default BookingList;