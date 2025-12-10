/* eslint-disable @typescript-eslint/no-explicit-any */
import { MapPin, Package, Building, Edit, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSupplierLogic } from "@/hooks/useSupplierLogic";

interface BusinessInfoCardProps {
  supplier: any;
  editSection: string | null;
  isSaving: boolean;
  formData: any;
  onEditSection: (section: string) => void;
  onSaveChanges: () => void;
  onCancelEditing: () => void;
  onInputChange: (field: string, value: string | number) => void;
}

export const BusinessInfoCard: React.FC<BusinessInfoCardProps> = ({
  supplier,
  editSection,
  isSaving,
  formData,
  onEditSection,
  onSaveChanges,
  onCancelEditing,
  onInputChange,
}) => {
  const { formatCategory } = useSupplierLogic();

  return (
    <div className="bg-linear-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <Building className="mr-2 h-5 w-5 text-blue-400" />
          Business Information
        </h2>
        {editSection !== "business" ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEditSection("business")}
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
              disabled={isSaving}
              className="text-green-400 hover:text-green-300 hover:bg-slate-700/50 cursor-pointer"
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
      <div className="space-y-4">
        <div className="flex items-start">
          <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-gray-400">Location</p>
            {editSection === "business" ? (
              <Input
                value={formData.location || ""}
                onChange={(e) => onInputChange("location", e.target.value)}
                className="bg-slate-700/50 border border-slate-600/40 text-white"
              />
            ) : (
              <p className="text-white">{supplier.location}</p>
            )}
          </div>
        </div>
        <div className="flex items-start">
          <Package className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-gray-400">Category</p>
            {editSection === "business" ? (
              <select
                value={formData.category || ""}
                onChange={(e) => onInputChange("category", e.target.value)}
                className="w-full p-2 bg-slate-700/50 border border-slate-600/40 text-white rounded cursor-pointer"
              >
                <option value="appliances">Appliances</option>
                <option value="home-living">Home & Living</option>
                <option value="gadgets">Gadgets</option>
                <option value="home-cleaning">Home Cleaning</option>
              </select>
            ) : (
              <p className="text-white">{formatCategory(supplier.category)}</p>
            )}
          </div>
        </div>
        <div className="flex items-start">
          <Package className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-gray-400">Total Orders</p>
            <p className="text-white">{supplier.total_orders}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
