/* eslint-disable @typescript-eslint/no-explicit-any */
import { User, Mail, Phone, Edit, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ContactInfoCardProps {
  supplier: any;
  editSection: string | null;
  isSaving: boolean;
  formData: any;
  onEditSection: (section: string) => void;
  onSaveChanges: () => void;
  onCancelEditing: () => void;
  onInputChange: (field: string, value: string | number) => void;
}

export const ContactInfoCard: React.FC<ContactInfoCardProps> = ({
  supplier,
  editSection,
  isSaving,
  formData,
  onEditSection,
  onSaveChanges,
  onCancelEditing,
  onInputChange,
}) => {
  return (
    <div className="bg-linear-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <User className="mr-2 h-5 w-5 text-blue-400" />
          Contact Information
        </h2>
        {editSection !== "contact" ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEditSection("contact")}
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
          <User className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-gray-400">Contact Person</p>
            {editSection === "contact" ? (
              <Input
                value={formData.contact_person || ""}
                onChange={(e) =>
                  onInputChange("contact_person", e.target.value)
                }
                className="bg-slate-700/50 border border-slate-600/40 text-white"
              />
            ) : (
              <p className="text-white">{supplier.contact_person}</p>
            )}
          </div>
        </div>
        <div className="flex items-start">
          <Mail className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-gray-400">Email</p>
            {editSection === "contact" ? (
              <Input
                type="email"
                value={formData.email || ""}
                onChange={(e) => onInputChange("email", e.target.value)}
                className="bg-slate-700/50 border border-slate-600/40 text-white"
              />
            ) : (
              <p className="text-white">{supplier.email}</p>
            )}
          </div>
        </div>
        <div className="flex items-start">
          <Phone className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-gray-400">Phone</p>
            {editSection === "contact" ? (
              <Input
                value={formData.phone || ""}
                onChange={(e) => onInputChange("phone", e.target.value)}
                className="bg-slate-700/50 border border-slate-600/40 text-white"
              />
            ) : (
              <p className="text-white">{supplier.phone}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
