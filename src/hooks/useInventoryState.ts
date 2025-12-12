import { useState, useEffect } from "react";
import type { InventoryItem } from "@/types/inventory";
import { getInventory, deleteInventoryItem } from "@/lib/api/inventory";

export function useInventoryState() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getInventory();
        setItems(data.sort((a, b) => b.id - a.id));
      } catch (err) {
        setError("Failed to load inventory. Please try again later.");
        console.error("Failed to fetch inventory:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    if (deletingIds.has(id)) return; 

    const originalItems = [...items];

    setItems((prev) => prev.filter((i) => i.id !== id));
   setDeletingIds((prev) => new Set(prev).add(id));

    try {
      await deleteInventoryItem(id);
    } catch (err) {
      setItems(originalItems);
      setError("Failed to delete item. Please try again.");
      console.error("Failed to delete item:", err);
    } finally {
      setDeletingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleAdd = (item: InventoryItem) => {
    setItems((prev) => [item, ...prev].sort((a, b) => b.id - a.id));
    setError(null); 
  };

  const handleUpdate = (updatedItem: InventoryItem) => {
    setItems((prev) =>
      prev
        .map((i) => (i.id === updatedItem.id ? updatedItem : i))
        .sort((a, b) => b.id - a.id)
    );
    setError(null); 
  };

  return {
    items,
    loading,
    error,
    deletingIds,
    handleDelete,
    handleAdd,
    handleUpdate,
  };
}
