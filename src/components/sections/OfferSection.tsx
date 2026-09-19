"use client";

import React from "react";
import Link from "next/link";
import { LuSparkles, LuArrowRight, LuTag } from "react-icons/lu";

interface OfferSectionProps {
  button?: boolean;
  data?: any;
}

const OfferSection: React.FC<OfferSectionProps> = ({ button, data }) => {
  const percentOff = data?.percent_off ?? 0;
  const description = data?.description || "Special Discount on Packages";

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-brandClr2 via-[#ffd447] to-[#f5b800] rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 text-gray-950 shadow-xl border-2 border-amber-300/90">
      {/* Ambient decorative soft glows */}
      <div className="absolute -right-12 -bottom-12 size-72 rounded-full bg-white/30 blur-3xl pointer-events-none" />
      <div className="absolute -left-12 -top-12 size-72 rounded-full bg-brandClr1/10 blur-3xl pointer-events-none" />

      {/* Large decorative watermark in background */}
      <span className="absolute right-4 sm:right-8 -bottom-4 text-7xl sm:text-9xl lg:text-[140px] font-black text-gray-950/[0.06] select-none pointer-events-none leading-none font-mono">
        {percentOff}%
      </span>

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          {/* Top Offer Badge in Brand Royal Blue */}
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brandClr1 text-white font-extrabold text-xs tracking-wider uppercase shadow-md shadow-brandClr1/25">
              <LuSparkles className="size-3.5 text-amber-300 animate-pulse" />
              <span>{percentOff}% Special Offer</span>
            </span>
          </div>

          {/* Headline Description */}
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-950 capitalize leading-snug">
            {description}
          </h3>

          <p className="text-xs sm:text-sm text-gray-800 font-medium leading-relaxed">
            Take advantage of exclusive discounts on our employer packages. Hire qualified labour faster with premium perks.
          </p>
        </div>

        {/* Action CTA Button in Brand Royal Blue */}
        {button && (
          <div className="shrink-0 pt-2 lg:pt-0">
            <Link
              href="/subscription"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-brandClr1 hover:bg-[#0047b8] text-white font-extrabold text-sm sm:text-base shadow-xl shadow-blue-900/20 hover:scale-[1.02] active:scale-[0.99] transition-all"
            >
              <LuTag className="size-4 text-amber-300" />
              <span>Claim Offer</span>
              <LuArrowRight className="size-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfferSection;