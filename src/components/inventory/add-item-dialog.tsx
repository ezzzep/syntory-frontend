"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { InventoryItem } from "@/types/inventory";
import {
  Plus,
  Package,
  Building,
  User,
  FileText,
  Info,
  PhilippinePeso,
} from "lucide-react";
import { SelectFive } from "@/components/ui/select";
import { useAddItemDialog } from "@/hooks/useAddItemDialog";
import { addItemDialogStyles } from "@/styles/inventory/addItemDialogStyles";

interface AddItemDialogProps {
  onAdd: (item: InventoryItem) => void;
}

const capitalizeFirstLetter = (str: string | null | undefined) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};


export default function AddItemDialog({ onAdd }: AddItemDialogProps) {
  const {
    loading,
    open,
    suppliers,
    suppliersLoading,
    errors,
    form,
    priceInput,
    setOpen,
    calculateTotalQuantityValue,
    handleSubmit,
    handleInputChange,
    handleQuantityChange,
    handleSupplierChange,
    handlePriceChange,
    handlePriceBlur,
    formatPrice,
  } = useAddItemDialog(onAdd);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={addItemDialogStyles.dialogTrigger}>
          <span className={addItemDialogStyles.dialogTriggerSpan}></span>
          <Plus className="w-4 h-4 mr-2 relative z-10" />
          <span className="relative z-10">Add Item</span>
        </Button>
      </DialogTrigger>

      <DialogPrimitive.Title className="sr-only">
        Add Inventory Item
      </DialogPrimitive.Title>

      <DialogContent className={addItemDialogStyles.dialogContent}>
        <div className={addItemDialogStyles.dialogHeader}>
          <DialogHeader>
            <DialogTitle className={addItemDialogStyles.dialogTitle}>
              Add Inventory Item
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className={addItemDialogStyles.formContainer}>
          <div className={addItemDialogStyles.formField}>
            <label className={addItemDialogStyles.label}>
              <Package className="w-4 h-4 mr-2" />
              Item Name
            </label>
            <Input
              placeholder="Enter item name"
              value={form.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={addItemDialogStyles.input}
            />
            {errors.name && (
              <p className={addItemDialogStyles.error}>{errors.name}</p>
            )}
          </div>

          <div className={addItemDialogStyles.formRow}>
            <div className={addItemDialogStyles.formField}>
              <label className={addItemDialogStyles.label}>
                <PhilippinePeso className="w-4 h-4 mr-2" />
                Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  ₱
                </span>
                <Input
                  type="text"
                  placeholder="0.00"
                  value={priceInput}
                  onChange={(e) => handlePriceChange(e.target.value)}
                  onBlur={handlePriceBlur}
                  inputMode="decimal"
                  className={`${addItemDialogStyles.input} pl-8`}
                />
              </div>
              
              {priceInput && form.quantity > 0 && (
                <div className="mt-1 text-xs text-gray-400">
                  Total value: ₱{formatPrice(calculateTotalQuantityValue())}
                </div>
              )}

              {errors.price && (
                <p className={addItemDialogStyles.error}>{errors.price}</p>
              )}
            </div>

            <div className={addItemDialogStyles.formField}>
              <label className={addItemDialogStyles.label}>
                <Package className="w-4 h-4 mr-2" />
                Quantity
              </label>
              <Input
                type="number"
                placeholder="0"
                value={form.quantity === 0 ? "" : form.quantity}
                onChange={(e) => handleQuantityChange(e.target.value)}
                className={addItemDialogStyles.input}
              />
              {errors.quantity && (
                <p className={addItemDialogStyles.error}>{errors.quantity}</p>
              )}
            </div>
          </div>

          <div className={addItemDialogStyles.formField}>
            <label className={addItemDialogStyles.label}>
              <User className="w-4 h-4 mr-2" />
              Supplier
            </label>
            <SelectFive
              value={form.supplier_name || ""}
              onChange={(v) => handleSupplierChange(v || "")}
              options={suppliers.map((s) => ({
                label: s.name,
                value: s.name,
              }))}
              placeholder={
                suppliersLoading ? "Loading suppliers..." : "Select Supplier"
              }
              disabled={suppliersLoading}
              searchable
            />
            {form.supplier_name && (
              <div className="mt-2 bg-blue-600/10 border border-blue-600/30 rounded-md p-2">
                <span className="text-sm text-blue-300">
                  Item will be added to {form.supplier_name}`s details
                </span>
              </div>
            )}
          </div>

          <div className={addItemDialogStyles.formField}>
            <label className={addItemDialogStyles.label}>
              <Building className="w-4 h-4 mr-2" />
              Category
            </label>
            <div className="relative">
              <Input
                value={capitalizeFirstLetter(form.category)}
                readOnly
                disabled
                placeholder={
                  form.supplier_name
                    ? "Auto-set from supplier"
                    : "Select a supplier first"
                }
                className={`${
                  form.supplier_name
                    ? "bg-slate-700/50 text-slate-300 w-full cursor-not-allowed placeholder:text-slate-400"
                    : "bg-slate-700/50 text-slate-300 w-full cursor-not-allowed placeholder:text-slate-400"
                }`}
              />
              {form.supplier_name && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <Info className="w-4 h-4 text-blue-400" />
                </div>
              )}
            </div>
            {form.supplier_name && (
              <p className="text-xs text-blue-400 mt-1">
                Category automatically set from supplier.
              </p>
            )}
            {errors.category && (
              <p className={addItemDialogStyles.error}>{errors.category}</p>
            )}
          </div>

          <div className={addItemDialogStyles.formField}>
            <label className={addItemDialogStyles.label}>
              <FileText className="w-4 h-4 mr-2" />
              Description
            </label>
            <textarea
              placeholder="Item description"
              value={form.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className={addItemDialogStyles.textarea}
            />
          </div>
        </div>

        <div className={addItemDialogStyles.footer}>
          <Button
            variant="outline"
            className={addItemDialogStyles.cancelButton}
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            className={addItemDialogStyles.saveButton}
            onClick={handleSubmit}
            disabled={loading || !form.supplier_name}
          >
            {loading ? (
              <div className="flex items-center">
                <svg
                  className={addItemDialogStyles.loadingSpinner}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </div>
            ) : (
              <div className="flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Save Item
              </div>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
