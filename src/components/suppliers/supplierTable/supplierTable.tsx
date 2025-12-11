"use client";

import { type Supplier, type SupplierCategory } from "@/types/supplier";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Mail, Phone, Calendar, Trash2, Star } from "lucide-react";
import Link from "next/link";
import { suppliersTableStyles } from "@/styles/supplierStatus/supplierTable";
import StarRating from "./starRating";

interface SupplierTableProps {
  suppliers: Supplier[];
  selectedSuppliers: number[];
  onSelectAll: (checked: boolean) => void;
  onSelectSupplier: (id: number, checked: boolean) => void;
  onDeleteClick: (supplier: Supplier) => void;
  onOpenRatingModal: (supplier: Supplier) => void;
  isDeleting: boolean;
  isAllSelected: boolean;
  isIndeterminate: boolean;
}

export default function SupplierTable({
  suppliers,
  selectedSuppliers,
  onSelectAll,
  onSelectSupplier,
  onDeleteClick,
  onOpenRatingModal,
  isDeleting,
  isAllSelected,
  isIndeterminate,
}: SupplierTableProps) {
  const getCategoryColor = (category: SupplierCategory) => {
    switch (category) {
      case "Appliances":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "Home & Living":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "Gadgets":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "Home Cleaning":
        return "bg-orange-500/20 text-orange-300 border-orange-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table
        className={suppliersTableStyles.table}
        style={{ tableLayout: "fixed", minWidth: "1100px" }}
      >
        <TableHeader className={suppliersTableStyles.tableHeader}>
          <TableRow>
            <TableHead
              className={suppliersTableStyles.tableHeadCell}
              style={{ width: "60px" }}
            >
              <input
                type="checkbox"
                checked={isAllSelected}
                ref={(el) => {
                  if (el) el.indeterminate = isIndeterminate;
                }}
                onChange={(e) => onSelectAll(e.target.checked)}
                className={`${suppliersTableStyles.checkbox} ${
                  isAllSelected ? suppliersTableStyles.checkboxChecked : ""
                }`}
              />
            </TableHead>
            <TableHead
              className={suppliersTableStyles.tableHeadCell}
              style={{ width: "250px" }}
            >
              Supplier
            </TableHead>
            <TableHead
              className={suppliersTableStyles.tableHeadCell}
              style={{ width: "250px" }}
            >
              Contact
            </TableHead>
            <TableHead
              className={suppliersTableStyles.tableHeadCell}
              style={{ width: "120px" }}
            >
              Category
            </TableHead>
            <TableHead
              className={suppliersTableStyles.tableHeadCell}
              style={{ width: "150px" }}
            >
              Last Delivery
            </TableHead>
            <TableHead
              className={suppliersTableStyles.tableHeadCell}
              style={{ width: "180px" }}
            >
              Rating
            </TableHead>
            <TableHead
              className={suppliersTableStyles.tableHeadCell}
              style={{ width: "180px" }}
            >
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {suppliers.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className={suppliersTableStyles.emptyState}
              >
                <p className="text-lg font-medium mb-2">No suppliers found.</p>
                <p className="text-sm">
                  Suppliers will appear here once added.
                </p>
              </TableCell>
            </TableRow>
          ) : (
            suppliers.map((supplier) => (
              <TableRow
                key={supplier.id}
                className={`${suppliersTableStyles.tableRowHover} ${
                  selectedSuppliers.includes(supplier.id)
                    ? "bg-slate-700/10"
                    : ""
                }`}
              >
                <TableCell className={suppliersTableStyles.tableCell}>
                  <input
                    type="checkbox"
                    checked={selectedSuppliers.includes(supplier.id)}
                    onChange={(e) =>
                      onSelectSupplier(supplier.id, e.target.checked)
                    }
                    className={`${suppliersTableStyles.checkbox} ${
                      selectedSuppliers.includes(supplier.id)
                        ? suppliersTableStyles.checkboxChecked
                        : ""
                    }`}
                  />
                </TableCell>
                <TableCell className={suppliersTableStyles.tableCellName}>
                  <div className="flex items-center">
                    <div>
                      <Link
                        href={`/suppliers/${supplier.id}`}
                        className="text-sm font-medium text-blue-300 hover:text-blue-400 transition-colors truncate block cursor-pointer"
                      >
                        {supplier.name}
                      </Link>
                      <div className="text-xs text-gray-400 truncate block">
                        {supplier.contact_person}
                      </div>
                    </div>
                  </div>
                </TableCell>

                <TableCell className={suppliersTableStyles.tableCell}>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-300">
                      <Mail className="h-4 w-4 mr-1 text-gray-400" />
                      <span className="truncate">{supplier.email}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-300">
                      <Phone className="h-4 w-4 mr-1 text-gray-400" />
                      <span className="truncate">{supplier.phone}</span>
                    </div>
                  </div>
                </TableCell>

                <TableCell className={suppliersTableStyles.tableCell}>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getCategoryColor(
                      supplier.category
                    )}`}
                  >
                    {supplier.category.charAt(0).toUpperCase() +
                      supplier.category.slice(1)}
                  </span>
                </TableCell>

                <TableCell className={suppliersTableStyles.tableCell}>
                  <div className="flex items-center text-sm text-gray-300">
                    <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                    {supplier.last_delivery}
                  </div>
                </TableCell>

                <TableCell className={suppliersTableStyles.tableCell}>
                  <StarRating rating={supplier.rating} />
                </TableCell>

                <TableCell className={suppliersTableStyles.actionCell}>
                  <Button
                    variant="outline"
                    size="sm"
                    className={suppliersTableStyles.starButton}
                    onClick={() => onOpenRatingModal(supplier)}
                  >
                    <Star className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={suppliersTableStyles.trashButton}
                    onClick={() => onDeleteClick(supplier)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="w-4 h-4 hover:text-red-400 cursor-pointer" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
