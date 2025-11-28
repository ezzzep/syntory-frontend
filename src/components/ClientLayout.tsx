"use client";

import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/navbar";
import { Sidebar } from "@/components/modern-side-bar";
import { BouncingDots } from "./bouncing-dots";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center gap-4 bg-gray-950">
        <BouncingDots />
      </div>
    );

  return (
    <div className="flex">
      {user ? <Sidebar /> : <Navbar />}
      <main className="w-full">{children}</main>
    </div>
  );
}
