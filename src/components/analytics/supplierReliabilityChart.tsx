/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, Award, Zap } from "lucide-react";
import type { ChartSupplier } from "@/lib/api/suppliers";
import { getSuppliersForChart } from "@/lib/api/suppliers";

const StarRating = ({ rating, max = 5 }: { rating: number; max?: number }) => (
  <div className="flex gap-1.5">
    {[...Array(max)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          duration: 0.5,
          delay: i * 0.1,
          type: "spring",
          stiffness: 200,
        }}
      >
        <Star
          className={`w-6 h-6 ${
            i < rating
              ? "text-yellow-400 fill-yellow-400"
              : "text-slate-600 fill-slate-700"
          }`}
        />
      </motion.div>
    ))}
  </div>
);

const CategoryCard = ({
  category,
  rating,
  index,
}: {
  category: string;
  rating: number;
  index: number;
}) => {
  const colors: Record<string, string> = {
    requirements: "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
    quality: "from-green-500/20 to-emerald-500/20 border-green-500/30",
    delivery: "from-amber-500/20 to-orange-500/20 border-amber-500/30",
    communication: "from-purple-500/20 to-pink-500/20 border-purple-500/30",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className={`relative p-6 bg-gradient-to-br ${
        colors[category] || "from-slate-500/20"
      } rounded-2xl border backdrop-blur-sm`}
    >
      <div className="flex flex-col items-center">
        <h3 className="text-lg font-bold text-white capitalize mb-4">
          {category}
        </h3>
        <div className="mb-3">
          <StarRating rating={Math.round(rating)} />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-3xl font-bold text-white">
            {rating.toFixed(1)}
          </span>
          <span className="text-slate-400 text-sm">/5.0</span>
        </div>
      </div>
    </motion.div>
  );
};

export default function SupplierReliabilityChart() {
  const [data, setData] = useState<ChartSupplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const categories = [
    "requirements",
    "quality",
    "delivery",
    "communication",
  ] as const;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setData(await getSuppliersForChart());
      } catch (err: any) {
        setError(err.message || "Failed to fetch suppliers");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p>Loading suppliers...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  const categoryAverages = categories.map((cat) => ({
    category: cat,
    rating: data.reduce((sum, s) => sum + s[cat], 0) / data.length,
  }));

  const overallScore =
    categoryAverages.reduce((sum, c) => sum + c.rating, 0) / categories.length;

  return (
    <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-slate-700/50 h-full flex flex-col overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-400 to-purple-500 rounded-full filter blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Supplier Reliability
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Performance ratings overview
            </p>
          </div>
          <motion.div
            className="flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 px-4 py-2 rounded-xl border border-green-500/30"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Zap className="w-4 h-4 text-green-400" />
            </motion.div>
            <span className="text-green-400 text-sm font-medium">
              {overallScore.toFixed(1)} Overall
            </span>
          </motion.div>
        </div>

        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categoryAverages.map((item, idx) => (
            <CategoryCard
              key={item.category}
              category={item.category}
              rating={item.rating}
              index={idx}
            />
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-700/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-yellow-400" />
            <span className="text-slate-400 text-sm">
              {data.length} suppliers evaluated
            </span>
          </div>
          <motion.div
            className="flex items-center gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.round(overallScore)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-slate-600 fill-slate-700"
                }`}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
