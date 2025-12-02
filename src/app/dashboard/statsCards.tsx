"use client";

import {
  ShoppingCart,
  PhilippinePeso,
  PackageSearch,
  Smile,
} from "lucide-react";
import { statsCardsStyles as s } from "@/styles/statsCards";
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
  lowStockThreshold = 10,
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
    <div className={s.grid}>
      <div className={s.card}>
        <div className={`${s.iconWrapper} bg-blue-600`}>
          <ShoppingCart className="text-white" size={28} />
        </div>
        <div>
          <h2 className={s.value}>{totalOrders}</h2>
          <p className={s.label}>Total Orders</p>
          <span className={`${s.badge} bg-green-700`}>+14.2%</span>
        </div>
      </div>

      <div className={s.card}>
        <div className={`${s.iconWrapper} bg-pink-600`}>
          <PhilippinePeso className="text-white" size={28} />
        </div>
        <div>
          <h2 className={s.value}>₱{monthlyRevenue.toLocaleString()}</h2>
          <p className={s.label}>Monthly Revenue</p>
          <span className={`${s.badge} bg-red-600`}>-3.6%</span>
        </div>
      </div>

      <div className={s.card}>
        <div className={`${s.iconWrapper} bg-yellow-600`}>
          <PackageSearch className="text-white" size={28} />
        </div>
        <div>
          {Object.values(lowStockByCategory).reduce((a, b) => a + b, 0) > 0 ? (
            <>
              <h2 className={s.value}>
                {Object.values(lowStockByCategory).reduce((a, b) => a + b, 0)}{" "}
                {Object.values(lowStockByCategory).reduce(
                  (a, b) => a + b,
                  0
                ) === 1
                  ? "item"
                  : "items"}
              </h2>
              <p className={s.label}>Low Stock Items</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {Object.entries(lowStockByCategory).map(([category]) => (
                  <span key={category} className={`${s.badge} bg-red-600`}>
                    {category}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <>
              <h2 className={s.value}>All Stocked </h2>
              <span className={`${s.badge} bg-green-700`}>Good</span>
            </>
          )}
        </div>
      </div>

      <div className={s.card}>
        <div className={`${s.iconWrapper} bg-green-700`}>
          <Smile className="text-white" size={28} />
        </div>
        <div>
          <h2 className={s.value}>{customerSatisfaction}%</h2>
          <p className={s.label}>Customer Satisfaction</p>
          <span className={`${s.badge} bg-green-700`}>+2.1%</span>
        </div>
      </div>
    </div>
  );
}
