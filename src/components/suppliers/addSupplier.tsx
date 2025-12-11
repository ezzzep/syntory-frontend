"use client";

import { useState, useRef } from "react";
import {
  Plus,
  Calendar,
  MapPin,
  Phone,
  Mail,
  User,
  Building,
  Package,
} from "lucide-react";
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
import { z } from "zod";

const supplierSchema = z.object({
  name: z.string().min(1, "Company name is required"),
  contact_person: z.string().min(1, "Contact person is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(1, "Phone number is required"),
  location: z.string().min(1, "Location is required"),
  category: z.enum(["appliances", "home-living", "gadgets", "home-cleaning"]),
  last_delivery: z.string(),
  image_path: z.string().optional(),
  image_url: z.string().optional(),
});

interface AddSupplierDialogProps {
  onAdd: (supplier: Supplier) => void;
}

export default function AddSupplierDialog({ onAdd }: AddSupplierDialogProps) {
  const toasts = useToasts();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    image_path: "",
    image_url: "",
  });

  const categories = [
    {
      value: "appliances",
      label: "Appliances",
      icon: Package,
      color: "from-blue-500 to-cyan-500",
    },
    {
      value: "home-living",
      label: "Home & Living",
      icon: Building,
      color: "from-green-500 to-emerald-500",
    },
    {
      value: "gadgets",
      label: "Gadgets",
      icon: Package,
      color: "from-purple-500 to-pink-500",
    },
    {
      value: "home-cleaning",
      label: "Home Cleaning",
      icon: Package,
      color: "from-orange-500 to-red-500",
    },
  ];

  const validateForm = () => {
    try {
      supplierSchema.parse(form);
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
        image_path: "",
        image_url: "",
      });

      setErrors({});
      setOpen(false);
    } catch (error) {
      console.error(error);
      toasts.error("Failed to save supplier");
    } finally {
      setLoading(false);
    }
  };

  const handleCalendarClick = () => {
    if (dateInputRef.current) {
      dateInputRef.current.type = "date";
      if (dateInputRef.current.showPicker) {
        dateInputRef.current.showPicker();
      } else {
        dateInputRef.current.focus();
      }
    }
  };

  const handleDateInputBlur = () => {
    if (dateInputRef.current) {
      dateInputRef.current.type = "text";
    }
  };

  const handleDateKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setForm({ ...form, phone: value });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg shadow-blue-500/20 rounded-lg px-4 py-2 text-sm font-medium cursor-pointer">
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
          <Plus className="w-4 h-4 mr-2 relative z-10" />
          <span className="relative z-10">Add Supplier</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-xl text-white border border-slate-700/50 rounded-2xl shadow-2xl w-[95%] max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="relative pb-6 border-b border-slate-700/30">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Add New Supplier
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="space-y-6 pt-6">
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-blue-300">
              <Building className="w-4 h-4 mr-2" />
              Company Name
            </label>
            <Input
              placeholder="Enter company name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full h-12 border-slate-600/40 bg-slate-700/30 text-white placeholder:text-slate-400 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 rounded-lg cursor-text"
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-blue-300">
                <User className="w-4 h-4 mr-2" />
                Contact Person
              </label>
              <Input
                placeholder="Contact person name"
                value={form.contact_person}
                onChange={(e) =>
                  setForm({ ...form, contact_person: e.target.value })
                }
                className="w-full h-12 border-slate-600/40 bg-slate-700/30 text-white placeholder:text-slate-400 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 rounded-lg cursor-text"
              />
              {errors.contact_person && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.contact_person}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-blue-300">
                <Mail className="w-4 h-4 mr-2" />
                Email
              </label>
              <Input
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full h-12 border-slate-600/40 bg-slate-700/30 text-white placeholder:text-slate-400 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 rounded-lg cursor-text"
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-blue-300">
                <Phone className="w-4 h-4 mr-2" />
                Phone
              </label>
              <Input
                type="tel"
                placeholder="Phone number"
                value={form.phone}
                onChange={handlePhoneChange}
                pattern="[0-9]*"
                inputMode="numeric"
                className="w-full h-12 border-slate-600/40 bg-slate-700/30 text-white placeholder:text-slate-400 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 rounded-lg cursor-text"
              />
              {errors.phone && (
                <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-blue-300">
                <MapPin className="w-4 h-4 mr-2" />
                Location
              </label>
              <Input
                placeholder="Company location"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full h-12 border-slate-600/40 bg-slate-700/30 text-white placeholder:text-slate-400 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 rounded-lg cursor-text"
              />
              {errors.location && (
                <p className="text-red-400 text-sm mt-1">{errors.location}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-blue-300">
                <Package className="w-4 h-4 mr-2" />
                Category
              </label>
              <div className="relative">
                <select
                  className="w-full h-12 appearance-none border-slate-600/40 bg-slate-700/30 text-white rounded-lg px-4 pr-10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 cursor-pointer"
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
                      className="bg-slate-800 text-white"
                    >
                      {cat.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Package className="h-5 w-5 text-slate-400" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-blue-300">
                <Calendar className="w-4 h-4 mr-2" />
                Last Delivery
              </label>
              <div className="relative">
                <Input
                  ref={dateInputRef}
                  type="text"
                  placeholder="Select a date"
                  value={form.last_delivery}
                  onChange={(e) =>
                    setForm({ ...form, last_delivery: e.target.value })
                  }
                  onBlur={handleDateInputBlur}
                  onKeyDown={handleDateKeyDown}
                  className="w-full h-12 border-slate-600/40 bg-slate-700/30 text-white placeholder:text-slate-400 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 rounded-lg pr-10 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={handleCalendarClick}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-blue-300 transition-colors duration-200 cursor-pointer"
                >
                  <Calendar className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-8 pt-6 border-t border-slate-700/30">
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
                Save Supplier
              </div>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
