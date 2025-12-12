/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, TrendingUp, AlertCircle } from "lucide-react";
import type { InventoryItem } from "@/types/inventory";
import type { OrderData } from "@/types/analytics";
import { getInventory } from "@/lib/api/inventory";
import InventoryPagination from "@/components/inventory/inventoryTable/InventoryPagination";

interface EnhancedOrderData extends OrderData {
  valuePercentage: number;
}

const getRecentOrdersData = (items: InventoryItem[]): EnhancedOrderData[] => {
  return items.map((item) => {
    const randomValue = Math.random() * 1000;
    return {
      product: item.name,
      category: item.category ?? "N/A",
      value: randomValue.toFixed(2),
      valuePercentage: (randomValue / 1000) * 100,
    };
  });
};

const OrderCard = ({
  order,
  index,
}: {
  order: EnhancedOrderData;
  index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: index * 0.05 }}
    whileHover={{ scale: 1.02, transition: { duration: 0.1 } }}
    className="flex items-center justify-between p-5 bg-slate-800/30 rounded-xl border border-slate-700/50 hover:border-slate-600/50 hover:shadow-lg cursor-pointer group"
  >
    <div className="flex items-center space-x-4 flex-1 min-w-0">
      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
        <Package className="w-6 h-6 text-blue-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate group-hover:text-blue-400 transition-colors">
          {order.product}
        </p>
        <p className="text-sm text-slate-400">{order.category}</p>
      </div>
    </div>

    <div className="flex items-center space-x-3 flex-shrink-0">
      <div className="text-right">
        <p className="text-sm font-semibold text-green-400">${order.value}</p>
        <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden mt-1">
          <motion.div
            className="h-full bg-gradient-to-r from-green-400 to-blue-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${order.valuePercentage}%` }}
            transition={{ duration: 0.5, delay: index * 0.05 + 0.2 }}
          />
        </div>
      </div>
      <TrendingUp className="w-5 h-5 text-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  </motion.div>
);

export default function RecentOrdersTable() {
  const [allItems, setAllItems] = useState<EnhancedOrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 4; 

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const inventoryItems = await getInventory();
        const transformedData = getRecentOrdersData(inventoryItems);
        setAllItems(transformedData);
        setCurrentPage(1); 
      } catch (err: any) {
        setError("Failed to load recent orders.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const { paginatedData, totalPages } = useMemo(() => {
    const totalPages = Math.ceil(allItems.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedData = allItems.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
    return { paginatedData, totalPages };
  }, [allItems, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md p-4 sm:p-5 rounded-2xl sm:rounded-3xl shadow-xl border border-slate-700/50 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <h2 className="text-lg sm:text-xl font-semibold">Recent Orders</h2>
        <button className="px-3 py-1.5 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-colors text-xs">
          Filter
        </button>
      </div>

      <div className="flex-1 min-h-[300px]">
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12 space-y-4"
            >
              <motion.div
                className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <p className="text-slate-400 text-sm">Loading recent orders...</p>
            </motion.div>
          )}

          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12 space-y-4 text-red-400"
            >
              <AlertCircle className="w-8 h-8" />
              <p className="text-sm">{error}</p>
            </motion.div>
          )}

          {!loading && !error && paginatedData.length === 0 && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12 space-y-4 text-slate-400"
            >
              <Package className="w-8 h-8" />
              <p className="text-sm">No recent orders found.</p>
            </motion.div>
          )}

          {!loading && !error && paginatedData.length > 0 && (
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {paginatedData.map((order, index) => (
                <OrderCard
                  key={`${order.product}-${currentPage}`}
                  order={order}
                  index={index}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <InventoryPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
