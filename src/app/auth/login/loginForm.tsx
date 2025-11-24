"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { login } from "@/lib/api/auth";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

  if (!email || !password) return;

  try {
    await login({ email, password });
    router.push("/dashboard"); 
  } catch (err: unknown) {
    if (err instanceof Error) {
      alert(err.message);
    } else {
      alert("Login failed");
    }
  }
}


  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 w-full max-w-sm"
    >
      <div className="flex flex-col gap-2">
        <label className="text-white text-sm">Email</label>
        <Input
          type="email"
          placeholder="Enter your email"
          className="bg-zinc-800 text-white border-zinc-700"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
        />
      </div>

      <Button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        Login
      </Button>
    </form>
  );
}
