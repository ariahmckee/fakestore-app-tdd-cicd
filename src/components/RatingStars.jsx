import { useId } from "react";

function RatingStars({ rating }) {
  const id = useId();
  const numericRating = Number(rating);

  if (!Number.isFinite(numericRating)) {
    return <span className="rating-stars">Rating unavailable</span>;
  }

  return (
    <div
      className="rating-stars"
      aria-label={`Rating: ${numericRating.toFixed(1)} out of 5`}
    >
      <span className="rating-stars__icons" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((star) => {
          const fillAmount = Math.max(0, Math.min(1, numericRating - star + 1));
          const clipId = `${id}-rating-star-${star}`;

          return (
            <svg
              key={star}
              className="rating-stars__star"
              viewBox="0 0 24 24"
              role="img"
            >
              <defs>
                <clipPath id={clipId}>
                  <rect width={24 * fillAmount} height="24" />
                </clipPath>
              </defs>
              <path
                className="rating-stars__star-empty"
                d="M12 2.8 14.8 8.5 21.1 9.4 16.5 13.8 17.6 20 12 17.1 6.4 20 7.5 13.8 2.9 9.4 9.2 8.5 12 2.8Z"
              />
              <path
                className="rating-stars__star-fill"
                clipPath={`url(#${clipId})`}
                d="M12 2.8 14.8 8.5 21.1 9.4 16.5 13.8 17.6 20 12 17.1 6.4 20 7.5 13.8 2.9 9.4 9.2 8.5 12 2.8Z"
              />
            </svg>
          );
        })}
      </span>
      <span className="rating-stars__value">{numericRating.toFixed(1)}</span>
    </div>
  );
}

export default RatingStars;
