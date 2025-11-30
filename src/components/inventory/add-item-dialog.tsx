"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { InventoryItem, CreateInventoryDto } from "@/types/inventory";
import { createInventoryItem } from "@/lib/api/inventory";

interface AddItemDialogProps {
  onAdd: (item: InventoryItem) => void;
}

export default function AddItemDialog({ onAdd }: AddItemDialogProps) {
  const [form, setForm] = useState<CreateInventoryDto>({
    name: "",
    category: "",
    quantity: 0,
    description: "",
  });

  const handleSubmit = async () => {
    try {
      const newItem = await createInventoryItem(form);
      onAdd(newItem);
      setForm({ name: "", category: "", quantity: 0, description: "" });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Failed to create item:", error.message);
        alert(`Failed to create item: ${error.message}`);
      } else {
        console.error("Failed to create item:", error);
        alert("Failed to create item. See console for details.");
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-gray-500 cursor-pointer">Add Item</Button>
      </DialogTrigger>

      <DialogContent title="Add New Inventory Item">
        <DialogHeader>
          <DialogTitle>Add New Inventory Item</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-3">
          <Input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Quantity"
            value={form.quantity}
            onChange={(e) =>
              setForm({ ...form, quantity: Number(e.target.value) })
            }
          />
          <Input
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <Button className="w-full mt-4" onClick={handleSubmit}>
          Save Item
        </Button>
      </DialogContent>
    </Dialog>
  );
}
