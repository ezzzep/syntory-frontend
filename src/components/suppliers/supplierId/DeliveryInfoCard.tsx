/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useEffect } from "react";
import { CalendarDays, Edit, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CalendarPicker } from "./CalendarPicker";
import { useSupplierIdLogic } from "@/hooks/useSupplierIdLogic";

interface DeliveryInfoCardProps {
  supplier: any;
  editSection: string | null;
  isSaving: boolean;
  formData: any;
  showCalendar: boolean;
  onEditSection: (section: string) => void;
  onSaveChanges: () => void;
  onCancelEditing: () => void;
  onInputChange: (field: string, value: string | number) => void;
  onToggleCalendar: () => void;
  onCloseCalendar: () => void;
}

export const DeliveryInfoCard: React.FC<DeliveryInfoCardProps> = ({
  supplier,
  editSection,
  isSaving,
  formData,
  showCalendar,
  onEditSection,
  onSaveChanges,
  onCancelEditing,
  onInputChange,
  onToggleCalendar,
  onCloseCalendar,
}) => {
  const calendarRef = useRef<HTMLDivElement>(null);
  const { formatDateDisplay } = useSupplierIdLogic();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        onCloseCalendar();
      }
    };

    if (showCalendar) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCalendar, onCloseCalendar]);

  return (
    <div className="bg-linear-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-4 mb-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-white flex items-center">
          <CalendarDays className="mr-2 h-4 w-4 text-blue-400" />
          Delivery Information
        </h2>
        {editSection !== "delivery" ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEditSection("delivery")}
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
      <div className="flex items-start">
        <div className="flex-1 relative" ref={calendarRef}>
          <p className="text-sm text-gray-400 mb-1">Last Delivery</p>
          {editSection === "delivery" ? (
            <div className="max-w-xs">
              <button
                type="button"
                onClick={onToggleCalendar}
                className="w-full p-2 bg-slate-700/50 border border-slate-600/40 text-white rounded-lg text-left flex items-center justify-between hover:bg-slate-700 transition-colors"
              >
                <span className="truncate">
                  {formData.last_delivery
                    ? formatDateDisplay(formData.last_delivery)
                    : "Select date"}
                </span>
                <CalendarDays className="h-4 w-4 text-gray-400 shrink-0 ml-2" />
              </button>
              {showCalendar && (
                <CalendarPicker
                  value={formData.last_delivery || ""}
                  onChange={(date) => onInputChange("last_delivery", date)}
                  onClose={onCloseCalendar}
                />
              )}
            </div>
          ) : (
            <div className="max-w-xs">
              <p className="text-white truncate">
                {formatDateDisplay(supplier.last_delivery)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
