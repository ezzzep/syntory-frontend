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
import { Plus, Package, Building, User, FileText } from "lucide-react";
import { SelectFive } from "@/components/ui/select";
import { useAddItemDialog } from "@/hooks/useAddItemDialog";
import { addItemDialogStyles } from "@/styles/inventory/addItemDialogStyles";

interface AddItemDialogProps {
  onAdd: (item: InventoryItem) => void;
}

export default function AddItemDialog({ onAdd }: AddItemDialogProps) {
  const {
    loading,
    open,
    suppliers,
    suppliersLoading,
    errors,
    form,
    categories,
    setOpen,
    handleSubmit,
    handleInputChange,
    handleQuantityChange,
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
          <div className={addItemDialogStyles.formRow}>
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

            <div className={addItemDialogStyles.formField}>
              <label className={addItemDialogStyles.label}>
                <Package className="w-4 h-4 mr-2" />
                Quantity
              </label>
              <Input
                type="number"
                placeholder="0"
                value={form.quantity}
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
              <Building className="w-4 h-4 mr-2" />
              Category
            </label>
            <SelectFive
              value={form.category}
              onChange={(v) => handleInputChange("category", v)}
              options={categories.map((c) => ({ label: c, value: c }))}
              placeholder="Select Category"
            />
            {errors.category && (
              <p className={addItemDialogStyles.error}>{errors.category}</p>
            )}
          </div>

          <div className={addItemDialogStyles.formField}>
            <label className={addItemDialogStyles.label}>
              <User className="w-4 h-4 mr-2" />
              Supplier
            </label>
            <SelectFive
              value={form.supplier_name || ""}
              onChange={(v) => handleInputChange("supplier_name", v || "")}
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
            disabled={loading}
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
