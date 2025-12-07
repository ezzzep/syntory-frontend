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
import { useToasts } from "@/components/ui/toast";
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
          className={`bg-transparent border border-blue-500/40 text-blue-300 hover:bg-blue-600/50 hover:text-blue-200 hover:border-blue-500/60 hover:shadow-lg hover:shadow-blue-500/20 cursor-pointer transition-all duration-300 rounded-lg px-3 py-1.5 text-sm ${className}`}
        >
          <Edit className="w-4 h-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl text-white border border-slate-700/50 rounded-2xl shadow-2xl max-w-lg">
        <div className="pb-4 border-b border-slate-700/30">
          <DialogHeader>
            <div className="text-xl font-semibold text-white">
              <DialogTitle>Edit Inventory Item</DialogTitle>
            </div>
          </DialogHeader>
        </div>

        <div className="space-y-6 pt-2">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-300">Name</label>
              <Input
                placeholder="Item name"
                value={form.name ?? ""}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 border border-slate-600/40 text-white placeholder:text-slate-400 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-300">
                Quantity
              </label>
              <Input
                type="number"
                placeholder="0"
                value={form.quantity ?? 0}
                onChange={(e) =>
                  setForm({ ...form, quantity: Number(e.target.value) })
                }
                className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 border border-slate-600/40 text-white placeholder:text-slate-400 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-blue-300">
              Category
            </label>
            <select
              className="w-full border rounded-lg p-3 bg-gradient-to-r from-slate-700/50 to-slate-800/50 text-white border-slate-600/40 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 cursor-pointer transition-all duration-300"
              value={form.category ?? ""}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
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
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-blue-300">
              Description
            </label>
            <textarea
              placeholder="Item description"
              value={form.description ?? ""}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full h-32 p-3 bg-gradient-to-r from-slate-700/50 to-slate-800/50 text-white placeholder:text-slate-400 rounded-lg border border-slate-600/40 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 resize-none transition-all duration-300"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6 pt-4 border-t border-slate-700/30">
          <Button
            variant="outline"
            className="flex-1 bg-transparent border border-slate-600/50 text-slate-300 hover:bg-slate-700/30 hover:text-white cursor-pointer transition-all duration-300"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 cursor-pointer transition-all duration-300 shadow-lg shadow-blue-500/20"
            onClick={handleUpdate}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Item"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
