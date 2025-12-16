"use client";

import { Package } from "lucide-react";
import type { InventoryItem } from "@/types/inventory";
import { supplierItemsCardStyles } from "@/styles/supplierStatus/supplierItemsCardStyles";

interface SupplierItemsCardProps {
  items: InventoryItem[];
  loading?: boolean;
}

export function SupplierItemsCard({
  items,
  loading = false,
}: SupplierItemsCardProps) {
  return (
    <div className={supplierItemsCardStyles.card}>
      <div className={supplierItemsCardStyles.header}>
        <div className={supplierItemsCardStyles.titleContainer}>
          <Package className={supplierItemsCardStyles.icon} />
          <h3 className={supplierItemsCardStyles.title}>Supplier Items</h3>
        </div>
      </div>

      <div className={supplierItemsCardStyles.content}>
        {loading ? (
          <div className={supplierItemsCardStyles.loadingContainer}>
            <div className={supplierItemsCardStyles.spinner}></div>
            <p className={supplierItemsCardStyles.loadingText}>
              Loading items...
            </p>
          </div>
        ) : items.length > 0 ? (
          <div className={supplierItemsCardStyles.itemsGrid}>
            {items.map((item) => (
              <div key={item.id} className={supplierItemsCardStyles.itemCard}>
                <div className={supplierItemsCardStyles.itemName}>
                  {item.name}
                </div>
                <div className={supplierItemsCardStyles.itemDetails}>
                  <span className={supplierItemsCardStyles.quantityBadge}>
                    Qty: {item.quantity}
                  </span>
                  <span className={supplierItemsCardStyles.categoryBadge}>
                    {item.category}
                  </span>
                </div>
                {item.description && (
                  <p className={supplierItemsCardStyles.itemDescription}>
                    {item.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className={supplierItemsCardStyles.emptyState}>
            <Package className={supplierItemsCardStyles.emptyIcon} />
            <h4 className={supplierItemsCardStyles.emptyTitle}>No items yet</h4>
            <p className={supplierItemsCardStyles.emptyDescription}>
              Items added to this supplier will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
