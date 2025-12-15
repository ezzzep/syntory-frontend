import { useRef } from "react";
import { Edit, Save, X, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToasts } from "@/components/ui/toast";
import type { InventoryItem, NameUpdate } from "@/types/inventory";
import { getFullImageUrl, formatPrice } from "@/utils/inventoryUtils";
import { updateInventoryItem, uploadItemImage } from "@/lib/api/inventory";

interface ItemDetailsHeaderProps {
  item: InventoryItem;
  editSection: string | null;
  formData: NameUpdate;
  isSaving: boolean;
  isUploading: boolean;
  setIsUploading: (value: boolean) => void;
  imagePath: string;
  startEditing: (section: string) => void;
  cancelEditing: () => void;
  saveChanges: () => void;
  handleInputChange: (field: string, value: string | number) => void;
  setImagePath: (path: string) => void;
  setItem: (item: InventoryItem) => void;
}

export const ItemDetailsHeader = ({
  item,
  editSection,
  formData,
  isSaving,
  isUploading,
  setIsUploading,
  imagePath,
  startEditing,
  cancelEditing,
  saveChanges,
  handleInputChange,
  setImagePath,
  setItem,
}: ItemDetailsHeaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toasts = useToasts();

  const saveImagePathToDatabase = async (url: string) => {
    if (!item) return;

    try {
      const updatePayload = {
        image_path: url,
      };
      const updatedItem = await updateInventoryItem(item.id, updatePayload);
      setItem({
        ...updatedItem,
        supplier_name: item.supplier_name,
      });
      return updatedItem;
    } catch (error) {
      console.error("Failed to save image path:", error);
      throw error;
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !item) return;
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);
      const result = await uploadItemImage(item.id, formData);

      if (result && result.image_url) {
        const pathOnly = result.image_url.replace(/.*\/storage\//, "");
        const fullImageUrl = getFullImageUrl(pathOnly);
        setImagePath(fullImageUrl);
        await saveImagePathToDatabase(pathOnly);

        toasts.success("Image uploaded and saved successfully");
      } else {
        console.error("Invalid response from server:", result);
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      toasts.error(
        `Failed to upload image: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-linear-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-5 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="relative h-20 w-20 rounded-lg overflow-hidden mr-6">
            {imagePath ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imagePath}
                alt={item.name}
                className="h-full w-full object-cover cursor-pointer"
                onError={(e) => {
                  console.error("Image failed to load:", imagePath);
                  console.error("Item image_path from DB:", item.image_path);
                  if (item.image_path && item.image_path !== imagePath) {
                    const fallbackUrl = getFullImageUrl(item.image_path);
                    console.log("Trying fallback URL:", fallbackUrl);
                    setImagePath(fallbackUrl);
                  }
                }}
                onLoad={() => {
                  console.log("Image loaded successfully:", imagePath);
                }}
              />
            ) : null}
            {!imagePath && (
              <div className="h-full w-full bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-2xl cursor-pointer">
                {item.name.charAt(0)}
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
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
          <div>
            {editSection === "name" ? (
              <Input
                value={formData.name || ""}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="text-3xl font-bold text-white bg-slate-700/50 border border-slate-600/40 mb-2"
              />
            ) : (
              <h1 className="text-3xl font-bold text-white mb-2">
                {item.name}
              </h1>
            )}
            <div className="flex items-center">
              <span className="text-sm text-gray-300 mr-2">ID:</span>
              <span className="text-sm text-gray-300">{item.id}</span>
            </div>
          </div>
        </div>
        {editSection !== "name" ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => startEditing("name")}
            className="text-blue-400 hover:text-blue-300 hover:bg-slate-700/50 cursor-pointer"
          >
            <Edit className="h-4 w-4" />
          </Button>
        ) : (
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={saveChanges}
              disabled={isSaving || isUploading}
              className="text-green-400 hover:text-green-300 hover:bg-slate-700/50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={cancelEditing}
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
