"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import type { InventoryItem } from "@/types/inventory";

// Define a type for our data structure for better type safety
type AnalyticsData = {
  abcAnalysis: { name: string; value: number }[];
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
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p>Loading Analytics...</p>
      </div>
    );
  }

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
      {/* ... Header remains the same ... */}
      <div className="mb-6 sm:mb-8 md:mb-10 relative">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent pb-2">
          Analytics
        </h1>
        <div className="h-1 w-24 sm:w-32 bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 mt-3 sm:mt-4 rounded-full"></div>
      </div>

      {/* --- CARDS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
        {/* Overstock Risk Card (using static data for now as an example) */}
        <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl border border-slate-700/50 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-semibold">Overstock Risk</h2>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 sm:w-5 sm:h-5 bg-yellow-500 rounded-full"></div>
            </div>
          </div>
          <div className="h-32 sm:h-40 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="100%"
                innerRadius="60%"
                outerRadius="90%"
                barSize={14}
                startAngle={180}
                endAngle={0}
                data={[{ name: "Risk", value: 65, fill: "#facc15" }]}
              >
                <RadialBar
                  dataKey="value"
                  background={{ fill: "#334155" }}
                  cornerRadius={8}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-center mt-2 text-yellow-300 font-semibold text-sm sm:text-base">
            65% Overstock Risk
          </p>
        </div>

        {/* Shrinkage & Loss Card - now using fetched data */}
        <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl border border-slate-700/50 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-semibold">
              Shrinkage & Loss
            </h2>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 sm:w-5 sm:h-5 bg-purple-500 rounded-full"></div>
            </div>
          </div>
          <div className="h-32 sm:h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.shrinkageAndLoss.data}
                  dataKey="value"
                  outerRadius={50}
                  label
                >
                  {data.shrinkageAndLoss.data.map((entry, i) => (
                    <Cell
                      key={`cell-${i}`}
                      fill={data.shrinkageAndLoss.colors[i]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #475569",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* --- CHARTS --- */}
      <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-xl border border-slate-700/50 hover:shadow-2xl transition-all duration-300 mb-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold">ABC Analysis</h2>
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-blue-500 rounded-sm"></div>
          </div>
        </div>
        <div className="h-48 sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.abcAnalysis}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #475569",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-xl border border-slate-700/50 hover:shadow-2xl transition-all duration-300 mb-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold">
            Supplier Reliability
          </h2>
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-sm"></div>
          </div>
        </div>
        <div className="h-48 sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.supplierReliability}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <XAxis
                dataKey="name"
                stroke="#94a3b8"
                fontSize={10}
                angle={-15}
                textAnchor="end"
                height={60}
              />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #475569",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* --- TABLES & LISTS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly Target Card - now using fetched data */}
        <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl border border-slate-700/50">
          <div className="flex justify-between items-start mb-4 sm:mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold">
                Monthly Target
              </h2>
              <p className="text-gray-400 text-xs sm:text-sm mt-1">
                Target you set for each month
              </p>
            </div>
            <button className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-700/50">
              ⋯
            </button>
          </div>
          <div className="h-40 sm:h-48 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="100%"
                innerRadius="60%"
                outerRadius="90%"
                startAngle={180}
                endAngle={0}
                barSize={16}
                data={[
                  {
                    name: "progress",
                    value: data.monthlyTarget.progress,
                    fill: "#6366f1",
                  },
                ]}
              >
                <RadialBar
                  dataKey="value"
                  background={{ fill: "#334155" }}
                  cornerRadius={8}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center -mt-8 sm:-mt-10 mb-4">
            <h1 className="text-3xl sm:text-4xl font-bold">
              {data.monthlyTarget.progress}%
            </h1>
            <span className="text-green-500 bg-green-500/20 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
              {data.monthlyTarget.change}
            </span>
          </div>
          <p className="text-center text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">
            You earned{" "}
            <span className="text-white font-semibold">
              {data.monthlyTarget.earningsToday}
            </span>{" "}
            today. {data.monthlyTarget.description}
          </p>
          <div className="grid grid-cols-3 text-center border-t border-slate-700/50 pt-4 sm:pt-5">
            <div>
              <p className="text-gray-400 text-xs sm:text-sm">Target</p>
              <p className="font-semibold text-sm sm:text-base">
                {data.monthlyTarget.target.value}{" "}
                <span
                  className={
                    data.monthlyTarget.target.trend === "↑"
                      ? "text-green-400"
                      : "text-red-400"
                  }
                >
                  {data.monthlyTarget.target.trend}
                </span>
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs sm:text-sm">Revenue</p>
              <p className="font-semibold text-sm sm:text-base">
                {data.monthlyTarget.revenue.value}{" "}
                <span
                  className={
                    data.monthlyTarget.revenue.trend === "↑"
                      ? "text-green-400"
                      : "text-red-400"
                  }
                >
                  {data.monthlyTarget.revenue.trend}
                </span>
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs sm:text-sm">Today</p>
              <p className="font-semibold text-sm sm:text-base">
                {data.monthlyTarget.todayValue.value}{" "}
                <span
                  className={
                    data.monthlyTarget.todayValue.trend === "↑"
                      ? "text-green-400"
                      : "text-red-400"
                  }
                >
                  {data.monthlyTarget.todayValue.trend}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Recent Orders Table - now using fetched data */}
        <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl border border-slate-700/50">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
            <h2 className="text-xl sm:text-2xl font-semibold">Recent Orders</h2>
            <button className="px-3 sm:px-4 py-2 rounded-xl bg-slate-700/50 hover:bg-slate-600/50 transition-colors text-sm">
              Filter
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[500px]">
              <thead className="border-b border-slate-700/50 text-gray-400">
                <tr>
                  <th className="pb-3 text-xs sm:text-sm">Product</th>
                  <th className="pb-3 text-xs sm:text-sm">Category</th>
                  <th className="pb-3 text-xs sm:text-sm">Country</th>
                  <th className="pb-3 text-xs sm:text-sm">CR</th>
                  <th className="pb-3 text-xs sm:text-sm">Value</th>
                </tr>
              </thead>
              <tbody>
                {data.recentOrders.map((order, i) => (
                  <tr
                    key={i}
                    className="border-b border-slate-700/30 hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="py-2 sm:py-3 text-xs sm:text-sm">
                      {order.product}
                    </td>
                    <td className="py-2 sm:py-3 text-xs sm:text-sm">
                      {order.category}
                    </td>
                    <td className="py-2 sm:py-3 text-lg sm:text-xl">
                      {order.country}
                    </td>
                    <td className="py-2 sm:py-3 text-xs sm:text-sm">
                      {order.cr}
                    </td>
                    <td className="py-2 sm:py-3 text-green-400 text-xs sm:text-sm">
                      {order.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recent Activity Feed - now using fetched data */}
      <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-xl border border-slate-700/50">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
          <h2 className="text-xl sm:text-2xl font-semibold">
            Recent Activity Feed
          </h2>
          <div className="flex gap-2 flex-wrap">
            <button className="px-3 sm:px-4 py-2 rounded-xl bg-slate-700/50 hover:bg-slate-600/50 transition-colors text-xs sm:text-sm">
              All
            </button>
            <button className="px-3 sm:px-4 py-2 rounded-xl bg-slate-700/30 hover:bg-slate-600/50 transition-colors text-xs sm:text-sm">
              Orders
            </button>
            <button className="px-3 sm:px-4 py-2 rounded-xl bg-slate-700/30 hover:bg-slate-600/50 transition-colors text-xs sm:text-sm">
              Alerts
            </button>
          </div>
        </div>
        <div className="space-y-3 sm:space-y-4">
          {data.recentActivityFeed.map((activity) => (
            <div
              key={activity.id}
              className={`flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl hover:bg-slate-700/30 transition-colors`}
            >
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0 ${activity.color} ${activity.iconColor}`}
              >
                <span className="text-lg sm:text-xl">{activity.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 sm:gap-2">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-white text-sm sm:text-base truncate">
                      {activity.title}
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm mt-1 line-clamp-1 sm:line-clamp-none">
                      {activity.description}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {activity.time}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 sm:mt-6 text-center">
          <button className="px-4 sm:px-6 py-2 rounded-xl bg-slate-700/50 hover:bg-slate-600/50 transition-colors text-sm">
            Load More Activities
          </button>
        </div>
      </div>
    </div>
  );
}
