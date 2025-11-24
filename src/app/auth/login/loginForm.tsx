"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { login } from "@/lib/api/auth";
import { notifyAuthChanged } from "@/lib/authEvents";

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
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Login failed");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 w-full max-w-sm"
    >
      {error && (
        <div className="bg-red-900/50 border border-red-600 text-red-200 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className="text-white text-sm">Email</label>
        <Input
          type="email"
          placeholder="Enter your email"
          className="bg-zinc-800 text-white border-zinc-700"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-white text-sm">Password</label>
        <Input
          type="password"
          placeholder="Enter your password"
          className="bg-zinc-800 text-white border-zinc-700"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 cursor-pointer"
      >
        {loading ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
}
