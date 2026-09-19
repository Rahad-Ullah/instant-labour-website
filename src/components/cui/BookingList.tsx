"use client"
// import { workerDatas } from '@/data/workerDatas'
import React, { useEffect } from 'react'
import WorkerCard from '../card/workerCard'
import Link from 'next/link'
import { myFetch } from '@/utils/myFetch';
import { BOOKING_STATUS } from '@/types/jobTypes';

const BookingList = () => {
  const [workerDatas, setWorkerDatas] = React.useState<any>([]);

  useEffect(() => {
    const getWorkers = async () => {
      const res = await myFetch(`/booking`);
      const workerDatas = res?.data || [];
      // const meta: any = res?.data?.pagination || {};
      //console.log("Booked worker datas : ", workerDatas);

      const refineRes = workerDatas?.map((item: any) => {
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
          status: item?.status
        };
      }) || [];

      //console.log("Refine Booked worker datas : ", refineRes);

      setWorkerDatas(refineRes);
    }
    getWorkers();
  }, []);

  return (
    <>
      {/* --------------- Workers --------------- */}
      <div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8'>
          {workerDatas?.map((item: any) => (
            <WorkerCard
              key={item._id}
              item={item}
              url={`/employer/posted-jobs/booking/${item?._id}`}
              status={item.status}
            />
          ))}
        </div>
      </div>
    </>
  )
}

export default BookingList