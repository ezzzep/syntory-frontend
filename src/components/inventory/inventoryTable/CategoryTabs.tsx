import { CATEGORIES } from "@/constants/categories";
import { inventoryTableStyles } from "@/styles/inventory/inventoryTable";
import type { InventoryItem } from "@/types/inventory";

interface CategoryTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  items: InventoryItem[];
  lowQuantityCounts: Record<string, number>;
}

export default function CategoryTabs({
  activeTab,
  setActiveTab,
  items,
  lowQuantityCounts,
}: CategoryTabsProps) {
  return (
    <div className={inventoryTableStyles.tabsContainer}>
      {CATEGORIES.map((category) => {
        const Icon = category.icon;
        const isActive = activeTab === category.name;
        const itemCount = items.filter(
          (i) => i.category === category.name
        ).length;
        const lowItemCount = lowQuantityCounts[category.name] || 0;

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
            ></div>

            <div className={inventoryTableStyles.tabContent}>
              <Icon className="w-4 h-4" />
              <span>{category.name}</span>
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
