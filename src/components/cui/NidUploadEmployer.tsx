"use client"

import { formatUrl } from '@/utils/formatUrl'
import { myFetch } from '@/utils/myFetch'
import React, { useEffect, useState } from 'react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { toast } from 'sonner'
import NidCardUpload from './NidCardUpload'

const items = [
  { label: "Limited", value: "limited" },
  { label: "Sole Trader", value: "sole_trader" },
  { label: "Agency", value: "agency" },
  { label: "Partnership", value: "partnership" },
  { label: "Individual", value: "individual" },
]

const NidUploadEmployer = () => {
  const [nidFornt, setNidFornt] = useState<string>();
  const [nidBack, setNidBack] = useState<string>();
  const [nidFrontFile, setNidFrontFile] = useState<File>();
  const [nidBackFile, setNidBackFile] = useState<File>();
  const [employerType, setEmployerType] = useState<string>();
  const [businessName, setBusinessName] = useState<string>("");
  const [companyNumber, setCompanyNumber] = useState<string>("");
  const [registeredAddress, setRegisteredAddress] = useState<string>("");
  const [preEmploymentCheck, setPreEmploymentCheck] = useState<boolean>(false);

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

      setBusinessName(res?.data?.businessName || "");
      setEmployerType(res?.data?.employerType || items[0].value);
      setCompanyNumber(res?.data?.companyNumber || "");
      setRegisteredAddress(res?.data?.registeredAddress || "");
    } catch (error) {
      console.error("Error fetching employer profile:", error);
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
    if (!preEmploymentCheck) {
      toast.error("Please full up the checkbox to confirm");
      return
    }
    const payload = {
      employerType,
      businessName,
      ...(employerType === "limited" ? { companyNumber } : { companyNumber: "" }),
      registeredAddress
    }
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
    })

    if (res.success) {
      toast.success("Verification request send to admin successfully");
      await fetchProfile();
    }
  }

  return (
    <div className='min-h-[600px] space-y-6 w-full max-w-[760px]'>
      <div>
        <h2 className='font-semibold text-lg sm:text-xl text-gray-800'>
          Identity Document Verification
        </h2>
        <p className='text-sm text-gray-500 mt-1'>
          Please upload clear photos or scans of both the front and back of your identity document.
        </p>
      </div>

      <div className='flex items-start flex-wrap gap-5'>
        <NidCardUpload
          side="front"
          imageUrl={nidFornt}
          inputId="nidForntImgEmployer"
          onFileSelect={handleNidFront}
          onRemove={handleRemoveFront}
        />
        <NidCardUpload
          side="back"
          imageUrl={nidBack}
          inputId="nidBackImgEmployer"
          onFileSelect={handleNidBack}
          onRemove={handleRemoveBack}
        />
      </div>
      <div className='space-y-4'>
        <div className='space-y-2'>
          <p className='font-semibold text-lg text-gray-700 capitalize'>Employer type</p>

          <Select onValueChange={(value) => setEmployerType(value)} defaultValue={employerType} >
            <SelectTrigger className="w-full border border-gray-300 rounded-md px-3 py-2" >
              <SelectValue placeholder={employerType || "Select Employer Type"} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {items.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

        </div>
        <div className='space-y-2'>
          <p className='font-semibold text-lg text-gray-700 capitalize'>Business Name </p>
          <input onChange={(e) => setBusinessName(e.target.value)} value={businessName} className='border border-gray-300 rounded-md px-3 py-2 w-full' type="text" placeholder='Type your business name' />
        </div>
        {employerType === "limited" && <div className='space-y-2'>
          <p className='font-semibold text-lg text-gray-700 capitalize'>Company Number</p>
          <input onChange={(e) => setCompanyNumber(e.target.value)} value={companyNumber} className='border border-gray-300 rounded-md px-3 py-2 w-full' type="text" placeholder='Enter your company number' />
        </div>}
        <div className='space-y-2'>
          <p className='font-semibold text-lg text-gray-700 capitalize'>registered address</p>
          <input onChange={(e) => setRegisteredAddress(e.target.value)} value={registeredAddress} className='border border-gray-300 rounded-md px-3 py-2 w-full' type="text" placeholder='Enter your registered address' />
        </div>
        <div className="flex items-baseline">
          <input type="checkbox" onChange={(e) => setPreEmploymentCheck(e.target.checked)} className="mr-2" />
          <span className=''>I acknowledge that a &quot;Verified&quot; badge only confirms a user&apos;s identity has been checked. I agree that I am solely responsible for performing all mandatory pre-employment checks, including Right to Work, references, and DBS checks.</span>
        </div>
        <div>
          <button onClick={handleSubmit} className='bg-[#FFC823] hover:bg-[#FFC823]/90 w-full px-3 py-3 rounded-md font-semibold text-gray-700 transition-colors duration-300 cursor-pointer'>Confirm</button>
        </div>
      </div>
    </div>
  )
}

export default NidUploadEmployer