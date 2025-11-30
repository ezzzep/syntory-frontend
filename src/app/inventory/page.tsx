"use client";

import { useEffect, useState } from "react";
import type { InventoryItem } from "@/types/inventory";
import { getInventory, deleteInventoryItem } from "@/lib/api/inventory";
import InventoryTable from "@/components/inventory/inventory-table";
import AddItemDialog from "@/components/inventory/add-item-dialog";
import { BouncingDots } from "@/components/bouncing-dots";

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getInventory();
      setItems(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    await deleteInventoryItem(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleAdd = (item: InventoryItem) =>
    setItems((prev) => [...prev, item]);
  const handleUpdate = (updatedItem: InventoryItem) =>
    setItems((prev) =>
      prev.map((i) => (i.id === updatedItem.id ? updatedItem : i))
    );

 if (loading)
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center gap-4 bg-gray-900">
        <BouncingDots />
      </div>
    );

  return (
    <div className="p-6 min-h-screen bg-gray-900">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white">Inventory</h1>
        <AddItemDialog onAdd={handleAdd} />
      </div>

      <InventoryTable
        items={items}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
      />
    </div>
  );
}
