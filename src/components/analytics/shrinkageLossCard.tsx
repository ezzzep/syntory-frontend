import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  PieProps,
} from "recharts";

interface ShrinkageLossCardProps {
  data: PieProps["data"]; 
  colors: string[];
}

export default function ShrinkageLossCard({
  data,
  colors,
}: ShrinkageLossCardProps) {
  return (
    <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl border border-slate-700/50 hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-semibold">Shrinkage & Loss</h2>
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
          <div className="w-4 h-4 sm:w-5 sm:h-5 bg-purple-500 rounded-full"></div>
        </div>
      </div>
      <div className="h-32 sm:h-40">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" outerRadius={50} label>
              {data?.map((entry, i) => (
                <Cell key={`cell-${i}`} fill={colors[i]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #475569",
                borderRadius: "8px",
                color: "#ffffff",
              }}
              labelStyle={{ color: "#ffffff" }} 
              itemStyle={{ color: "#ffffff" }} 
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
