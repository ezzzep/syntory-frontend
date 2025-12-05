"use client";

import {
  ShoppingCart,
  PhilippinePeso,
  PackageSearch,
  Smile,
} from "lucide-react";
import type { InventoryItem } from "@/types/inventory";

interface StatsCardsProps {
  totalOrders: number;
  monthlyRevenue: number;
  customerSatisfaction: number;
  items: InventoryItem[];
  lowStockThreshold?: number;
}

export default function StatsCards({
  totalOrders,
  monthlyRevenue,
  customerSatisfaction,
  items,
  lowStockThreshold = 9,
}: StatsCardsProps) {
  const lowStockByCategory: Record<string, number> = {};
  items.forEach((i) => {
    if (i.quantity <= lowStockThreshold) {
      const category = i.category || "Uncategorized";
      if (!lowStockByCategory[category]) lowStockByCategory[category] = 0;
      lowStockByCategory[category] += 1;
    }
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl border border-slate-700/50 hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
            <ShoppingCart className="text-blue-500" size={20} />
          </div>
          <span className="text-xs sm:text-sm px-2 py-1 rounded-full bg-green-500/20 text-green-400 font-medium">
            +14.2%
          </span>
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">
            {totalOrders.toLocaleString()}
          </h2>
          <p className="text-sm sm:text-base text-gray-400">Total Orders</p>
        </div>
      </div>

      <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl border border-slate-700/50 hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-pink-500/20 rounded-xl flex items-center justify-center">
            <PhilippinePeso className="text-pink-500" size={20} />
          </div>
          <span className="text-xs sm:text-sm px-2 py-1 rounded-full bg-red-500/20 text-red-400 font-medium">
            -3.6%
          </span>
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">
            ₱{monthlyRevenue.toLocaleString()}
          </h2>
          <p className="text-sm sm:text-base text-gray-400">Monthly Revenue</p>
        </div>
      </div>

      <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl border border-slate-700/50 hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
            <PackageSearch className="text-yellow-500" size={20} />
          </div>
          {Object.values(lowStockByCategory).reduce((a, b) => a + b, 0) > 0 ? (
            <span className="text-xs sm:text-sm px-2 py-1 rounded-full bg-red-500/20 text-red-400 font-medium">
              Alert
            </span>
          ) : (
            <span className="text-xs sm:text-sm px-2 py-1 rounded-full bg-green-500/20 text-green-400 font-medium">
              Good
            </span>
          )}
        </div>
        <div>
          {Object.values(lowStockByCategory).reduce((a, b) => a + b, 0) > 0 ? (
            <>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                {Object.values(lowStockByCategory).reduce((a, b) => a + b, 0)}
              </h2>
              <p className="text-sm sm:text-base text-gray-400 mb-2">
                Low Stock Items
              </p>
              <div className="flex flex-wrap gap-1">
                {Object.entries(lowStockByCategory).map(([category]) => (
                  <span
                    key={category}
                    className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-400"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                All Stocked
              </h2>
              <p className="text-sm sm:text-base text-gray-400">
                Inventory Status
              </p>
            </>
          )}
        </div>
      </div>

      <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl border border-slate-700/50 hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
            <Smile className="text-green-500" size={20} />
          </div>
          <span className="text-xs sm:text-sm px-2 py-1 rounded-full bg-green-500/20 text-green-400 font-medium">
            +2.1%
          </span>
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">
            {customerSatisfaction}%
          </h2>
          <p className="text-sm sm:text-base text-gray-400">
            Customer Satisfaction
          </p>
        </div>
      </div>
    </div>
  );
}
