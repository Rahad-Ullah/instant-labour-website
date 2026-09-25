"use server";

import { cookies } from "next/headers";

export const getUserIdServer = async (): Promise<string | null> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    if (!token || typeof token !== "string") return null;
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = Buffer.from(base64, "base64").toString("utf-8");
    const parsed = JSON.parse(jsonPayload);
    return (
      parsed?._id ||
      parsed?.id ||
      parsed?.authId ||
      parsed?.userId ||
      parsed?.sub ||
      null
    );
  } catch {
    return null;
  }
};
