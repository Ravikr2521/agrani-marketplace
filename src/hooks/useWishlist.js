import { useCallback, useState, useContext } from "react";
import { toast } from "sonner";

import { useProductApi } from "@/api/products";
import { MobileNumberContext } from "@/context/MobileNumberContext";

export function useWishlist(variants = []) {
  const { requireMobileNumber } = useContext(MobileNumberContext);
  const { addtoWishlist } = useProductApi();

  const [wishlistLoading, setWishlistLoading] = useState(null);
  const [wishlistedVariants, setWishlistedVariants] = useState(
    () =>
      new Set(
        (variants ?? [])
          .filter((variant) => variant?.is_wishlisted === true)
          .map((variant) => String(variant.id)),
      ),
  );

  const isWishlisted = useCallback(
    (variant) =>
      wishlistedVariants.has(String(variant?.id)) ||
      variant?.is_wishlisted === true,
    [wishlistedVariants],
  );

  const toggleWishlist = useCallback(
    async (variant, event) => {
      event?.stopPropagation();
      event?.preventDefault();

      if (!variant?.id || wishlistLoading === variant.id) {
        return;
      }

      const variantId = String(variant.id);
      const alreadyWishlisted = isWishlisted(variant);

      requireMobileNumber(async (buyerMobile) => {
        try {
          setWishlistLoading(variant.id);

          await addtoWishlist({ buyerMobile, variantId: variant.id });

          setWishlistedVariants((previous) => {
            const next = new Set(previous);

            if (alreadyWishlisted) {
              next.delete(variantId);
            } else {
              next.add(variantId);
            }

            return next;
          });

          toast.success(
            alreadyWishlisted ? "Removed from wishlist" : "Added to wishlist",
          );
        } catch (error) {
          toast.error(error?.message || "Failed to update wishlist");
        } finally {
          setWishlistLoading(null);
        }
      });
    },
    [addtoWishlist, requireMobileNumber, isWishlisted, wishlistLoading],
  );

  return { wishlistLoading, isWishlisted, toggleWishlist };
}
