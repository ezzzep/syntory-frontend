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
    <Table className="bg-white shadow rounded-lg">
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id} className="hover:bg-gray-50 transition">
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.category ?? "-"}</TableCell>
            <TableCell>{item.quantity}</TableCell>
            <TableCell>{item.description ?? "-"}</TableCell>
            <TableCell className="flex gap-2">
              <EditItemDialog item={item} onUpdate={onUpdate} />
              <Button variant="destructive" onClick={() => onDelete(item.id)}>
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
