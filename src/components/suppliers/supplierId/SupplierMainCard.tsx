/* eslint-disable @typescript-eslint/no-explicit-any */
import { Star, Edit, Save, X, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SupplierMainCardProps {
  supplier: any;
  editSection: string | null;
  isSaving: boolean;
  isUploading: boolean;
  imagePath: string;
  formData: any;
  fileInputRef: React.RefObject<HTMLInputElement | null>; 
  onEditSection: (section: string) => void;
  onSaveChanges: () => void;
  onCancelEditing: () => void;
  onInputChange: (field: string, value: string | number) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  triggerFileInput: () => void;
}

export const SupplierMainCard: React.FC<SupplierMainCardProps> = ({
  supplier,
  editSection,
  isSaving,
  isUploading,
  imagePath,
  formData,
  fileInputRef,
  onEditSection,
  onSaveChanges,
  onCancelEditing,
  onInputChange,
  onImageUpload,
  triggerFileInput,
}) => {
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
    <div className="bg-linear-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-5 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="relative h-20 w-20 rounded-full overflow-hidden mr-6">
            {imagePath ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imagePath}
                alt={supplier.name}
                className="h-full w-full object-cover cursor-pointer"
                onError={(e) => {
                  console.error("Image failed to load:", imagePath);
                  console.error(
                    "Supplier image_path from DB:",
                    supplier.image_path
                  );
                }}
                onLoad={() => {
                  console.log("Image loaded successfully:", imagePath);
                }}
              />
            ) : null}
            {!imagePath && (
              <div className="h-full w-full bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-2xl cursor-pointer">
                {supplier.name.charAt(0)}
              </div>
            )}
            {editSection === "name" && (
              <button
                onClick={triggerFileInput}
                disabled={isUploading}
                className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity disabled:cursor-not-allowed cursor-pointer"
              >
                {isUploading ? (
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                ) : (
                  <Camera className="h-6 w-6 text-white" />
                )}
              </button>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={onImageUpload}
            accept="image/*"
            className="hidden"
          />
          <div>
            {editSection === "name" ? (
              <Input
                value={formData.name || ""}
                onChange={(e) => onInputChange("name", e.target.value)}
                className="text-3xl font-bold text-white bg-slate-700/50 border border-slate-600/40 mb-2"
              />
            ) : (
              <h1 className="text-3xl font-bold text-white mb-2">
                {supplier.name}
              </h1>
            )}
            <div className="flex items-center">
              {renderRating(supplier.rating || 0)}
            </div>
          </div>
        </div>
        {editSection !== "name" ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEditSection("name")}
            className="text-blue-400 hover:text-blue-300 hover:bg-slate-700/50 cursor-pointer"
          >
            <Edit className="h-4 w-4" />
          </Button>
        ) : (
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onSaveChanges}
              disabled={isSaving || isUploading}
              className="text-green-400 hover:text-green-300 hover:bg-slate-700/50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancelEditing}
              className="text-red-400 hover:text-red-300 hover:bg-slate-700/50 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
