import Cookies from "js-cookie";
import type {
  Supplier,
  CreateSupplier,
  UpdateSupplier,
} from "@/types/supplier";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/suppliers`;

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

export async function getSuppliers(): Promise<Supplier[]> {
  const res = await fetch(BASE_URL, {
    cache: "no-store",
    credentials: "include",
    headers: { Accept: "application/json" },
  });

  return handleResponse<Supplier[]>(res);
}

export async function getSupplierById(id: number): Promise<Supplier> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    cache: "no-store",
    credentials: "include",
    headers: { Accept: "application/json" },
  });

  return handleResponse<Supplier>(res);
}

export async function createSupplier(data: CreateSupplier): Promise<Supplier> {
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
    body: JSON.stringify(data),
  });

  return handleResponse<Supplier>(res);
}

export async function updateSupplier(id: number, data: Partial<Supplier>) {
  await fetchCsrf();
  const xsrfToken = Cookies.get("XSRF-TOKEN") ?? "";

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/suppliers/${id}`,
    {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-XSRF-TOKEN": decodeURIComponent(xsrfToken),
      },
      body: JSON.stringify(data),
    }
  );

  return handleResponse<Supplier>(res);
}

export async function deleteSupplier(id: number): Promise<{ message: string }> {
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

export async function uploadSupplierImage(id: number, formData: FormData) {
  await fetchCsrf();
  const xsrfToken = Cookies.get("XSRF-TOKEN") ?? "";

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/suppliers/${id}/image`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "X-XSRF-TOKEN": decodeURIComponent(xsrfToken),
      },
      body: formData,
    }
  );

  return handleResponse<{ image_url: string }>(res);
}

