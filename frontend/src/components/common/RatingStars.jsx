import React from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({ rating = 0, numReviews = null, size = 'sm', interactive = false, onRatingChange = null }) => {
  const stars = [1, 2, 3, 4, 5];
  const starSize = size === 'lg' ? 'w-6 h-6' : size === 'md' ? 'w-5 h-5' : 'w-4 h-4';

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center">
        {stars.map((starIndex) => {
          const filled = rating >= starIndex;
          const halfFilled = rating >= starIndex - 0.5 && rating < starIndex;

          return (
            <button
              type={interactive ? 'button' : undefined}
              key={starIndex}
              disabled={!interactive}
              onClick={() => interactive && onRatingChange && onRatingChange(starIndex)}
              className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'} p-0.5`}
            >
              <Star
                className={`${starSize} transition-colors ${
                  filled
                    ? 'fill-amber-400 text-amber-400'
                    : halfFilled
                    ? 'fill-amber-400/50 text-amber-400'
                    : 'fill-slate-100 text-slate-300'
                }`}
              />
            </button>
          );
        })}
      </div>
      {numReviews !== null && (
        <span className="text-xs font-semibold text-slate-500">
          {rating ? Number(rating).toFixed(1) : '0.0'} ({numReviews})
        </span>
      )}
    </div>
  );
};

export default RatingStars;
