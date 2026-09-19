"use client";

import { getCookie } from "cookies-next";

export const getUserIdClient = (): string | null => {
  try {
    const token = getCookie("accessToken");
    if (!token || typeof token !== "string") return null;
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const parsed = JSON.parse(jsonPayload);
    return parsed?._id || parsed?.id || parsed?.userId || parsed?.sub || null;
  } catch {
    return null;
  }
};
