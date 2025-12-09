"use client";

import { type Supplier, type SupplierCategory } from "@/types/supplier";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Calendar, Trash2, Star } from "lucide-react";
import { suppliersTableStyles } from "@/styles/supplierStatus/supplierTable";
import StarRating from "./starRating";

interface SupplierCardProps {
  supplier: Supplier;
  isSelected: boolean;
  onSelect: (id: number, checked: boolean) => void;
  onDeleteClick: (supplier: Supplier) => void;
  onOpenRatingModal: (supplier: Supplier) => void;
  isDeleting: boolean;
}

export default function SupplierCard({
  supplier,
  isSelected,
  onSelect,
  onDeleteClick,
  onOpenRatingModal,
  isDeleting,
}: SupplierCardProps) {
  const getCategoryColor = (category: SupplierCategory) => {
    switch (category) {
      case "appliances":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "home-living":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "gadgets":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "home-cleaning":
        return "bg-orange-500/20 text-orange-300 border-orange-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  return (
    <div
      className={`${suppliersTableStyles.mobileCard} ${
        isSelected ? "ring-2 ring-blue-500/50" : ""
      }`}
    >
      <div className="flex items-start gap-3 mb-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(supplier.id, e.target.checked)}
          className={`${suppliersTableStyles.checkbox} mt-1 ${
            isSelected ? suppliersTableStyles.checkboxChecked : ""
          }`}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold mr-3">
              {supplier.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-white truncate">
                {supplier.name}
              </div>
              <div className="text-xs text-gray-400 truncate">
                {supplier.contact_person}
              </div>
            </div>
          </div>
        </div>
        <span
          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border flex-shrink-0 ${getCategoryColor(
            supplier.category
          )}`}
        >
          {supplier.category.charAt(0).toUpperCase() +
            supplier.category.slice(1)}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div>
          <div className="flex items-center text-sm text-gray-300 mb-1">
            <Mail className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
            <span className="truncate">{supplier.email}</span>
          </div>
          <div className="flex items-center text-sm text-gray-300">
            <Phone className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
            <span className="truncate">{supplier.phone}</span>
          </div>
        </div>
        <div className="flex items-center text-sm text-gray-300">
          <Calendar className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
          <span>{supplier.last_delivery}</span>
        </div>
        <div className="flex items-center">
          <StarRating rating={supplier.rating} />
        </div>
      </div>

      <div className={suppliersTableStyles.mobileActions}>
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
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
