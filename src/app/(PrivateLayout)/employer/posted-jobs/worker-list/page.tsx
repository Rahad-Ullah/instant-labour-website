// "use client"

import React from 'react'
import Image from 'next/image'
import CustomButton from '@/components/cui/CustomButton'
// import { workerDatas } from '@/data/workerDatas'
import { myFetch } from '@/utils/myFetch'
import { formatUrl } from '@/utils/formatUrl'
import GoBack from '@/components/actions/GoBack'
import { LuUser } from 'react-icons/lu'
// import { useSearchParams } from 'next/navigation'

const WorkerList = async ({ searchParams }: { searchParams: any }) => {
  const { type, jobId } = await searchParams;

  //console.log("Type : ", type);

  const res = await myFetch(`/application/${jobId}?status=${type}`, {
    method: "GET",
  })
  //console.log("--------------Application List : ", res);



  return (
    <div className='maxWidth pt-4 pb-20 min-h-screen'>
      {/* ------------------- Go Back Button ------------------- */}
      <GoBack type={type} />
      {/* <h2 className='text-2xl md:text-3xl xl:text-4xl font-bold mb-6 text-center text-gray-700 capitalize'>{type} Workers</h2> */}
      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
        {res?.data?.map((item: any, index: number) => (
          <div key={index} className='flex items-center justify-between customShadow px-3 py-3 rounded-sm'>
            <div className='flex items-center gap-4'>
              {item?.applicant?.profile ? (
                <Image
                  src={formatUrl(item.applicant.profile)}
                  width={100}
                  height={100}
                  alt={item?.applicant?.name || "Applicant"}
                  className='w-16 h-16 rounded-full object-cover shrink-0'
                />
              ) : (
                <div className='w-16 h-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0'>
                  <LuUser className="size-8" />
                </div>
              )}
              <div>
                <p>{item?.applicant.name}</p>
                <p className='text-sm text-gray-600'>{item?.applicant.category}</p>
                <p className='text-sm text-gray-600'>{item?.applicant.address}</p>
              </div>
            </div>
            <div>
              <CustomButton text="View" url={`/employer/posted-jobs/worker-list/${item?.applicant._id}?type=${type}&applicationId=${item?._id}&jobId=${jobId}`} variant="button03" className='w-full md:w-auto' />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WorkerList