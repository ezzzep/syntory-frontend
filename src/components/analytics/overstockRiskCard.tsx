import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
import { OverstockRiskCardProps } from "@/types/analytics";

export default function OverstockRiskCard({
  riskPercentage = 65,
}: OverstockRiskCardProps) {
  return (
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
            data={[{ name: "Risk", value: riskPercentage, fill: "#facc15" }]}
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
        {riskPercentage}% Overstock Risk
      </p>
    </div>
  );
}
