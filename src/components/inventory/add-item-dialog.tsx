"use client";

import { useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToasts } from "@/components/toast";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import type { InventoryItem, CreateInventoryDto } from "@/types/inventory";
import { createInventoryItem } from "@/lib/api/inventory";

// Reusable Dialog Components
export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;

interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
}

export function DialogContent({ children, className }: DialogContentProps) {
  return (
    <DialogPrimitive.Portal>
      {/* Backdrop */}
      <DialogPrimitive.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />

      {/* Dialog */}
      <DialogPrimitive.Content
        className={`fixed z-50 w-[90%] max-w-lg max-h-[90vh] overflow-auto rounded-xl bg-white p-6 shadow-lg
          ${className ?? ""}`}
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          position: "fixed", // ensure fixed positioning
        }}
      >
        {children}

        <DialogPrimitive.Close className="absolute right-4 top-4 p-1 hover:bg-gray-200 rounded-full cursor-pointer z-60">
          <X size={20} />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function DialogHeader({ children }: { children: React.ReactNode }) {
  return <div className="mb-4">{children}</div>;
}

export function DialogTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2 className={`text-lg font-semibold ${className ?? ""}`}>{children}</h2>
  );
}

// Main AddItemDialog Component
interface AddItemDialogProps {
  onAdd: (item: InventoryItem) => void;
}

export default function AddItemDialog({ onAdd }: AddItemDialogProps) {
  const toasts = useToasts();

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
      const newItem = await createInventoryItem(form);
      onAdd(newItem);

      toasts.success(`${form.name} added successfully`);

      setForm({ name: "", category: "", quantity: 0, description: "" });
      setOpen(false);
    } catch (error) {
      console.error(error);
      toasts.error("Failed to save item");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gray-500 cursor-pointer">Add Item</Button>
      </DialogTrigger>

      <DialogContent className="relative">
        {/* Accessible Radix Title (hidden visually) */}
        <VisuallyHidden>
          <DialogPrimitive.Title>Add Inventory Item</DialogPrimitive.Title>
        </VisuallyHidden>

        {/* Custom header */}
        <DialogHeader>
          <DialogTitle className="text-xl">Add Inventory Item</DialogTitle>
        </DialogHeader>

        {/* Form */}
        <div className="space-y-4 mt-4">
          <Input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <select
            className="w-full border rounded-md p-2 bg-white cursor-pointer"
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

        <Button
          className="w-full mt-5 bg-blue-600 hover:bg-blue-700 cursor-pointer"
          onClick={handleSubmit}
        >
          Save Item
        </Button>
      </DialogContent>
    </Dialog>
  );
}
