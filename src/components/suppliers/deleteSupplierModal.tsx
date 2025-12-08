"use client";

import { Button } from "@/components/ui/button";
import { Supplier } from "@/types/supplier";


interface DeleteSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
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
  if (!isOpen) return null;

  const isBulkDelete = suppliers.length > 0;
  const targetSupplier = isBulkDelete ? null : supplier;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-xl border border-indigo-900/30 w-full max-w-md p-6">
        <h2 className="text-xl font-bold text-white mb-4">
          {isBulkDelete
            ? `Delete ${suppliers.length} Suppliers?`
            : "Delete Supplier?"}
        </h2>

        <p className="text-gray-300 mb-6">
          {isBulkDelete
            ? `Are you sure you want to delete ${suppliers.length} suppliers? This action cannot be undone.`
            : `Are you sure you want to delete ${targetSupplier?.name}? This action cannot be undone.`}
        </p>

        {!isBulkDelete && targetSupplier && (
          <div className="bg-slate-800 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold mr-3">
                {targetSupplier.name.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-medium text-white">
                  {targetSupplier.name}
                </div>
                <div className="text-xs text-gray-400">
                  {targetSupplier.contactPerson}
                </div>
              </div>
            </div>
          </div>
        )}

        {isBulkDelete && (
          <div className="bg-slate-800 rounded-lg p-4 mb-6 max-h-40 overflow-y-auto">
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

        <div className="flex gap-3">
          <Button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-700 transition-colors"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
