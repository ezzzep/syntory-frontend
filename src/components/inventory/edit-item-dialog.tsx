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
import Cookies from "js-cookie";

interface EditItemDialogProps {
  item: InventoryItem;
  onUpdate: (updatedItem: InventoryItem) => void;
}

export default function EditItemDialog({
  item,
  onUpdate,
}: EditItemDialogProps) {
  const [form, setForm] = useState<InventoryItem>(item);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCsrf = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sanctum/csrf-cookie`, {
      credentials: "include",
      headers: { Accept: "application/json" },
    });
  };

  const handleUpdate = async () => {
    setLoading(true);
    setError(null);

    try {
      const sanitizedForm: UpdateInventoryDto = {
        name: form.name ?? "",
        category: form.category ?? undefined,
        quantity: form.quantity ?? 0,
        description: form.description ?? undefined,
      };

      await fetchCsrf();
      const xsrfToken = Cookies.get("XSRF-TOKEN") ?? "";

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/inventory/${item.id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-XSRF-TOKEN": decodeURIComponent(xsrfToken),
          },
          body: JSON.stringify(sanitizedForm),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to update item: ${res.status} ${text}`);
      }

      const updated: InventoryItem = await res.json();
      onUpdate(updated);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err) || "Failed to update item");
      }
    } finally {
      setLoading(false);
    }
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

        {error && <p className="text-red-500 mb-2">{error}</p>}

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

        <Button
          className="w-full mt-4"
          onClick={handleUpdate}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Item"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
