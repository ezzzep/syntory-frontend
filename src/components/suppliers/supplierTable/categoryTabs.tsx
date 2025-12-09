"use client";

import { Supplier, type SupplierCategory } from "@/types/supplier";
import { Grid3X3, Zap, Home, Cpu, Sparkles } from "lucide-react";
import { suppliersTableStyles } from "@/styles/supplierStatus/supplierTable";

interface CategoryTabsProps {
  activeTab: SupplierCategory | "all";
  setActiveTab: (tab: SupplierCategory | "all") => void;
  // Corrected: Use the specific Supplier[] type instead of any[]
  suppliers: Supplier[];
}

export default function CategoryTabs({
  activeTab,
  setActiveTab,
  suppliers,
}: CategoryTabsProps) {
  const categories = [
    {
      name: "All",
      value: "all" as SupplierCategory | "all",
      icon: Grid3X3,
      color: "from-blue-500 to-cyan-500",
    },
    {
      name: "Appliances",
      value: "appliances" as SupplierCategory,
      icon: Zap,
      color: "from-blue-500 to-cyan-500",
    },
    {
      name: "Home & Living",
      value: "home-living" as SupplierCategory,
      icon: Home,
      color: "from-green-500 to-emerald-500",
    },
    {
      name: "Gadgets",
      value: "gadgets" as SupplierCategory,
      icon: Cpu,
      color: "from-purple-500 to-pink-500",
    },
    {
      name: "Home Cleaning",
      value: "home-cleaning" as SupplierCategory,
      icon: Sparkles,
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2 sm:gap-3 md:flex-nowrap md:overflow-x-auto md:pb-2 md:scrollbar-hide">
        {categories.map((category) => {
          const isActive = activeTab === category.value;
          const supplierCount =
            category.value === "all"
              ? suppliers.length
              : suppliers.filter((s) => s.category === category.value).length;

          const Icon = category.icon;

          return (
            <button
              key={category.value}
              onClick={() => setActiveTab(category.value)}
              className={`
                relative shrink-0 px-3 py-2 sm:px-4 rounded-lg transition-all duration-200 overflow-hidden
                min-w-fit flex items-center gap-1 sm:gap-2
                ${
                  isActive
                    ? `${suppliersTableStyles.tabActive} shadow-lg`
                    : suppliersTableStyles.tabInactive
                }
              `}
            >
              <div
                className={`${suppliersTableStyles.tabGradient} ${
                  isActive ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  background: isActive
                    ? `linear-gradient(to right, ${category.color})`
                    : "none",
                }}
              ></div>

              <div className={suppliersTableStyles.tabContent}>
                <div className="flex items-center">
                  <Icon className="w-4 h-4 mr-1 sm:mr-2" />
                  <span className="text-xs sm:text-sm">{category.name}</span>
                </div>
                <span
                  className={`${suppliersTableStyles.tabBadge} ${
                    isActive
                      ? suppliersTableStyles.tabBadgeActive
                      : suppliersTableStyles.tabBadgeInactive
                  }`}
                >
                  {supplierCount}
                </span>
              </div>

              {isActive && (
                <div className={suppliersTableStyles.tabIndicator}></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
