/* eslint-disable @typescript-eslint/no-explicit-any */
import { MapPin, Package, Building, Edit, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSupplierIdLogic } from "@/hooks/useSupplierIdLogic";
import { useState, useEffect } from "react";
import { getItemsBySupplier } from "@/lib/api/inventory";

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
  const { formatCategory } = useSupplierIdLogic();
  const [totalOrders, setTotalOrders] = useState(0);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    const fetchTotalOrders = async () => {
      if (!supplier?.name) return;

      try {
        setLoadingOrders(true);
        const items = await getItemsBySupplier(supplier.name);
        const total = items.reduce((sum, item) => sum + item.quantity, 0);
        setTotalOrders(total);
      } catch (error) {
        console.error("Failed to fetch supplier items:", error);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchTotalOrders();
  }, [supplier?.name]);

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
                <option value="Appliances">Appliances</option>
                <option value="Home & Living">Home & Living</option>
                <option value="Gadgets">Gadgets</option>
                <option value="Home Cleaning">Home Cleaning</option>
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
            {loadingOrders ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500 mr-2"></div>
                <span className="text-white">Calculating...</span>
              </div>
            ) : (
              <p className="text-white">{totalOrders}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
