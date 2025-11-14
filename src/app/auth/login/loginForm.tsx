"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (email && password) {
      router.push("/");
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
