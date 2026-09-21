
// "use client"
import { heroWorkerImg } from '@/assets/assets'
import { CustomFilter } from '@/components/cui/CustomFilter'
import { CustomSearchBar } from '@/components/cui/CustomSearchBar'
import Image from 'next/image'
import { FaBars } from "react-icons/fa6";
import CustomPagination from '@/components/cui/CustomPagination'
import WorkerCard from '@/components/card/workerCard'
// import { workerDatas } from '@/data/workerDatas'
import { getUserRoleEmployer } from '@/utils/getUserRoleServer'
import Link from 'next/link'
import { myFetch } from '@/utils/myFetch'
import LocationPicker from '@/components/map/LocationPicker'
import { CustomModalAutoComplete } from '@/components/modal/CustomModalAutoComplete';
import { IoCheckmarkCircle } from 'react-icons/io5';
import { LuMapPin, LuPlus, LuShieldCheck, LuSparkles } from 'react-icons/lu';


const Workers = async ({ searchParams }: { searchParams: { [key: string]: string } }) => {
  const isEmployer = await getUserRoleEmployer();
  const newSearchParams = await searchParams;
  const workers = newSearchParams.workers;
  const type = newSearchParams.type;
  const searchTerm = newSearchParams.searchTerm;
  const category = newSearchParams.category;
  const subCategory = newSearchParams.subCategory;
  const price = newSearchParams.price;
  const radius = newSearchParams.radius;
  const salaryType = newSearchParams.salaryType;
  // const location = newSearchParams.location;
  const longitude = newSearchParams.longitude;
  const latitude = newSearchParams.latitude;
  const page = newSearchParams?.page || 1;
  const limit = newSearchParams?.pageSize || 10;

  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...(searchTerm ? { searchTerm } : {}),
    ...(category ? { category } : {}),
    ...(subCategory ? { subCategory } : {}),
    ...(salaryType ? { salaryType } : {}),
    ...(price ? { minSalary: "0", maxSalary: price } : {}),
    ...(radius ? { radius } : {}),
    // ...(location ? { address: location } : {}),
    ...(longitude && latitude ? { longitude, latitude } : {}),
  });

  const url = `/user/workers?${params.toString()}`;
  //console.log("workers url : ", url);
  const res = await myFetch(url);
  
  //console.log("worker res : ", res?.data?.data);

  // formatting the worker data to fit the worker card props
  const refineRes = res?.data?.data?.map((item: any) => {
    return {
      ...item,
      _id: item?._id,
      profile: item?.profile,
      name: item?.name,
      verified: item?.isAccountVerified ?? item?.verified,
      createdAt: item?.createdAt,
      category: item?.category,
      location: item?.address || item?.location,
      salary: item?.salary,
      salaryType: item?.salaryType,
      status: item?.status
    };
  }) || [];
  // console.log("worker refine res : ", refineRes);

  // extracting the coordinates for the map
  const resCoordinates = res?.data?.data?.map((item: any) => ({
    lng: item.location.coordinates[0],
    lat: item.location.coordinates[1]
  }));

  // console.log("resCoordinates : ", resCoordinates);

  // const workerDatas = res?.data?.data || [];
  const meta: any = res?.data?.meta || {};
  // console.log("worker get res : ", workerDatas);
  // console.log("worker meta res : ", res);



  return (
    <div className='maxWidth'>
      {/* --------------------- Hero Worker Section --------------------- */}
      {isEmployer && type !== "instantLabour" && <>
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-10 lg:gap-12 py-12 sm:py-16 lg:py-20">
          <div className="flex-1 space-y-6 text-center lg:text-left">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-brandClr1 text-xs sm:text-sm font-semibold tracking-wide shadow-2xs">
              <LuSparkles className="size-3.5 text-brandClr2 fill-brandClr2" />
              <span>Verified On-Demand Labour</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-[1.15] capitalize">
              Find labour for <br className="hidden sm:inline" />
              your <span className="text-brandClr1">short-term</span> <br className="hidden lg:inline" />
              or <span className="relative inline-block text-brandClr1">
                day job
                <span className="absolute -bottom-1 left-0 w-full h-2.5 bg-brandClr2/40 -z-10 rounded-full" />
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-gray-600 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Connect instantly with skilled local workers available right now for temporary, seasonal, or urgent shifts.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs sm:text-sm text-gray-600 font-medium pt-1">
              <span className="inline-flex items-center gap-1.5">
                <IoCheckmarkCircle className="size-4 text-emerald-600 shrink-0" />
                Fast Hiring
              </span>
              <span className="inline-flex items-center gap-1.5">
                <LuShieldCheck className="size-4 text-brandClr1 shrink-0" />
                Vetted Profiles
              </span>
              <span className="inline-flex items-center gap-1.5">
                <LuMapPin className="size-4 text-brandClr2 shrink-0" />
                Local Workers
              </span>
            </div>

            {/* Post Job CTA */}
            {workers !== "instantLabour" && (
              <div className="pt-3 flex justify-center lg:justify-start">
                <Link
                  href="/employer/posted-jobs/post-job"
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-brandClr2 hover:bg-amber-400 text-gray-950 font-bold text-base rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 group"
                >
                  <LuPlus className="size-5 text-gray-950 stroke-[2.5] group-hover:rotate-90 transition-transform duration-200" />
                  <span>Post A Job</span>
                </Link>
              </div>
            )}
          </div>

          {/* Hero Worker Image with decorative glow & floating badges */}
          <div className="flex justify-center items-center relative py-4 sm:py-6">
            {/* Background Ambient Glow */}
            <div className="absolute w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full bg-gradient-to-br from-blue-100/80 via-amber-100/50 to-transparent blur-2xl pointer-events-none -z-10" />

            {/* Image Container */}
            <div className="relative p-2 sm:p-3 rounded-full bg-gradient-to-tr from-brandClr1/25 via-white to-brandClr2/35 shadow-2xl">
              <Image
                src={heroWorkerImg}
                alt="Hero Worker"
                width={800}
                height={800}
                priority
                className="w-60 h-60 sm:w-76 sm:h-76 lg:w-92 lg:h-92 object-cover rounded-full border-4 border-white shadow-inner"
              />

              {/* Floating Badge 1: Active Workers (Bottom Left) */}
              <div className="absolute -bottom-2 -left-2 sm:bottom-4 sm:-left-4 bg-white/95 backdrop-blur-sm border border-gray-100 rounded-2xl p-2.5 sm:p-3 shadow-lg flex items-center gap-2.5 sm:gap-3">
                <span className="relative flex size-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full size-3 bg-emerald-500" />
                </span>
                <div>
                  <p className="text-xs font-bold text-gray-900 leading-tight">Active Workers</p>
                  <p className="text-[11px] text-gray-500 font-medium">Ready for hire</p>
                </div>
              </div>

              {/* Floating Badge 2: Verified Skills (Top Right) */}
              <div className="absolute top-2 -right-2 sm:top-6 sm:-right-4 bg-white/95 backdrop-blur-sm border border-gray-100 rounded-2xl p-2.5 sm:p-3 shadow-lg flex items-center gap-2 sm:gap-2.5">
                <div className="size-8 rounded-xl bg-blue-50 text-brandClr1 flex items-center justify-center font-bold">
                  <LuShieldCheck className="size-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900 leading-tight">Verified Skills</p>
                  <p className="text-[11px] text-gray-500 font-medium">Quality Guaranteed</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --------------------- Available Labour Banner --------------------- */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brandClr1 via-[#0047b8] to-[#00348f] text-white py-6 sm:py-8 px-6 sm:px-10 mb-10 shadow-sm border border-blue-400/20">
          {/* Ambient soft glow overlays */}
          <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute -left-8 -top-8 w-44 h-44 rounded-full bg-brandClr2/20 blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-semibold text-blue-100 mb-2">
                <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Directory & Map
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white capitalize">
                Available Labour
              </h2>
              <p className="text-sm sm:text-base text-blue-100/90 mt-1 max-w-xl font-normal">
                Explore nearby workers on the interactive map below or search profiles by skill and trade.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 text-sm font-semibold text-white shadow-xs">
                <LuMapPin className="size-4 text-brandClr2" />
                <span>Interactive Map</span>
              </div>
            </div>
          </div>
        </div>
      </>}

      {/* --------------- Google Map --------------- */}
      <div>
        <LocationPicker locations={resCoordinates || []} />
      </div>

      {/* --------------- Search and Jobs Filter Options --------------- */}
      <div className='flex items-center gap-4 py-8'>
        <div className='flex-1'>
          <CustomSearchBar placeholder="Search here..." query="searchTerm" />
        </div>
        <CustomModalAutoComplete
          title="Workers Filter Options"
          trigger={<button className='border border-gray-400 p-3 text-gray-500 rounded-full cursor-pointer'>
            <FaBars className='text-xl' />
          </button>}
        >
          <CustomFilter />
        </CustomModalAutoComplete>
      </div>

      {/* --------------- Workers --------------- */}
      <div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8'>
          {refineRes?.map((item: any) => (
            <WorkerCard key={item._id} item={item} url={`/workers/${item._id}`} />
          ))}
        </div>
      </div>

      {/* --------------- Pagination --------------- */}
      <div className='py-12'>
        <CustomPagination TOTAL_PAGES={meta?.totalPages} />
      </div>

    </div>
  )
}

export default Workers