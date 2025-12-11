import { useState, useRef } from "react";
import { z } from "zod";
import { useToasts } from "@/components/ui/toast";
import { Supplier, type SupplierCategory } from "@/types/supplier";
import { createSupplier } from "@/lib/api/suppliers";

const supplierSchema = z.object({
  name: z.string().min(1, "Company name is required"),
  contact_person: z.string().min(1, "Contact person is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(1, "Phone number is required"),
  location: z.string().min(1, "Location is required"),
  category: z.enum(["Appliances", "Home & Living", "Gadgets", "Home Cleaning"]),
  last_delivery: z.string(),
  image_path: z.string().optional(),
  image_url: z.string().optional(),
});

export const useAddSupplierDialog = (onAdd: (supplier: Supplier) => void) => {
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
    category: "Appliances",
    last_delivery: new Date().toISOString().split("T")[0],
    image_path: "",
    image_url: "",
  });

  const categories = [
    {
      value: "Appliances",
      label: "Appliances",
      icon: "Package",
      color: "from-blue-500 to-cyan-500",
    },
    {
      value: "Home & Living",
      label: "Home & Living",
      icon: "Building",
      color: "from-green-500 to-emerald-500",
    },
    {
      value: "Gadgets",
      label: "Gadgets",
      icon: "Package",
      color: "from-purple-500 to-pink-500",
    },
    {
      value: "Home Cleaning",
      label: "Home Cleaning",
      icon: "Package",
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
        category: "Appliances",
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

  const handleInputChange = (
    field: string,
    value: string | SupplierCategory
  ) => {
    setForm({ ...form, [field]: value });
  };

  return {
    loading,
    open,
    dateInputRef,
    errors,
    form,
    categories,
    setOpen,
    handleSubmit,
    handleCalendarClick,
    handleDateInputBlur,
    handleDateKeyDown,
    handlePhoneChange,
    handleInputChange,
  };
};
