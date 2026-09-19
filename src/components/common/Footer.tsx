import React from 'react';
import Link from 'next/link';
import { contactInfo, followUs, quickLinks } from '@/constants/footerDatas';
import FooterTitle from '../cui/FooterTitle';
import { LuChevronRight } from 'react-icons/lu';

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-b from-[#0047b8] via-[#003ea6] to-[#00348f] text-blue-50/90 border-t border-blue-300/20">
      <div className="maxWidth flex flex-col lg:flex-row justify-between gap-12 py-14 lg:py-16">
        {/* Left Column: Brand & Mission */}
        <div className="lg:max-w-md space-y-5">
          <div className="flex items-center text-3xl sm:text-4xl font-black tracking-tight">
            <span className="text-white">Instant</span>
            <span className="text-brandClr2">Labour</span>
          </div>
          <p className="text-sm sm:text-base text-blue-50/85 leading-relaxed font-normal">
            At Instant Labour, we&apos;re a platform that connects businesses with skilled freelancers. Our marketplace makes it easy to find the right talent, hire with confidence, and collaborate seamlessly. Whether you&apos;re a business seeking experts or a freelancer showcasing your skills, we help you get great work done together.
          </p>
        </div>

        {/* Right Columns: Quick Links & Contact Info */}
        <div className="flex flex-col sm:flex-row gap-10 sm:gap-16 lg:gap-20">
          {/* Quick Links */}
          <div className="min-w-36">
            <FooterTitle title="Quick Links" />
            <ul className="space-y-2.5">
              {quickLinks?.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item?.url}
                    className="text-sm sm:text-base text-blue-50 hover:text-brandClr2 hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-1.5 group font-medium"
                  >
                    <LuChevronRight className="size-3.5 text-blue-200 group-hover:text-brandClr2 transition-colors" />
                    <span>{item?.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="min-w-44">
            <FooterTitle title="Contact Info" />
            <ul className="space-y-3">
              {contactInfo?.map((item, index) => (
                <li key={index}>
                  <a
                    href={item?.title?.includes("@") ? `mailto:${item.title}` : "#"}
                    className="inline-flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 hover:border-brandClr2/60 text-white transition-all text-sm group shadow-xs"
                  >
                    <span className="size-8 rounded-lg bg-brandClr2/20 text-brandClr2 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      {item?.icon}
                    </span>
                    <span className="truncate font-medium">{item?.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Sub-footer border divider */}
      <div className="border-t border-white/15" />

      {/* Sub-footer Bottom Bar */}
      <div className="maxWidth flex flex-col-reverse md:flex-row justify-between items-center gap-4 py-6 sm:py-8">
        <p className="text-xs sm:text-sm text-blue-100/80 text-center md:text-left">
          © {new Date().getFullYear()} Instantlabour. All rights reserved.
        </p>

        {/* Social Media Links */}
        <div className="flex items-center gap-3">
          {followUs?.map((item, index) => (
            <a
              key={index}
              target="_blank"
              rel="noopener noreferrer"
              href={item?.url}
              aria-label="Social Link"
              className="size-10 rounded-xl bg-white/10 hover:bg-brandClr2 border border-white/20 hover:border-brandClr2 text-white hover:text-gray-950 flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-sm text-lg"
            >
              {item?.icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;