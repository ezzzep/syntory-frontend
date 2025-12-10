"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const [internalRating, setInternalRating] = useState({
    overall: 0,
    quality: 0,
    delivery: 0,
    communication: 0,
  });

  const [hoveredRatings, setHoveredRatings] = useState({
    overall: 0,
    quality: 0,
    delivery: 0,
    communication: 0,
  });

  const [inputErrors, setInputErrors] = useState({
    overall: "",
    quality: "",
    delivery: "",
    communication: "",
  });

  const [inputValues, setInputValues] = useState({
    overall: "0",
    quality: "0",
    delivery: "0",
    communication: "0",
  });

  useEffect(() => {
    if (isOpen && supplier) {
      const overallRating = Number(supplier.rating) || 0;
      const qualityRating = Number(supplier.quality_rating) || 0;
      const deliveryRating = Number(supplier.delivery_rating) || 0;
      const communicationRating = Number(supplier.communication_rating) || 0;

      if (qualityRating || deliveryRating || communicationRating) {
        setInternalRating({
          overall: overallRating,
          quality: qualityRating,
          delivery: deliveryRating,
          communication: communicationRating,
        });
        setInputValues({
          overall: overallRating.toString(),
          quality: qualityRating.toString(),
          delivery: deliveryRating.toString(),
          communication: communicationRating.toString(),
        });
      } else {
        setInternalRating({
          overall: overallRating,
          quality: overallRating,
          delivery: overallRating,
          communication: overallRating,
        });
        setInputValues({
          overall: overallRating.toString(),
          quality: overallRating.toString(),
          delivery: overallRating.toString(),
          communication: overallRating.toString(),
        });
      }

      setHoveredRatings({
        overall: 0,
        quality: 0,
        delivery: 0,
        communication: 0,
      });

      setInputErrors({
        overall: "",
        quality: "",
        delivery: "",
        communication: "",
      });
    }
  }, [isOpen, supplier]);

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
          {Number(displayValue).toFixed(1)}/5
        </span>
      </div>
    );
  };

  const handleInternalRatingChange = (
    category: RatingCategory,
    value: number
  ) => {
    setInternalRating((prev) => ({
      ...prev,
      [category]: value,
    }));
    setInputValues((prev) => ({
      ...prev,
      [category]: value.toString(),
    }));
    onRatingChange(category, value);

    // Clear any input error for this category
    setInputErrors((prev) => ({
      ...prev,
      [category]: "",
    }));
  };

  const handleInputChange = (category: RatingCategory, value: string) => {
    // Update the input value immediately to allow backspace
    setInputValues((prev) => ({
      ...prev,
      [category]: value,
    }));

    // Only validate if the input is not empty
    if (value === "") {
      setInputErrors((prev) => ({
        ...prev,
        [category]: "",
      }));
      return;
    }

    const numValue = parseFloat(value);

    if (isNaN(numValue)) {
      setInputErrors((prev) => ({
        ...prev,
        [category]: "Invalid number",
      }));
      return;
    }

    if (numValue < 0 || numValue > 5) {
      setInputErrors((prev) => ({
        ...prev,
        [category]: "0-5 only",
      }));
      return;
    }

    // Clear any input error for this category
    setInputErrors((prev) => ({
      ...prev,
      [category]: "",
    }));

    // Update rating
    handleInternalRatingChange(category, numValue);
  };

  const handleSubmit = async () => {
    if (!supplier) return;

    // Validate all ratings
    let hasError = false;
    const newInputErrors = {
      overall: "",
      quality: "",
      delivery: "",
      communication: "",
    };

    Object.entries(internalRating).forEach(([category, value]) => {
      if (value < 0 || value > 5 || isNaN(value)) {
        newInputErrors[category as RatingCategory] = "0-5 only";
        hasError = true;
      }
    });

    if (hasError) {
      setInputErrors(newInputErrors);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const averageRating = parseFloat(
        (
          (internalRating.overall +
            internalRating.quality +
            internalRating.delivery +
            internalRating.communication) /
          4
        ).toFixed(1)
      );

      const updatedSupplier = {
        ...supplier,
        rating: averageRating,
        quality_rating: internalRating.quality,
        delivery_rating: internalRating.delivery,
        communication_rating: internalRating.communication,
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

  const renderRatingInput = (category: RatingCategory, label: string) => {
    return (
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-300">{label}</label>
        </div>
        <div className="flex items-center space-x-3 pr-8">
          <div className="flex-1">
            {renderStars(category, internalRating[category], (value) =>
              handleInternalRatingChange(category, value)
            )}
          </div>
          <div className="w-28 relative">
            <Input
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={inputValues[category]}
              onChange={(e) => handleInputChange(category, e.target.value)}
              className={`bg-slate-700/50 border ${
                inputErrors[category] ? "border-red-500" : "border-slate-600/40"
              } text-white text-center`}
            />
            {inputErrors[category] && (
              <p className="text-xs text-red-400 mt-1 whitespace-nowrap">
                {inputErrors[category]}
              </p>
            )}
          </div>
        </div>
      </div>
    );
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
              {renderRatingInput("overall", "Overall Service Rating")}
              {renderRatingInput("quality", "Quality of Products")}
              {renderRatingInput("delivery", "Delivery Time")}
              {renderRatingInput("communication", "Communication")}
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
