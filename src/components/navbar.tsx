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

  return (
    <nav className="w-full bg-white shadow px-6 py-4 flex items-center justify-between fixed">
      <Link href="/" className="text-xl font-semibold">
        Syntory
      </Link>

      {loading ? null : (
        <div className="flex items-center gap-6">
          {!user ? (
            <>
              <Link href="/auth/login" className="hover:text-blue-500">
                Login
              </Link>
              <Link href="/auth/register" className="hover:text-blue-500">
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link
                href={`/account/${user.id}`}
                className="hover:text-blue-500"
              >
                Account
              </Link>
              <button
                onClick={handleLogout}
                className="hover:text-red-500 cursor-pointer"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
