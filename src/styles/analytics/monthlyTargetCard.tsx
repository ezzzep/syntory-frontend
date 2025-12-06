import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
import { MonthlyTargetCardProps } from "@/types/analytics";

export default function MonthlyTargetCard({ data }: MonthlyTargetCardProps) {
  return (
    <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl border border-slate-700/50">
      <div className="flex justify-between items-start mb-4 sm:mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold">Monthly Target</h2>
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
                value: data.progress,
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
        <h1 className="text-3xl sm:text-4xl font-bold">{data.progress}%</h1>
        <span className="text-green-500 bg-green-500/20 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
          {data.change}
        </span>
      </div>
      <p className="text-center text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">
        You earned{" "}
        <span className="text-white font-semibold">{data.earningsToday}</span>{" "}
        today. {data.description}
      </p>
      <div className="grid grid-cols-3 text-center border-t border-slate-700/50 pt-4 sm:pt-5">
        <div>
          <p className="text-gray-400 text-xs sm:text-sm">Target</p>
          <p className="font-semibold text-sm sm:text-base">
            {data.target.value}{" "}
            <span
              className={
                data.target.trend === "↑" ? "text-green-400" : "text-red-400"
              }
            >
              {data.target.trend}
            </span>
          </p>
        </div>
        <div>
          <p className="text-gray-400 text-xs sm:text-sm">Revenue</p>
          <p className="font-semibold text-sm sm:text-base">
            {data.revenue.value}{" "}
            <span
              className={
                data.revenue.trend === "↑" ? "text-green-400" : "text-red-400"
              }
            >
              {data.revenue.trend}
            </span>
          </p>
        </div>
        <div>
          <p className="text-gray-400 text-xs sm:text-sm">Today</p>
          <p className="font-semibold text-sm sm:text-base">
            {data.todayValue.value}{" "}
            <span
              className={
                data.todayValue.trend === "↑"
                  ? "text-green-400"
                  : "text-red-400"
              }
            >
              {data.todayValue.trend}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
