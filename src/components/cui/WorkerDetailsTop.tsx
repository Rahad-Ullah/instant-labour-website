"use client";
import { formatUrl } from '@/utils/formatUrl';
import Image from 'next/image';
import React, { useState } from 'react';
import { MdArrowBack } from 'react-icons/md';
import { LuUser } from 'react-icons/lu';
import { brandLogo } from '@/assets/assets';

const WorkerDetailsTop = ({ workerDetails }: { workerDetails: any }) => {
  const [profileError, setProfileError] = useState(false);
  const [coverError, setCoverError] = useState(false);

  const goBack = () => {
    window.history.back();
  };

  const hasCover = Boolean(
    workerDetails?.cover &&
    workerDetails.cover !== "undefined" &&
    workerDetails.cover !== "null" &&
    !coverError
  );
  const hasProfile = Boolean(
    workerDetails?.profile &&
    workerDetails.profile !== "undefined" &&
    workerDetails.profile !== "null" &&
    !profileError
  );

  return (
    <div className='maxWidth pt-4 pb-4'>
      {/* ------------------- Profile & Cover ------------------- */}
      <div className='relative'>
        <div className="relative w-full h-48 sm:h-60 md:h-72 rounded-2xl overflow-hidden bg-slate-100 border border-gray-200/70 shadow-sm">
          {hasCover ? (
            <>
              <Image
                src={formatUrl(workerDetails.cover)}
                fill
                sizes="100vw"
                alt={workerDetails?.name || "Worker cover"}
                className='object-cover'
                onError={() => setCoverError(true)}
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </>
          ) : (
            /* Platform logo for banner fallback */
            <div className="relative w-full h-full flex items-center justify-center p-6 bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100/80">
              <div className="size-24 sm:size-28 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center p-3">
                <Image
                  src={brandLogo}
                  alt="Instant Labour"
                  width={150}
                  height={50}
                  className="max-h-12 w-auto object-contain"
                  priority
                />
              </div>
            </div>
          )}
        </div>

        <div onClick={goBack} className='absolute top-4 left-4 md:left-8 flex items-center gap-2 md:gap-4 cursor-pointer group z-10'>
          <span className='size-8 md:size-10 border border-white/50 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center group-hover:bg-black/60 transition-colors duration-200 shadow-sm'>
            <MdArrowBack className='size-5 md:size-6 text-white' />
          </span>
        </div>

        <div className='absolute bottom-0 left-6 md:left-12 rounded-2xl transform translate-y-1/2 z-10'>
          <div className="relative size-24 md:size-36 rounded-2xl overflow-hidden ring-4 ring-white shadow-lg bg-slate-100 flex items-center justify-center">
            {hasProfile ? (
              <Image
                src={formatUrl(workerDetails.profile)}
                fill
                sizes="(max-width: 768px) 96px, 144px"
                alt={workerDetails?.name || "Worker profile"}
                className='object-cover'
                onError={() => setProfileError(true)}
                priority
              />
            ) : (
              <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                <LuUser className="size-12 md:size-18" />
              </div>
            )}
          </div>
          <div className='size-4 md:size-6 rounded-full bg-emerald-500 ring-2 ring-white absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3 shadow' title="Active" />
        </div>
      </div>
      <div className='h-16 md:h-24' />
    </div>
  );
};

export default WorkerDetailsTop;