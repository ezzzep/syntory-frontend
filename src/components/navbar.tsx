"use client";

import Link from "next/link";
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
    <nav className="w-full bg-black px-6 py-4 flex items-center justify-between fixed">
      <Link
        href={logoHref}
        className="flex items-center text-white text-3xl font-bold"
      >
        Syntory
      </Link>

      {!loading && user && (
        <div className="flex items-center gap-6">
          <Link
            href={`/account/${user.id}`}
            className="hover:text-blue-500 text-white"
          >
            Account
          </Link>
          <button
            onClick={handleLogout}
            className="hover:text-red-500 cursor-pointer text-white"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
