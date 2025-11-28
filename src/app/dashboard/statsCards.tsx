"use client";

import {
  ShoppingCart,
  PhilippinePeso,
  PackageSearch,
  Smile,
} from "lucide-react";
import { statsCardsStyles as s } from "@/styles/statsCards";

export default function StatsCards() {
  return (
    <div className={s.grid}>
      <div className={s.card}>
        <div className={`${s.iconWrapper} bg-blue-500`}>
          <ShoppingCart className="text-white" size={28} />
        </div>
        <div>
          <h2 className={s.value}>12.8k</h2>
          <p className={s.label}>Total Orders</p>
          <span className={`${s.badge} bg-green-500`}>+14.2%</span>
        </div>
      </div>
      <div className={s.card}>
        <div className={`${s.iconWrapper} bg-pink-500`}>
          <PhilippinePeso className="text-white" size={28} />
        </div>
        <div>
          <h2 className={s.value}>₱1.2M</h2>
          <p className={s.label}>Monthly Revenue</p>
          <span className={`${s.badge} bg-red-500`}>-3.6%</span>
        </div>
      </div>
      <div className={s.card}>
        <div className={`${s.iconWrapper} bg-yellow-500`}>
          <PackageSearch className="text-white" size={28} />
        </div>
        <div>
          <h2 className={s.value}>32</h2>
          <p className={s.label}>Low Stock Items</p>
          <span className={`${s.badge} bg-red-500`}>Alert</span>
        </div>
      </div>
      <div className={s.card}>
        <div className={`${s.iconWrapper} bg-green-500`}>
          <Smile className="text-white" size={28} />
        </div>
        <div>
          <h2 className={s.value}>94%</h2>
          <p className={s.label}>Customer Satisfaction</p>
          <span className={`${s.badge} bg-green-600`}>+2.1%</span>
        </div>
      </div>
    </div>
  );
}
