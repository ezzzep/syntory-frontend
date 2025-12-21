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
  confidence_score: number;
};

export default function MarketInsightsCard() {
  const [data, setData] = useState<MarketRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMarketRecommendations()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-4 rounded-xl bg-slate-900 text-white">
        Loading market insights...
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl bg-slate-900 text-white">
      <h3 className="text-lg font-semibold mb-3">Market Insights</h3>

      <div className="space-y-3">
        {data.map((item) => {
          const overpriced = item.current_price > item.market_avg_price * 1.2;

          return (
            <div
              key={item.id}
              className={`p-3 rounded-lg border ${
                overpriced ? "border-red-500 bg-red-950/30" : "border-slate-700"
              }`}
            >
              <div className="flex justify-between">
                <span className="font-medium">{item.keyword}</span>
                <span className="text-sm opacity-70">
                  Confidence: {item.confidence_score}%
                </span>
              </div>

              <div className="text-sm mt-1">
                Your Price: ₱{item.current_price} <br />
                Market Avg: ₱{item.market_avg_price}
              </div>

              <div className="text-sm mt-1">
                Price Trend: {item.price_trend} <br />
                Demand Trend: {item.demand_trend}
              </div>

              <p className="text-sm mt-2 italic text-blue-300">
                {item.recommendation}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
