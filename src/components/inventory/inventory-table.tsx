"use client";

import { useState, useMemo } from "react";
import type { InventoryItem } from "@/types/inventory";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import EditItemDialog from "./edit-item-dialog";
import AddItemDialog from "./add-item-dialog";
import ItemDetails from "./item-details";
import {
  Search,
  Package,
  Home,
  Cpu,
  Sparkles,
  Inbox,
  Trash2,
} from "lucide-react";
import { inventoryTableStyles } from "@/styles/inventoryTable";

interface InventoryTableProps {
  items: InventoryItem[];
  onDelete: (id: number) => void;
  onUpdate: (updatedItem: InventoryItem) => void;
  onAdd: (item: InventoryItem) => void;
}

export default function InventoryTable({
  items,
  onDelete,
  onUpdate,
  onAdd,
}: InventoryTableProps) {
  const categories = [
    { name: "Appliances", icon: Package, color: "from-blue-500 to-cyan-500" },
    {
      name: "Home & Living",
      icon: Home,
      color: "from-green-500 to-emerald-500",
    },
    { name: "Gadgets", icon: Cpu, color: "from-purple-500 to-pink-500" },
    {
      name: "Home Cleaning",
      icon: Sparkles,
      color: "from-orange-500 to-red-500",
    },
  ];

  const [activeTab, setActiveTab] = useState(categories[0].name);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const lowQuantityCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    categories.forEach((category) => {
      counts[category.name] = items.filter(
        (item) => item.category === category.name && item.quantity < 10
      ).length;
    });

    return counts;
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory = item.category === activeTab;
      const matchesSearch =
        searchTerm === "" ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description &&
          item.description.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [items, activeTab, searchTerm]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(filteredItems.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, id]);
    } else {
      setSelectedItems((prev) => prev.filter((item) => item !== id));
    }
  };

  const isAllSelected =
    filteredItems.length > 0 && selectedItems.length === filteredItems.length;
  const isIndeterminate =
    selectedItems.length > 0 && selectedItems.length < filteredItems.length;

  return (
    <div className={inventoryTableStyles.wrapper}>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className={inventoryTableStyles.searchContainer}>
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={inventoryTableStyles.searchInput}
            />
          </div>
          <AddItemDialog onAdd={onAdd} />
        </div>

        {selectedItems.length > 0 && (
          <div className={inventoryTableStyles.selectedItemsBar}>
            <span className={inventoryTableStyles.selectedCount}>
              {selectedItems.length} item{selectedItems.length > 1 ? "s" : ""}{" "}
              selected
            </span>
            <Button
              variant="outline"
              size="sm"
              className={inventoryTableStyles.button}
              onClick={() => {
                selectedItems.forEach((id) => onDelete(id));
                setSelectedItems([]);
              }}
            >
              Delete
            </Button>
          </div>
        )}
      </div>

      <div className={inventoryTableStyles.tabsContainer}>
        {categories.map((category) => {
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
                <div
                  className={inventoryTableStyles.lowQuantityIndicator}
                ></div>
              )}
            </button>
          );
        })}
      </div>

      <div className={inventoryTableStyles.desktopWrapper}>
        <Table
          className={inventoryTableStyles.table}
          style={{ tableLayout: "fixed", minWidth: "1100px" }}
        >
          <TableHeader className={inventoryTableStyles.tableHeader}>
            <TableRow>
              <TableHead
                className={inventoryTableStyles.tableHeadCell}
                style={{ width: "60px" }}
              >
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = isIndeterminate;
                  }}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className={`${inventoryTableStyles.checkbox} ${
                    isAllSelected ? inventoryTableStyles.checkboxChecked : ""
                  }`}
                />
              </TableHead>
              <TableHead
                className={inventoryTableStyles.tableHeadCell}
                style={{ width: "250px" }}
              >
                Name
              </TableHead>
              <TableHead
                className={inventoryTableStyles.tableHeadCell}
                style={{ width: "180px" }}
              >
                Category
              </TableHead>
              <TableHead
                className={inventoryTableStyles.tableHeadCell}
                style={{ width: "120px" }}
              >
                Quantity
              </TableHead>
              <TableHead
                className={inventoryTableStyles.tableHeadCell}
                style={{ width: "300px" }}
              >
                Description
              </TableHead>
              <TableHead
                className={inventoryTableStyles.tableHeadCell}
                style={{ width: "180px" }}
              >
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredItems.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className={inventoryTableStyles.emptyState}
                >
                  <Inbox className={inventoryTableStyles.emptyStateIcon} />
                  <p className="text-lg font-medium mb-2">
                    {searchTerm
                      ? "No items found matching your search."
                      : "No items found in this category."}
                  </p>
                  <p className="text-sm">
                    {searchTerm
                      ? "Try adjusting your search terms."
                      : "Items will appear here once added."}
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((item) => (
                <TableRow
                  key={item.id}
                  className={`${inventoryTableStyles.tableRowHover} ${
                    selectedItems.includes(item.id) ? "bg-slate-700/10" : ""
                  }`}
                >
                  <TableCell className={inventoryTableStyles.tableCell}>
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={(e) =>
                        handleSelectItem(item.id, e.target.checked)
                      }
                      className={`${inventoryTableStyles.checkbox} ${
                        selectedItems.includes(item.id)
                          ? inventoryTableStyles.checkboxChecked
                          : ""
                      }`}
                    />
                  </TableCell>
                  <TableCell className={inventoryTableStyles.tableCellName}>
                    <ItemDetails item={item}>
                      <span className="cursor-pointer hover:text-blue-300 transition-colors truncate block">
                        {item.name}
                      </span>
                    </ItemDetails>
                  </TableCell>

                  <TableCell className={inventoryTableStyles.tableCell}>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-700/30 text-slate-300 border border-slate-600/30 truncate">
                      {item.category ?? "-"}
                    </span>
                  </TableCell>

                  <TableCell className={inventoryTableStyles.tableCell}>
                    <div className="flex items-center gap-2">
                      <span className={inventoryTableStyles.quantityNumber}>
                        {item.quantity}
                      </span>
                      {item.quantity < 10 && (
                        <div
                          className={inventoryTableStyles.quantityLowIndicator}
                        ></div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell
                    className={inventoryTableStyles.tableCellDescription}
                    title={item.description || ""}
                  >
                    {item.description ?? "-"}
                  </TableCell>

                  <TableCell className={inventoryTableStyles.actionCell}>
                    <EditItemDialog item={item} onUpdate={onUpdate} />
                    <Button
                      variant="outline"
                      size="sm"
                      className={inventoryTableStyles.button}
                      onClick={() => onDelete(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="sm:hidden flex flex-col gap-4">
        {filteredItems.length === 0 ? (
          <div className={inventoryTableStyles.emptyState}>
            <Inbox className={inventoryTableStyles.emptyStateIcon} />
            <p className="text-lg font-medium mb-2">
              {searchTerm
                ? "No items found matching your search."
                : "No items found in this category."}
            </p>
            <p className="text-sm">
              {searchTerm
                ? "Try adjusting your search terms."
                : "Items will appear here once added."}
            </p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className={`${inventoryTableStyles.mobileCard} ${
                selectedItems.includes(item.id) ? "ring-2 ring-blue-500/50" : ""
              }`}
            >
              <div className="flex items-start gap-3 mb-4">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                  className={`${inventoryTableStyles.checkbox} mt-1 ${
                    selectedItems.includes(item.id)
                      ? inventoryTableStyles.checkboxChecked
                      : ""
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <ItemDetails item={item}>
                    <span className="font-medium text-white cursor-pointer hover:text-blue-300 transition-colors truncate block">
                      {item.name}
                    </span>
                  </ItemDetails>
                </div>
                <div className="flex items-center gap-2">
                  <span className={inventoryTableStyles.quantityNumber}>
                    {item.quantity}
                  </span>
                  {item.quantity < 10 && (
                    <div
                      className={inventoryTableStyles.quantityLowIndicator}
                    ></div>
                  )}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div>
                  <span className={inventoryTableStyles.mobileLabel}>
                    Category:{" "}
                  </span>
                  <span className={inventoryTableStyles.mobileValueSecondary}>
                    {item.category ?? "-"}
                  </span>
                </div>
                <div>
                  <span className={inventoryTableStyles.mobileLabel}>
                    Description:{" "}
                  </span>
                  <span
                    className={inventoryTableStyles.mobileValueSecondary}
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {item.description ?? "-"}
                  </span>
                </div>
              </div>

              <div className={inventoryTableStyles.mobileActions}>
                <EditItemDialog item={item} onUpdate={onUpdate} />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(item.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
