import Image from "next/image";
import Link from "next/link";
import { IoCheckmarkCircle } from "react-icons/io5";
import { BsExclamationCircle } from "react-icons/bs";
import { LuShieldCheck } from "react-icons/lu";
import IndustriesSlider from "@/components/sections/IndustriesSlider";
import ClientSayCard from "@/components/card/ClientSayCard";
import FAQ from "@/components/sections/FAQ";
import {
  getUserRole,
  getUserRoleEmployer,
  getUserRoleWorker,
} from "@/utils/getUserRoleServer";
import { CustomModal } from "@/components/modal/CustomModal";
import OfferSection from "@/components/sections/OfferSection";
import { myFetch } from "@/utils/myFetch";
import { formatUrl } from "@/utils/formatUrl";
import { filteredSectionData } from "@/utils/filteredSectionData";
import { sectionTypeEnum } from "@/types/types";
import { brandLogo } from "@/assets/assets";

{/* --------------------- Modal Content Components Start --------------------- */ }
const ForEmployersComponent = () => (
  <div className="space-y-4 text-gray-700">
    <div className="space-y-2.5">
      {[
        "Post A Job In Seconds",
        "Browse Available Local Workers",
        "Review Profiles And Ratings",
      ].map((item, idx) => (
        <div
          key={idx}
          className="flex items-center gap-2.5 text-sm sm:text-base font-medium"
        >
          <IoCheckmarkCircle className="size-5 text-emerald-500 shrink-0" />
          <span className="capitalize">{item}</span>
        </div>
      ))}
    </div>
    <div className="pt-3 border-t border-gray-100">
      <p className="text-base sm:text-lg font-bold text-gray-900 capitalize">
        Need A worker Today?
      </p>
      <p className="text-sm text-gray-600 capitalize mt-1">
        Post your job and connect with available workers in minutes.
      </p>
    </div>
  </div>
);

