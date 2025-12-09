import { Inbox } from "lucide-react";
import { inventoryTableStyles } from "@/styles/inventory/inventoryTable";

interface EmptyStateProps {
  searchTerm: string;
}

export default function EmptyState({ searchTerm }: EmptyStateProps) {
  return (
    <div className={inventoryTableStyles.emptyState}>
      <Inbox className={inventoryTableStyles.emptyStateIcon} />
      <p className="text-lg font-medium mb-2">
        {searchTerm
          ? "No items found matching your search."
          : "No items found in this category."}
      </p>
      <p className="text-sm">
        {searchTerm
          ? "Try adjusting your search terms."
          : "Items will appear here once added."}
      </p>
    </div>
  );
}
