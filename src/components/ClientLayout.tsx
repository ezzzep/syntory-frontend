"use client";

import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/navbar";
import { Sidebar } from "@/components/modern-side-bar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex">
      {user ? <Sidebar /> : <Navbar />}
      <main className={user ? "w-full" : "w-full "}>{children}</main>
    </div>
  );
}
