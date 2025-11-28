"use client";

import {
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import { salesChartStyles as s } from "@/styles/salesChart";

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
    <div className={s.wrapper}>
      <div className={s.titleRow}>
        <h2 className={s.title}>Sales</h2>
      </div>

      <div className={s.chartContainer}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5EA8FF" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#5EA8FF" stopOpacity={0.3} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />

            <XAxis dataKey="name" stroke="#fff" />
            <YAxis stroke="#fff" />

            <Tooltip />
            <Bar
              dataKey="sales"
              fill="url(#barGradient)"
              radius={[20, 20, 20, 20]}
            />

            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#4CB8FF"
              strokeWidth={3}
              dot={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
