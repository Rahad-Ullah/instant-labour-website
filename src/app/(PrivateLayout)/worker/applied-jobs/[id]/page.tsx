// "use client"


import JobDetailsBody from '@/components/cui/JobDetailsBody'
import React from 'react'
import { myFetch } from '@/utils/myFetch'
import ReviewCard from '@/components/card/ReviewCard'
import JobDetailsTop from '@/components/cui/JobDetailsTop'
// import { reviewDatas } from '@/data/reviewData'
// import Image from 'next/image'
// import { jobDetails } from '@/data/jobDatas'
// import JobDetailsTopRight from '@/components/cui/JobDetailsTopRight'
// import Link from 'next/link'
// import { CustomModal } from '@/components/modal/CustomModal'
// import TakeReview from '@/components/cui/TakeReview'
// import { formatUrl } from '@/utils/formatUrl'
// import { APPLICATION_STATUS } from '@/types/jobTypes'

const page = async ({ params }: { params: { id: string } }) => {

  const { id } = await params;
  const res = await myFetch(`/job/${id}`);
  const jobDetails = res?.data || [];
  //console.log("Job Details res : ", jobDetails);


  const resReview = await myFetch(`/review/${jobDetails?.createdBy?._id}`);
  //console.log("Employee reviews : ", resReview?.data);


  return (
    <div className='maxWidth pt-4 pb-20'>

      {/* --------------------- Job Header --------------------- */}
      {/* <JobDetailsTop /> */}
      {/* <div key={jobDetails._id} className='flex flex-col md:flex-row gap-8 bg-white'>
        <div>
          <Image src={formatUrl(jobDetails.images[0])} width={500} height={400} alt={jobDetails.companyName} className='w-full sm:w-100 h-67.5 rounded-md' />
        </div>
        <div className='space-y-3'>
          <div className='space-y-3'>

            <JobDetailsTopRight jobDetails={jobDetails} />

            {(jobDetails?.applicationStatus === APPLICATION_STATUS.APPROVED) ? <p className='flex gap-4 items-center'>
              <span className='text-blue-600 font-semibold'>Status :</span>
              <span className='text-blue-600 font-semibold'>Ongoing</span>
            </p> : <div className='flex gap-4 items-center'>
              <Link href={`/inbox`} className='border-2 border-brandClr2 bg-brandClr2 text-gray-800 font-semibold py-2 px-8 rounded-sm hover:bg-brandClr2/90 transition-colors duration-300'>Contact Now</Link>
              <CustomModal
                title="Feedback"
                trigger={<button className='border-2 border-blue-600 text-blue-600 font-semibold py-2 px-8 rounded-sm cursor-pointer hover:border-blue-700 transition-colors duration-300'>Feedback</button>}
              >
                <TakeReview id={jobDetails?.createdBy?._id} />
              </CustomModal>
            </div>}

          </div>

        </div>
      </div> */}

      {/* --------------------- Job Header --------------------- */}
      <JobDetailsTop jobDetails={jobDetails} />
      
      {/* --------------------- Job body (description) --------------------- */}
      <JobDetailsBody jobDetails={jobDetails} />


      {/* --------------------- Rating list --------------------- */}
      <div className='space-y-8 mt-12'>
        <p className='py-2 px-3 border-2 border-blue-600 font-semibold text-blue-700 rounded-sm text-xl'>Reviews</p>
        {resReview?.data?.map((item: any, index: number) => (
          <div key={index} className=''>
            <ReviewCard item={item} />
          </div>
        ))}
      </div>

    </div>
  )
}

export default page