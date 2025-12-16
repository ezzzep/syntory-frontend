"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToasts } from "@/components/ui/toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Supplier } from "@/types/supplier";
import { deleteSupplier } from "@/lib/api/suppliers";
import { Star } from "lucide-react";

interface DeleteSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  supplier?: Supplier | null;
  suppliers?: Supplier[];
}

export default function DeleteSupplierModal({
  isOpen,
  onClose,
  onConfirm,
  supplier,
  suppliers = [],
}: DeleteSupplierModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toasts = useToasts();

  const isBulkDelete = suppliers.length > 0;
  const targetSupplier = isBulkDelete ? null : supplier;

  const handleConfirm = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      if (isBulkDelete) {
        await Promise.all(suppliers.map((s) => deleteSupplier(s.id)));
        toasts.success(`Successfully deleted ${suppliers.length} suppliers`);
      } else if (targetSupplier) {
        await deleteSupplier(targetSupplier.id);
        toasts.itemDeleted(` ${targetSupplier.name} Successfully`);
      }

      if (onConfirm) {
        onConfirm();
      }

      onClose();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete supplier(s)";
      setError(errorMessage);
      toasts.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3 w-3 ${
              star <= rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-600"
            }`}
          />
        ))}
        <span className="ml-1 text-xs text-gray-400">({rating})</span>
      </div>
    );
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && !isDeleting && onClose()}
    >
      <DialogContent className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl text-white border border-slate-700/50 rounded-2xl shadow-2xl max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">
            {isBulkDelete
              ? `Delete ${suppliers.length} Suppliers?`
              : "Delete Supplier?"}
          </DialogTitle>
        </DialogHeader>

        {error && (
          <div className="bg-red-900/20 border border-red-500/50 text-red-300 px-4 py-2 rounded-md">
            {error}
          </div>
        )}

        <p className="text-gray-300">
          {isBulkDelete
            ? `Are you sure you want to delete ${suppliers.length} suppliers? This action cannot be undone.`
            : `Are you sure you want to delete ${targetSupplier?.name}? This action cannot be undone.`}
        </p>

        {!isBulkDelete && targetSupplier && (
          <div className="bg-slate-800 rounded-lg p-4">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold mr-3">
                {targetSupplier.name.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-medium text-white">
                  {targetSupplier.name}
                </div>
                <div className="flex items-center mt-1">
                  {renderRating(targetSupplier.rating || 0)}
                </div>
              </div>
            </div>
          </div>
        )}

        {isBulkDelete && (
          <div className="bg-slate-800 rounded-lg p-4 max-h-40 overflow-y-auto">
            <p className="text-sm text-gray-300 mb-2">
              Suppliers to be deleted:
            </p>
            <ul className="space-y-1">
              {suppliers.map((s) => (
                <li key={s.id} className="text-sm text-gray-400">
                  • {s.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 px-4 py-2 bg-transparent text-white rounded-md hover:bg-slate-400 transition-colors cursor-pointer border-slate-700"
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors cursor-pointer"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
