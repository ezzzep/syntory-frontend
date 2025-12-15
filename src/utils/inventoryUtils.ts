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
    const matchesCategory = activeTab === "all" || item.category === activeTab;

    const matchesSearch =
      searchTerm === "" ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description &&
        item.description.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesCategory && matchesSearch;
  });
};

export const formatPrice = (value: number | undefined | null): string => {
  if (value === undefined || value === null) return "0.00";

  const numValue = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(numValue)) return "0.00";

  return numValue.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true,
  });
};

export const formatPriceWithoutDecimals = (
  value: number | undefined | null
): string => {
  if (value === undefined || value === null) return "0";

  const numValue = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(numValue)) return "0";

  return numValue.toLocaleString("en-US", {
    useGrouping: true,
  });
};

export const calculateTotalValue = (price: number, quantity: number) => {
  return price * quantity;
};

export const formatTotalValue = (price: number, quantity: number) => {
  const totalValue = calculateTotalValue(price, quantity);
  return formatPrice(totalValue);
};

export const getFullImageUrl = (path: string | null | undefined) => {
  if (!path) return "";

  if (path.startsWith("http")) {
    return path;
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const cleanBaseUrl = baseUrl.replace(/\/$/, "");
  const cleanPath = path.replace(/^\//, "");

  return `${cleanBaseUrl}/storage/${cleanPath}`;
};

export const getStockStatus = (quantity: number) => {
  if (quantity === 0) {
    return { status: "Out of Stock", color: "text-red-500" };
  } else if (quantity < 10) {
    return { status: "Very Low Stock", color: "text-red-400" };
  } else if (quantity <= 20) {
    return { status: "Low Stock", color: "text-yellow-400" };
  } else {
    return { status: "High Stock", color: "text-green-400" };
  }
};

export const formatCategory = (category: string) => {
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
