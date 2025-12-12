/* eslint-disable @typescript-eslint/no-explicit-any */
// components/add-item-dialog.tsx

"use client";

import { useState, useEffect } from "react";
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
import type { InventoryItem, CreateInventoryDto } from "@/types/inventory";
import type { Supplier } from "@/types/supplier"; // Import the Supplier type
import {
  Plus,
  Package,
  Building,
  User,
  FileText,
  Info,
  AlertCircle,
} from "lucide-react";
import { addItemDialogStyles } from "@/styles/inventory/addItemDialogStyles";

// Import your actual API functions
import { createInventoryItem } from "@/lib/api/inventory";
import { getSuppliers } from "@/lib/api/suppliers";

interface AddItemDialogProps {
  onAdd: (item: InventoryItem) => void;
}

export default function AddItemDialog({ onAdd }: AddItemDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suppliersLoading, setSuppliersLoading] = useState(true);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]); // Initialize as empty array
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState<CreateInventoryDto>({
    name: "",
    quantity: 0,
    supplier_name: "",
    category: "",
    description: "",
  });

  // Fetch suppliers when the component mounts
  useEffect(() => {
    const fetchSuppliersData = async () => {
      setSuppliersLoading(true);
      setFetchError(null);
      try {
        const suppliersData = await getSuppliers(); // Call the real API function
        setSuppliers(suppliersData);
      } catch (error: any) {
        console.error("Failed to fetch suppliers:", error);
        setFetchError(error.message || "Could not load suppliers.");
      } finally {
        setSuppliersLoading(false);
      }
    };
    fetchSuppliersData();
  }, []);

  const handleInputChange = (
    field: keyof CreateInventoryDto,
    value: string | number
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSupplierChange = (supplierName: string) => {
    const selectedSupplier = suppliers.find((s) => s.name === supplierName);
    setForm((prev) => ({
      ...prev,
      supplier_name: supplierName,
      category: selectedSupplier?.category || "",
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Item name is required.";
    if (form.quantity <= 0)
      newErrors.quantity = "Quantity must be greater than 0.";
    if (!form.supplier_name) newErrors.supplier_name = "Supplier is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const newItem = await createInventoryItem(form); // Call the real API function
      onAdd(newItem); // Pass the new item up to the parent
      setOpen(false);
      // Reset form
      setForm({
        name: "",
        quantity: 0,
        supplier_name: "",
        category: "",
        description: "",
      });
    } catch (error: any) {
      console.error("Failed to create item:", error);
      setErrors({ api: error.message || "An unknown error occurred." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={addItemDialogStyles.dialogTrigger}>
          <span className={addItemDialogStyles.dialogTriggerSpan}></span>
          <Plus className="w-4 h-4 mr-2 relative z-10" />
          <span className="relative z-10">Add Item</span>
        </Button>
      </DialogTrigger>

      <DialogContent className={addItemDialogStyles.dialogContent}>
        <DialogHeader>
          <DialogTitle className={addItemDialogStyles.dialogTitle}>
            Add Inventory Item
          </DialogTitle>
        </DialogHeader>

        {fetchError && (
          <div className="bg-red-900/20 border border-red-500/50 text-red-400 p-3 rounded-md flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>{fetchError}</span>
          </div>
        )}

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
                value={form.quantity === 0 ? "" : form.quantity}
                onChange={(e) =>
                  handleInputChange("quantity", parseInt(e.target.value) || 0)
                }
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
            {/* NOTE: Replace this with your actual Select component */}
            <select
              value={form.supplier_name}
              onChange={(e) => handleSupplierChange(e.target.value)}
              disabled={suppliersLoading || !!fetchError}
              className="w-full bg-slate-700/50 text-slate-300 rounded-md px-3 py-2 placeholder:text-slate-400 disabled:opacity-50"
            >
              <option value="" disabled>
                {suppliersLoading ? "Loading..." : "Select Supplier"}
              </option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
            {errors.supplier_name && (
              <p className={addItemDialogStyles.error}>
                {errors.supplier_name}
              </p>
            )}
          </div>

          <div className={addItemDialogStyles.formField}>
            <label className={addItemDialogStyles.label}>
              <Building className="w-4 h-4 mr-2" />
              Category
            </label>
            <div className="relative">
              <Input
                value={form.category}
                readOnly
                disabled
                placeholder={
                  form.supplier_name
                    ? "Auto-set from supplier"
                    : "Select a supplier first"
                }
                className={`bg-slate-700/50 text-slate-300 w-full cursor-not-allowed placeholder:text-slate-400`}
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

        {errors.api && (
          <p className="text-red-400 text-sm text-center">{errors.api}</p>
        )}

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
            disabled={loading || !form.supplier_name || !!fetchError}
          >
            {loading ? "Saving..." : "Save Item"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
