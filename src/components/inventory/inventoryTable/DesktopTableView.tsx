import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { inventoryTableStyles } from "@/styles/inventory/inventoryTable";
import EditItemDialog from "../edit-item-dialog";
import ItemDetails from "../item-details";
import type { InventoryItem } from "@/types/inventory";
import EmptyState from "./EmptyState";

interface DesktopTableViewProps {
  filteredItems: InventoryItem[];
  selectedItems: number[];
  handleSelectAll: (checked: boolean) => void;
  handleSelectItem: (id: number, checked: boolean) => void;
  handleDeleteClick: (item: InventoryItem) => void;
  isDeleting: boolean;
  searchTerm: string;
  onUpdate: (updatedItem: InventoryItem) => void; 
}

export default function DesktopTableView({
  filteredItems,
  selectedItems,
  handleSelectAll,
  handleSelectItem,
  handleDeleteClick,
  isDeleting,
  searchTerm,
  onUpdate,
}: DesktopTableViewProps) {
  const isAllSelected =
    filteredItems.length > 0 && selectedItems.length === filteredItems.length;
  const isIndeterminate =
    selectedItems.length > 0 && selectedItems.length < filteredItems.length;

  return (
    <div className={inventoryTableStyles.desktopWrapper}>
      <Table
        className={inventoryTableStyles.table}
        style={{ tableLayout: "fixed", minWidth: "1100px" }}
      >
        <TableHeader className={inventoryTableStyles.tableHeader}>
          <TableRow>
            <TableHead
              className={inventoryTableStyles.tableHeadCell}
              style={{ width: "60px" }}
            >
              <input
                type="checkbox"
                checked={isAllSelected}
                ref={(el) => {
                  if (el) el.indeterminate = isIndeterminate;
                }}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className={`${inventoryTableStyles.checkbox} ${
                  isAllSelected ? inventoryTableStyles.checkboxChecked : ""
                }`}
              />
            </TableHead>
            <TableHead
              className={inventoryTableStyles.tableHeadCell}
              style={{ width: "250px" }}
            >
              Name
            </TableHead>
            <TableHead
              className={inventoryTableStyles.tableHeadCell}
              style={{ width: "180px" }}
            >
              Category
            </TableHead>
            <TableHead
              className={inventoryTableStyles.tableHeadCell}
              style={{ width: "120px" }}
            >
              Quantity
            </TableHead>
            <TableHead
              className={inventoryTableStyles.tableHeadCell}
              style={{ width: "300px" }}
            >
              Description
            </TableHead>
            <TableHead
              className={inventoryTableStyles.tableHeadCell}
              style={{ width: "180px" }}
            >
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredItems.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className={inventoryTableStyles.emptyState}
              >
                <EmptyState searchTerm={searchTerm} />
              </TableCell>
            </TableRow>
          ) : (
            filteredItems.map((item) => (
              <TableRow
                key={item.id}
                className={`${inventoryTableStyles.tableRowHover} ${
                  selectedItems.includes(item.id) ? "bg-slate-700/10" : ""
                }`}
              >
                <TableCell className={inventoryTableStyles.tableCell}>
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={(e) =>
                      handleSelectItem(item.id, e.target.checked)
                    }
                    className={`${inventoryTableStyles.checkbox} ${
                      selectedItems.includes(item.id)
                        ? inventoryTableStyles.checkboxChecked
                        : ""
                    }`}
                  />
                </TableCell>
                <TableCell className={inventoryTableStyles.tableCellName}>
                  <ItemDetails item={item}>
                    <span className="cursor-pointer hover:text-blue-300 transition-colors truncate block">
                      {item.name}
                    </span>
                  </ItemDetails>
                </TableCell>

                <TableCell className={inventoryTableStyles.tableCell}>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-700/30 text-slate-300 border border-slate-600/30 truncate">
                    {item.category ?? "-"}
                  </span>
                </TableCell>

                <TableCell className={inventoryTableStyles.tableCell}>
                  <div className="flex items-center gap-2">
                    <span className={inventoryTableStyles.quantityNumber}>
                      {item.quantity}
                    </span>
                    {item.quantity < 10 && (
                      <div
                        className={inventoryTableStyles.quantityLowIndicator}
                        title="Low stocks"
                      ></div>
                    )}
                  </div>
                </TableCell>

                <TableCell
                  className={inventoryTableStyles.tableCellDescription}
                  title={item.description || ""}
                >
                  {item.description ?? "-"}
                </TableCell>

                <TableCell className={inventoryTableStyles.actionCell}>
                  <EditItemDialog item={item} onUpdate={onUpdate} />
                  <Button
                    variant="outline"
                    size="sm"
                    className={inventoryTableStyles.button}
                    onClick={() => handleDeleteClick(item)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
