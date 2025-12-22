"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getMarketRecommendations } from "@/lib/api/analyticsMarket";
import InventoryPagination from "@/components/inventory/inventoryTable/InventoryPagination";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  AlertCircle,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type MarketRecommendation = {
  id: number;
  keyword: string;
  current_price: number;
  market_avg_price: number;
  price_trend: string;
  demand_trend: string;
};

export default function MarketInsightsCard() {
  const [data, setData] = useState<MarketRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 4;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const recommendations = await getMarketRecommendations();
        setData(recommendations);
        setCurrentPage(1);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError("Failed to load market insights.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const { paginatedData, totalPages } = useMemo(() => {
    const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedData = data.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    return { paginatedData, totalPages };
  }, [data, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setSelectedKeyword(null);
    }
  };

  const calculatePriceDeviation = (current: number, market: number): number => {
    if (market === 0 || current === 0) return 0;
    return Math.abs(((current - market) / market) * 100);
  };

  const calculateRecommendation = (
    currentPrice: number,
    marketAvgPrice: number,
    priceTrend: string,
    demandTrend: string
  ): string => {
    const priceGapPercent =
      ((currentPrice - marketAvgPrice) / marketAvgPrice) * 100;

    if (priceGapPercent > 20) {
      return "Your average price is significantly above market. Consider lowering prices.";
    }

    if (priceGapPercent < -15) {
      return demandTrend === "Rising"
        ? "Strong demand detected and you are underpriced. Consider increasing prices."
        : "Your average price is significantly below market. You may be losing profit.";
    }

    if (priceTrend === "Down" && demandTrend === "Falling") {
      return "Market is cooling. Avoid overstocking.";
    }

    if (priceGapPercent < -5) {
      return "Your price is slightly below market average.";
    }

    if (priceGapPercent > 5) {
      return "Your price is slightly above market average.";
    }

    return "Pricing is aligned with current market conditions.";
  };

  const getPriceStatusColor = (percentage: number) => {
    if (percentage > 20) return "text-red-400";
    if (percentage < -15) return "text-green-400";
    return "text-yellow-400";
  };

  const getPriceStatusIcon = (trend: string) => {
    switch (trend) {
      case "Up":
        return <TrendingUp className="h-5 w-5 text-green-400" />;
      case "Down":
        return <TrendingDown className="h-5 w-5 text-red-400" />;
      default:
        return <Minus className="h-5 w-5 text-yellow-400" />;
    }
  };

  const getDemandTrendIcon = (trend: string) => {
    switch (trend) {
      case "Rising":
        return (
          <div className="flex space-x-1">
            <div className="w-1 h-3 bg-green-400 rounded"></div>
            <div className="w-1 h-4 bg-green-400 rounded"></div>
            <div className="w-1 h-5 bg-green-400 rounded"></div>
          </div>
        );
      case "Falling":
        return (
          <div className="flex space-x-1">
            <div className="w-1 h-5 bg-red-400 rounded"></div>
            <div className="w-1 h-4 bg-red-400 rounded"></div>
            <div className="w-1 h-3 bg-red-400 rounded"></div>
          </div>
        );
      default:
        return (
          <div className="flex space-x-1">
            <div className="w-1 h-4 bg-yellow-400 rounded"></div>
            <div className="w-1 h-4 bg-yellow-400 rounded"></div>
            <div className="w-1 h-4 bg-yellow-400 rounded"></div>
          </div>
        );
    }
  };

  const MarketInsightCard = ({
    item,
    index,
  }: {
    item: MarketRecommendation;
    index: number;
  }) => {
    const priceDeviation = calculatePriceDeviation(
      item.current_price,
      item.market_avg_price
    );
    const priceDifferencePercentage =
      ((item.current_price - item.market_avg_price) / item.market_avg_price) *
      100;
    const isSelected = selectedKeyword === item.keyword;

    // Calculate recommendation on the frontend
    const recommendation = calculateRecommendation(
      item.current_price,
      item.market_avg_price,
      item.price_trend,
      item.demand_trend
    );

    return (
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        whileHover={{ scale: 1.02, transition: { duration: 0.1 } }}
        className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
          isSelected
            ? "border-blue-500 bg-blue-950/30 shadow-lg"
            : "border-slate-700 hover:border-slate-600 hover:bg-slate-800/50"
        }`}
        onClick={() => setSelectedKeyword(isSelected ? null : item.keyword)}
      >
        <div className="flex justify-between items-start mb-3">
          <h4 className="font-semibold text-lg">{item.keyword}</h4>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-xs opacity-70">
              Deviation: {priceDeviation.toFixed(2)}%
            </span>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-slate-400">Your Price</span>
            <span className="font-medium">₱{item.current_price}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-400">Market Avg</span>
            <span className="font-medium">₱{item.market_avg_price}</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <motion.div
              className={`h-2 rounded-full ${
                priceDifferencePercentage > 0 ? "bg-red-500" : "bg-green-500"
              }`}
              animate={{
                width: `${Math.min(100, Math.abs(priceDifferencePercentage))}%`,
              }}
              transition={{ duration: 0.5 }}
              initial={false}
            />
          </div>
          <div
            className={`text-right text-sm mt-1 ${getPriceStatusColor(
              priceDifferencePercentage
            )}`}
          >
            {priceDifferencePercentage > 0 ? "+" : ""}
            {priceDifferencePercentage.toFixed(2)}% vs market
          </div>
        </div>

        <div className="flex justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-400">Price Trend:</span>
            <div className="flex items-center space-x-1">
              {getPriceStatusIcon(item.price_trend)}
              <span className="text-sm">{item.price_trend}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-400">Demand:</span>
            {getDemandTrendIcon(item.demand_trend)}
            <span className="text-sm">{item.demand_trend}</span>
          </div>
        </div>

        {isSelected && (
          <motion.div
            animate={{ opacity: 1, height: "auto" }}
            className="mt-3 pt-3 border-t border-slate-700"
          >
            <div className="flex items-start space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-400 mt-0.5" />
              <p className="text-sm text-blue-300 italic">{recommendation}</p>
            </div>
          </motion.div>
        )}
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="p-6 rounded-xl bg-slate-800/30 text-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Market Insights</h3>
          <div className="flex items-center space-x-2 text-sm text-slate-400">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span>Live Market Data</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
            <div key={index} className="p-4 rounded-lg border border-slate-700">
              <div className="flex justify-between items-start mb-3">
                <Skeleton className="h-6 w-32" />
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex justify-between items-center mb-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
                <Skeleton className="h-4 w-24 mt-1 ml-auto" />
              </div>

              <div className="flex justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-8" />
                </div>
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-16" />
                  <div className="flex space-x-1">
                    <Skeleton className="w-1 h-4 rounded" />
                    <Skeleton className="w-1 h-4 rounded" />
                    <Skeleton className="w-1 h-4 rounded" />
                  </div>
                  <Skeleton className="h-4 w-8" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-xl bg-slate-800/30  text-white">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Market Insights</h3>
        <div className="flex items-center space-x-2 text-sm text-slate-400">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
          <span>Live Market Data</span>
        </div>
      </div>

      <div className="flex-1 min-h-[300px]">
        <AnimatePresence mode="wait">
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
              <BarChart3 className="w-8 h-8" />
              <p className="text-sm">
                No market insights available at the moment.
              </p>
            </motion.div>
          )}

          {!loading && !error && paginatedData.length > 0 && (
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {paginatedData.map((item, index) => (
                <MarketInsightCard key={item.id} item={item} index={index} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <InventoryPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
