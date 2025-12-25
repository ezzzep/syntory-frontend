import Cookies from "js-cookie";
import type { Notification } from "@/types/notification";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const BASE_URL = `${API_URL}/api/notifications`;


async function fetchCsrf() {
  await fetch(`${API_URL}/sanctum/csrf-cookie`, {
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


export async function getNotifications(): Promise<Notification[]> {
  const res = await fetch(BASE_URL, {
    cache: "no-store",
    credentials: "include",
    headers: { Accept: "application/json" },
  });


  const result = await handleResponse<{ data: Notification[] }>(res);
  return result.data ?? [];
}

export async function markNotificationAsRead(
  id: number
): Promise<Notification> {
  await fetchCsrf();
  const xsrfToken = Cookies.get("XSRF-TOKEN") ?? "";

  const res = await fetch(`${BASE_URL}/${id}/read`, {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "X-XSRF-TOKEN": decodeURIComponent(xsrfToken),
    },
  });


  const result = await handleResponse<{ notification: Notification }>(res);
  return result.notification;
}


export async function deleteNotification(
  id: number
): Promise<{ message: string }> {
  await fetchCsrf();
  const xsrfToken = Cookies.get("XSRF-TOKEN") ?? "";

  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "X-XSRF-TOKEN": decodeURIComponent(xsrfToken),
    },
  });

  return handleResponse<{ message: string }>(res);
}
