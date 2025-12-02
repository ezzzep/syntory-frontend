"use client";

import { useEffect, useState } from "react";
import StatsCards from "./statsCards";
import SalesChart from "./salesChart";
import TopListsCards from "./topListCards";
import type { InventoryItem } from "@/types/inventory";
import { getInventory } from "@/lib/api/inventory"; // your API function
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
      <div className="w-full h-screen flex flex-col items-center justify-center gap-4 bg-gray-900">
        <BouncingDots />
      </div>
    );

  return (
    <div className="min-h-screen w-full bg-gray-900 p-6">
      <StatsCards
        totalOrders={totalOrders}
        monthlyRevenue={monthlyRevenue}
        customerSatisfaction={customerSatisfaction}
        items={inventory}
      />
      <SalesChart />
      <TopListsCards />
    </div>
  );
}
