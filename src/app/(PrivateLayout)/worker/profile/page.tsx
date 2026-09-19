

import WorkerDetailsBody from '@/components/cui/WorkerDetailsBody'
// import { workerDetails } from '@/data/workerDatas'
import Image from 'next/image'
import React from 'react'
import { RiSettings5Line } from "react-icons/ri";
import { BiEdit } from "react-icons/bi";
import Link from 'next/link';
import { myFetch } from '@/utils/myFetch';
import { formatUrl } from '@/utils/formatUrl';
import { brandLogo } from '@/assets/assets';
import { LuUser } from 'react-icons/lu';

const Profile = async () => {
  const res = await myFetch("/user/profile");
  const workerDetails = res?.data;

  const hasCover = Boolean(workerDetails?.cover && workerDetails.cover !== "undefined" && workerDetails.cover !== "null");
  const hasProfile = Boolean(workerDetails?.profile && workerDetails.profile !== "undefined" && workerDetails.profile !== "null");

  return (
    <div className='pb-20'>
      {/* ------------------- Profile & Cover ------------------- */}
      <div className='maxWidth relative'>
        {hasCover ? (
          <Image
            src={formatUrl(workerDetails.cover)}
            width={1200}
            height={300}
            alt={workerDetails?.name || "Worker Cover"}
            className='w-full sm:h-50 md:h-75 object-cover rounded-2xl shadow-sm'
          />
        ) : (
          <div className="w-full h-48 sm:h-60 md:h-72 flex items-center justify-center bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100/80 rounded-2xl border border-gray-200/70 shadow-sm">
            <div className="px-5 py-3 rounded-2xl bg-white shadow-sm border border-gray-200/70">
              <Image src={brandLogo} alt="Instant Labour" width={160} height={55} className="max-h-10 md:max-h-12 w-auto object-contain" priority />
            </div>
          </div>
        )}
        <div className='absolute bottom-0 left-6 md:left-16 rounded-2xl transform translate-y-1/2'>
          <div className="size-24 md:size-36 rounded-2xl overflow-hidden ring-4 ring-white shadow-lg bg-slate-100 flex items-center justify-center">
            {hasProfile ? (
              <Image src={formatUrl(workerDetails.profile)} width={400} height={400} alt={workerDetails?.name || "Worker Profile"} className='w-full h-full object-cover' />
            ) : (
              <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                <LuUser className="size-12 md:size-18" />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className='maxWidth flex items-center justify-end gap-2 md:gap-4 pt-2 md:pt-4'>
        <Link href="/worker/profile/edit-profile" className='flex items-center w-8 h-8 md:w-10 md:h-10 justify-center rounded-full bg-brandClr2/50 cursor-pointer'>
          <BiEdit className='md:text-2xl text-gray-600' />
        </Link>
        <Link href="/worker/profile/settings" className='flex items-center gap-2 bg-brandClr2/50 cursor-pointer rounded-full md:rounded-md p-2 md:px-4 md:py-1.5'>
          <span>
            <RiSettings5Line className='md:text-2xl text-gray-600' />
          </span>
          <span className='text-gray-600 text-lg font-semibold hidden md:block'>Settings</span>
        </Link>
      </div>
      <div className='h-5 md:h-20' />

      {/* ------------------- Personal Info ------------------- */}
      <WorkerDetailsBody workerDetails={workerDetails} />
    </div>
  )
}

export default Profile