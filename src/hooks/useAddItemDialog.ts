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
  price: z.number().min(0, "Price must be at least 0").optional(),
  total_quantity_value: z.number().optional(),
});

export const useAddItemDialog = (onAdd: (item: InventoryItem) => void) => {
  const toasts = useToasts();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [suppliersLoading, setSuppliersLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [priceInput, setPriceInput] = useState("");
  const [form, setForm] = useState<
    CreateInventoryDto & {
      supplier_name?: string;
      total_quantity_value?: number;
    }
  >({
    name: "",
    category: "",
    quantity: 0,
    description: "",
    supplier_name: "",
    price: 0,
    total_quantity_value: 0,
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

  const calculateTotalQuantityValue = (price?: number, quantity?: number) => {
    const itemPrice = price !== undefined ? price : form.price;
    const itemQuantity = quantity !== undefined ? quantity : form.quantity;
    return itemPrice * itemQuantity;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      let finalCategory = form.category;
      if (form.supplier_name) {
        const selectedSupplier = suppliers.find(
          (s) => s.name === form.supplier_name
        );
        finalCategory = selectedSupplier?.category || form.category;
      }

      // Ensure we have the latest total value
      const totalValue = calculateTotalQuantityValue();

      const itemData = {
        name: form.name,
        category: finalCategory,
        quantity: form.quantity,
        description: form.description,
        supplier_name: form.supplier_name,
        price: form.price,
        total_quantity_value: totalValue,
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
        price: 0,
        total_quantity_value: 0,
      });

      setPriceInput("");
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
      setForm((prev) => ({
        ...prev,
        quantity: 0,
        total_quantity_value: 0,
      }));
      return;
    }
    if (/^\d+$/.test(value)) {
      const newQuantity = Number(value);
      const price = parseFloat(priceInput.replace(/,/g, "")) || 0;
      const totalValue = price * newQuantity;

      setForm((prev) => ({
        ...prev,
        quantity: newQuantity,
        total_quantity_value: totalValue,
      }));
    }
  };

  const formatPrice = (value: number) =>
    value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const handlePriceBlur = () => {
    if (form.price > 0) {
      setPriceInput(formatPrice(form.price));
    }
  };

  const handlePriceChange = (value: string) => {
    const raw = value.replace(/,/g, "");
    if (!/^\d*\.?\d*$/.test(raw)) return;
    const numeric = raw === "" ? 0 : parseFloat(raw);

    if (raw === "") {
      setPriceInput("");
      setForm((prev) => ({
        ...prev,
        price: 0,
        total_quantity_value: 0,
      }));
    } else {
      const parts = raw.split(".");
      const formatted =
        Number(parts[0]).toLocaleString("en-US") +
        (parts[1] !== undefined ? "." + parts[1] : "");

      setPriceInput(formatted);

      const totalValue = numeric * form.quantity;
      setForm((prev) => ({
        ...prev,
        price: isNaN(numeric) ? 0 : numeric,
        total_quantity_value: totalValue,
      }));
    }
  };

  const handleSupplierChange = (supplierName: string) => {
    const selectedSupplier = suppliers.find((s) => s.name === supplierName);
    setForm((prev) => ({
      ...prev,
      supplier_name: supplierName,
      category: selectedSupplier?.category || "",
    }));
  };

  return {
    loading,
    open,
    suppliers,
    suppliersLoading,
    errors,
    form,
    priceInput,
    categories,
    calculateTotalQuantityValue,
    setOpen,
    handleSubmit,
    handleInputChange,
    handleQuantityChange,
    handleSupplierChange,
    handlePriceChange,
    handlePriceBlur,
    formatPrice,
  };
};
