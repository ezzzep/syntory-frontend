import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { SupplierReliabilityChartProps } from "@/types/analytics";

export default function SupplierReliabilityChart({
  data,
}: SupplierReliabilityChartProps) {
  return (
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
            data={data}
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
  );
}
