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
import ItemDetails from "./item-details";

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
  const categories = {
    Appliances: items.filter((i) => i.category === "Appliances"),
    "Home & Living": items.filter((i) => i.category === "Home & Living"),
    Gadgets: items.filter((i) => i.category === "Gadgets"),
    "Home Cleaning": items.filter((i) => i.category === "Home Cleaning"),
  };

  return (
    <div className="flex flex-col gap-10">
      {Object.entries(categories).map(([categoryName, categoryItems]) => (
        <div key={categoryName} className="w-full">
          <h2 className="text-xl font-bold mb-4 text-gray-300">
            {categoryName}
          </h2>
          <div className={inventoryTableStyles.desktopWrapper}>
            <Table className={inventoryTableStyles.table}>
              <TableHeader className={inventoryTableStyles.tableHeader}>
                <TableRow>
                  <TableHead className={inventoryTableStyles.tableHead}>
                    Name
                  </TableHead>
                  <TableHead className={inventoryTableStyles.tableHead}>
                    Category
                  </TableHead>
                  <TableHead className={inventoryTableStyles.tableHead}>
                    Quantity
                  </TableHead>
                  <TableHead className={inventoryTableStyles.tableHead}>
                    Description
                  </TableHead>
                  <TableHead className={inventoryTableStyles.tableHead}>
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-600">
                {categoryItems.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-4 text-gray-400"
                    >
                      No items found in this category.
                    </TableCell>
                  </TableRow>
                ) : (
                  categoryItems.map((item) => (
                    <TableRow
                      key={item.id}
                      className={inventoryTableStyles.tableRowHover}
                    >
                      <TableCell className={inventoryTableStyles.tableCellName}>
                        <ItemDetails item={item}>
                          <span className="cursor-pointer hover:underline hover:text-blue-300 text-white">
                            {item.name}
                          </span>
                        </ItemDetails>
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
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="sm:hidden flex flex-col gap-4 mt-4">
            {categoryItems.length === 0 ? (
              <p className="text-gray-400 text-center">
                No items found in this category.
              </p>
            ) : (
              categoryItems.map((item) => (
                <div key={item.id} className={inventoryTableStyles.mobileCard}>
                  <div className="flex flex-col gap-1">
                    <ItemDetails item={item}>
                      <span className={inventoryTableStyles.mobileLabel}>
                        Name:
                      </span>
                    </ItemDetails>
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
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
