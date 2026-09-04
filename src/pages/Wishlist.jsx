import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Heart, ArrowLeft, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import { useCart } from "@/context/CartContext";
import { useProductApi } from "@/api/products";
import { formatINR } from "@/lib/utils";
import { toast } from "sonner";
import { MobileNumberContext } from "@/context/MobileNumberContext";

const getMediaUrl = (media) =>
  media?.productImgUrl || media?.image || media?.file || media?.url || "";

function WishlistSkeleton() {
  return (
    <>
      <div className="hidden md:block space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-border/70 bg-white shadow-xs"
          >
            <div className="flex gap-4 p-4">
              <Skeleton className="h-24 w-24 shrink-0 rounded-xl" />

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-5 w-40 rounded-md" />
                      <Skeleton className="h-4 w-20 rounded-md" />
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                      <Skeleton className="h-6 w-20 rounded-lg" />
                      <Skeleton className="h-6 w-24 rounded-lg" />
                    </div>
                  </div>

                  <Skeleton className="h-7 w-7 shrink-0 rounded-md" />
                </div>

                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <Skeleton className="h-7 w-24 rounded-md" />
                    <Skeleton className="mt-2 h-3 w-32 rounded-md" />
                  </div>

                  <Skeleton className="h-9 w-32 rounded-md" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3 md:hidden">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-border/70 bg-white shadow-xs"
          >
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex min-w-0 gap-3">
                  <Skeleton className="h-16 w-16 shrink-0 rounded-lg" />

                  <div className="min-w-0 flex-1">
                    <Skeleton className="h-4 w-28 rounded-md" />
                    <Skeleton className="mt-1.5 h-3 w-20 rounded-md" />
                    <Skeleton className="mt-2 h-5 w-16 rounded-full" />
                  </div>
                </div>

                <Skeleton className="h-6 w-6 shrink-0 rounded-md" />
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div>
                  <Skeleton className="h-5 w-20 rounded-md" />
                  <Skeleton className="mt-1.5 h-3 w-20 rounded-md" />
                </div>

                <Skeleton className="h-8 w-24 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function WishlistItem({ item, onMoveToCart, onRemove }) {
  const variant = item.variant_detail;
  const product = variant?.product_detail;
  const [isLoading, setIsLoading] = useState(false);
  const { isInCart } = useCart();

  const isInCartAlready = isInCart(product?.id, variant?.id);

  const variantImages = variant?.all_media
    ? [...new Set(variant.all_media.map(getMediaUrl).filter(Boolean))]
    : [];

  const handleMoveToCart = async () => {
    if (isLoading || isInCartAlready) return;

    setIsLoading(true);

    try {
      await onMoveToCart(item);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = () => {
    onRemove(item);
  };

  return (
    <Card className="overflow-hidden rounded-2xl border-border/70 bg-white shadow-xs transition-all duration-200 hover:shadow-md">
      <div className="flex gap-4 p-4">
        <div className="shrink-0">
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-xl bg-cream">
            {variantImages.length > 0 ? (
              <img
                src={variantImages[0]}
                alt={`${product?.name || "Product"} ${variant?.name || ""}`}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <Heart className="h-8 w-8 text-red-300" />
            )}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="truncate text-lg font-semibold leading-tight text-body-dark">
                  {product?.name || "Product"}
                </h3>

                <p className="text-sm text-primary">
                  ({variant?.name || "Standard"})
                </p>
              </div>

              <div className="mt-2 flex items-center gap-2">
                <span className="rounded-lg bg-orange-100 px-2 py-1 text-xs font-medium text-orange-700">
                  {variant?.pack_quantity || 1} {variant?.pack_unit || "unit"}
                </span>

                {variant?.no_of_units !== undefined && (
                  <span className="rounded-lg bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                    {variant.no_of_units} available
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={handleRemove}
              className="shrink-0 p-1 text-gray-400 transition-colors hover:text-red-500"
              aria-label="Remove from wishlist"
            >
              <Heart className="h-5 w-5 fill-red-500 text-red-500" />
            </button>
          </div>

          <div className="mt-4 flex items-end justify-between">
            <div>
              <p className="text-xl font-bold tracking-tight text-body-dark">
                {formatINR(variant?.price || 0)}
              </p>

              <p className="text-xs text-muted">
                Added on {new Date(item.created_at).toLocaleDateString("en-IN")}
              </p>
            </div>

            <div className="shrink-0">
              {isInCartAlready ? (
                <Button
                  disabled
                  className="bg-green-100 text-green-700 hover:bg-green-100"
                  size="sm"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  In Cart
                </Button>
              ) : (
                <Button
                  onClick={handleMoveToCart}
                  disabled={isLoading}
                  size="sm"
                  className="bg-primary hover:bg-primary/90"
                >
                  {isLoading ? (
                    <Loader2 className="mb-0.5 h-4 w-4 animate-spin" />
                  ) : (
                    <ShoppingCart className="mb-0.5 h-4 w-4" />
                  )}
                  Move to Cart
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function MobileWishlistItem({ item, onMoveToCart, onRemove }) {
  const variant = item.variant_detail;
  const product = variant?.product_detail;
  const [isLoading, setIsLoading] = useState(false);
  const { isInCart } = useCart();

  const isInCartAlready = isInCart(product?.id, variant?.id);

  const variantImages = variant?.all_media
    ? [...new Set(variant.all_media.map(getMediaUrl).filter(Boolean))]
    : [];

  const handleMoveToCart = async () => {
    if (isLoading || isInCartAlready) return;

    setIsLoading(true);

    try {
      await onMoveToCart(item);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = () => {
    onRemove(item);
  };

  return (
    <Card className="overflow-hidden rounded-2xl border-border/70 bg-white shadow-xs">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex gap-3">
            <div className="shrink-0">
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg bg-cream">
                {variantImages.length > 0 ? (
                  <img
                    src={variantImages[0]}
                    alt={`${product?.name || "Product"} ${variant?.name || ""}`}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <Heart className="h-6 w-6 text-red-300" />
                )}
              </div>
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold leading-tight text-body-dark">
                {product?.name || "Product"}
              </h3>

              <p className="mt-0.5 text-xs text-muted">
                {variant?.name || "Standard"}
              </p>

              <div className="mt-2">
                <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
                  {variant?.pack_quantity || 1} {variant?.pack_unit || "unit"}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleRemove}
            className="shrink-0 p-1 text-gray-400 transition-colors hover:text-red-500"
            aria-label="Remove from wishlist"
          >
            <Heart className="h-4 w-4 fill-red-500 text-red-500" />
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div>
            <p className="text-base font-bold tracking-tight text-body-dark">
              {formatINR(variant?.price || 0)}
            </p>

            {variant?.no_of_units !== undefined && (
              <p className="mt-0.5 text-xs text-green-600">
                {variant.no_of_units} available
              </p>
            )}
          </div>

          <div className="shrink-0">
            {isInCartAlready ? (
              <Button
                disabled
                className="h-8 bg-green-100 px-3 text-xs text-green-700 hover:bg-green-100"
                size="sm"
              >
                <ShoppingCart className="mr-1 h-3 w-3" />
                In Cart
              </Button>
            ) : (
              <Button
                onClick={handleMoveToCart}
                disabled={isLoading}
                size="sm"
                className="h-8 bg-primary px-3 text-xs hover:bg-primary/90"
              >
                {isLoading ? (
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                ) : (
                  <ShoppingCart className="mr-1 h-3 w-3" />
                )}
                Move to Cart
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

/* =========================================================
   WISHLIST PAGE
========================================================= */

export default function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { getWishlist, addtoWishlist } = useProductApi();
  const { addToCart } = useCart();

  const { requireMobileNumber, getCurrentMobile } =
    useContext(MobileNumberContext);

  const fetchWishlist = async (buyerMobile) => {
    if (!buyerMobile) {
      setError("Please login to view your wishlist");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await getWishlist(buyerMobile);

      if (response.status === 200) {
        setWishlistItems(response.data || []);
      } else {
        setError(response.message || "Failed to fetch wishlist");
      }
    } catch (err) {
      setError(err.message || "Failed to fetch wishlist");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    requireMobileNumber(fetchWishlist);
  }, [requireMobileNumber]);

  const handleMoveToCart = async (item) => {
    const variant = item.variant_detail;
    const product = variant?.product_detail;

    if (!variant || !product) {
      toast.error("Product information not available");
      return;
    }

    try {
      const variantImages = variant?.all_media
        ? [...new Set(variant.all_media.map(getMediaUrl).filter(Boolean))]
        : [];

      const cartPayload = {
        productId: product.id,
        productName: product.name,
        variantId: variant.id,
        variantName: variant.name,
        packQuantity: variant.pack_quantity || 1,
        packUnit: variant.pack_unit || "unit",
        price: Number(variant.price) || 0,
        availableUnits: Number(variant.no_of_units) || 10,
        seller: item.seller || "Farmer",
        image: variantImages[0] || "",
        category: product.category || "",
      };

      addToCart(cartPayload);

      toast.success("Added to cart", {
        description: `${product.name} · ${variant.name || "Standard"}`,
      });
    } catch (err) {
      toast.error("Failed to add to cart");
    }
  };

  const handleRemoveFromWishlist = async (item) => {
    const buyerMobile = getCurrentMobile();

    if (!buyerMobile) return;

    try {
      await addtoWishlist({
        buyerMobile,
        variantId: item.variant_detail?.id,
      });

      setWishlistItems((prev) => prev.filter((i) => i.id !== item.id));

      toast.success("Removed from wishlist");
    } catch (err) {
      toast.error("Failed to remove from wishlist");
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <WishlistSkeleton />;
    }

    if (error) {
      return (
        <ErrorState
          message={error}
          actionText="Try Again"
          onAction={fetchWishlist}
        />
      );
    }

    if (wishlistItems.length === 0) {
      return (
        <EmptyState
          icon={<Heart className="h-12 w-12 text-gray-300" />}
          title="Your wishlist is empty"
          description="Add products you love to your wishlist to save them for later"
          actionText="Browse Products"
          actionLink="/"
        />
      );
    }

    return (
      <div className="space-y-4">
        {/* Desktop */}
        <div className="hidden space-y-4 md:block">
          {wishlistItems.map((item) => (
            <WishlistItem
              key={item.id}
              item={item}
              onMoveToCart={handleMoveToCart}
              onRemove={handleRemoveFromWishlist}
            />
          ))}
        </div>

        {/* Mobile */}
        <div className="space-y-3 md:hidden">
          {wishlistItems.map((item) => (
            <MobileWishlistItem
              key={item.id}
              item={item}
              onMoveToCart={handleMoveToCart}
              onRemove={handleRemoveFromWishlist}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Mobile Header */}
      <div className="sticky top-0 z-10 block border-b border-border bg-white px-4 py-4 md:hidden">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>

              <div>
                <h1 className="text-xl font-bold tracking-tight text-body-dark">
                  My Wishlist
                </h1>

                <p className="text-sm text-muted">
                  {wishlistItems.length}{" "}
                  {wishlistItems.length === 1 ? "item" : "items"}
                </p>
              </div>
            </div>

            {wishlistItems.length > 0 && (
              <Button
                onClick={fetchWishlist}
                variant="ghost"
                size="sm"
                className="text-primary"
              >
                Refresh
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-6">
        {/* Desktop Header */}
        <div className="mb-6 hidden items-center justify-between md:flex">
          <div className="flex items-center gap-2.5">
            <span className="h-7 w-1 rounded-full bg-orange-500" />

            <h1 className="text-2xl font-bold tracking-tight text-body-dark/90">
              My Wishlist
            </h1>
          </div>
        </div>

        {renderContent()}
      </div>

      {/* Mobile Bottom Bar */}
      {wishlistItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-border bg-white p-4 md:hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted">Total items</p>

              <p className="text-lg font-bold text-body-dark">
                {wishlistItems.length}{" "}
                {wishlistItems.length === 1 ? "item" : "items"}
              </p>
            </div>

            <Button
              onClick={() => {
                wishlistItems.forEach((item) => handleMoveToCart(item));
              }}
              className="bg-primary hover:bg-primary/90"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Move All to Cart
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
