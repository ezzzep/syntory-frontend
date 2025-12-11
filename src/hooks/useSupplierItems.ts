import { useState, useEffect } from "react";
import { z } from "zod";
import { useToasts } from "@/components/ui/toast";
import type { InventoryItem, CreateInventoryDto } from "@/types/inventory";
import type { Supplier } from "@/types/supplier";
import { createInventoryItem } from "@/lib/api/inventory";
import { getSuppliers } from "@/lib/api/suppliers";

const inventorySchema = z.object({
  name: z.string().min(1, "Item name is required"),
  category: z.string().min(1, "Category is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  description: z.string().optional(),
  supplier_name: z.string().optional(),
});

export const useAddItemDialog = (onAdd: (item: InventoryItem) => void) => {
  const toasts = useToasts();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [suppliersLoading, setSuppliersLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState<
    CreateInventoryDto & { supplier_name?: string }
  >({
    name: "",
    category: "",
    quantity: 0,
    description: "",
    supplier_name: "",
  });

  const categories = [
    "Appliances",
    "Home & Living",
    "Gadgets",
    "Home Cleaning",
  ];

  useEffect(() => {
    if (open && suppliers.length === 0) fetchSuppliersList();
  }, [open]);

  const fetchSuppliersList = async () => {
    try {
      setSuppliersLoading(true);
      const suppliersData = await getSuppliers();
      setSuppliers(suppliersData);
    } catch (error) {
      toasts.error("Failed to load suppliers");
    } finally {
      setSuppliersLoading(false);
    }
  };

  const validateForm = () => {
    try {
      inventorySchema.parse(form);
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
      const itemData = {
        ...form,
      };

      console.log("Creating item with data:", itemData);
      const newItem = await createInventoryItem(itemData);
      console.log("Created item:", newItem);

      onAdd(newItem);

      toasts.success(
        `${form.name} added successfully${
          form.supplier_name ? ` to ${form.supplier_name}` : ""
        }`
      );

      setForm({
        name: "",
        category: "",
        quantity: 0,
        description: "",
        supplier_name: "",
      });

      setErrors({});
      setOpen(false);
    } catch (error) {
      console.error("Error creating item:", error);
      toasts.error("Failed to save item");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleQuantityChange = (value: string) => {
    if (value === "") {
      setForm((prev) => ({ ...prev, quantity: 0 }));
      return;
    }
    if (/^\d+$/.test(value)) {
      setForm((prev) => ({ ...prev, quantity: Number(value) }));
    }
  };

  return {
    loading,
    open,
    suppliers,
    suppliersLoading,
    errors,
    form,
    categories,
    setOpen,
    handleSubmit,
    handleInputChange,
    handleQuantityChange,
  };
};
