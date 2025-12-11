/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { SupplierReliabilityChartProps } from "@/types/analytics";

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const filteredPayload = payload.filter((entry: any) => entry.value !== 0);
    if (filteredPayload.length === 0) {
      return null;
    }
    return (
      <div
        className="p-2 bg-slate-800 border border-slate-600 rounded-lg shadow-lg"
        style={{
          backgroundColor: "#1e293b",
          border: "1px solid #475569",
          borderRadius: "8px",
        }}
      >
        <div className="text-slate-300 font-medium mb-1">
          {" "}
          {filteredPayload.map((entry: any, index: number) => (
            <p key={`item-${index}`}>{`${entry.value}`}</p>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

export default function SupplierReliabilityChart({
  data,
  
}: SupplierReliabilityChartProps) {
  return (
    <div
      className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md 
      p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-xl border border-slate-700/50 
      transition-all duration-300 h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold">
          Suppliers Reliability
        </h2>
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
          <div className="w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-sm"></div>
        </div>
      </div>

      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 20, right: 20, left: 40, bottom: 20 }}
            barSize={25}
          >
            <YAxis dataKey="name" type="category" stroke="#94a3b8" width={85} />
            <XAxis type="number" stroke="#94a3b8" domain={[0, 5]} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="requirements" fill="#3b82f6" radius={[0, 8, 8, 0]} />
            <Bar dataKey="quality" fill="#10b981" radius={[0, 8, 8, 0]} />
            <Bar dataKey="delivery" fill="#f59e0b" radius={[0, 8, 8, 0]} />
            <Bar dataKey="communication" fill="#8b5cf6" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
