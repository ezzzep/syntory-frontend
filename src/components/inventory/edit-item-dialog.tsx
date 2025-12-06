"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { InventoryItem, UpdateInventoryDto } from "@/types/inventory";
import Cookies from "js-cookie";
import { useToasts } from "@/components/toast";
import { Edit } from "lucide-react";

interface EditItemDialogProps {
  item: InventoryItem;
  onUpdate: (updatedItem: InventoryItem) => void;
  className?: string;
}

export default function EditItemDialog({
  item,
  onUpdate,
  className = "",
}: EditItemDialogProps) {
  const toast = useToasts();
  const [form, setForm] = useState<InventoryItem>(item);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const categories = [
    "Appliances",
    "Home & Living",
    "Gadgets",
    "Home Cleaning",
  ];

  const fetchCsrf = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sanctum/csrf-cookie`, {
      credentials: "include",
      headers: { Accept: "application/json" },
    });
  };

  const handleUpdate = async () => {
    setLoading(true);

    try {
      const sanitized: UpdateInventoryDto = {
        name: form.name ?? "",
        category: form.category ?? undefined,
        quantity: form.quantity ?? 0,
        description: form.description ?? undefined,
      };

      await fetchCsrf();
      const xsrf = Cookies.get("XSRF-TOKEN") ?? "";

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/inventory/${item.id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-XSRF-TOKEN": decodeURIComponent(xsrf),
          },
          body: JSON.stringify(sanitized),
        }
      );

      if (!res.ok) {
        toast.error("Update failed. Please try again.");
        return;
      }

      const updated: InventoryItem = await res.json();
      onUpdate(updated);

      toast.success(`${updated.name} has been updated.`);
      setOpen(false);
    } catch {
      toast.error("Unable to update item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`bg-transparent border border-gray-500 text-gray-300 hover:bg-blue-600 hover:text-white cursor-pointer transition-colors duration-300 rounded-md px-3 py-1 text-sm ${className}`}
        >
          <Edit className="w-4 h-4"></Edit>
        </Button>
      </DialogTrigger>

      <DialogContent className="text-white">
        <DialogHeader>
          <DialogTitle>Edit Inventory Item</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-4">
            <Input
              placeholder="Name"
              value={form.name ?? ""}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full md:flex-1 bg-gray-600 placeholder:text-gray-400 text-white"
            />
            <Input
              type="number"
              placeholder="Quantity"
              value={form.quantity ?? 0}
              onChange={(e) =>
                setForm({ ...form, quantity: Number(e.target.value) })
              }
              className="w-full md:w-32 bg-gray-600 text-white"
            />
          </div>

          <select
            className="w-full border rounded-md p-3 bg-gray-600 text-white cursor-pointer"
            value={form.category ?? ""}
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
            value={form.description ?? ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full h-32 p-3 bg-gray-600 text-white placeholder:text-gray-400 rounded-lg resize-none"
          />
        </div>

        <Button
          className="w-full mt-6 bg-blue-900 hover:bg-blue-800 cursor-pointer"
          onClick={handleUpdate}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Item"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
