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
    const encodedValue = parts.pop()?.split(";").shift();
    return encodedValue ? decodeURIComponent(encodedValue) : undefined;
  }
  return undefined;
}

// --- Types ---
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

// --- Core Functions ---
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

// --- API Actions ---

export async function register(data: RegisterData) {
  try {
    console.log("--- REGISTER FUNCTION START ---");
    console.log("Register function called with data:", data);

    // CRITICAL DEBUGGING: Check the API_URL
    console.log("API_URL is:", API_URL);
    console.log("Full register URL will be:", `${API_URL}/api/register`);

    await fetchCsrfCookie();
    console.log("✅ CSRF cookie fetched successfully.");

    const xsrfToken = getCookie("XSRF-TOKEN");

    // CRITICAL DEBUGGING: Check the cookie
    console.log("All cookies in browser:", document.cookie);
    console.log("Extracted XSRF-TOKEN:", xsrfToken);

    if (!xsrfToken) {
      console.error("❌ XSRF-TOKEN cookie was not found! Aborting.");
      throw new Error("XSRF-TOKEN cookie was not found after fetching.");
    }

    console.log("🚀 About to send POST request...");

    const res = await fetch(`${API_URL}/api/register`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-XSRF-TOKEN": xsrfToken,
      },
      body: JSON.stringify(data),
    });

    console.log(
      "✅ POST request sent. Response status:",
      res.status,
      res.statusText
    );
    console.log("--- REGISTER FUNCTION END ---");

    return handleResponse<User>(res);
  } catch (error) {
    console.error("--- REGISTER FUNCTION ERROR ---");
    console.error("An error occurred during registration:", error);
    console.error("--- END ERROR ---");
    // Re-throw the error so your UI can handle it
    throw error;
  }
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
      "X-XSRF-TOKEN": xsrfToken,
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

  if (!res.ok) throw new Error("Unauthenticated");

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
        "X-XSRF-TOKEN": xsrfToken,
      },
    });
  } finally {
    notifyAuthChanged();
  }
}
