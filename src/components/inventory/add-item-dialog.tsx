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

import type { InventoryItem, CreateInventoryDto } from "@/types/inventory";
import type { Supplier } from "@/types/supplier";
import { createInventoryItem } from "@/lib/api/inventory";
import { getSuppliers } from "@/lib/api/suppliers";
import { Plus } from "lucide-react";
import { SelectFive } from "@/components/ui/select";

interface AddItemDialogProps {
  onAdd: (item: InventoryItem) => void;
}

export default function AddItemDialog({ onAdd }: AddItemDialogProps) {
  const toasts = useToasts();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [suppliersLoading, setSuppliersLoading] = useState(false);

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

  const handleSubmit = async () => {
    if (!form.name || !form.category || form.quantity <= 0) {
      toasts.warning("Please fill in all required fields");
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

      setOpen(false);
    } catch (error) {
      toasts.error("Failed to save item");
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 cursor-pointer transition-all duration-300 shadow-lg shadow-blue-500/20 rounded-lg px-4 py-2 text-sm font-medium">
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </DialogTrigger>

      <DialogPrimitive.Title className="sr-only">
        Add Inventory Item
      </DialogPrimitive.Title>

      <DialogContent className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl text-white border border-slate-700/50 rounded-2xl shadow-2xl max-w-lg">
        <div className="pb-4 border-b border-slate-700/30">
          <DialogHeader>
            <div className="text-xl font-semibold text-white">
              <DialogTitle>Add Inventory Item</DialogTitle>
            </div>
          </DialogHeader>
        </div>

        <div className="space-y-6 pt-2">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-300">Name</label>
              <Input
                placeholder="Item name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 border border-slate-600/40 text-white placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-300">
                Quantity
              </label>
              <Input
                type="number"
                placeholder="0"
                value={form.quantity}
                onChange={(e) =>
                  setForm({ ...form, quantity: Number(e.target.value) })
                }
                className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 border border-slate-600/40 text-white placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-blue-300">
              Category
            </label>
            <SelectFive
              value={form.category}
              onChange={(v) => setForm({ ...form, category: v })}
              options={categories.map((c) => ({ label: c, value: c }))}
              placeholder="Select Category"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-blue-300">
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
              searchable={true}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-blue-300">
              Description
            </label>
            <textarea
              placeholder="Item description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full h-32 p-3 bg-gradient-to-r from-slate-700/50 to-slate-800/50 text-white rounded-lg border border-slate-600/40 resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6 pt-4 border-t border-slate-700/30">
          <Button
            variant="outline"
            className="flex-1 bg-transparent border border-slate-600/50 text-slate-300 hover:text-white hover:bg-slate-700/30 cursor-pointer"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/20 cursor-pointer"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Item"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
