"use client";

import { useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToasts } from "@/components/toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import type { InventoryItem, CreateInventoryDto } from "@/types/inventory";
import { createInventoryItem } from "@/lib/api/inventory";

interface AddItemDialogProps {
  onAdd: (item: InventoryItem) => void;
}

export default function AddItemDialog({ onAdd }: AddItemDialogProps) {
  const toasts = useToasts();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState<CreateInventoryDto>({
    name: "",
    category: "",
    quantity: 0,
    description: "",
  });

  const categories = [
    "Gadgets",
    "Home & Living",
    "Appliances",
    "Home Cleaning",
  ];

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

      setForm({ name: "", category: "", quantity: 0, description: "" });
      setOpen(false);
    } catch (error) {
      console.error(error);
      toasts.error("Failed to save item");
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gray-500 cursor-pointer">Add Item</Button>
      </DialogTrigger>

      <DialogPrimitive.Title className="sr-only">
        Add Inventory Item
      </DialogPrimitive.Title>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-gray-400 text-2xl">
            Add Inventory Item
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            <Input
              placeholder="Name"
              value={form.name ?? ""}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full md:flex-1 bg-gray-600 placeholder:text-gray-400 text-white"
            />

            <Input
              type="number"
              placeholder="Quantity"
              value={form.quantity}
              onChange={(e) =>
                setForm({ ...form, quantity: Number(e.target.value) })
              }
              className="w-full md:w-32 bg-gray-600 text-white"
            />
          </div>

          <select
            className="w-full border rounded-md p-3 bg-gray-600 text-white cursor-pointer"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option value="" disabled>
              Select Category
            </option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full h-32 p-3 bg-gray-600 text-white placeholder:text-gray-400 rounded-lg resize-none"
          />
        </div>

        <Button
          className="w-full mt-6 bg-blue-900 hover:bg-blue-800 cursor-pointer"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Item"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
