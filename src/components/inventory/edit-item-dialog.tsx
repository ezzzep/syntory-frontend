"use client";

import { useState } from "react";
import type { InventoryItem, UpdateInventoryDto } from "@/types/inventory";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface EditItemDialogProps {
  item: InventoryItem;
  onUpdate: (updatedItem: InventoryItem) => void;
}

export default function EditItemDialog({
  item,
  onUpdate,
}: EditItemDialogProps) {
  const [form, setForm] = useState<InventoryItem>(item);

  const handleUpdate = async () => {
    const sanitizedForm: UpdateInventoryDto = {
      name: form.name ?? "",
      category: form.category ?? undefined,
      quantity: form.quantity ?? 0,
      description: form.description ?? undefined,
    };

    const updated = await fetch(
      `http://localhost:8000/api/inventory/${item.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sanitizedForm),
      }
    ).then((res) => res.json());

    onUpdate(updated);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent title="Edit Inventory Item">
        <DialogHeader>
          <DialogTitle>Edit Inventory Item</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 mt-2">
          <Input
            value={form.name ?? ""}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            value={form.category ?? ""}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
          <Input
            type="number"
            value={form.quantity ?? 0}
            onChange={(e) =>
              setForm({ ...form, quantity: Number(e.target.value) })
            }
          />
          <Input
            value={form.description ?? ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <Button className="w-full mt-4" onClick={handleUpdate}>
          Update Item
        </Button>
      </DialogContent>
    </Dialog>
  );
}
