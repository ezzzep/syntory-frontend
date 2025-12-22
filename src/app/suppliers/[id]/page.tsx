"use client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SupplierMainCard } from "@/components/suppliers/supplierId/SupplierMainCard";
import { ContactInfoCard } from "@/components/suppliers/supplierId/ContactInfoCard";
import { BusinessInfoCard } from "@/components/suppliers/supplierId/BusinessInfoCard";
import { DeliveryInfoCard } from "@/components/suppliers/supplierId/DeliveryInfoCard";
import { SupplierItemsCard } from "@/components/suppliers/supplierId/SupplierItemsCard";
import { useSupplierIdLogic } from "@/hooks/useSupplierIdLogic";
import { useState, useEffect } from "react";
import { getItemsBySupplier } from "@/lib/api/inventory";
import type { InventoryItem } from "@/types/inventory";
import { useRouter } from "next/navigation";

export default function SupplierDetailPage() {
  const router = useRouter();
  const {
    supplier,
    loading,
    editSection,
    formData,
    isSaving,
    isUploading,
    imagePath,
    showCalendar,
    fileInputRef,
    triggerFileInput,
    handleImageUpload,
    startEditing,
    cancelEditing,
    saveChanges,
    handleInputChange,
    navigateToSuppliers,
    toggleCalendar,
    closeCalendar,
  } = useSupplierIdLogic();

  const [items, setItems] = useState<InventoryItem[]>([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [itemsError, setItemsError] = useState<string | null>(null);

  useEffect(() => {
    if (supplier?.name) {
      fetchSupplierItems();
    }
  }, [supplier?.name]);

  const fetchSupplierItems = async () => {
    if (!supplier?.name) return;

    try {
      setItemsLoading(true);
      setItemsError(null);
      console.log("Fetching items for supplier name:", supplier.name);
      const supplierItems = await getItemsBySupplier(supplier.name);
      console.log("Fetched items:", supplierItems);
      setItems(supplierItems);
    } catch (error) {
      console.error("Failed to fetch supplier items:", error);
      setItemsError(
        error instanceof Error ? error.message : "Failed to fetch items"
      );
    } finally {
      setItemsLoading(false);
    }
  };

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "itemAdded") {
        fetchSupplierItems();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [supplier?.name]);

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

            <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md rounded-2xl shadow-xl border border-slate-700/50 p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-10 w-24" />
              </div>
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="border-b border-slate-700/50 pb-3"
                  >
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded" />
                      <div className="flex-1">
                        <Skeleton className="h-5 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                      <Skeleton className="h-5 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        ) : supplier ? (
          <div className="max-w-4xl mx-auto">
            <SupplierMainCard
              supplier={supplier}
              editSection={editSection}
              isSaving={isSaving}
              isUploading={isUploading}
              imagePath={imagePath}
              formData={formData}
              fileInputRef={fileInputRef}
              onEditSection={startEditing}
              onSaveChanges={saveChanges}
              onCancelEditing={cancelEditing}
              onInputChange={handleInputChange}
              onImageUpload={handleImageUpload}
              triggerFileInput={triggerFileInput}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <ContactInfoCard
                supplier={supplier}
                editSection={editSection}
                isSaving={isSaving}
                formData={formData}
                onEditSection={startEditing}
                onSaveChanges={saveChanges}
                onCancelEditing={cancelEditing}
                onInputChange={handleInputChange}
              />

              <BusinessInfoCard
                supplier={supplier}
                editSection={editSection}
                isSaving={isSaving}
                formData={formData}
                onEditSection={startEditing}
                onSaveChanges={saveChanges}
                onCancelEditing={cancelEditing}
                onInputChange={handleInputChange}
              />
            </div>

            <DeliveryInfoCard
              supplier={supplier}
              editSection={editSection}
              isSaving={isSaving}
              formData={formData}
              showCalendar={showCalendar}
              onEditSection={startEditing}
              onSaveChanges={saveChanges}
              onCancelEditing={cancelEditing}
              onInputChange={handleInputChange}
              onToggleCalendar={toggleCalendar}
              onCloseCalendar={closeCalendar}
            />

            <div className="mb-6">
              <SupplierItemsCard items={items} loading={itemsLoading} />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                onClick={() => {
                  fetchSupplierItems();
                  navigateToSuppliers();
                }}
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
                Supplier Not Found
              </h1>
              <Button
                onClick={navigateToSuppliers}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              >
                Back to Suppliers
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
