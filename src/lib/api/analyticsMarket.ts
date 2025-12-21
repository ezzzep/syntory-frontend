const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/analytics/market`;

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

export async function getMarketRecommendations() {
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
