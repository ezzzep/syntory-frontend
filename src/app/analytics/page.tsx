"use client";

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

export default function AnalyticsPage() {
  // ---------- Sample Data ----------
  const abcData = [
    { name: "A", value: 70 },
    { name: "B", value: 20 },
    { name: "C", value: 10 },
  ];

  const overstockData = [{ name: "Risk", value: 65, fill: "#facc15" }]; // Yellow

  const supplierScore = [
    { name: "Delivery Accuracy", value: 85 },
    { name: "Quantity Accuracy", value: 78 },
    { name: "Price Stability", value: 90 },
    { name: "On-time Delivery", value: 72 },
  ];

  const shrinkData = [
    { name: "Missing", value: 12 },
    { name: "Damaged", value: 8 },
    { name: "Adjustments", value: 5 },
  ];

  const shrinkColors = ["#ef4444", "#facc15", "#3b82f6"];

  return (
    <div className="p-10 min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-8">Analytics</h1>

      {/* GRID LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* 🟧 ABC ANALYSIS CARD */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">ABC Analysis</h2>
          <div className="h-40">
            <ResponsiveContainer>
              <BarChart data={abcData}>
                <XAxis dataKey="name" stroke="#aaa" />
                <YAxis stroke="#aaa" />
                <Tooltip />
                <Bar dataKey="value" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 🟫 OVERSTOCK RISK METER */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Overstock Risk Meter</h2>

          <div className="h-40 flex items-center justify-center">
            <ResponsiveContainer>
              <RadialBarChart
                cx="50%"
                cy="100%"
                innerRadius="70%"
                outerRadius="100%"
                barSize={18}
                startAngle={180}
                endAngle={0}
                data={[{ name: "Risk", value: 65, fill: "#facc15" }]}
              >
                {/* Valid props ONLY */}
                <RadialBar
                  dataKey="value"
                  background={{ fill: "#444" }}
                  cornerRadius={10}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>

          <p className="text-center mt-2 text-yellow-300 font-semibold">
            65% Overstock Risk
          </p>
        </div>

        {/* 🟨 SUPPLIER RELIABILITY SCORE */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">
            Supplier Reliability Score
          </h2>
          <div className="h-40">
            <ResponsiveContainer>
              <BarChart data={supplierScore}>
                <XAxis
                  dataKey="name"
                  stroke="#aaa"
                  angle={-20}
                  textAnchor="end"
                />
                <YAxis stroke="#aaa" />
                <Tooltip />
                <Bar dataKey="value" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 🟦 SHRINKAGE & LOSS ANALYTICS */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Shrinkage & Loss</h2>
          <div className="h-40">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={shrinkData} dataKey="value" outerRadius={70} label>
                  {shrinkData.map((entry, i) => (
                    <Cell key={i} fill={shrinkColors[i]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
