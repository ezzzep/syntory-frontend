"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { login } from "@/lib/api/auth";
import { notifyAuthChanged } from "@/lib/authEvents";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("loginEmail") || "";
    }
    return "";
  });

  const [password, setPassword] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("loginPassword") || "";
    }
    return "";
  });

  const [error, setError] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("loginError") || "";
    }
    return "";
  });

  const [loading, setLoading] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("loginLoading") === "true";
    }
    return false;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("loginEmail", email);
      localStorage.setItem("loginPassword", password);
      localStorage.setItem("loginError", error);
      localStorage.setItem("loginLoading", loading.toString());
    }
  }, [email, password, error, loading]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      setLoading(true);

      if (!email || !password) {
        setError("Please fill in both email and password");
        setLoading(false);
        return;
      }

      try {
        await login({ email, password });
        if (typeof window !== "undefined") {
          localStorage.removeItem("loginEmail");
          localStorage.removeItem("loginPassword");
          localStorage.removeItem("loginError");
          localStorage.removeItem("loginLoading");
        }
        notifyAuthChanged();
        router.push("/dashboard");
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError("Login failed. Please try again.");
        setLoading(false);
      }
    },
    [email, password, router]
  );

  useEffect(() => {
    if (typeof window !== "undefined" && loading) {
      console.log("Login was interrupted. Please try again.");
    }
  }, [loading]);

  return (
    <form
      onSubmit={handleSubmit}
      className="
        flex flex-col gap-8 w-full max-w-md
        px-6 sm:px-10 sm:py-12
        mx-auto
      "
    >
      <div className="text-center">
        <h2 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent p-1">
          Login
        </h2>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm backdrop-blur-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-3">
        <label className="text-base sm:text-lg font-medium text-white">
          Email
        </label>
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
          variant="dark"
        />
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-base sm:text-lg font-medium text-white">
          Password
        </label>
        <Input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
          variant="dark"
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 text-white font-medium py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg cursor-pointer"
      >
        {loading ? "Logging in..." : "Login"}
      </Button>

      <p className="text-center text-sm sm:text-base text-gray-200 mt-4">
        Don&apos;t have an account?{" "}
        <Link
          href="/auth/register"
          className="font-medium bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent hover:from-blue-300 hover:via-purple-300 hover:to-pink-300 transition-all"
        >
          Register
        </Link>
      </p>
    </form>
  );
}
