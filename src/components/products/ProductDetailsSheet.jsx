import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  ShoppingCart,
  UserRound,
  MapPin,
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { useCart } from "@/context/CartContext";
import { formatINR } from "@/lib/utils";
import { toast } from "sonner";
import { getProductView } from "../../api/products";

function getMediaUrl(media) {
  return (
    media?.file || media?.productImgUrl || media?.image || media?.url || ""
  );
}

export default function ProductDetailsSheet({
  open,
  onOpenChange,
  product,
  variantId,
}) {
  const [selectedVariantId, setSelectedVariantId] = useState(variantId);

  const [selectedImage, setSelectedImage] = useState(0);

  const [qty, setQty] = useState(1);

  const {
    items = [],
    addToCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  useEffect(() => {
    if (!open || !product) return;

    setSelectedVariantId(variantId);
    setSelectedImage(0);
    setQty(1);
  }, [open, product, variantId]);

  useEffect(() => {
    if (!open || !variantId) return;

    getProductView(variantId).catch((error) => {
      console.error("Failed to track product view:", error);
    });
  }, [open]);

  const variants = useMemo(
    () =>
      (product?.variants || []).filter(
        (variant) => variant?.is_active !== false,
      ),
    [product],
  );

  const selectedVariant = useMemo(() => {
    return (
      variants.find(
        (variant) => String(variant.id) === String(selectedVariantId),
      ) || variants[0]
    );
  }, [variants, selectedVariantId]);

  const images = useMemo(() => {
    if (!selectedVariant) return [];

    return [
      ...new Set(
        (selectedVariant.all_media || []).map(getMediaUrl).filter(Boolean),
      ),
    ];
  }, [selectedVariant]);

  const cartQuantity = selectedVariant
    ? items.find(
        (item) =>
          String(item.productId) === String(product?.id) &&
          String(item.variantId) === String(selectedVariant.id),
      )?.quantity || 0
    : 0;

  useEffect(() => {
    setSelectedImage(0);
  }, [selectedVariantId]);

  useEffect(() => {
    if (selectedImage >= images.length && images.length > 0) {
      setSelectedImage(0);
    }
  }, [images.length, selectedImage]);

  const handleVariantChange = (id) => {
    setSelectedVariantId(id);
    setQty(1);
  };

  const getCartPayload = () => {
    if (!selectedVariant) return null;

    return {
      productId: product.id,
      productName: product.name,
      variantId: selectedVariant.id,
      variantName: selectedVariant.name,
      packQuantity: selectedVariant.pack_quantity,
      packUnit: selectedVariant.pack_unit,
      price: Number(selectedVariant.price),
      availableUnits: Number(selectedVariant.no_of_units || 0),
      seller: product?.seller_detail?.user_name || "Farmer",
      image: images[0] || "",
      category: product.category,
    };
  };

  const handleAdd = () => {
    if (!selectedVariant) return;

    const available = Number(selectedVariant.no_of_units || 0);

    if (available < 1) return;

    addToCart(getCartPayload(), qty);

    toast.success("Added to cart", {
      description: `${product.name} · ${selectedVariant.name || "Standard"}`,
    });
  };

  const handleIncrease = () => {
    if (!selectedVariant) return;

    const available = Number(selectedVariant.no_of_units || 0);

    if (cartQuantity > 0) {
      if (cartQuantity >= available) return;

      increaseQuantity(product.id, selectedVariant.id);

      return;
    }

    setQty((current) => Math.min(available, current + 1));
  };

  const handleDecrease = () => {
    if (!selectedVariant) return;

    if (cartQuantity > 0) {
      decreaseQuantity(product.id, selectedVariant.id);

      return;
    }

    setQty((current) => Math.max(1, current - 1));
  };

  const previousImage = () => {
    if (images.length < 2) return;

    setSelectedImage((current) =>
      current === 0 ? images.length - 1 : current - 1,
    );
  };

  const nextImage = () => {
    if (images.length < 2) return;

    setSelectedImage((current) =>
      current === images.length - 1 ? 0 : current + 1,
    );
  };

  if (!product) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="max-h-[92vh] overflow-hidden rounded-t-[28px] bg-[#fffdf8] p-0"
      >
        <SheetHeader className="border-b border-border bg-white px-4 pb-3 pt-4 text-left">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <SheetTitle className="truncate text-lg font-bold text-body-dark">
                {product.name}
              </SheetTitle>

              <p className="mt-0.5 text-xs text-muted">
                {product.category || "Produce"}
              </p>
            </div>

            <Badge variant="success" className="absolute right-12 top-5">
              {selectedVariant && Number(selectedVariant.no_of_units) > 0
                ? "In stock"
                : "Out of stock"}
            </Badge>
          </div>
        </SheetHeader>

        <div className="max-h-[calc(92vh-76px)] overflow-y-auto">
          <div className="p-4 sm:p-5">
            <div className="relative overflow-hidden rounded-2xl bg-cream">
              <div className="aspect-4/3 w-full">
                {images[selectedImage] ? (
                  <img
                    src={images[selectedImage]}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="grid h-full place-items-center text-sm text-muted">
                    No image available
                  </div>
                )}
              </div>

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={previousImage}
                    className="absolute left-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow-sm"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow-sm"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>

                  <div className="absolute bottom-3 right-3 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-semibold text-white">
                    {selectedImage + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            <div className="mt-4">
              {/* <div className="flex gap-1 text-xs text-muted">
                <UserRound className="h-3 w-3" />

                <span>{product?.seller_detail?.user_name || "Farmer"}</span>
              </div> */}

              <p className=" text-sm leading-6 text-muted">
                {product.description ||
                  "Fresh agricultural produce available from this verified marketplace seller."}
              </p>
            </div>

            <Separator className="my-3 bg-gray-100" />

            <div>
              {/* <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-bold text-body-dark">
                  Choose variant
                </p>

                <span className="text-xs text-muted">
                  {variants.length}{" "}
                  {variants.length === 1 ? "option" : "options"}
                </span>
              </div> */}

              <div className="flex gap-2 overflow-x-auto pb-1">
                {variants.map((variant) => {
                  const active =
                    String(variant.id) === String(selectedVariant?.id);

                  const variantImage = variant.all_media
                    ?.map(getMediaUrl)
                    .find(Boolean);

                  return (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => handleVariantChange(variant.id)}
                      className={`w-28 shrink-0 overflow-hidden rounded-xl border bg-white p-1.5 text-left transition ${
                        active
                          ? "border-primary ring-2 ring-primary/15"
                          : "border-border"
                      }`}
                    >
                      <div className="aspect-square overflow-hidden rounded-lg bg-cream">
                        {variantImage ? (
                          <img
                            src={variantImage}
                            alt={variant.name || "Variant"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="grid h-full place-items-center text-xs text-muted">
                            No image
                          </div>
                        )}
                      </div>

                      <div className="p-1">
                        <p className="truncate text-xs font-bold text-body-dark">
                          {variant.name || "Standard"}
                        </p>

                        <p className="mt-0.5 text-[10px] text-muted">
                          {variant.pack_quantity} {variant.pack_unit}
                        </p>

                        <p className="mt-1 text-sm font-semibold text-body-dark">
                          {formatINR(variant.price)}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedVariant && (
              <>
                <div className="mt-5 flex items-end justify-between gap-4 rounded-2xl bg-white shadow-xs p-4">
                  <div>
                    <p className="text-2xl font-semibold tracking-tight text-body-dark">
                      {formatINR(selectedVariant.price)}
                    </p>

                    <p className="text-xs text-muted">
                      per {selectedVariant.pack_quantity}{" "}
                      {selectedVariant.pack_unit}
                    </p>
                  </div>

                  <p
                    className={`text-xs font-bold ${
                      Number(selectedVariant.no_of_units) > 0
                        ? "text-primary"
                        : "text-red-600"
                    }`}
                  >
                    {Number(selectedVariant.no_of_units) > 0
                      ? `${selectedVariant.no_of_units} available`
                      : "Out of stock"}
                  </p>
                </div>

                <div className="mt-3 flex gap-2.5">
                  <div className="flex h-12 shrink-0 items-center overflow-hidden rounded-xl border border-border bg-white">
                    <button
                      type="button"
                      disabled={cartQuantity === 0 && qty <= 1}
                      onClick={handleDecrease}
                      className="grid h-12 w-11 place-items-center text-muted hover:bg-cream hover:text-primary disabled:opacity-30"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-4 w-4" />
                    </button>

                    <span className="grid h-12 min-w-10 place-items-center border-x border-border px-1 text-sm font-bold text-body-dark">
                      {cartQuantity || qty}
                    </span>

                    <button
                      type="button"
                      disabled={
                        cartQuantity
                          ? cartQuantity >= Number(selectedVariant.no_of_units)
                          : qty >= Number(selectedVariant.no_of_units)
                      }
                      onClick={handleIncrease}
                      className="grid h-12 w-11 place-items-center text-muted hover:bg-cream hover:text-primary disabled:opacity-30"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  {cartQuantity > 0 ? (
                    <div className="flex flex-1 items-center justify-center rounded-xl bg-light-blue px-4 text-sm font-bold text-primary">
                      Added to cart
                    </div>
                  ) : (
                    <Button
                      size="lg"
                      className="h-12 flex-1 rounded-xl font-semibold"
                      disabled={Number(selectedVariant.no_of_units) < 1}
                      onClick={handleAdd}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Add {qty} to Cart
                    </Button>
                  )}
                </div>
              </>
            )}

            {product?.delivery_location_detail?.coverage?.include?.states
              ?.length > 0 && (
              <div className="mt-5 rounded-2xl border border-border bg-white p-4">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-red-500 mt-[0.5px]" />

                  <div className="min-w-0">
                    <p className="text-sm font-bold text-body-dark">
                      Delivery available in
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {product.delivery_location_detail.coverage.include.states.map(
                        (location) => (
                          <div
                            key={location.state_name}
                            className="rounded-lg border border-orange-200/80 bg-orange-50/90 px-3 py-2"
                          >
                            <p className="text-xs font-semibold text-body-light">
                              {location.state_name}
                            </p>

                            {location.all_districts ? (
                              <p className="mt-0.5 text-[11px] text-primary">
                                All districts
                              </p>
                            ) : location.districts?.length ? (
                              <p className="mt-0.5 text-[11px] text-muted">
                                {location.districts.join(", ")}
                              </p>
                            ) : null}
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
