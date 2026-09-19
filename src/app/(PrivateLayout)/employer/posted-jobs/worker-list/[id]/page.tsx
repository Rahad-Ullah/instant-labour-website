

import React from 'react'
import ApplicationApproveDeclineButtons from '@/components/actions/ApplicationApproveDeclineButtons';
import ReviewCard from '@/components/card/ReviewCard';
import TakeReview from '@/components/cui/TakeReview';
import WorkerDetailsBody from '@/components/cui/WorkerDetailsBody'
import WorkerDetailsTop from '@/components/cui/WorkerDetailsTop'
import { CustomModal } from '@/components/modal/CustomModal';
// import { reviewDatas } from '@/data/reviewData';
import { APPLICATION_STATUS } from '@/types/jobTypes';
import { myFetch } from '@/utils/myFetch';
import Link from 'next/link';

const ApproveAppliedWorkerDetails = async ({ searchParams, params }: { searchParams: any, params: any }) => {
  const { type, jobId, applicationId } = await searchParams
  const { id } = await params

  const res = await myFetch(`/user/workers/${id}`);
  const workerDetails = res?.data
  console.log("Get Worker Details Data : ", workerDetails);

  
  const resReview = await myFetch(`/review/${id}`);
  
  //console.log("Worker reviews : ", resReview?.data);


  return (
    <div className='pb-12'>
      {/* ------------------- Worker Details Top ------------------- */}
      <WorkerDetailsTop workerDetails={workerDetails} />



      {/* ------------------- Contact & Review Button ------------------- */}
      {type === 'approved' && <div className='maxWidth mb-8 flex gap-4 items-center'>
        <Link href={`/inbox?chat_id=${workerDetails?.chatId || ''}&user_id=${workerDetails?._id || id || ''}&name=${encodeURIComponent(workerDetails?.name || '')}`} className='border-2 border-brandClr2 bg-brandClr2 text-gray-800 font-semibold py-2 px-8 rounded-sm hover:bg-brandClr2/90 transition-colors duration-300'>Contact Now</Link>
        <CustomModal
          title="Feedback"
          trigger={<button className='border-2 border-blue-600 text-blue-600 font-semibold py-2 px-8 rounded-sm cursor-pointer hover:border-blue-700 transition-colors duration-300'>Feedback</button>}
        >
          <TakeReview id={id} />
        </CustomModal>
      </div>}

      {/* ------------------- Worker Details Body ------------------- */}
      <WorkerDetailsBody workerDetails={workerDetails} jobType="Full Time" />

      {/* --------------------- Rating list --------------------- */}
      <div className='maxWidth space-y-8 mt-12'>
        <p className='py-2 px-3 border-2 border-blue-600 font-semibold text-blue-700 rounded-sm text-xl'>Reviews</p>
        {resReview?.data?.map((item:any, index:number) => (
          <div key={index} className=''>
            <ReviewCard item={item} />
          </div>
        ))}
      </div>

      {/* ------------------- Action Buttons - Decline, Approve ------------------- */}
      {type === APPLICATION_STATUS.PENDING && <ApplicationApproveDeclineButtons applicationId={applicationId || workerDetails?._id} workerId={workerDetails?._id} jobId={jobId} />}


    </div>
  )
}

export default ApproveAppliedWorkerDetails