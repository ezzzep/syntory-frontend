"use client";

import { useEffect, useState } from "react";
import { getMarketRecommendations } from "@/lib/api/analyticsMarket";

type MarketRecommendation = {
  id: number;
  keyword: string;
  current_price: number;
  market_avg_price: number;
  price_trend: string;
  demand_trend: string;
  recommendation: string;
};

export default function MarketInsightsCard() {
  const [data, setData] = useState<MarketRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);

  useEffect(() => {
    getMarketRecommendations()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const calculatePriceDeviation = (current: number, market: number): number => {
    if (market === 0 || current === 0) return 0;
    return Math.abs(((current - market) / market) * 100);
  };

  const getPriceStatusColor = (percentage: number) => {
    if (percentage > 20) return "text-red-400";
    if (percentage < -15) return "text-green-400";
    return "text-yellow-400";
  };

  const getPriceStatusIcon = (trend: string) => {
    switch (trend) {
      case "Up":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-green-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "Down":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-red-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-yellow-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
        );
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

  if (loading) {
    return (
      <div className="p-6 rounded-xl bg-slate-900 text-white">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-sm">Loading market insights...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-xl bg-slate-900 text-white">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Market Insights</h3>
        <div className="flex items-center space-x-2 text-sm text-slate-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <span>Live Market Data</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map((item) => {

          const priceDeviation = calculatePriceDeviation(
            item.current_price,
            item.market_avg_price
          );
          const priceDifferencePercentage =
            ((item.current_price - item.market_avg_price) /
              item.market_avg_price) *
            100;

          const isSelected = selectedKeyword === item.keyword;

          return (
            <div
              key={item.id}
              className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
                isSelected
                  ? "border-blue-500 bg-blue-950/30 shadow-lg"
                  : "border-slate-700 hover:border-slate-600 hover:bg-slate-800/50"
              }`}
              onClick={() =>
                setSelectedKeyword(isSelected ? null : item.keyword)
              }
            >
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold text-lg">{item.keyword}</h4>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                  {/* --- UPDATED LABEL AND VALUE --- */}
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
                  <div
                    className={`h-2 rounded-full ${
                      priceDifferencePercentage > 0
                        ? "bg-red-500"
                        : "bg-green-500"
                    }`}
                    style={{
                      width: `${Math.min(
                        100,
                        Math.abs(priceDifferencePercentage)
                      )}%`,
                    }}
                  ></div>
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
                <div className="mt-3 pt-3 border-t border-slate-700">
                  <div className="flex items-start space-x-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-400 mt-0.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-sm text-blue-300 italic">
                      {item.recommendation}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {data.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-slate-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <p>No market insights available at the moment.</p>
        </div>
      )}
    </div>
  );
}
