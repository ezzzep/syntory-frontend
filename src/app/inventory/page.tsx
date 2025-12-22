"use client";

import InventoryTable from "@/components/inventory/inventoryTable/InventoryTable";
import { Skeleton } from "@/components/ui/skeleton";
import { useInventoryState } from "@/hooks/useInventoryState";

export default function InventoryPage() {
  const { items, loading, handleDelete, handleAdd, handleUpdate } =
    useInventoryState();

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-linear-to-br from-slate-950 via-indigo-950 to-slate-950 text-white font-sans p-3 sm:p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 md:mb-10 pb-5">
          <div className="mb-4 sm:mb-0">
            <Skeleton className="h-10 sm:h-12 md:h-14 w-64 bg-slate-800" />
          </div>
        </div>

        <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl border border-slate-700/50">

          <div className="mb-4">
            <div className="flex justify-between items-center mb-4">
              <Skeleton className="h-10 w-48 bg-slate-700" />
              <Skeleton className="h-10 w-24 bg-slate-700" />
            </div>
          </div>

          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="border-b border-slate-700/50 pb-3">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                  <Skeleton className="h-6 bg-slate-700 rounded" />
                  <Skeleton className="h-6 bg-slate-700 rounded" />
                  <Skeleton className="h-6 bg-slate-700 rounded" />
                  <Skeleton className="h-6 bg-slate-700 rounded" />
                  <Skeleton className="h-6 bg-slate-700 rounded" />
                  <div className="flex space-x-2">
                    <Skeleton className="h-8 w-8 bg-slate-700 rounded" />
                    <Skeleton className="h-8 w-8 bg-slate-700 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-6">
            <Skeleton className="h-6 w-32 bg-slate-700" />
            <div className="flex space-x-2">
              <Skeleton className="h-8 w-8 bg-slate-700 rounded" />
              <Skeleton className="h-8 w-8 bg-slate-700 rounded" />
              <Skeleton className="h-8 w-8 bg-slate-700 rounded" />
              <Skeleton className="h-8 w-8 bg-slate-700 rounded" />
              <Skeleton className="h-8 w-8 bg-slate-700 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-slate-950 via-indigo-950 to-slate-950 text-white font-sans p-3 sm:p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 md:mb-10 pb-5">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent pb-2">
            Inventory Management
          </h1>
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
