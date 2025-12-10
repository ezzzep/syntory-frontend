"use client";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SupplierMainCard } from "@/components/suppliers/supplierId/SupplierMainCard";
import { ContactInfoCard } from "@/components/suppliers/supplierId/ContactInfoCard";
import { BusinessInfoCard } from "@/components/suppliers/supplierId/BusinessInfoCard";
import { DeliveryInfoCard } from "@/components/suppliers/supplierId/DeliveryInfoCard";
import { useSupplierLogic } from "@/hooks/useSupplierLogic";

export default function SupplierDetailPage() {
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
    getFullImageUrl,
    formatCategory,
    formatDateDisplay,
    triggerFileInput,
    handleImageUpload,
    startEditing,
    cancelEditing,
    saveChanges,
    handleInputChange,
    handleDateChange,
    navigateToSuppliers,
    toggleCalendar,
    closeCalendar,
  } = useSupplierLogic();

  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-600"
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-300">({rating}/5)</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-indigo-950 to-slate-950">
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-white text-xl">
                Loading supplier details...
              </p>
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

            <div className="flex justify-end gap-3">
              <Button
                onClick={navigateToSuppliers}
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
