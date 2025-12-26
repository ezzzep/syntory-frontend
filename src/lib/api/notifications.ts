import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const BASE_URL = `${API_URL}/api/notifications`;

async function ensureCsrf() {
  await fetch(`${API_URL}/sanctum/csrf-cookie`, {
    credentials: "include",
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

export async function getNotifications() {
  const res = await fetch(BASE_URL, {
    cache: "no-store",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await handleResponse<{ data: any[] }>(res);
  return result.data ?? [];
}

export async function markNotificationAsRead(id: number) {
  await ensureCsrf();

  const token = Cookies.get("XSRF-TOKEN");

  const res = await fetch(`${BASE_URL}/${id}/read`, {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "X-XSRF-TOKEN": decodeURIComponent(token ?? ""),
    },
  });

  return handleResponse(res);
}

export async function deleteNotification(id: number) {
  await ensureCsrf();

  const token = Cookies.get("XSRF-TOKEN");

  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "X-XSRF-TOKEN": decodeURIComponent(token ?? ""),
    },
  });

  return handleResponse(res);
}
