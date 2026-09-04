import { Heart, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function WishlistButton({
  variant,
  isWishlisted,
  loading,
  disabled = false,
  onToggle,
  size = "default",
  className = "",
}) {
  const handleClick = (event) => onToggle(variant, event);

  const label = isWishlisted ? "Remove from wishlist" : "Add to wishlist";

  if (size === "icon-sm") {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={loading || disabled}
        className={`grid h-7 w-7 place-items-center rounded-full border border-white/80 bg-white/95 text-gray-600 shadow-md backdrop-blur-sm transition-all active:scale-90 disabled:opacity-60 ${className}`}
        aria-label={label}
      >
        <Heart
          className={`h-3.5 w-3.5 transition-all ${
            isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"
          }`}
        />
      </button>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleClick}
      disabled={loading || disabled}
      className={`h-11 w-11 shrink-0 rounded-xl p-0 text-muted transition-colors hover:bg-gray-200/70 hover:text-primary ${className}`}
      aria-label={label}
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <Heart
          className={`h-5 w-5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`}
        />
      )}
    </Button>
  );
}
