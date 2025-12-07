"use client";

import { useState, useEffect } from "react";
import OverstockRiskCard from "@/components/analytics/overstockRiskCard";
import ShrinkageLossCard from "@/components/analytics/shrinkageLossCard";
import SeasonalDemandChart from "@/components/analytics/seasonalDemandChart";
import SupplierReliabilityChart from "@/components/analytics/supplierReliabilityChart";
import MonthlyTargetCard from "@/components/analytics/monthlyTargetCard";
import RecentOrdersTable from "@/components/analytics/recentOrdersTable";
import RecentActivityFeed from "@/components/analytics/recentActivityFeed";
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
  }, []);

  if (loading)
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center gap-4 bg-linear-to-br from-slate-950 via-indigo-950 to-slate-950">
        <BouncingDots />
      </div>
    );

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p>Error loading data: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-indigo-950 to-slate-950 text-white font-sans p-3 sm:p-4 md:p-6">
      <div className="mb-6 sm:mb-8 md:mb-10 relative">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent pb-2">
          Analytics
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
        <OverstockRiskCard />
        <ShrinkageLossCard
          data={data.shrinkageAndLoss.data}
          colors={data.shrinkageAndLoss.colors}
        />
      </div>
      <SeasonalDemandChart data={data.seasonalDemand} />

      <SupplierReliabilityChart data={data.supplierReliability} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <MonthlyTargetCard data={data.monthlyTarget} />
        <RecentOrdersTable data={data.recentOrders} />
      </div>
      <RecentActivityFeed data={data.recentActivityFeed} />
    </div>
  );
}
