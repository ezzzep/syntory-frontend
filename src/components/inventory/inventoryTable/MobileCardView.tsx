import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react";
import { inventoryTableStyles } from "@/styles/inventory/inventoryTable";
import { useRouter } from "next/navigation";
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
}: MobileCardViewProps) {
  const router = useRouter();
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
          {/* Header with checkbox */}
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
            <div className="flex-1">
              <div className="space-y-2">
                <div>
                  <span className={inventoryTableStyles.mobileLabel}>
                    Name:{" "}
                  </span>
                  <span className={inventoryTableStyles.mobileValueSecondary}>
                    {item.name ?? "-"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={inventoryTableStyles.mobileLabel}>
                    Quantity:{" "}
                  </span>
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
                  <div
                    className={`${inventoryTableStyles.mobileValueSecondary} inline-block`}
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      wordBreak: "break-word",
                      maxWidth: "100%",
                    }}
                  >
                    {item.description ?? "-"}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`flex justify-end gap-2 ${inventoryTableStyles.mobileActions}`}
          >
            <Button
              variant="outline"
              size="sm"
              className={inventoryTableStyles.ediItem}
              onClick={() => router.push(`/inventory/${item.id}`)}
            >
              <Edit className="w-4 h-4" />
            </Button>
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
