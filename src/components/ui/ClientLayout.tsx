"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Sidebar } from "@/components/ui/modern-side-bar";
import { BouncingDots } from "./bouncing-dots";
import { usePathname } from "next/navigation";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const sidebarPages = [
    "/dashboard",
    "/analytics",
    "/inventory",
    "/suppliers",
    "/notifications",
    "/account",
  ];

  const showSidebar =
    user && sidebarPages.some((page) => pathname.startsWith(page));

  if (loading)
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center gap-4 bg-linear-to-br from-slate-950 via-indigo-950 to-slate-950">
        <BouncingDots />
      </div>
    );

  const mainMargin = isSidebarCollapsed ? "md:ml-20" : "md:ml-64";

  return (
    <div className="flex">
      {showSidebar && (
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
        />
      )}
      <main
        className={`flex-1 transition-all duration-300 ${
          showSidebar ? mainMargin : ""
        }`}
      >
        {children}
      </main>
    </div>
  );
}
