
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { SeasonalDemandChartProps } from "@/types/analytics";

export default function SeasonalDemandChart({
  data,
}: SeasonalDemandChartProps) {
  return (
    <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-xl border border-slate-700/50 hover:shadow-2xl transition-all duration-300 mb-6">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold">
          Seasonal Demand Analytics
        </h2>
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
          <div className="w-4 h-4 sm:w-5 sm:h-5 bg-purple-500 rounded-full"></div>
        </div>
      </div>
      <div className="h-48 sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="month" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #475569",
                borderRadius: "8px",
                color: "#ffffff", // White text
              }}
              labelStyle={{ color: "#ffffff" }}
              itemStyle={{ color: "#ffffff" }}
            />
            <Legend wrapperStyle={{ color: "#94a3b8" }} iconType="line" />
            <Line
              type="monotone"
              dataKey="winter"
              stroke="#a78bfa" // Purple
              strokeWidth={2}
              dot={{ fill: "#a78bfa", r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="spring"
              stroke="#34d399" // Green
              strokeWidth={2}
              dot={{ fill: "#34d399", r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="summer"
              stroke="#fbbf24" // Yellow
              strokeWidth={2}
              dot={{ fill: "#fbbf24", r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="autumn"
              stroke="#fb923c" // Orange
              strokeWidth={2}
              dot={{ fill: "#fb923c", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
