"use client"

import { formatUrl } from '@/utils/formatUrl'
import { myFetch } from '@/utils/myFetch'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import NidCardUpload from './NidCardUpload'

const NidUploadWorker = () => {
  const [nidFornt, setNidFornt] = useState<string>();
  const [nidBack, setNidBack] = useState<string>();
  const [nidFrontFile, setNidFrontFile] = useState<File>();
  const [nidBackFile, setNidBackFile] = useState<File>();
  const [isCommitted, setIsCommitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const fetchProfile = async () => {
    try {
      const res = await myFetch(`/user/profile`);
      const rawFront = res?.data?.nidFront;
      const rawBack = res?.data?.nidBack;

      if (rawFront && typeof rawFront === 'string' && !rawFront.includes('defaultImage') && rawFront.trim() !== '') {
        setNidFornt(formatUrl(rawFront));
      } else {
        setNidFornt(undefined);
      }

      if (rawBack && typeof rawBack === 'string' && !rawBack.includes('defaultImage') && rawBack.trim() !== '') {
        setNidBack(formatUrl(rawBack));
      } else {
        setNidBack(undefined);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleNidFront = (file: File) => {
    setNidFrontFile(file);
    const url = URL.createObjectURL(file);
    setNidFornt(url);
  }

  const handleNidBack = (file: File) => {
    setNidBackFile(file);
    const url = URL.createObjectURL(file);
    setNidBack(url);
  }

  const handleRemoveFront = () => {
    setNidFrontFile(undefined);
    setNidFornt(undefined);
  }

  const handleRemoveBack = () => {
    setNidBackFile(undefined);
    setNidBack(undefined);
  }

  const handleSubmit = async () => {
    if (!isCommitted) {
      toast.error("Please fill up the checkbox to confirm");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: any = {
        isCommitted: isCommitted
      };

      const formData = new FormData();
      formData.append("data", JSON.stringify(payload));
      if (nidFrontFile) {
        formData.append("nidFront", nidFrontFile);
      }
      if (nidBackFile) {
        formData.append("nidBack", nidBackFile);
      }

      const res = await myFetch(`/user/profile`, {
        method: "PATCH",
        body: formData
      });

      if (res.success) {
        toast.success("Verification request send to admin successfully");
        await fetchProfile();
      } else {
        toast.error("Failed to send verification request");
      }
    } catch (error) {
      toast.error("Failed to send verification request");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className='min-h-[500px] space-y-6 w-full max-w-[760px]'>
      <div>
        <h2 className='font-semibold text-lg sm:text-xl text-gray-800'>
          National ID Verification
        </h2>
        <p className='text-sm text-gray-500 mt-1'>
          Please upload clear photos or scans of both the front and back of your National ID, Driver&apos;s Licence, or Passport.
        </p>
      </div>

      <div className='flex items-start flex-wrap gap-5'>
        <NidCardUpload
          side="front"
          imageUrl={nidFornt}
          inputId="nidForntImg"
          onFileSelect={handleNidFront}
          onRemove={handleRemoveFront}
        />
        <NidCardUpload
          side="back"
          imageUrl={nidBack}
          inputId="nidBackImg"
          onFileSelect={handleNidBack}
          onRemove={handleRemoveBack}
        />
      </div>

      <div className='space-y-4 pt-2'>
        <div className="flex items-start bg-amber-50/60 border border-amber-200/80 rounded-lg p-3.5">
          <input
            id="commitCheckbox"
            type="checkbox"
            checked={isCommitted}
            onChange={(e) => setIsCommitted(e.target.checked)}
            className="mt-1 mr-3 h-4 w-4 rounded border-gray-300 text-[#FFC823] focus:ring-[#FFC823] cursor-pointer"
          />
          <label htmlFor="commitCheckbox" className="text-xs sm:text-sm text-gray-700 leading-relaxed cursor-pointer select-none">
            I confirm that my profile information is accurate and I have the legal right to work in the UK. I acknowledge that Instantlabour verification is for identity purposes only and does not include background, criminal, or Right to Work checks.
          </label>
        </div>
        <div>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className='bg-[#FFC823] hover:bg-[#FFC823]/90 disabled:opacity-60 disabled:cursor-not-allowed w-full px-3 py-3 rounded-md font-semibold text-gray-800 transition-colors duration-300 cursor-pointer shadow-xs'
          >
            {isSubmitting ? "Submitting..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default NidUploadWorker