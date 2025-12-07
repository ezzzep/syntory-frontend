"use client";

import RegisterForm from "./registerForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="min-h-screen w-full bg-linear-to-br from-slate-950 via-indigo-950 to-slate-950 text-white font-sans p-3 sm:p-4 md:p-6 flex items-center justify-center relative">
      <div className="fixed top-0 left-0 p-6">
        <Link
          href="/"
          className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-800/50 backdrop-blur-md border border-slate-700/50 text-gray-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200 hover:scale-110"
          aria-label="Back to Homepage"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </div>
      <RegisterForm />
    </div>
  );
}
