interface StarRatingProps {
  value: number;
  disabled: boolean;
  onRatingChange: (v: number) => void;
}

const StarRating = ({ value, disabled, onRatingChange }: StarRatingProps) => (
  <div className="flex space-x-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => onRatingChange(star)}
        disabled={disabled}
        className={`text-2xl transition-colors duration-100 star-button ${
          disabled
            ? "opacity-50"
            : star <= value
              ? "text-yellow-400"
              : "text-gray-300 hover:text-yellow-300"
        }`}
      >
        ★
      </button>
    ))}
  </div>
);

export default StarRating;
