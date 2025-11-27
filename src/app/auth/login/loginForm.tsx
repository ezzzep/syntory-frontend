"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { login } from "@/lib/api/auth";
import { notifyAuthChanged } from "@/lib/authEvents";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
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
      notifyAuthChanged();
      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) alert(err.message);
      else alert("Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="
        flex flex-col gap-8 w-full max-w-md 
        shadow-xl 
        px-10 py-12
        
      "
    >
      <h2 className="text-3xl font-bold text-center text-white">Login</h2>

      {error && (
        <div className="bg-red-200 text-red-800 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-3">
        <label className="text-base font-medium text-white">Email</label>
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-base font-medium text-white">Password</label>
        <Input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="bg-blue-950 cursor-pointer "
      >
        {loading ? "Logging in..." : "Login"}
      </Button>
      <p className="text-center text-sm text-gray-200 mt-4">
        Don’t have an account?{" "}
        <Link
          href="/auth/register"
          className="text-white font-medium underline"
        >
          Register
        </Link>
      </p>
    </form>
  );
}
