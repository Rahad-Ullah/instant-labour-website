"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { LuCheck, LuX, LuClock } from "react-icons/lu";
import { myFetch } from "@/utils/myFetch";
import { APPLICATION_STATUS } from "@/types/jobTypes";

interface ApplicationApproveDeclineButtonsProps {
  jobId: string;
  workerId?: string;
  applicationId: string;
}

const ApplicationApproveDeclineButtons: React.FC<
  ApplicationApproveDeclineButtonsProps
> = ({ jobId, applicationId }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [loadingAction, setLoadingAction] = useState<"approve" | "decline" | null>(
    null
  );

  const approveApplication = async () => {
    if (!applicationId) {
      toast.error("Application ID is missing.");
      return;
    }

    setLoadingAction("approve");
    toast.loading("Approving applicant...", { id: "app-decision" });

    try {
      const res = await myFetch(`/application/${applicationId}?jobId=${jobId}`, {
        method: "PATCH",
        body: { status: APPLICATION_STATUS.APPROVED },
      });

      if (res.success) {
        toast.success("Applicant approved successfully!", { id: "app-decision" });
        const params = new URLSearchParams(searchParams.toString());
        params.set("type", APPLICATION_STATUS.APPROVED);
        router.push(`${pathname}?${params.toString()}`);
        router.refresh();
      } else {
        toast.error(res.message || "Failed to approve application.", {
          id: "app-decision",
        });
      }
    } catch {
      toast.error("An error occurred while approving the application.", {
        id: "app-decision",
      });
    } finally {
      setLoadingAction(null);
    }
  };

  const declineApplication = async () => {
    if (!applicationId) {
      toast.error("Application ID is missing.");
      return;
    }

    setLoadingAction("decline");
    toast.loading("Declining application...", { id: "app-decision" });

    try {
      const res = await myFetch(`/application/${applicationId}?jobId=${jobId}`, {
        method: "PATCH",
        body: { status: APPLICATION_STATUS.DECLINED },
      });

      if (res.success) {
        toast.success("Application declined.", { id: "app-decision" });
        const params = new URLSearchParams(searchParams.toString());
        params.set("type", APPLICATION_STATUS.DECLINED);
        router.push(`${pathname}?${params.toString()}`);
        router.refresh();
      } else {
        toast.error(res.message || "Failed to decline application.", {
          id: "app-decision",
        });
      }
    } catch {
      toast.error("An error occurred while declining the application.", {
        id: "app-decision",
      });
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      {/* Status Info */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200">
          <LuClock className="size-3.5 text-amber-600" />
          <span>Application Pending Decision</span>
        </div>
        <p className="text-xs sm:text-sm text-gray-500">
          Review this applicant&apos;s credentials and decide whether to approve
          them for your job posting.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2.5 flex-wrap shrink-0">
        <button
          type="button"
          onClick={declineApplication}
          disabled={loadingAction !== null}
          className="inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-sm transition-all active:scale-[0.99] cursor-pointer disabled:opacity-50"
        >
          <LuX className="size-4" />
          <span>{loadingAction === "decline" ? "Declining..." : "Decline"}</span>
        </button>

        <button
          type="button"
          onClick={approveApplication}
          disabled={loadingAction !== null}
          className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 rounded-xl bg-brandClr2 hover:bg-[#f5be18] text-gray-950 font-bold text-sm shadow-sm transition-all active:scale-[0.99] cursor-pointer disabled:opacity-50"
        >
          <LuCheck className="size-4" />
          <span>
            {loadingAction === "approve" ? "Approving..." : "Approve & Hire"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default ApplicationApproveDeclineButtons;