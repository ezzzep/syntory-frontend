import { Edit, Save, X, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { InventoryItem, StockUpdate } from "@/types/inventory";
import { getStockStatus } from "@/utils/inventoryUtils";
import { useState } from "react";

interface StockInfoSectionProps {
  item: InventoryItem;
  editSection: string | null;
  formData: StockUpdate;
  isSaving: boolean;
  additionalQuantity: string;
  startEditing: (section: string) => void;
  cancelEditing: () => void;
  saveChanges: () => void;
  handleAdditionalQuantityChange: (value: string) => void;
}

export const StockInfoSection = ({
  item,
  editSection,
  isSaving,
  additionalQuantity,
  startEditing,
  cancelEditing,
  saveChanges,
  handleAdditionalQuantityChange,
}: StockInfoSectionProps) => {
  const [quantityMode, setQuantityMode] = useState<"add" | "subtract">("add");

  const displayValue =
    additionalQuantity === ""
      ? ""
      : Math.abs(parseInt(additionalQuantity) || 0).toString();

  const handleModeChange = (mode: "add" | "subtract") => {
    setQuantityMode(mode);

    if (additionalQuantity === "") return;

    const value = Math.abs(parseInt(additionalQuantity) || 0);
    const signedValue = mode === "subtract" ? -value : value;

    handleAdditionalQuantityChange(String(signedValue));
  };

  const handleInputChange = (value: string) => {
    if (value === "") {
      handleAdditionalQuantityChange("");
      return;
    }

    if (!/^\d+$/.test(value)) return;

    const numValue = parseInt(value);
    const signedValue = quantityMode === "subtract" ? -numValue : numValue;

    handleAdditionalQuantityChange(String(signedValue));
  };

  return (
    <div className="bg-linear-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <Package className="mr-2 h-5 w-5 text-blue-400" />
          Stock Information
        </h2>

        {editSection !== "stock" ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => startEditing("stock")}
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

      <div className="space-y-5">
        {/* Current Quantity */}
        <div className="flex items-center">
          <Package className="h-5 w-5 text-blue-400 mr-3" />
          <div className="flex-1">
            <p className="text-sm text-white/60">Current Quantity</p>
            <Input
              type="number"
              value={item.quantity}
              disabled
              className="mt-1 bg-slate-700/30 border border-slate-600/40 text-white/70 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Update Quantity */}
        {editSection === "stock" && (
          <div className="flex items-center">
            <Package className="h-5 w-5 text-blue-400 mr-3" />
            <div className="flex-1">
              <p className="text-sm text-white/60">Update Quantity</p>

              {/* Mode toggle */}
              <div className="flex mt-2 mb-3">
                <div className="flex bg-slate-700/50 border border-slate-600/40 rounded-lg p-1">
                  <button
                    onClick={() => handleModeChange("add")}
                    className={`px-3 py-1 rounded-md text-sm font-medium cursor-pointer ${
                      quantityMode === "add"
                        ? "bg-blue-500 text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Add
                  </button>
                  <button
                    onClick={() => handleModeChange("subtract")}
                    className={`px-3 py-1 rounded-md text-sm font-medium cursor-pointer ${
                      quantityMode === "subtract"
                        ? "bg-red-600 text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Subtract
                  </button>
                </div>
              </div>

              <div className="flex items-center bg-slate-700/50 border border-slate-600/40 rounded-lg w-53">
                <div className="relative w-full">
                  {quantityMode === "subtract" && displayValue !== "" && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white pointer-events-none">
                      -
                    </span>
                  )}

                  <Input
                    type="text"
                    value={displayValue}
                    placeholder="0"
                    onChange={(e) => handleInputChange(e.target.value)}
                    className={`border-0 bg-transparent text-white text-center w-53 placeholder:text-gray-500 ${
                      quantityMode === "subtract" && displayValue !== ""
                        ? "pl-8"
                        : ""
                    }`}
                  />
                </div>
              </div>

              <p className="text-xs text-gray-400 mt-2">
                {quantityMode === "add"
                  ? "Adding to current stock"
                  : "Subtracting from current stock"}
              </p>
            </div>
          </div>
        )}

        {/* Status */}
        <div className="flex items-start">
          <div className="h-5 w-5 mr-3 mt-0.5"></div>
          <div className="flex-1">
            <p className="text-sm text-white/60">Status</p>
            <p className={getStockStatus(item.quantity).color}>
              {getStockStatus(item.quantity).status}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
