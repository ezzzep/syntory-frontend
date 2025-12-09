"use client";

import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number | string;
}

export default function StarRating({ rating }: StarRatingProps) {
  const ratingValue = parseFloat(String(rating)) || 0;
  const fullStars = Math.floor(ratingValue);
  const hasHalfStar = ratingValue % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center">
      <div className="flex space-x-1">
        {[...Array(fullStars)].map((_, i) => (
          <Star
            key={`full-${i}`}
            className="h-5 w-5 fill-yellow-400 text-yellow-400"
          />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <Star className="h-5 w-5 text-gray-400" />
            <div className="absolute top-0 left-0 overflow-hidden w-1/2">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="h-5 w-5 text-gray-400" />
        ))}
      </div>
      <span className="ml-2 text-sm text-gray-300">
        {ratingValue.toFixed(1)}/5
      </span>
    </div>
  );
}
