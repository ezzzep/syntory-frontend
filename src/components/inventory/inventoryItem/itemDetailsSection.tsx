import {
  Edit,
  Save,
  X,
  Tag,
  Building,
  PhilippinePeso,
  CircleCheckBig,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { InventoryItem, DetailsUpdate } from "@/types/inventory";
import {
  formatCategory,
  formatPrice,
  formatTotalValue,
} from "@/utils/inventoryUtils";

interface ItemDetailsSectionProps {
  item: InventoryItem;
  editSection: string | null;
  formData: DetailsUpdate;
  isSaving: boolean;
  categories: string[];
  priceInput: string;
  additionalQuantity: string;
  startEditing: (section: string) => void;
  cancelEditing: () => void;
  saveChanges: () => void;
  handleInputChange: (field: string, value: string | number) => void;
  handlePriceChange: (value: string) => void;
  handlePriceBlur: () => void;
}

export const ItemDetailsSection = ({
  item,
  editSection,
  formData,
  isSaving,
  categories,
  priceInput,
  additionalQuantity,
  startEditing,
  cancelEditing,
  saveChanges,
  handleInputChange,
  handlePriceChange,
  handlePriceBlur,
}: ItemDetailsSectionProps) => {
  return (
    <div className="bg-linear-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <Tag className="mr-2 h-5 w-5 text-blue-400" />
          Item Details
        </h2>
        {editSection !== "details" ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => startEditing("details")}
            className="text-blue-400 hover:text-blue-300 hover:bg-slate-700/50 cursor-pointer"
          >
            <Edit className="h-4 w-4" />
          </Button>
        ) : (
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={saveChanges}
              disabled={isSaving}
              className="text-green-400 hover:text-green-300 hover:bg-slate-700/50 cursor-pointer"
            >
              <Save className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={cancelEditing}
              className="text-red-400 hover:text-red-300 hover:bg-slate-700/50 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      <div className="space-y-4">
        <div className="flex items-start">
          <Tag className="h-5 w-5 text-blue-400 mr-3 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-white/60">Category</p>
            {editSection === "details" ? (
              <select
                value={formData.category || ""}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className="w-full p-2 bg-slate-700/50 border border-slate-600/40 text-white rounded cursor-pointer"
              >
                <option value="" disabled className="bg-slate-800">
                  Select Category
                </option>
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="bg-slate-800">
                    {cat}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-white">
                {item.category ? formatCategory(item.category) : "No category"}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center">
          <PhilippinePeso className="h-5 w-5 text-blue-400 mr-3" />
          <div className="flex-1">
            <p className="text-sm text-white/60">Price</p>
            {editSection === "details" ? (
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                  ₱
                </span>
                <Input
                  type="text"
                  value={priceInput}
                  onChange={(e) => handlePriceChange(e.target.value)}
                  onBlur={handlePriceBlur}
                  className="pl-10 bg-slate-700/50 border border-slate-600/40 text-white"
                  placeholder="0.00"
                />
              </div>
            ) : (
              <p className="text-white">
                ₱ {item.price !== undefined ? formatPrice(item.price) : "0.00"}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center">
          <CircleCheckBig className="h-5 w-5 text-blue-400 mr-3" />
          <div className="flex-1">
            <p className="text-sm text-white/60 ">Total Value</p>
            <p className="text-white">
              ₱{" "}
              {formatTotalValue(
                item.price,
                editSection === "stock"
                  ? item.quantity + (parseInt(additionalQuantity) || 0)
                  : item.quantity
              )}
            </p>
          </div>
        </div>
        <div className="flex items-start">
          <Building className="h-5 w-5 text-blue-400 mr-3 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-white/60">Supplier Name</p>
            <p className="text-white">
              {item.supplier_name ? item.supplier_name : "No supplier"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
