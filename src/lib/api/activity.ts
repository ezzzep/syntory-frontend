import Cookies from "js-cookie";
import type { ActivityData } from "@/types/analytics";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/activity`;

async function fetchCsrf() {
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sanctum/csrf-cookie`, {
    credentials: "include",
    headers: { Accept: "application/json" },
  });
}

async function handleResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  let data: unknown;

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { message: "Invalid JSON from server" };
  }

  if (!res.ok) {
    const payload = data as { message?: string };
    throw new Error(payload.message || `HTTP ${res.status}`);
  }

  return data as T;
}

export async function getActivityLogs(): Promise<ActivityData[]> {
  const res = await fetch(BASE_URL, {
    cache: "no-store",
    credentials: "include",
    headers: { Accept: "application/json" },
  });

  const result = await handleResponse<{ data: ActivityData[] }>(res);
  return Array.isArray(result.data) ? result.data : [];
}

export async function createActivityLog(entry: {
  action: string;
  item_name: string;
  item_id: number;
  item_category?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  changes?: Record<string, any> | any[];
}) {
  await fetchCsrf();
  const xsrfToken = Cookies.get("XSRF-TOKEN") ?? "";

  const res = await fetch(BASE_URL, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-XSRF-TOKEN": decodeURIComponent(xsrfToken),
    },
    body: JSON.stringify(entry),
  });

  return handleResponse(res);
}
