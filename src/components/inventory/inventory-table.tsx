"use client";

import type { InventoryItem } from "@/types/inventory";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import EditItemDialog from "./edit-item-dialog";

interface InventoryTableProps {
  items: InventoryItem[];
  onDelete: (id: number) => void;
  onUpdate: (updatedItem: InventoryItem) => void;
}

export default function InventoryTable({
  items,
  onDelete,
  onUpdate,
}: InventoryTableProps) {
  return (
    <div className="w-full">
      {/* Desktop / Tablet Table */}
      <div className="hidden sm:block overflow-x-auto w-full">
        <Table className="min-w-full border border-gray-700 rounded-lg overflow-hidden shadow-lg bg-gray-950">
          <TableHeader className="bg-gray-900">
            <TableRow>
              <TableHead className="text-left text-gray-300 uppercase text-sm font-medium px-4 py-3">
                Name
              </TableHead>
              <TableHead className="text-left text-gray-300 uppercase text-sm font-medium px-4 py-3">
                Category
              </TableHead>
              <TableHead className="text-left text-gray-300 uppercase text-sm font-medium px-4 py-3">
                Quantity
              </TableHead>
              <TableHead className="text-left text-gray-300 uppercase text-sm font-medium px-4 py-3">
                Description
              </TableHead>
              <TableHead className="text-left text-gray-300 uppercase text-sm font-medium px-4 py-3">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-700">
            {items.map((item) => (
              <TableRow
                key={item.id}
                className="hover:bg-gray-800 transition-colors duration-200"
              >
                <TableCell className="px-4 py-3 font-medium text-gray-100">
                  {item.name}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-300">
                  {item.category ?? "-"}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-300">
                  {item.quantity}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-300">
                  {item.description ?? "-"}
                </TableCell>
                <TableCell className="px-4 py-3 flex gap-2 flex-wrap">
                  <EditItemDialog item={item} onUpdate={onUpdate} />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="hover:bg-red-600"
                    onClick={() => onDelete(item.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden flex flex-col gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-gray-950 rounded-lg shadow-lg p-4 hover:bg-gray-900 transition-colors duration-200"
          >
            <div className="flex flex-col gap-1">
              <span className="text-gray-300 font-semibold">Name:</span>
              <span className="text-gray-100">{item.name}</span>

              <span className="text-gray-300 font-semibold mt-1">
                Category:
              </span>
              <span className="text-gray-300">{item.category ?? "-"}</span>

              <span className="text-gray-300 font-semibold mt-1">
                Quantity:
              </span>
              <span className="text-gray-300">{item.quantity}</span>

              <span className="text-gray-300 font-semibold mt-1">
                Description:
              </span>
              <span className="text-gray-300">{item.description ?? "-"}</span>
            </div>

            <div className="flex gap-2 flex-wrap mt-3">
              <EditItemDialog item={item} onUpdate={onUpdate} />
              <Button
                variant="destructive"
                size="sm"
                className="hover:bg-red-600"
                onClick={() => onDelete(item.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
