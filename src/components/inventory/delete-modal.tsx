"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { InventoryItem } from "@/types/inventory";
import { Dialog, DialogContent } from "../ui/dialog";
import { useToasts } from "@/components/toast";

interface DeleteItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  item?: InventoryItem | null;
  items?: InventoryItem[];
}

export default function DeleteItemModal({
  isOpen,
  onClose,
  onConfirm,
  item,
  items = [],
}: DeleteItemModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { error: showError, itemDeleted } = useToasts();

  const isBulkDelete = items.length > 0;

  const itemNames = isBulkDelete
    ? items.map((i) => i.name).filter(Boolean)
    : item
    ? [item.name]
    : [];

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();

      if (isBulkDelete) {
        showError(
          `${itemNames.length} item${
            itemNames.length > 1 ? "s" : ""
          } deleted successfully`
        );
      } else if (item) {
        itemDeleted(item.name);
      }

      onClose();
    } catch (err) {
      console.error("Error deleting item(s):", err);

      let errorMessage = `Failed to delete ${
        isBulkDelete ? "items" : "item"
      }. Please try again.`;

      if (err instanceof Error) {
        errorMessage = `Failed to delete ${isBulkDelete ? "items" : "item"}. ${
          err.message
        }`;
      }

      showError(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        title="Confirm Deletion"
        className="bg-slate-800 text-white border-slate-700"
      >
        <div className="text-slate-300 mt-2">
          {isBulkDelete ? (
            <>
              Are you sure you want to delete {itemNames.length} selected item
              {itemNames.length > 1 ? "s" : ""}?
            </>
          ) : (
            <>Are you sure you want to delete this item?</>
          )}
        </div>

        {!isBulkDelete && item && (
          <div className="py-4">
            <div className="bg-slate-700/30 rounded-md p-3 border border-slate-600/30">
              <p className="text-slate-300 truncate">{item.name}</p>
              {item.category && (
                <p className="text-slate-400 text-sm mt-1">
                  Category: {item.category}
                </p>
              )}
              {item.quantity !== undefined && (
                <p className="text-slate-400 text-sm">
                  Quantity: {item.quantity}
                </p>
              )}
            </div>
          </div>
        )}

        {isBulkDelete && items.length > 0 && (
          <div className="py-4">
            <div className="bg-slate-700/30 rounded-md p-3 border border-slate-600/30 max-h-40 overflow-y-auto">
              <p className="text-slate-300 text-sm mb-2">
                Items to be deleted:
              </p>
              <ul className="space-y-1">
                {items.slice(0, 5).map((item, index) => (
                  <li key={index} className="text-slate-400 text-sm truncate">
                    • {item.name}
                  </li>
                ))}
                {items.length > 5 && (
                  <li className="text-slate-400 text-sm">
                    ...and {items.length - 5} more
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}

        <div className="flex gap-2 justify-end mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-slate-700/30 border-slate-600/30 text-white hover:bg-slate-700 cursor-pointer"
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 cursor-pointer"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
