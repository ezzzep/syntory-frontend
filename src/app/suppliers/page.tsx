"use client";

import { useEffect, useState } from "react";
import type { Supplier } from "@/types/supplier";
import { getSuppliers, deleteSupplier } from "@/lib/api/suppliers";
import SuppliersTable from "@/components/suppliers/suppliersTable";
import { BouncingDots } from "@/components/ui/bouncing-dots";

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getSuppliers();
      setSuppliers(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    await deleteSupplier(id);
    setSuppliers((prev) => prev.filter((s) => s.id !== id));
  };

  const handleAdd = (supplier: Supplier) =>
    setSuppliers((prev) => [...prev, supplier]);

  const handleUpdate = (updatedSupplier: Supplier) =>
    setSuppliers((prev) =>
      prev.map((s) => (s.id === updatedSupplier.id ? updatedSupplier : s))
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
            Supplier Management
          </h1>
        </div>
      </div>

      <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl border border-slate-700/50 hover:shadow-2xl transition-all duration-300">
        <SuppliersTable
          suppliers={suppliers}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
          onAdd={handleAdd}
        />
      </div>
    </div>
  );
}
