// pages/analytics.tsx

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
import { Supplier } from "@/types/supplier";
import { getSuppliers } from "@/lib/api/suppliers";

interface SupplierChartData {
  name: string;
  requirements: number;
  quality: number;
  delivery: number;
  communication: number;
}

type AnalyticsData = {
  seasonalDemand: {
    month: string;
    winter: number;
    spring: number;
    summer: number;
    autumn: number;
  }[];
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

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [supplierChartData, setSupplierChartData] = useState<
    SupplierChartData[]
  >([]);
  const [refreshChart] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const analyticsRes = await fetch("/mockAnalyticsData.json");
        if (!analyticsRes.ok) {
          throw new Error("Failed to fetch mock analytics data");
        }
        const analyticsData: AnalyticsData = await analyticsRes.json();
        setData(analyticsData);

        const suppliersData = await getSuppliers();
        setSuppliers(suppliersData);

        const categoryAverages = {
          requirements: 0,
          quality: 0,
          delivery: 0,
          communication: 0,
        };

        let count = 0;

        suppliersData.forEach((supplier: Supplier) => {
          const requirements = Number(supplier.requirements_rating) || 0;
          const quality = Number(supplier.quality_rating) || 0;
          const delivery = Number(supplier.delivery_rating) || 0;
          const communication = Number(supplier.communication_rating) || 0;

          if (requirements || quality || delivery || communication) {
            categoryAverages.requirements += requirements;
            categoryAverages.quality += quality;
            categoryAverages.delivery += delivery;
            categoryAverages.communication += communication;
            count++;
          }
        });

        if (count > 0) {
          categoryAverages.requirements = parseFloat(
            (categoryAverages.requirements / count).toFixed(1)
          );
          categoryAverages.quality = parseFloat(
            (categoryAverages.quality / count).toFixed(1)
          );
          categoryAverages.delivery = parseFloat(
            (categoryAverages.delivery / count).toFixed(1)
          );
          categoryAverages.communication = parseFloat(
            (categoryAverages.communication / count).toFixed(1)
          );
        }

        const data: SupplierChartData[] = [
          {
            name: "Requirements",
            requirements: categoryAverages.requirements,
            quality: 0,
            delivery: 0,
            communication: 0,
          },
          {
            name: "Quality",
            requirements: 0,
            quality: categoryAverages.quality,
            delivery: 0,
            communication: 0,
          },
          {
            name: "Delivery",
            requirements: 0,
            quality: 0,
            delivery: categoryAverages.delivery,
            communication: 0,
          },
          {
            name: "Communication",
            requirements: 0,
            quality: 0,
            delivery: 0,
            communication: categoryAverages.communication,
          },
        ];

        setSupplierChartData(data);
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshChart]);

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <SupplierReliabilityChart />
        <MonthlyTargetCard data={data.monthlyTarget} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-8 gap-6">
        <div className="lg:col-span-5">
          <RecentOrdersTable  />
        </div>
        <div className="lg:col-span-3">
          <RecentActivityFeed data={data.recentActivityFeed} />
        </div>
      </div>
    </div>
  );
}
