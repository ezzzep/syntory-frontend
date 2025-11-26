"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { logout } from "@/lib/api/auth";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, loading } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  const logoHref = user ? "/dashboard" : "/";

  return (
    <nav className="w-full bg-white px-6 py-4 flex items-center justify-between fixed">
      <Link href={logoHref} className="flex items-center">
        <Image
          src="/image/syntory-logo.png"
          alt="Syntory Logo"
          width={120} 
          height={20}
          priority 
        />
      </Link>

      {!loading && user && (
        <div className="flex items-center gap-6">
          <Link href={`/account/${user.id}`} className="hover:text-blue-500">
            Account
          </Link>
          <button
            onClick={handleLogout}
            className="hover:text-red-500 cursor-pointer"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
