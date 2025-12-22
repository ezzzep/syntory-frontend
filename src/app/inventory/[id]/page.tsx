"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { updateInventoryItem } from "@/lib/api/inventory";
import type {
  UpdateData,
  NameUpdate,
  StockUpdate,
  DetailsUpdate,
} from "@/types/inventory";
import { useToasts } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useInventoryItem } from "@/hooks/useInventoryItem";
import {
  formatPrice,
  calculateTotalValue,
  getFullImageUrl,
} from "@/utils/inventoryUtils";
import { ItemDetailsHeader } from "@/components/inventory/inventoryItem/itemDetailsHeader";
import { ItemDetailsSection } from "@/components/inventory/inventoryItem/itemDetailsSection";
import { StockInfoSection } from "@/components/inventory/inventoryItem/stockInfoSection";
import { DescriptionSection } from "@/components/inventory/inventoryItem/descriptionSection";

export default function InventoryItemDetails() {
  const router = useRouter();
  const pathname = usePathname();
  const toasts = useToasts();

  const categories = [
    "Appliances",
    "Home & Living",
    "Gadgets",
    "Home Cleaning",
  ];

  const {
    item,
    loading,
    imagePath,
    setImagePath,
    priceInput,
    setPriceInput,
    setItem,
  } = useInventoryItem();

  const [editSection, setEditSection] = useState<string | null>(null);
  const [formData, setFormData] = useState<UpdateData>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [additionalQuantity, setAdditionalQuantity] = useState("");

  const handlePriceChange = (value: string) => {
    const raw = value.replace(/,/g, "");
    if (!/^\d*\.?\d*$/.test(raw)) return;

    const numeric = raw === "" ? 0 : parseFloat(raw);

    setFormData((prev) => ({
      ...prev,
      price: isNaN(numeric) ? 0 : numeric,
    }));

    if (item) {
      const currentQuantity =
        editSection === "stock"
          ? item.quantity + (parseInt(additionalQuantity) || 0)
          : item.quantity;
      const totalValue = calculateTotalValue(numeric, currentQuantity);
      setFormData((prev) => ({
        ...prev,
        total_quantity_value: totalValue,
      }));
    }

    if (raw === "") {
      setPriceInput("");
    } else {
      const [int, dec] = raw.split(".");
      const formatted =
        Number(int).toLocaleString("en-US") +
        (dec !== undefined ? "." + dec : "");
      setPriceInput(formatted);
    }
  };

  const handlePriceBlur = () => {
    const price = (formData as DetailsUpdate).price;
    if (price !== undefined) {
      setPriceInput(formatPrice(price));
    }
  };

  const startEditing = (section: string) => {
    if (!item) return;

    if (section === "name") {
      setFormData({
        name: item.name,
        image_path: imagePath || item.image_path || "",
      } as NameUpdate);
    } else if (section === "stock") {
      setFormData({
        quantity: item.quantity,
        total_quantity_value:
          item.total_quantity_value ||
          calculateTotalValue(item.price, item.quantity),
      } as StockUpdate);
      setAdditionalQuantity("");
    } else if (section === "details") {
      setFormData({
        category: item.category || "",
        description: item.description || "",
        price: item.price,
      } as DetailsUpdate);
      setPriceInput(formatPrice(item.price));
    } else if (section === "description") {
      setFormData({
        description: item.description || "",
      } as DetailsUpdate);
    }

    setEditSection(section);
  };

  const cancelEditing = () => {
    setEditSection(null);
    setFormData({});
    setAdditionalQuantity("");
    if (item) {
      const dbImagePath = getFullImageUrl(item.image_path);
      setImagePath(dbImagePath);
      setPriceInput(formatPrice(item.price));
    }
  };

  const saveChanges = async () => {
    if (!item) return;

    setIsSaving(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updatePayload: any = {};

      Object.assign(updatePayload, formData);

      if (editSection === "stock" && additionalQuantity) {
        const newQuantity = item.quantity + parseInt(additionalQuantity);
        updatePayload.quantity = newQuantity;
        updatePayload.total_quantity_value = calculateTotalValue(
          item.price,
          newQuantity
        );
      }

      const updatedItem = await updateInventoryItem(item.id, updatePayload);
      setItem({
        ...updatedItem,
        supplier_name: item.supplier_name,
      });

      if (updatedItem.price !== undefined) {
        setPriceInput(formatPrice(updatedItem.price));
      }

      setEditSection(null);
      setFormData({});
      setAdditionalQuantity("");
      toasts.success("Item information updated successfully");
    } catch (err) {
      console.error("Failed to update item:", err);
      toasts.error("Failed to update item information");
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleAdditionalQuantityChange = (value: string) => {
    setAdditionalQuantity(value);

    if (item) {
      const currentPrice =
        editSection === "details"
          ? (formData as DetailsUpdate).price || item.price
          : item.price;
      const newQuantity = item.quantity + (parseInt(value) || 0);
      const totalValue = calculateTotalValue(currentPrice, newQuantity);
      setFormData((prev) => ({
        ...prev,
        total_quantity_value: totalValue,
      }));
    }
  };

  const navigateToInventory = () => {
    router.push("/inventory");
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("activeNav", "inventory");
    }
  }, [pathname]);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-indigo-950 to-slate-950">
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="max-w-4xl mx-auto">
            <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md rounded-2xl shadow-xl border border-slate-700/50 p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-6">
                <Skeleton className="h-48 w-48 rounded-lg" />
                <div className="flex-1 space-y-4">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex gap-4 mt-4">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-24" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md rounded-2xl shadow-xl border border-slate-700/50 p-6">
                <div className="flex justify-between items-center mb-4">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-8 w-20" />
                </div>
                <div className="space-y-4">
                  <div>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              </div>

              <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md rounded-2xl shadow-xl border border-slate-700/50 p-6">
                <div className="flex justify-between items-center mb-4">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-8 w-20" />
                </div>
                <div className="space-y-4">
                  <div>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md rounded-2xl shadow-xl border border-slate-700/50 p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-8 w-20" />
              </div>
              <Skeleton className="h-32 w-full" />
            </div>

            <div className="flex justify-end">
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        ) : item ? (
          <div className="max-w-4xl mx-auto">
            <ItemDetailsHeader
              item={item}
              editSection={editSection}
              formData={formData as NameUpdate}
              isSaving={isSaving}
              isUploading={isUploading}
              setIsUploading={setIsUploading}
              imagePath={imagePath}
              startEditing={startEditing}
              cancelEditing={cancelEditing}
              saveChanges={saveChanges}
              handleInputChange={handleInputChange}
              setImagePath={setImagePath}
              setItem={setItem}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <ItemDetailsSection
                item={item}
                editSection={editSection}
                formData={formData as DetailsUpdate}
                isSaving={isSaving}
                categories={categories}
                priceInput={priceInput}
                additionalQuantity={additionalQuantity}
                startEditing={startEditing}
                cancelEditing={cancelEditing}
                saveChanges={saveChanges}
                handleInputChange={handleInputChange}
                handlePriceChange={handlePriceChange}
                handlePriceBlur={handlePriceBlur}
              />

              <StockInfoSection
                item={item}
                editSection={editSection}
                formData={formData as StockUpdate}
                isSaving={isSaving}
                additionalQuantity={additionalQuantity}
                startEditing={startEditing}
                cancelEditing={cancelEditing}
                saveChanges={saveChanges}
                handleAdditionalQuantityChange={handleAdditionalQuantityChange}
              />
            </div>

            <DescriptionSection
              item={item}
              editSection={editSection}
              formData={formData as DetailsUpdate}
              isSaving={isSaving}
              startEditing={startEditing}
              cancelEditing={cancelEditing}
              saveChanges={saveChanges}
              handleInputChange={handleInputChange}
            />

            <div className="flex justify-end gap-3">
              <Button
                onClick={navigateToInventory}
                className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              >
                Done
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="bg-linear-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-8 text-center max-w-md">
              <h1 className="text-white text-2xl font-bold mb-2">
                Item Not Found
              </h1>
              <Button
                onClick={navigateToInventory}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              >
                Back to Inventory
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
