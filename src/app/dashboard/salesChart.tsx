"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", sales: 1800, revenue: 4200 },
  { name: "Feb", sales: 2500, revenue: 4600 },
  { name: "Mar", sales: 230, revenue: 3900 },
  { name: "Apr", sales: 140, revenue: 3200 },
  { name: "May", sales: 260, revenue: 5100 },
  { name: "Jun", sales: 210, revenue: 4700 },
  { name: "Jul", sales: 130, revenue: 3100 },
  { name: "Aug", sales: 180, revenue: 3500 },
  { name: "Sep", sales: 160, revenue: 3300 },
  { name: "Oct", sales: 220, revenue: 4900 },
  { name: "Nov", sales: 150, revenue: 3600 },
  { name: "Dec", sales: 240, revenue: 5500 },
];

export default function SalesChart() {
  return (
    <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-xl border border-slate-700/50 hover:shadow-2xl transition-all duration-300">

      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold">Sales Overview</h2>
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
          <div className="w-4 h-4 sm:w-5 sm:h-5 bg-blue-500 rounded-sm"></div>
        </div>
      </div>

      <div className="h-64 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.3} />
              </linearGradient>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0.3} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />

            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
            <YAxis stroke="#94a3b8" fontSize={12} />

            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #475569",
                borderRadius: "8px",
              }}
              content={({ payload, label }) => (
                <div className="bg-slate-800/90 backdrop-blur-sm border border-slate-600/50 rounded-xl p-4 min-w-[180px]">
                  <div className="text-white font-medium mb-3">{label}</div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-1">
                      <span className="text-blue-400 font-medium">Sales:</span>
                      <span className="text-white font-bold ml-4">
                        {payload[0]?.payload.sales.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-green-400 font-medium">
                        Revenue:
                      </span>
                      <span className="text-white font-bold ml-4">
                        ${payload[0]?.payload.revenue.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            />

            <Bar
              dataKey="sales"
              fill="url(#salesGradient)"
              radius={[8, 8, 0, 0]}
            />
            <Bar
              dataKey="revenue"
              fill="url(#revenueGradient)"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center gap-6 mt-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
          <span className="text-sm text-gray-300">Sales</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
          <span className="text-sm text-gray-300">Revenue</span>
        </div>
      </div>
    </div>
  );
}
