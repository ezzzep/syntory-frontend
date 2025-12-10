import Cookies from "js-cookie";
import { notifyAuthChanged } from "@/lib/authEvents";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type RegisterData = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

type LoginData = {
  email: string;
  password: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
};

async function fetchCsrfToken() {
  const res = await fetch(`${API_URL}/sanctum/csrf-cookie`, {
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  if (!res.ok) throw new Error("Failed to get CSRF cookie");
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
    const payload = data as {
      message?: string;
      errors?: Record<string, string[]>;
    };
    const msg =
      payload.message ||
      (payload.errors ? Object.values(payload.errors)[0]?.[0] : res.statusText);
    throw new Error(msg || `HTTP ${res.status}`);
  }

  return data as T;
}

export async function register(data: RegisterData) {
  await fetchCsrfToken();

  const xsrfToken = Cookies.get("XSRF-TOKEN") ?? "";

  const res = await fetch(`${API_URL}/api/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-XSRF-TOKEN": decodeURIComponent(xsrfToken),
    },
    body: JSON.stringify(data),
  });

  return handleResponse<User>(res);
}

export async function login(data: LoginData) {
  await fetchCsrfToken();

  const xsrfToken = Cookies.get("XSRF-TOKEN") ?? "";

  const res = await fetch(`${API_URL}/api/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-XSRF-TOKEN": decodeURIComponent(xsrfToken),
    },
    body: JSON.stringify(data),
  });

  return handleResponse<User>(res);
}

export async function getUser(): Promise<User> {
  const res = await fetch(`${API_URL}/api/user`, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  if (!res.ok) throw new Error("Unauthenticated");

  return handleResponse<User>(res);
}

export async function logout() {
  try {
    await fetchCsrfToken();

    const xsrfToken = Cookies.get("XSRF-TOKEN") ?? "";
    await fetch(`${API_URL}/api/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-XSRF-TOKEN": decodeURIComponent(xsrfToken),
      },
    });
  } catch (err) {
    console.warn("Logout request failed (probably offline or 204)", err);
  } finally {
    Cookies.remove("XSRF-TOKEN");
    notifyAuthChanged();
  }
}
