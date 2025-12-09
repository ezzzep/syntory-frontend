"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Home,
  User,
  LogOut,
  Menu,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Bell,
  Boxes,
  Smile,
} from "lucide-react";
import { logout } from "@/lib/api/auth";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface NavigationItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  onClick?: () => void;
  badge?: string;
}

interface SidebarProps {
  className?: string;
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Sidebar({
  className = "",
  isCollapsed,
  setIsCollapsed,
}: SidebarProps) {
  const router = useRouter();
  const { user } = useAuth();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number | null>(null);

  useEffect(() => {
    const handleResize = () => setIsOpen(window.innerWidth >= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const handleItemClick = (item: NavigationItem) => {
    if (item.onClick) item.onClick();
    else if (item.href) router.push(item.href);
    if (window.innerWidth < 768) setIsOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const navigationItems: NavigationItem[] = [
    { id: "dashboard", name: "Dashboard", icon: Home, href: "/dashboard" },
    { id: "analytics", name: "Analytics", icon: BarChart3, href: "/analytics" },
    { id: "inventory", name: "Inventory", icon: Boxes, href: "/inventory" },
    {
      id: "supplier",
      name: "Supplier Status",
      icon: Smile,
      href: "/suppliers",
    },
    {
      id: "notifications",
      name: "Notifications",
      icon: Bell,
      href: "/notifications",
    },
    {
      id: "profile",
      name: "Profile",
      icon: User,
      onClick: () => router.push(`/account/${user?.id}`),
    },
  ];

  const getActiveItem = () => {

    if (pathname.startsWith("/suppliers")) return "supplier";
    if (pathname.startsWith("/account")) return "profile";
    const exactMatch = navigationItems.find((item) => item.href === pathname);
    if (exactMatch) return exactMatch.id;

    return "dashboard";
  };

  const activeItem = getActiveItem();

  const handleTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (startXRef.current === null) return;
    const deltaX = e.touches[0].clientX - startXRef.current;
    if (deltaX < -50) setIsOpen(false);
  };
  const handleTouchEnd = () => {
    startXRef.current = null;
  };

  return (
    <>
      {/* Mobile toggle button */}
      {!isOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-6 left-6 z-50 p-3 rounded-lg bg-white shadow-md border border-slate-100 md:hidden hover:bg-slate-50 transition-all duration-200"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5 text-slate-600" />
        </button>
      )}

      {/* Mobile overlay */}
      {isOpen && (
        <div
          ref={overlayRef}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen z-40 flex flex-col transition-all duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          ${isCollapsed ? "w-20" : "w-56 md:w-64"} 
          bg-gray-900 border-r border-gray-700
          ${className}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-700">
          {!isCollapsed && (
            <div className="text-2xl font-bold text-white">Syntory</div>
          )}
          <button
            onClick={toggleCollapse}
            className="hidden md:flex p-1.5 rounded-md hover:bg-gray-800 transition-all duration-200"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 text-gray-300" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-gray-300" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 mt-2">
          <ul className="space-y-0.5">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleItemClick(item)}
                    className={`w-full flex items-center rounded-md text-left transition-all duration-200 group
                      ${
                        isActive
                          ? "bg-blue-800 text-blue-200"
                          : "text-gray-300 hover:bg-gray-800 hover:text-white"
                      }
                      ${
                        isCollapsed
                          ? "justify-center p-3"
                          : "space-x-3 px-3 py-2.5"
                      }
                      cursor-pointer`}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <Icon
                      className={`h-5 w-5 shrink-0 ${
                        isActive
                          ? "text-blue-200"
                          : "text-gray-400 group-hover:text-white"
                      }`}
                    />
                    {!isCollapsed && (
                      <span
                        className={`text-sm ${
                          isActive ? "font-medium" : "font-normal"
                        }`}
                      >
                        {item.name}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-gray-700 mt-auto">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center rounded-md transition-all duration-200 group
              ${isCollapsed ? "justify-center p-3" : "space-x-3 px-3 py-2.5"}
              text-gray-300 hover:bg-gray-800 hover:text-red-500 cursor-pointer`}
            title={isCollapsed ? "Logout" : undefined}
          >
            <LogOut className="h-5 w-5 shrink-0 text-gray-300 group-hover:text-red-500" />
            {!isCollapsed && (
              <span className="text-sm font-medium text-gray-300 group-hover:text-red-500">
                Logout
              </span>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
