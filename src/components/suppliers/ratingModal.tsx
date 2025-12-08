"use client";

import { Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Supplier } from "@/types/supplier";

type RatingCategory = "overall" | "quality" | "delivery" | "communication";

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  supplier: Supplier | null;
  rating: {
    overall: number;
    quality: number;
    delivery: number;
    communication: number;
  };
  onRatingChange: (category: RatingCategory, value: number) => void;
}

export default function RatingModal({
  isOpen,
  onClose,
  onConfirm,
  supplier,
  rating,
  onRatingChange,
}: RatingModalProps) {
  const renderStars = (
    ratingValue: number,
    onChange?: (value: number) => void
  ) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= ratingValue
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-400"
            } ${onChange ? "cursor-pointer" : ""}`}
            onClick={() => onChange && onChange(star)}
          />
        ))}
      </div>
    );
  };

  if (!isOpen || !supplier) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-xl border border-indigo-900/30 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Rate Supplier</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-md hover:bg-white/10 transition-colors"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
          </div>

          <div className="mb-6">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold mr-3">
                {supplier.name.charAt(0)}
              </div>
              <div>
                <div className="text-lg font-medium text-white">
                  {supplier.name}
                </div>
                <div className="text-sm text-gray-400">
                  {supplier.contactPerson}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-300">
                  Overall Service Rating
                </label>
                <span className="text-sm text-gray-400">
                  {rating.overall}/5
                </span>
              </div>
              {renderStars(rating.overall, (value) =>
                onRatingChange("overall", value)
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-300">
                  Quality of Products
                </label>
                <span className="text-sm text-gray-400">
                  {rating.quality}/5
                </span>
              </div>
              {renderStars(rating.quality, (value) =>
                onRatingChange("quality", value)
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-300">
                  Delivery Time
                </label>
                <span className="text-sm text-gray-400">
                  {rating.delivery}/5
                </span>
              </div>
              {renderStars(rating.delivery, (value) =>
                onRatingChange("delivery", value)
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-300">
                  Communication
                </label>
                <span className="text-sm text-gray-400">
                  {rating.communication}/5
                </span>
              </div>
              {renderStars(rating.communication, (value) =>
                onRatingChange("communication", value)
              )}
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <Button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-700 transition-colors"
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 text-white rounded-md hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 transition-all duration-200"
            >
              Submit Rating
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
