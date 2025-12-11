"use client";

import { useState, useEffect } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToasts } from "@/components/ui/toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { z } from "zod";

import type { InventoryItem, CreateInventoryDto } from "@/types/inventory";
import type { Supplier } from "@/types/supplier";
import { createInventoryItem } from "@/lib/api/inventory";
import { getSuppliers } from "@/lib/api/suppliers";
import { Plus, Package, Building, User, FileText } from "lucide-react";
import { SelectFive } from "@/components/ui/select";

// Define the schema for form validation
const inventorySchema = z.object({
  name: z.string().min(1, "Item name is required"),
  category: z.string().min(1, "Category is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  description: z.string().optional(),
  supplier_name: z.string().optional(),
});

interface AddItemDialogProps {
  onAdd: (item: InventoryItem) => void;
}

export default function AddItemDialog({ onAdd }: AddItemDialogProps) {
  const toasts = useToasts();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [suppliersLoading, setSuppliersLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState<
    CreateInventoryDto & { supplier_name?: string }
  >({
    name: "",
    category: "",
    quantity: 0,
    description: "",
    supplier_name: "",
  });

  const categories = [
    "Appliances",
    "Home & Living",
    "Gadgets",
    "Home Cleaning",
  ];

  useEffect(() => {
    if (open && suppliers.length === 0) fetchSuppliersList();
  }, [open]);

  const fetchSuppliersList = async () => {
    try {
      setSuppliersLoading(true);
      const suppliersData = await getSuppliers();
      setSuppliers(suppliersData);
    } catch (error) {
      toasts.error("Failed to load suppliers");
    } finally {
      setSuppliersLoading(false);
    }
  };

  const validateForm = () => {
    try {
      inventorySchema.parse(form);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          if (err.path.length > 0) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const newItem = await createInventoryItem(form);
      onAdd(newItem);

      toasts.success(`${form.name} added successfully`);

      setForm({
        name: "",
        category: "",
        quantity: 0,
        description: "",
        supplier_name: "",
      });

      setErrors({});
      setOpen(false);
    } catch (error) {
      toasts.error("Failed to save item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg shadow-blue-500/20 rounded-lg px-4 py-2 text-sm font-medium cursor-pointer">
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
          <Plus className="w-4 h-4 mr-2 relative z-10" />
          <span className="relative z-10">Add Item</span>
        </Button>
      </DialogTrigger>

      <DialogPrimitive.Title className="sr-only">
        Add Inventory Item
      </DialogPrimitive.Title>

      <DialogContent className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-xl text-white border border-slate-700/50 rounded-2xl shadow-2xl w-[95%] max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="relative pb-6 border-b border-slate-700/30">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Add Inventory Item
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-blue-300">
                <Package className="w-4 h-4 mr-2" />
                Item Name
              </label>
              <Input
                placeholder="Enter item name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full h-12 border-slate-600/40 bg-slate-700/30 text-white placeholder:text-slate-400 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 rounded-lg cursor-text"
              />
              {errors.name && (
                <p className="text-red-400 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-blue-300">
                <Package className="w-4 h-4 mr-2" />
                Quantity
              </label>
              <Input
                type="number"
                placeholder="0"
                value={form.quantity}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === "") {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    setForm({ ...form, quantity: "" as any });
                    return;
                  }
                  if (/^\d+$/.test(v)) {
                    setForm({ ...form, quantity: Number(v) });
                  }
                }}
                className="w-full h-12 border-slate-600/40 bg-slate-700/30 text-white placeholder:text-slate-400 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 rounded-lg cursor-text"
              />
              {errors.quantity && (
                <p className="text-red-400 text-sm mt-1">{errors.quantity}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-blue-300">
              <Building className="w-4 h-4 mr-2" />
              Category
            </label>
            <SelectFive
              value={form.category}
              onChange={(v) => setForm({ ...form, category: v })}
              options={categories.map((c) => ({ label: c, value: c }))}
              placeholder="Select Category"
            />
            {errors.category && (
              <p className="text-red-400 text-sm mt-1">{errors.category}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-blue-300">
              <User className="w-4 h-4 mr-2" />
              Supplier
            </label>
            <SelectFive
              value={form.supplier_name || ""}
              onChange={(v) => setForm({ ...form, supplier_name: v || "" })}
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

          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-blue-300">
              <FileText className="w-4 h-4 mr-2" />
              Description
            </label>
            <textarea
              placeholder="Item description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full h-20 p-3 bg-slate-700/30 text-white rounded-lg border border-slate-600/40 resize-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-8 pt-1 border-t border-slate-700/30">
          <Button
            variant="outline"
            className="flex-1 h-12 border-slate-600/50 bg-transparent text-slate-300 hover:bg-slate-700/30 hover:text-white transition-all duration-200 rounded-lg cursor-pointer"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/20 transition-all duration-200 rounded-lg cursor-pointer"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
