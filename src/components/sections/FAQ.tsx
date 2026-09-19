"use client";

import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { myFetch } from "@/utils/myFetch";

const FAQSkeleton = () => (
  <div className="space-y-3.5">
    {[1, 2, 3, 4].map((n) => (
      <div
        key={n}
        className="bg-white rounded-2xl border border-gray-200/70 p-5 shadow-xs animate-pulse space-y-2"
      >
        <div className="h-5 bg-gray-100 rounded-md w-3/4" />
      </div>
    ))}
  </div>
);

const FAQ = () => {
  const [faqDatas, setCategoryDatas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await myFetch("/public/faq/all", {
          method: "GET",
        });
        setCategoryDatas(res?.data || []);
      } catch (err) {
        console.error("Error fetching FAQs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="max-w-3xl w-full mx-auto px-2">
      {loading ? (
        <FAQSkeleton />
      ) : faqDatas && faqDatas.length > 0 ? (
        <Accordion type="single" collapsible className="space-y-3.5">
          {faqDatas.map((faq: Record<string, any>, idx: number) => (
            <AccordionItem
              key={faq._id || idx}
              value={faq._id ? faq._id.toString() : String(idx)}
              className="group bg-white rounded-2xl border border-gray-200/85 hover:border-brandClr1/30 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden px-5 sm:px-6 data-[state=open]:border-brandClr1/40 data-[state=open]:shadow-md data-[state=open]:bg-blue-50/20"
            >
              <AccordionTrigger className="text-left font-bold text-gray-900 text-base sm:text-lg hover:text-brandClr1 hover:no-underline py-4 sm:py-5 cursor-pointer">
                <span className="flex-1 pr-3 leading-snug">
                  {faq?.question}
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-sm sm:text-base text-gray-600 leading-relaxed pb-5 pt-1 border-t border-gray-100">
                {faq?.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-8 text-center space-y-2">
          <p className="text-base font-semibold text-gray-800">
            No FAQs available right now
          </p>
          <p className="text-xs sm:text-sm text-gray-500">
            Please check back soon or contact support if you need assistance.
          </p>
        </div>
      )}
    </div>
  );
};

export default FAQ;
