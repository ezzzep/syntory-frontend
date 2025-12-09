"use client";

import { useState, useRef } from "react";
import { Plus, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToasts } from "@/components/ui/toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Supplier, type SupplierCategory } from "@/types/supplier";
import { createSupplier } from "@/lib/api/suppliers";

interface AddSupplierDialogProps {
  onAdd: (supplier: Supplier) => void;
}

export default function AddSupplierDialog({ onAdd }: AddSupplierDialogProps) {
  const toasts = useToasts();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<
    Omit<Supplier, "id" | "total_orders" | "rating">
  >({
    name: "",
    contact_person: "",
    email: "",
    phone: "",
    location: "",
    category: "appliances",
    last_delivery: new Date().toISOString().split("T")[0],
    image_path: "", // Added missing property
    image_url: "", // Added missing property
  });

  const categories = [
    { value: "appliances", label: "Appliances" },
    { value: "home-living", label: "Home & Living" },
    { value: "gadgets", label: "Gadgets" },
    { value: "home-cleaning", label: "Home Cleaning" },
  ];

  const handleSubmit = async () => {
    if (
      !form.name ||
      !form.contact_person ||
      !form.email ||
      !form.phone ||
      !form.location
    ) {
      toasts.warning("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      const newSupplier = await createSupplier(form);
      onAdd(newSupplier);

      toasts.success(`${form.name} Added Successfully`);

      setForm({
        name: "",
        contact_person: "",
        email: "",
        phone: "",
        location: "",
        category: "appliances",
        last_delivery: new Date().toISOString().split("T")[0],
        image_path: "", // Added missing property to reset form
        image_url: "", // Added missing property to reset form
      });
      setOpen(false);
    } catch (error) {
      console.error(error);
      toasts.error("Failed to save supplier");
    }
    setLoading(false);
  };

  const handleCalendarClick = () => {
    if (dateInputRef.current) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      dateInputRef.current.showPicker
        ? dateInputRef.current.showPicker()
        : dateInputRef.current.focus();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 cursor-pointer transition-all duration-300 shadow-lg shadow-blue-500/20 rounded-lg px-4 py-2 text-sm font-medium">
          <Plus className="w-4 h-4 mr-2" />
          Add Supplier
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-linear-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl text-white border border-slate-700/50 rounded-2xl shadow-2xl max-w-3xl">
        <div className="pb-4 border-b border-slate-700/30">
          <DialogHeader>
            <div className="text-xl font-semibold text-white">
              <DialogTitle>Add New Supplier</DialogTitle>
            </div>
          </DialogHeader>
        </div>

        <div className="space-y-6 pt-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-blue-300">Name</label>
            <Input
              placeholder="Supplier name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-slate-700/50  text-white placeholder:text-slate-400 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-300">
                Contact Person
              </label>
              <Input
                placeholder="Contact person"
                value={form.contact_person}
                onChange={(e) =>
                  setForm({ ...form, contact_person: e.target.value })
                }
                className="bg-slate-700/50   border border-slate-600/40 text-white placeholder:text-slate-400 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-300">Email</label>
              <Input
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="bg-slate-700/50   border border-slate-600/40 text-white placeholder:text-slate-400 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-300">Phone</label>
              <Input
                placeholder="Phone number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="bg-slate-700/50   border border-slate-600/40 text-white placeholder:text-slate-400 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-300">
                Location
              </label>
              <Input
                placeholder="Location"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="bg-slate-700/50   border border-slate-600/40 text-white placeholder:text-slate-400 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-300">
                Category
              </label>
              <select
                className="w-full border rounded-lg p-3 bg-slate-700/50   text-white border-slate-600/40 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 cursor-pointer transition-all duration-300"
                value={form.category}
                onChange={(e) =>
                  setForm({
                    ...form,
                    category: e.target.value as SupplierCategory,
                  })
                }
              >
                {categories.map((cat) => (
                  <option
                    key={cat.value}
                    value={cat.value}
                    className="bg-slate-800"
                  >
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-300">
                Last Delivery
              </label>
              <div className="relative">
                <Input
                  ref={dateInputRef}
                  type="date"
                  value={form.last_delivery}
                  onChange={(e) =>
                    setForm({ ...form, last_delivery: e.target.value })
                  }
                  className="w-full p-3 pr-10 bg-slate-700/50 border border-slate-600/40 text-white placeholder:text-slate-400 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 [&::-webkit-calendar-picker-indicator]:hidden"
                />
                <button
                  type="button"
                  onClick={handleCalendarClick}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-white hover:text-blue-300 transition-colors duration-200"
                  aria-label="Open date picker"
                >
                  <Calendar className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-8 pt-4 border-t border-slate-700/30">
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
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Supplier"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
