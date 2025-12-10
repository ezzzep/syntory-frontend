"use client";

import { useEffect, useState } from "react";
import { getUser } from "@/lib/api/auth";
import { subscribeToAuthChange } from "@/lib/authEvents";
import type { User } from "@/lib/api/auth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const u = await getUser();
      setUser(u || null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    const unsubscribe = subscribeToAuthChange(fetchUser);
    return unsubscribe;
  }, []);

  return { user, loading, refetch: fetchUser };
}
