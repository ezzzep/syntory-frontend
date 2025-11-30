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
import { inventoryTableStyles } from "@/styles/inventoryTable";

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
    <div className={inventoryTableStyles.wrapper}>
      {/* Desktop / Tablet Table */}
      <div className={inventoryTableStyles.desktopWrapper}>
        <Table className={inventoryTableStyles.table}>
          <TableHeader className={inventoryTableStyles.tableHeader}>
            <TableRow>
              <TableHead className={inventoryTableStyles.tableHeadCell}>
                Name
              </TableHead>
              <TableHead className={inventoryTableStyles.tableHeadCell}>
                Category
              </TableHead>
              <TableHead className={inventoryTableStyles.tableHeadCell}>
                Quantity
              </TableHead>
              <TableHead className={inventoryTableStyles.tableHeadCell}>
                Description
              </TableHead>
              <TableHead className={inventoryTableStyles.tableHeadCell}>
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-700">
            {items.map((item) => (
              <TableRow
                key={item.id}
                className={inventoryTableStyles.tableRowHover}
              >
                <TableCell className={inventoryTableStyles.tableCellName}>
                  {item.name}
                </TableCell>
                <TableCell className={inventoryTableStyles.tableCell}>
                  {item.category ?? "-"}
                </TableCell>
                <TableCell className={inventoryTableStyles.tableCell}>
                  {item.quantity}
                </TableCell>
                <TableCell className={inventoryTableStyles.tableCell}>
                  {item.description ?? "-"}
                </TableCell>
                <TableCell className={inventoryTableStyles.actionCell}>
                  <EditItemDialog item={item} onUpdate={onUpdate} />
                  <Button
                    variant="outline"
                    size="sm"
                    className={inventoryTableStyles.button}
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
          <div key={item.id} className={inventoryTableStyles.mobileCard}>
            <div className="flex flex-col gap-1">
              <span className={inventoryTableStyles.mobileLabel}>Name:</span>
              <span className={inventoryTableStyles.mobileValue}>
                {item.name}
              </span>

              <span className={inventoryTableStyles.mobileLabel}>
                Category:
              </span>
              <span className={inventoryTableStyles.mobileValueSecondary}>
                {item.category ?? "-"}
              </span>

              <span className={inventoryTableStyles.mobileLabel}>
                Quantity:
              </span>
              <span className={inventoryTableStyles.mobileValueSecondary}>
                {item.quantity}
              </span>

              <span className={inventoryTableStyles.mobileLabel}>
                Description:
              </span>
              <span className={inventoryTableStyles.mobileValueSecondary}>
                {item.description ?? "-"}
              </span>
            </div>

            <div className={inventoryTableStyles.mobileActions}>
              <EditItemDialog item={item} onUpdate={onUpdate} />
              <Button
                variant="outline"
                size="sm"
                className={inventoryTableStyles.button}
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
