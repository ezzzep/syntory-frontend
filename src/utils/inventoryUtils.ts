// utils/inventoryUtils.ts
import type { InventoryItem } from "@/types/inventory";

export const calculateLowQuantityCounts = (
  items: InventoryItem[],
  categories: Array<{ name: string }>
): Record<string, number> => {
  const counts: Record<string, number> = {};

  categories.forEach((category) => {
    counts[category.name] = items.filter(
      (item) => item.category === category.name && item.quantity < 10
    ).length;
  });

  return counts;
};

export const filterItems = (
  items: InventoryItem[],
  activeTab: string,
  searchTerm: string
): InventoryItem[] => {
  return items.filter((item) => {
    const matchesCategory = item.category === activeTab;
    const matchesSearch =
      searchTerm === "" ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description &&
        item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });
};
