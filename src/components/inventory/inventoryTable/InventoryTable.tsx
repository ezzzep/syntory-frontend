"use client";

import { useState, useMemo } from "react";
import type { InventoryItem } from "@/types/inventory";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import AddItemDialog from "../add-item-dialog";
import DeleteItemModal from "../delete-modal";
import { inventoryTableStyles } from "@/styles/inventory/inventoryTable";
import { CATEGORIES } from "@/constants/categories";
import {
  calculateLowQuantityCounts,
  filterItems,
} from "@/utils/inventoryUtils";
import InventoryPagination from "./InventoryPagination";

import SearchBar from "./SearchBar";
import CategoryTabs from "./CategoryTabs";
import DesktopTableView from "./DesktopTableView";
import MobileCardView from "./MobileCardView";

interface InventoryTableProps {
  items: InventoryItem[];
  onDelete: (id: number) => void;
  onUpdate: (updatedItem: InventoryItem) => void;
  onAdd: (item: InventoryItem) => void;
}

const ROWS_PER_PAGE = 5;

export default function InventoryTable({
  items,
  onDelete,
  onUpdate,
  onAdd,
}: InventoryTableProps) {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAll, setShowAll] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<InventoryItem | null>(null);
  const [itemsToDelete, setItemsToDelete] = useState<InventoryItem[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const lowQuantityCounts = useMemo(() => {
    return calculateLowQuantityCounts(items, CATEGORIES);
  }, [items]);

  const filteredItems = useMemo(() => {
    return filterItems(items, activeTab, searchTerm);
  }, [items, activeTab, searchTerm]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredItems.length / ROWS_PER_PAGE);
  }, [filteredItems.length]);

  const paginatedItems = useMemo(() => {
    if (showAll) {
      return filteredItems;
    }
    const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
    return filteredItems.slice(startIndex, startIndex + ROWS_PER_PAGE);
  }, [filteredItems, currentPage, showAll]);

  useMemo(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(paginatedItems.map((item) => item.id));
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

  const handleDeleteClick = (item: InventoryItem) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleBulkDeleteClick = () => {
    const selectedItemsData = items.filter((item) =>
      selectedItems.includes(item.id)
    );
    setItemsToDelete(selectedItemsData);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);

    try {
      if (itemsToDelete.length > 0) {
        await Promise.all(itemsToDelete.map((item) => onDelete(item.id)));
        setSelectedItems([]);
      } else if (itemToDelete) {
        await onDelete(itemToDelete.id);
      }
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
      setItemsToDelete([]);
    } catch (error) {
      console.error("Error deleting item(s):", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedItems([]);
  };

  const handleShowAllChange = (checked: boolean) => {
    setShowAll(checked);
    if (checked) {
      setCurrentPage(1);
    }
    setSelectedItems([]);
  };

  const allItemsCount = items.length;

  return (
    <div className={inventoryTableStyles.wrapper}>
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

            {selectedItems.length > 0 && (
              <div className="flex items-center gap-3 bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2">
                <span className={inventoryTableStyles.selectedCount}>
                  {selectedItems.length} item
                  {selectedItems.length > 1 ? "s" : ""} selected
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className={inventoryTableStyles.trashButton}
                  onClick={handleBulkDeleteClick}
                  disabled={isDeleting}
                >
                  Delete
                </Button>
              </div>
            )}
          </div>

          <AddItemDialog onAdd={onAdd} />
        </div>
      </div>

      <CategoryTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        items={items}
        lowQuantityCounts={lowQuantityCounts}
        allItemsCount={allItemsCount}
      />

      <div className="flex justify-start mb-4  cursor-pointer">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="show-all-inventory"
            checked={showAll}
            onCheckedChange={handleShowAllChange}
            className=" cursor-pointer"
          />
          <label
            htmlFor="show-all-inventory"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            Show All
          </label>
        </div>
      </div>

      <DesktopTableView
        filteredItems={paginatedItems}
        selectedItems={selectedItems}
        handleSelectAll={handleSelectAll}
        handleSelectItem={handleSelectItem}
        handleDeleteClick={handleDeleteClick}
        isDeleting={isDeleting}
        searchTerm={searchTerm}
        onUpdate={onUpdate}
      />

      <MobileCardView
        filteredItems={paginatedItems}
        selectedItems={selectedItems}
        handleSelectItem={handleSelectItem}
        handleDeleteClick={handleDeleteClick}
        isDeleting={isDeleting}
        searchTerm={searchTerm}
        onUpdate={onUpdate}
      />

      {!showAll && totalPages > 1 && (
        <InventoryPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      <DeleteItemModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          if (!isDeleting) {
            setIsDeleteModalOpen(false);
            setItemToDelete(null);
            setItemsToDelete([]);
          }
        }}
        onConfirm={handleConfirmDelete}
        item={itemToDelete}
        items={itemsToDelete}
      />
    </div>
  );
}
