"use client";

import { useEffect, useState } from "react";
import StatsCards from "./statsCards";
import SalesChart from "./salesChart";
import TopListsCards from "./topListCards";
import type { InventoryItem } from "@/types/inventory";
import { getInventory } from "@/lib/api/inventory";
import { BouncingDots } from "@/components/bouncing-dots";

export default function DashboardPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalOrders, setTotalOrders] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [customerSatisfaction, setCustomerSatisfaction] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getInventory();
        setInventory(data);
        setTotalOrders(12800);
        setMonthlyRevenue(1200000);
        setCustomerSatisfaction(94);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center gap-4 bg-linear-to-br from-slate-950 via-indigo-950 to-slate-950">
        <BouncingDots />
      </div>
    );

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-slate-950 via-indigo-950 to-slate-950 text-white font-sans p-3 sm:p-4 md:p-6">
      <div className="mb-6 sm:mb-8 md:mb-10 relative">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <div className="h-1 w-24 sm:w-32 bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 mt-3 sm:mt-4 rounded-full"></div>
      </div>

      <div className="mb-8">
        <StatsCards
          totalOrders={totalOrders}
          monthlyRevenue={monthlyRevenue}
          customerSatisfaction={customerSatisfaction}
          items={inventory}
        />
      </div>

      <div className="mb-8">
        <SalesChart />
      </div>
      <div className="mb-8">
        <TopListsCards />
      </div>
    </div>
  );
}
