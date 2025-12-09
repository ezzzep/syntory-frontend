"use client";

import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { suppliersTableStyles } from "@/styles/supplierStatus/supplierTable";
import AddSupplierDialog from "../addSupplier";
import { Supplier } from "@/types/supplier";

interface SearchAndActionsProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedSuppliers: number[];
  onBulkDelete: () => void;
  isDeleting: boolean;
  onAdd: (supplier: Supplier) => void;
}

export default function SearchAndActions({
  searchTerm,
  setSearchTerm,
  selectedSuppliers,
  onBulkDelete,
  isDeleting,
  onAdd,
}: SearchAndActionsProps) {
  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
          <div className="relative flex-1 w-full sm:max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search suppliers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={suppliersTableStyles.searchInput}
            />
          </div>

          {selectedSuppliers.length > 0 && (
            <div className="flex items-center gap-3 bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2">
              <span className={suppliersTableStyles.selectedCount}>
                {selectedSuppliers.length} supplier
                {selectedSuppliers.length > 1 ? "s" : ""} selected
              </span>
              <Button
                variant="outline"
                size="sm"
                className={suppliersTableStyles.trashButton}
                onClick={onBulkDelete}
                disabled={isDeleting}
              >
                Delete
              </Button>
            </div>
          )}
        </div>

        <AddSupplierDialog onAdd={onAdd} />
      </div>
    </div>
  );
}
