// lib/auth.ts

import { notifyAuthChanged } from "@/lib/authEvents";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  (typeof window !== "undefined"
    ? window.location.origin
    : "http://localhost:8000");

// --- Helper function to read and DECODE a cookie ---
function getCookie(name: string): string | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    // Get the raw, encoded cookie value
    const encodedValue = parts.pop()?.split(";").shift();
    // DECODE IT before returning
    return encodedValue ? decodeURIComponent(encodedValue) : undefined;
  }
  return undefined;
}

// --- Types (no changes) ---
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

// --- Core Functions (no changes) ---
async function fetchCsrfCookie() {
  const res = await fetch(`${API_URL}/sanctum/csrf-cookie`, {
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch CSRF cookie");
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};

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

// --- API Actions (Updated to use the corrected getCookie function) ---

export async function register(data: RegisterData) {
  await fetchCsrfCookie();
  const xsrfToken = getCookie("XSRF-TOKEN") ?? "";

  const res = await fetch(`${API_URL}/api/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-XSRF-TOKEN": xsrfToken, // No need to decode here, getCookie already did it
    },
    body: JSON.stringify(data),
  });

  return handleResponse<User>(res);
}

export async function login(data: LoginData) {
  await fetchCsrfCookie();
  const xsrfToken = getCookie("XSRF-TOKEN") ?? "";

  const res = await fetch(`${API_URL}/api/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-XSRF-TOKEN": xsrfToken, // No need to decode here, getCookie already did it
    },
    body: JSON.stringify(data),
  });

  return handleResponse<User>(res);
}

export async function getUser(): Promise<User> {
  const res = await fetch(`${API_URL}/api/user`, {
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Unauthenticated");
  }

  return handleResponse<User>(res);
}

export async function logout() {
  try {
    await fetchCsrfCookie();
    const xsrfToken = getCookie("XSRF-TOKEN") ?? "";

    await fetch(`${API_URL}/api/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "X-XSRF-TOKEN": xsrfToken, // No need to decode here, getCookie already did it
      },
    });
  } finally {
    notifyAuthChanged();
  }
}
