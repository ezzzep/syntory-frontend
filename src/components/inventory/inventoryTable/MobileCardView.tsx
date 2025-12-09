import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { inventoryTableStyles } from "@/styles/inventory/inventoryTable";
import EditItemDialog from "../edit-item-dialog";
import ItemDetails from "../item-details";
import type { InventoryItem } from "@/types/inventory";
import EmptyState from "./EmptyState";

interface MobileCardViewProps {
  filteredItems: InventoryItem[];
  selectedItems: number[];
  handleSelectItem: (id: number, checked: boolean) => void;
  handleDeleteClick: (item: InventoryItem) => void;
  isDeleting: boolean;
  searchTerm: string;
  onUpdate: (updatedItem: InventoryItem) => void; 
}

export default function MobileCardView({
  filteredItems,
  selectedItems,
  handleSelectItem,
  handleDeleteClick,
  isDeleting,
  searchTerm,
  onUpdate, 
}: MobileCardViewProps) {
  if (filteredItems.length === 0) {
    return <EmptyState searchTerm={searchTerm} />;
  }

  return (
    <div className="sm:hidden flex flex-col gap-4">
      {filteredItems.map((item) => (
        <div
          key={item.id}
          className={`${inventoryTableStyles.mobileCard} ${
            selectedItems.includes(item.id) ? "ring-2 ring-blue-500/50" : ""
          }`}
        >
          <div className="flex items-start gap-3 mb-4">
            <input
              type="checkbox"
              checked={selectedItems.includes(item.id)}
              onChange={(e) => handleSelectItem(item.id, e.target.checked)}
              className={`${inventoryTableStyles.checkbox} mt-1 ${
                selectedItems.includes(item.id)
                  ? inventoryTableStyles.checkboxChecked
                  : ""
              }`}
            />
            <div className="flex-1 min-w-0">
              <ItemDetails item={item}>
                <span className="font-medium text-white cursor-pointer hover:text-blue-300 transition-colors truncate block">
                  {item.name}
                </span>
              </ItemDetails>
            </div>
            <div className="flex items-center gap-2">
              <span className={inventoryTableStyles.quantityNumber}>
                {item.quantity}
              </span>
              {item.quantity < 10 && (
                <div
                  className={inventoryTableStyles.quantityLowIndicator}
                  title="Low quantity"
                ></div>
              )}
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div>
              <span className={inventoryTableStyles.mobileLabel}>
                Category:{" "}
              </span>
              <span className={inventoryTableStyles.mobileValueSecondary}>
                {item.category ?? "-"}
              </span>
            </div>
            <div>
              <span className={inventoryTableStyles.mobileLabel}>
                Description:{" "}
              </span>
              <span
                className={inventoryTableStyles.mobileValueSecondary}
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {item.description ?? "-"}
              </span>
            </div>
          </div>

          <div className={inventoryTableStyles.mobileActions}>
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
          </div>
        </div>
      ))}
    </div>
  );
}
