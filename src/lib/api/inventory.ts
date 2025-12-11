import Cookies from "js-cookie";
import type {
  InventoryItem,
  CreateInventoryDto,
  UpdateInventoryDto,
} from "@/types/inventory";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/inventory`;

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

export async function getInventory(): Promise<InventoryItem[]> {
  const res = await fetch(BASE_URL, {
    cache: "no-store",
    credentials: "include", 
    headers: { Accept: "application/json" },
  });
  return handleResponse<InventoryItem[]>(res);
}

export async function createInventoryItem(
  data: CreateInventoryDto
): Promise<InventoryItem> {
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

  return handleResponse<InventoryItem>(res);
}

export async function updateInventoryItem(
  id: number,
  data: UpdateInventoryDto
): Promise<InventoryItem> {
  await fetchCsrf();
  const xsrfToken = Cookies.get("XSRF-TOKEN") ?? "";

  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-XSRF-TOKEN": decodeURIComponent(xsrfToken),
    },
    body: JSON.stringify(data),
  });

  return handleResponse<InventoryItem>(res);
}

export async function deleteInventoryItem(
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

export async function uploadItemImage(id: number, formData: FormData) {
  await fetchCsrf();
  const xsrfToken = Cookies.get("XSRF-TOKEN") ?? "";

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/inventory/${id}/image`,
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

export async function getItemById(id: number): Promise<InventoryItem> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    cache: "no-store",
    credentials: "include",
    headers: { Accept: "application/json" },
  });

  return handleResponse<InventoryItem>(res);
}

export async function getItemsBySupplier(
  supplierName: string
): Promise<InventoryItem[]> {
  try {
    const allItems = await getInventory();
    const filteredItems = allItems.filter((item) => {
      console.log(`Item ${item.name} has supplier_name: ${item.supplier_name}`);
      return item.supplier_name === supplierName;
    });

    console.log("Filtered items:", filteredItems);
    return filteredItems;
  } catch (error) {
    console.error("Failed to get items by supplier:", error);
    throw error;
  }
}