const ForWorkersComponent = () => (
  <div className="max-h-96 overflow-y-auto scrollbar-hide space-y-4 text-gray-700">
    <div className="space-y-1">
      <p className="font-bold text-gray-900 text-sm sm:text-base capitalize">
        Looking for same-day or flexible work?
      </p>
      <p className="text-sm text-gray-600 leading-relaxed capitalize">
        InstantLabour makes it easy to browse local job opportunities, apply for
        roles, and connect directly with employers—all in one place.
      </p>
    </div>

    <div className="pt-2">
      <p className="text-base font-bold text-gray-900 pb-2 capitalize">
        Work on Your Terms
      </p>
      <div className="space-y-2">
        {[
          "Browse and apply for jobs that fit your availability",
          "Choose when and where you work",
          "Connect directly with employers",
          "No phone calls, no agencies",
        ].map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2.5 text-sm font-medium"
          >
            <IoCheckmarkCircle className="size-5 text-emerald-500 shrink-0" />
            <span className="capitalize">{item}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const InstantLabourComponent = () => (
  <div className="max-h-96 overflow-y-auto scrollbar-hide space-y-4 text-gray-700">
    <p className="text-sm leading-relaxed capitalize text-gray-600">
      Hire local labourers, cleaners, drivers, and more - fast. Instant Labour is a
      simple platform where employers and workers can connect directly, without
      agencies or phone calls.
    </p>
    <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-1">
      <p className="text-base font-bold text-gray-900 capitalize">
        Need A worker Today?
      </p>
      <p className="text-sm text-gray-700 capitalize">
        Instant Labour is a UK-based platform designed for urgent labour and
        short-term work opportunities.
      </p>
    </div>
    <p className="text-sm text-gray-600 leading-relaxed capitalize">
      Browse available workers and connect instantly - no need to post a job.
      Ideal for last-minute cover, urgent projects, or one-day tasks.
    </p>
  </div>
);
{/* --------------------- Modal Content Components End --------------------- */ }

export default async function Home() {
  const isUser = await getUserRole();
  const isEmployer = await getUserRoleEmployer();
  const isWorker = await getUserRoleWorker();

  const resCoupon = await myFetch("/package/offer-data", { method: "GET" });
  const resClientReview = await myFetch("/clientreview", { method: "GET" });

  const res = await myFetch("/content/section/home", { method: "GET" });

  const homeHero = filteredSectionData({
    data: res?.data,
    section: sectionTypeEnum.HERO,
  });
  const howItWorksEmployer = filteredSectionData({
    data: res?.data,
    section: sectionTypeEnum.HOW_IT_WORKS,
  });
  const howItWorksWorker = filteredSectionData({
    data: res?.data,
    section: sectionTypeEnum.HOW_IT_WORKS_WORKER,
  });
  const howItWorks = isEmployer ? howItWorksEmployer : howItWorksWorker;
  const whyInstantLabour = filteredSectionData({
    data: res?.data,
    section: sectionTypeEnum.WHY_US,
  });

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* --------------------- Hero Section --------------------- */}
      <div className="maxWidth flex flex-col-reverse lg:flex-row items-center justify-between gap-10 sm:gap-14 pt-6 pb-12 sm:pt-10 sm:pb-16">
        <div className="flex-1 space-y-6 text-center lg:text-left">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl text-gray-800 font-semibold tracking-tight capitalize leading-[1.18]">
            {homeHero?.title}
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
            {homeHero?.description}
          </p>

          {/* --------------------- Buttons & Modals --------------------- */}
          {isUser ? (
            <div className="flex flex-wrap gap-3.5 items-center justify-center lg:justify-start pt-2">
              {isEmployer && (
                <Link
                  href="/workers"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-brandClr2 hover:bg-[#f5be18] text-gray-950 font-bold text-sm sm:text-base shadow-sm hover:shadow-md transition-all active:scale-[0.99]"
                >
                  I&apos;m Hiring
                </Link>
              )}

              {isWorker && (
                <Link
                  href="/jobs"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-brandClr2 hover:bg-[#f5be18] text-gray-950 font-bold text-sm sm:text-base shadow-sm hover:shadow-md transition-all active:scale-[0.99]"
                >
                  I Need A Job
                </Link>
              )}

              {isEmployer && (
                <Link
                  href="/workers?type=instantLabour"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl border-2 border-brandClr1 hover:bg-blue-50 text-brandClr1 font-bold text-sm sm:text-base shadow-sm hover:shadow-md transition-all active:scale-[0.99]"
                >
                  Instant Labour
                </Link>
              )}
            </div>
          ) : (
            <div className="flex flex-wrap gap-3.5 items-center justify-center lg:justify-start pt-2">
              <div className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brandClr2 hover:bg-[#f5be18] text-gray-950 font-bold text-sm sm:text-base shadow-sm hover:shadow-md transition-all active:scale-[0.99]">
                <Link href="/workers" className="text-gray-950 font-bold">
                  Instant Labour
                </Link>
                {!isUser && (
                  <CustomModal
                    title="Instant Labour - Find Workers Near You Fast."
                    trigger={
                      <button
                        type="button"
                        className="text-gray-950/80 hover:text-gray-950 transition-colors p-0.5 cursor-pointer"
                        title="Learn more about Instant Labour"
                      >
                        <BsExclamationCircle className="size-4" />
                      </button>
                    }
                  >
                    <InstantLabourComponent />
                  </CustomModal>
                )}
              </div>

              <div className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brandClr2 hover:bg-[#f5be18] text-gray-950 font-bold text-sm sm:text-base shadow-sm hover:shadow-md transition-all active:scale-[0.99]">
                <Link href="/jobs" className="text-gray-950 font-bold">
                  I Need A Job
                </Link>
                {!isUser && (
                  <CustomModal
                    title="For Workers"
                    trigger={
                      <button
                        type="button"
                        className="text-gray-950/80 hover:text-gray-950 transition-colors p-0.5 cursor-pointer"
                        title="Learn more for workers"
                      >
                        <BsExclamationCircle className="size-4" />
                      </button>
                    }
                  >
                    <ForWorkersComponent />
                  </CustomModal>
                )}
              </div>

              <div className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brandClr2 hover:bg-[#f5be18] text-gray-950 font-bold text-sm sm:text-base shadow-sm hover:shadow-md transition-all active:scale-[0.99]">
                <Link href="/workers" className="text-gray-950 font-bold">
                  I&apos;m Hiring
                </Link>
                {!isUser && (
                  <CustomModal
                    title="For Employers"
                    trigger={
                      <button
                        type="button"
                        className="text-gray-950/80 hover:text-gray-950 transition-colors p-0.5 cursor-pointer"
                        title="Learn more for employers"
                      >
                        <BsExclamationCircle className="size-4" />
                      </button>
                    }
                  >
                    <ForEmployersComponent />
                  </CustomModal>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Hero Image Container */}
        <div className="flex justify-center items-center relative shrink-0">
          <div className="relative size-64 sm:size-80 lg:size-96 rounded-full overflow-hidden ring-8 ring-amber-100/80 shadow-2xl bg-gradient-to-tr from-amber-50 to-blue-50 flex items-center justify-center">
            {homeHero?.images?.[0] ? (
              <Image
                src={formatUrl(homeHero.images[0])}
                alt={homeHero?.title || "Hero Image"}
                fill
                priority
                sizes="(max-width: 640px) 256px, (max-width: 1024px) 320px, 384px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center p-8">
                <Image
                  src={brandLogo}
                  alt="Instant Labour"
                  width={220}
                  height={80}
                  className="max-h-16 w-auto object-contain"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* -------------- Guaranteed Response Banner -------------- */}
      {!isEmployer && (
        <div className="maxWidth">
          <div className="relative overflow-hidden bg-gradient-to-r from-brandClr2 via-[#ffd24d] to-brandClr2 rounded-2xl md:rounded-3xl p-6 sm:p-10 md:p-12 shadow-md border border-amber-300/80 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 backdrop-blur-xs text-xs font-bold text-gray-900 border border-white/80 shadow-2xs">
                  <LuShieldCheck className="size-4 text-emerald-600" />
                  <span>Verified Guarantee</span>
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-gray-950 font-bold tracking-tight capitalize leading-tight">
                All Applicants guaranteed a response within <br className="hidden sm:inline" />
                7-14 days
              </h3>
            </div>
            <div className="hidden lg:flex size-20 rounded-2xl bg-white/80 backdrop-blur-xs border border-white/90 items-center justify-center text-gray-900 shadow-sm shrink-0">
              <LuShieldCheck className="size-10 text-brandClr1" />
            </div>
          </div>
        </div>
      )}

      {/* --------------------- How It Works --------------------- */}
      {isUser && (
        <div className="maxWidth py-10 md:py-16 space-y-8">
          <div className="space-y-3 sm:space-y-4">
            <span className="inline-block text-xs font-bold tracking-wider uppercase px-3.5 py-1.5 rounded-full bg-blue-50 text-brandClr1 border border-blue-100/80 shadow-2xs">
              Simple Process
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl text-gray-800 font-bold tracking-tight capitalize">
              How it works
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {howItWorks?.content?.steps?.map((item: any, index: number) => (
              <div
                key={index}
                className="group bg-white rounded-2xl border border-gray-200/80 hover:border-brandClr1/40 hover:shadow-lg p-6 transition-all duration-300 flex flex-col justify-between space-y-4 relative"
              >
                <div className="space-y-4">
                  <div className="size-12 rounded-2xl bg-brandClr1 text-white font-extrabold text-lg flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
                    {index + 1}
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-bold text-lg lg:text-xl text-gray-900 capitalize group-hover:text-brandClr1 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed capitalize">
                      {item.subTitle}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* -------------- Industries We Support -------------- */}
      <div className="maxWidth py-10 md:py-16 space-y-8 sm:space-y-10 text-center">
        <div className="space-y-3 sm:space-y-4 max-w-2xl mx-auto">
          <div>
            <span className="inline-block text-xs font-bold tracking-wider uppercase px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200/80 shadow-2xs">
              Sectors & Trades
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl text-gray-800 font-bold tracking-tight capitalize">
            Industries We Support
          </h2>
          <p className="text-sm sm:text-base text-gray-500">
            Connecting certified talent across multiple essential industries nationwide
          </p>
        </div>
        <IndustriesSlider />
      </div>

      {/* -------------- Special Offers Banner -------------- */}
      {!isWorker && resCoupon?.data && (
        <div className="maxWidth py-6 md:py-10">
          <OfferSection button={true} data={resCoupon?.data} />
        </div>
      )}

      {/* -------------- Why Instant Labour? -------------- */}
      <div className="maxWidth py-10 md:py-16 flex flex-col items-center space-y-8 sm:space-y-10">
        <div className="text-center space-y-3 sm:space-y-4 max-w-xl mx-auto">
          <div>
            <span className="inline-block text-xs font-bold tracking-wider uppercase px-3.5 py-1.5 rounded-full bg-blue-50 text-brandClr1 border border-blue-100/80 shadow-2xs">
              Platform Benefits
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl text-gray-800 font-bold tracking-tight capitalize">
            Why Instant Labour?
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full max-w-4xl mx-auto">
          {whyInstantLabour?.content?.texts?.map((item: any, index: number) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-brandClr1/30 transition-all duration-200 flex items-center gap-4"
            >
              <div className="size-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 text-emerald-600 mt-0.5">
                <IoCheckmarkCircle className="size-6" />
              </div>
              <p className="text-base sm:text-lg font-semibold text-gray-800 leading-snug">
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* -------------- What Our Clients Say -------------- */}
      <div className="maxWidth py-12 md:py-20 space-y-10 sm:space-y-12">
        <div className="text-center space-y-3 sm:space-y-4 max-w-xl mx-auto">
          <div>
            <span className="inline-block text-xs font-bold tracking-wider uppercase px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200/80 shadow-2xs">
              Testimonials
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl text-gray-800 font-bold tracking-tight capitalize">
            What Our Clients Say
          </h2>
          <p className="text-sm sm:text-base text-gray-500">
            Real feedback from employers and businesses hiring with Instant Labour
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {resClientReview?.data?.map((item: any, index: number) => (
            <ClientSayCard key={item?._id || index} item={item} />
          ))}
        </div>
      </div>

      {/* -------------- Frequently Asked Questions -------------- */}
      <div className="maxWidth py-12 md:py-20 space-y-10 sm:space-y-12">
        <div className="text-center space-y-3 sm:space-y-4 max-w-xl mx-auto">
          <div>
            <span className="inline-block text-xs font-bold tracking-wider uppercase px-3.5 py-1.5 rounded-full bg-blue-50 text-brandClr1 border border-blue-100/80 shadow-2xs">
              Need Help?
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl text-gray-800 font-bold tracking-tight capitalize">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-gray-500">
            Find answers to common questions about hiring and working on Instant Labour
          </p>
        </div>
        <FAQ />
      </div>
    </div>
  );
}