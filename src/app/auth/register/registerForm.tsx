"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { register } from "@/lib/api/auth";

export default function RegisterForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    if (!name || !email || !password || !passwordConfirmation) {
      alert("All fields are required");
      setLoading(false);
      return;
    }

    if (password !== passwordConfirmation) {
      alert("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await register({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      alert("Registration successful!");
      router.push("/");
    } catch (error: unknown) {
      if (error instanceof Error) alert(error.message);
      else alert("Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 w-full max-w-sm"
    >
      <div className="flex flex-col gap-2">
        <label className="text-white text-sm">Name</label>
        <Input
          type="text"
          placeholder="Enter your name"
          className="bg-zinc-800 text-white border-zinc-700"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-white text-sm">Email</label>
        <Input
          type="email"
          placeholder="Enter your email"
          className="bg-zinc-800 text-white border-zinc-700"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
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
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-white text-sm">Confirm Password</label>
        <Input
          type="password"
          placeholder="Confirm your password"
          className="bg-zinc-800 text-white border-zinc-700"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          required
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="bg-green-600 hover:bg-green-700 text-white"
      >
        {loading ? "Registering..." : "Register"}
      </Button>
    </form>
  );
}
