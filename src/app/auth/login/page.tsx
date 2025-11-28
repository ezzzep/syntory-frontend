"use client";

import Image from "next/image";
import LoginForm from "./loginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 pt-14">
      <div
        className="
      
        rounded-3xl 
        shadow-2xl 
        flex flex-col md:flex-row 
        w-full max-w-5xl 
        overflow-hidden
      "
      >
        <div className="flex-1 flex items-center justify-center p-10">
          <LoginForm />
        </div>
        <div className="relative flex-1 hidden md:block">
          <Image
            src="/image/syntory.png"
            alt="Login visual"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
