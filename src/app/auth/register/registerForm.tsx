"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { register } from "@/lib/api/auth";
import { notifyAuthChanged } from "@/lib/authEvents";
import Link from "next/link";

export default function RegisterForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      setLoading(true);

      if (!name || !email || !password || !confirmPassword) {
        setError("All fields are required");
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
      }

      try {
        await register({
          name,
          email,
          password,
          password_confirmation: confirmPassword,
        });
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");

        notifyAuthChanged();
        router.push("/");
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError("Registration failed. Please try again.");
        setLoading(false);
      }
    },
    [name, email, password, confirmPassword, router]
  );

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
          Register
        </h2>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm backdrop-blur-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-3">
        <label className="text-base sm:text-lg font-medium text-white">
          Name
        </label>
        <Input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={loading}
          variant="dark"
        />
      </div>

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
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
          variant="dark"
        />
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-base sm:text-lg font-medium text-white">
          Confirm Password
        </label>
        <Input
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
        {loading ? "Registering..." : "Register"}
      </Button>

      <p className="text-center text-sm sm:text-base text-gray-200 mt-4">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="font-medium bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent hover:from-blue-300 hover:via-purple-300 hover:to-pink-300 transition-all"
        >
          Login
        </Link>
      </p>
    </form>
  );
}
