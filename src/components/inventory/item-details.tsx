"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import type { InventoryItem } from "@/types/inventory";

interface ItemDetailsProps {
  item: InventoryItem;
  children: React.ReactNode;
}

export default function ItemDetails({ item, children }: ItemDetailsProps) {
  const [open, setOpen] = useState(false);

  if (!item) return null;

  return (
    <>
      <span
        className="cursor-pointer text-blue-400 hover:underline"
        onClick={() => setOpen(true)}
      >
        {children}
      </span>

      {open &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="fixed inset-0 bg-black/40"
              onClick={() => setOpen(false)}
            ></div>
            <div className="relative z-10 w-[95%] max-w-lg bg-gray-800 rounded-xl shadow-xl p-6 text-gray-100">
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 text-white p-1 rounded-full hover:bg-gray-600 cursor-pointer"
              >
                <X size={20} />
              </button>

              <h2 className="text-2xl font-semibold mb-4 text-gray-200">
                Item Details
              </h2>

              <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <p className="text-lg font-medium text-blue-200">Name</p>
                    <p className="font-extralight">{item.name}</p>
                  </div>

                  <div className="flex-1">
                    <p className="text-lg font-medium text-blue-200">
                      Quantity
                    </p>
                    <p className="font-extralight">{item.quantity}</p>
                  </div>
                </div>

                <div>
                  <p className="text-lg font-medium text-blue-200">Category</p>
                  <p className="font-extralight">{item.category ?? "-"}</p>
                </div>

                <div>
                  <p className="text-lg font-medium text-blue-200">
                    Description
                  </p>
                  <p className="font-extralight">{item.description ?? "-"}</p>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
