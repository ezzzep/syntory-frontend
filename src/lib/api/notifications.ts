const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/notifications`;

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

/* ================================
   FETCH NOTIFICATIONS
================================ */
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

/* ================================
   MARK AS READ
================================ */
export async function markNotificationAsRead(id: number) {
  const res = await fetch(`${BASE_URL}/${id}/read`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  return handleResponse(res);
}

/* ================================
   DELETE NOTIFICATION
================================ */
export async function deleteNotification(id: number) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  return handleResponse(res);
}
