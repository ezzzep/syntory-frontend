import { CATEGORIES } from "@/constants/categories";
import { inventoryTableStyles } from "@/styles/inventory/inventoryTable";
import type { InventoryItem } from "@/types/inventory";
import { Grid3X3 } from "lucide-react";

interface CategoryTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  items: InventoryItem[];
  lowQuantityCounts: Record<string, number>;
  allItemsCount?: number;
}

export default function CategoryTabs({
  activeTab,
  setActiveTab,
  items,
  lowQuantityCounts,
  allItemsCount,
}: CategoryTabsProps) {
  const allCategory = {
    name: "all",
    icon: Grid3X3,
    color: "from-blue-500 to-cyan-500",
  };
  const allCategories = [allCategory, ...CATEGORIES];

  return (
    <div className={inventoryTableStyles.tabsContainer}>
      {allCategories.map((category) => {
        const Icon = category.icon;
        const isActive = activeTab === category.name;
        const itemCount =
          category.name === "all"
            ? allItemsCount || items.length
            : items.filter((i) => i.category === category.name).length;

        const lowItemCount =
          category.name === "all"
            ? Object.values(lowQuantityCounts).reduce(
                (sum, count) => sum + count,
                0
              )
            : lowQuantityCounts[category.name] || 0;

        return (
          <button
            key={category.name}
            onClick={() => setActiveTab(category.name)}
            className={`${inventoryTableStyles.tabButton} ${
              isActive
                ? inventoryTableStyles.tabActive
                : inventoryTableStyles.tabInactive
            }`}
          >
            <div
              className={`${inventoryTableStyles.tabGradient} ${
                isActive ? "opacity-100" : "opacity-0"
              }`}
              style={{
                background:
                  isActive && category.color
                    ? `linear-gradient(to right, ${category.color})`
                    : "none",
              }}
            ></div>

            <div className={inventoryTableStyles.tabContent}>
              <Icon className="w-4 h-4" />
              <span>{category.name === "all" ? "All" : category.name}</span>
              <span
                className={`${inventoryTableStyles.tabBadge} ${
                  isActive
                    ? inventoryTableStyles.tabBadgeActive
                    : inventoryTableStyles.tabBadgeInactive
                }`}
              >
                {itemCount}
              </span>
            </div>

            {isActive && (
              <div className={inventoryTableStyles.tabIndicator}></div>
            )}
            {lowItemCount > 0 && (
              <div className={inventoryTableStyles.lowQuantityIndicator}></div>
            )}
          </button>
        );
      })}
    </div>
  );
}
