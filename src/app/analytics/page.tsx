"use client";

import { useState, useEffect } from "react";
import OverstockRiskCard from "@/styles/analytics/overstockRiskCard";
import ShrinkageLossCard from "@/styles/analytics/shrinkageLossCard";
import SeasonalDemandChart from "@/styles/analytics/seasonalDemandChart";
import SupplierReliabilityChart from "@/styles/analytics/supplierReliabilityChart";
import MonthlyTargetCard from "@/styles/analytics/monthlyTargetCard";
import RecentOrdersTable from "@/styles/analytics/recentOrdersTable";
import RecentActivityFeed from "@/styles/analytics/recentActivityFeed";
import { BouncingDots } from "@/components/ui/bouncing-dots";

type AnalyticsData = {
  seasonalDemand: {
    month: string;
    winter: number;
    spring: number;
    summer: number;
    autumn: number;
  }[];
  supplierReliability: { name: string; value: number }[];
  shrinkageAndLoss: {
    data: { name: string; value: number }[];
    colors: string[];
  };
  monthlyTarget: {
    progress: number;
    change: string;
    earningsToday: string;
    description: string;
    target: { value: string; trend: string };
    revenue: { value: string; trend: string };
    todayValue: { value: string; trend: string };
  };
  recentOrders: {
    product: string;
    category: string;
    country: string;
    cr: string;
    value: string;
  }[];
  recentActivityFeed: {
    id: number;
    type: string;
    icon: string;
    title: string;
    description: string;
    time: string;
    color: string;
    iconColor: string;
  }[];
};

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/mockAnalyticsData.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch mock data");
        }
        return res.json();
      })
      .then((analyticsData: AnalyticsData) => {
        setData(analyticsData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []); // Empty dependency array means this runs once on mount

  // --- LOADING STATE ---
  if (loading)
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center gap-4 bg-linear-to-br from-slate-950 via-indigo-950 to-slate-950">
        <BouncingDots />
      </div>
    );

  // --- ERROR STATE ---
  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p>Error loading data: {error}</p>
      </div>
    );
  }

  // --- SUCCESS STATE: Render UI with fetched data ---
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-indigo-950 to-slate-950 text-white font-sans p-3 sm:p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8 md:mb-10 relative">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent pb-2">
          Analytics
        </h1>
        <div className="h-1 w-24 sm:w-32 bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 mt-3 sm:mt-4 rounded-full"></div>
      </div>

      {/* --- CARDS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
        {/* Overstock Risk Card */}
        <OverstockRiskCard />

        {/* Shrinkage & Loss Card */}
        <ShrinkageLossCard
          data={data.shrinkageAndLoss.data}
          colors={data.shrinkageAndLoss.colors}
        />
      </div>

      {/* --- CHARTS --- */}
      <SeasonalDemandChart data={data.seasonalDemand} />

      <SupplierReliabilityChart data={data.supplierReliability} />

      {/* --- TABLES & LISTS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly Target Card */}
        <MonthlyTargetCard data={data.monthlyTarget} />

        {/* Recent Orders Table */}
        <RecentOrdersTable data={data.recentOrders} />
      </div>

      {/* Recent Activity Feed */}
      <RecentActivityFeed data={data.recentActivityFeed} />
    </div>
  );
}
