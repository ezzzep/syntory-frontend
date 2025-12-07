"use client";

import { useEffect, useState } from "react";
import type { InventoryItem } from "@/types/inventory";
import { getInventory, deleteInventoryItem } from "@/lib/api/inventory";
import InventoryTable from "@/components/inventory/inventory-table";
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
      <div className="w-full h-screen flex flex-col items-center justify-center gap-4 bg-linear-to-br from-slate-950 via-indigo-950 to-slate-950">
        <BouncingDots />
      </div>
    );

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-slate-950 via-indigo-950 to-slate-950 text-white font-sans p-3 sm:p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 md:mb-10 pb-5">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent pb-2">
            Inventory Management
          </h1>
          <div className="h-1 w-24 sm:w-32 bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 mt-3 sm:mt-4 rounded-full"></div>
        </div>
      </div>

      <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl border border-slate-700/50 hover:shadow-2xl transition-all duration-300">
        <InventoryTable
          items={items}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
          onAdd={handleAdd}
        />
      </div>
    </div>
  );
}
