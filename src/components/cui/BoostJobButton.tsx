"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { myFetch } from '@/utils/myFetch';
import { toast } from 'sonner';
import { HiSparkles } from 'react-icons/hi';
import { LuFlame, LuTrendingUp, LuCheck } from 'react-icons/lu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface BoostJobButtonProps {
  jobId: string;
  className?: string;
  isBoosted?: boolean;
  jobTitle?: string;
  onBoostSuccess?: () => void;
}

const BoostJobButton: React.FC<BoostJobButtonProps> = ({
  jobId,
  className,
  isBoosted = false,
  jobTitle,
  onBoostSuccess,
}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [boosted, setBoosted] = useState(isBoosted);

  useEffect(() => {
    setBoosted(isBoosted);
  }, [isBoosted]);

  const handleConfirmBoost = async () => {
    setLoading(true);
    toast.loading("Boosting job post...", { id: "boost-loading" });

    try {
      const res = await myFetch(`/job/boost/${jobId}`, {
        method: "POST",
      });

      if (res.success) {
        setBoosted(true);
        setOpen(false);
        toast.success(res.message || "Job boosted successfully! Your post now has priority ranking.", { id: "boost-loading" });
        router.refresh();
        onBoostSuccess?.();
      } else {
        toast.error(res.message || "Failed to boost job.", { id: "boost-loading" });
      }
    } catch {
      toast.error("An error occurred while boosting the job.", { id: "boost-loading" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          if (boosted) return;
          setOpen(true);
        }}
        disabled={loading || boosted}
        className={className || `inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer shadow-sm ${
          boosted
            ? "bg-amber-100 text-amber-900 border border-amber-300 cursor-default"
            : "bg-brandClr1 hover:bg-blue-700 text-white hover:shadow-md active:scale-[0.99]"
        } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <HiSparkles className={`size-4 ${boosted ? "text-amber-600" : "text-brandClr2"}`} />
        <span>{boosted ? "Featured & Boosted" : "Boost Job"}</span>
      </button>

      {/* Confirmation Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md p-6 rounded-3xl overflow-hidden border border-gray-100 shadow-2xl">
          <div className="flex flex-col items-center text-center space-y-4 pt-2">
            {/* Sparkling Icon */}
            <div className="relative">
              <div className="size-16 rounded-2xl bg-gradient-to-tr from-amber-400 via-amber-300 to-yellow-200 flex items-center justify-center shadow-lg shadow-amber-300/30 text-gray-950">
                <HiSparkles className="size-9" />
              </div>
              <div className="absolute -top-1 -right-1 size-6 rounded-full bg-brandClr1 text-white flex items-center justify-center shadow">
                <LuTrendingUp className="size-3.5" />
              </div>
            </div>

            <DialogHeader className="space-y-1.5 text-center sm:text-center">
              <DialogTitle className="text-xl sm:text-2xl font-extrabold text-gray-900">
                Boost This Job Posting?
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto">
                Are you sure you want to promote this job post?
              </DialogDescription>
            </DialogHeader>

            {/* Benefits box */}
            <div className="w-full bg-slate-50/80 border border-slate-100 rounded-2xl p-4 text-left space-y-2.5 text-xs sm:text-sm">
              <p className="font-bold flex items-center gap-1.5 text-xs uppercase tracking-wider text-brandClr1">
                <LuFlame className="size-4 text-amber-500" />
                What happens when you boost:
              </p>
              <div className="space-y-2 text-gray-600">
                <div className="flex items-start gap-2.5">
                  <div className="size-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <LuCheck className="size-2.5 stroke-[3]" />
                  </div>
                  <span><strong className="text-gray-900">Priority Placement:</strong> Pinned higher in worker search & category listings.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="size-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <LuCheck className="size-2.5 stroke-[3]" />
                  </div>
                  <span><strong className="text-gray-900">Faster Hiring:</strong> Attract more qualified applicants in less time.</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row gap-2.5 w-full pt-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={loading}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-700 font-semibold text-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmBoost}
                disabled={loading}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brandClr2 hover:bg-[#f5be18] text-gray-950 font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer disabled:opacity-50 active:scale-[0.99]"
              >
                {loading ? (
                  <>
                    <span className="size-4 border-2 border-gray-950/30 border-t-gray-950 rounded-full animate-spin" />
                    <span>Boosting...</span>
                  </>
                ) : (
                  <>
                    <HiSparkles className="size-4" />
                    <span>Confirm & Boost</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BoostJobButton;
