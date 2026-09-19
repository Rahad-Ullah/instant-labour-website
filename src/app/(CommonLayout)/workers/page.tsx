
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
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-8 py-20">
          <div className="flex-1 space-y-6">
            <h1 className="text-3xl sm:text-4xl lg:text-7xl text-gray-800 font-bold leading-20 capitalize">find labour for <br />your short-term <br />or day job</h1>
            <p className="text-gray-600 mt-4">connects with local labour available now for temporary work.</p>
            {workers !== "instantLabour" && <div className='max-w-50 mt-12'>
              <Link href="/employer/posted-jobs/post-job" className='block w-full bg-brandClr2 text-gray-50 hover:bg-brandClr2/80 py-2 rounded-sm text-center font-semibold'>Post A Job</Link>
            </div>}
          </div>
          <div className="flex justify-center items-center">
            <Image src={heroWorkerImg} alt="Hero Image" width={1000} height={1000} className='w-75 h-75 lg:w-100 lg:h-100 object-cover rounded-full' />
          </div>
        </div>

        {/* --------------------- Available Labour Banner --------------------- */}
        <div className='bg-[#548EE8] py-2 mb-12'>
          <h2 className='text-2xl md:text-3xl xl:text-4xl font-bold text-gray-50 text-center capitalize'>available labour</h2>
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