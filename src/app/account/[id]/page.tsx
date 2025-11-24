"use client";
import { useEffect, useState } from "react";
import { getUser, User } from "@/lib/api/auth";

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUser();
        // console.log("User details:", data); 
        setUser(data); 
      } catch (err) {
        console.warn("Failed to fetch user:", err);
      }
    };

    fetchUser(); 
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center font-sans bg-amber-700">
      <h1 className="text-white">
        {user ? `Welcome ${user.name}` : "Loading..."}
      </h1>
    </div>
  );
}
