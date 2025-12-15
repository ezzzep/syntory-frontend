import { Edit, Save, X, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { InventoryItem, DetailsUpdate } from "@/types/inventory";

interface DescriptionSectionProps {
  item: InventoryItem;
  editSection: string | null;
  formData: DetailsUpdate;
  isSaving: boolean;
  startEditing: (section: string) => void;
  cancelEditing: () => void;
  saveChanges: () => void;
  handleInputChange: (field: string, value: string | number) => void;
}

export const DescriptionSection = ({
  item,
  editSection,
  formData,
  isSaving,
  startEditing,
  cancelEditing,
  saveChanges,
  handleInputChange,
}: DescriptionSectionProps) => {
  return (
    <div className="bg-linear-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <Package className="mr-2 h-5 w-5 text-blue-400" />
          Description
        </h2>
        {editSection !== "description" ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => startEditing("description")}
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
              disabled={isSaving}
              className="text-green-400 hover:text-green-300 hover:bg-slate-700/50 cursor-pointer"
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
      <div className="flex items-start">
        <Package className="h-5 w-5 text-blue-400 mr-3 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm text-white/60 mb-2">Description</p>
          {editSection === "description" ? (
            <textarea
              value={formData.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="w-full p-3 bg-slate-700/50 border border-slate-600/40 text-white rounded-lg min-h-[120px] text-base"
              placeholder="Enter item description..."
            />
          ) : (
            <p className="text-white text-base whitespace-pre-wrap">
              {item.description || "No description available"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
