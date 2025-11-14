"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-white shadow px-6 py-4 flex items-center justify-between fixed">
      <Link href="/" className="text-xl font-semibold">
        Syntory
      </Link>
      <div className="flex items-center gap-6">
        <Link href="/auth/login" className="hover:text-blue-500">
          Login
        </Link>
        <Link href="/auth/register" className="hover:text-blue-500">
          Sign Up
        </Link>
      </div>
    </nav>
  );
}
