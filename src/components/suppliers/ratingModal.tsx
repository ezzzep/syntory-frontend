"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Supplier } from "@/types/supplier";
import { updateSupplier } from "@/lib/api/suppliers";

type RatingCategory = "overall" | "quality" | "delivery" | "communication";

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: (updatedSupplier: Supplier) => void; 
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [hoveredRatings, setHoveredRatings] = useState({
    overall: 0,
    quality: 0,
    delivery: 0,
    communication: 0,
  });

  const handleStarHover = (category: RatingCategory, value: number) => {
    setHoveredRatings((prev) => ({
      ...prev,
      [category]: value,
    }));
  };
  const handleStarHoverLeave = (category: RatingCategory) => {
    setHoveredRatings((prev) => ({
      ...prev,
      [category]: 0,
    }));
  };

  const renderStars = (
    category: RatingCategory,
    ratingValue: number,
    onChange?: (value: number) => void
  ) => {
    const displayValue = hoveredRatings[category] || ratingValue;
    const fullStars = Math.floor(displayValue);
    const hasHalfStar = displayValue % 1 >= 0.5;


    return (
      <div className="flex items-center">
        <div className="flex space-x-1">
          {[...Array(5)].map((_, i) => {
            const starValue = i + 1;
            const isFull = i < fullStars;
            const isHalf = i === fullStars && hasHalfStar;

            return (
              <div key={i} className="relative">
                <Star
                  className={`h-5 w-5 ${
                    isFull ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
                  } ${onChange ? "cursor-pointer" : ""}`}
                  onClick={() => onChange && onChange(starValue)}
                  onMouseEnter={() =>
                    onChange && handleStarHover(category, starValue)
                  }
                  onMouseLeave={() =>
                    onChange && handleStarHoverLeave(category)
                  }
                />
                {isHalf && (
                  <div className="absolute top-0 left-0 overflow-hidden w-1/2">
                    <Star
                      className="h-5 w-5 fill-yellow-400 text-yellow-400"
                      onClick={() => onChange && onChange(fullStars + 0.5)}
                      onMouseEnter={() =>
                        onChange && handleStarHover(category, fullStars + 0.5)
                      }
                      onMouseLeave={() =>
                        onChange && handleStarHoverLeave(category)
                      }
                    />
                  </div>
                )}
                {!isFull && !isHalf && (
                  <div
                    className="absolute top-0 left-0 overflow-hidden w-1/2 opacity-0 hover:opacity-100 transition-opacity"
                    onMouseEnter={() =>
                      onChange && handleStarHover(category, i + 0.5)
                    }
                    onMouseLeave={() =>
                      onChange && handleStarHoverLeave(category)
                    }
                  >
                    <Star
                      className="h-5 w-5 fill-yellow-400 text-yellow-400 cursor-pointer"
                      onClick={() => onChange && onChange(i + 0.5)}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <span className="ml-2 text-sm text-gray-400">
          {displayValue.toFixed(1)}/5
        </span>
      </div>
    );
  };

  const handleSubmit = async () => {
    if (!supplier) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const averageRating = parseFloat(
        (
          (rating.overall +
            rating.quality +
            rating.delivery +
            rating.communication) /
          4
        ).toFixed(1)
      );

      const updatedSupplier = {
        ...supplier,
        rating: averageRating,
      };
      await updateSupplier(supplier.id, updatedSupplier);
      if (onConfirm) {
        onConfirm(updatedSupplier);
      }
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update supplier rating"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && !isSubmitting && onClose()}
    >
      <DialogContent className="bg-slate-900 border border-indigo-900/30 text-white max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Rate Supplier
          </DialogTitle>
        </DialogHeader>

        {supplier && (
          <>
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold mr-3">
                  {supplier.name.charAt(0)}
                </div>
                <div>
                  <div className="text-lg font-medium text-white">
                    {supplier.name}
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-500/50 text-red-300 px-4 py-2 rounded-md mb-4">
                {error}
              </div>
            )}

            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-300">
                    Overall Service Rating
                  </label>
                </div>
                {renderStars("overall", rating.overall, (value) =>
                  onRatingChange("overall", value)
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-300">
                    Quality of Products
                  </label>
                </div>
                {renderStars("quality", rating.quality, (value) =>
                  onRatingChange("quality", value)
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-300">
                    Delivery Time
                  </label>
                </div>
                {renderStars("delivery", rating.delivery, (value) =>
                  onRatingChange("delivery", value)
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-300">
                    Communication
                  </label>
                </div>
                {renderStars("communication", rating.communication, (value) =>
                  onRatingChange("communication", value)
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1 px-4 py-2 bg-transparent text-white rounded-md hover:bg-slate-400 transition-colors border-slate-700 cursor-pointer"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-white rounded-md hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 transition-all duration-200 cursor-pointer"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Rating"}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
