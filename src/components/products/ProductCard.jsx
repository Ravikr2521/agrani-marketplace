import { memo, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  Minus,
  Plus,
  ShoppingCart,
  User2Icon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { useCart } from "@/context/CartContext";
import { formatINR } from "@/lib/utils";

import ProductCarousel from "./ProductCarousel";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Separator } from "../ui/separator";
import ProductDetailsSheet from "./ProductDetailsSheet";

const toTitleCase = (str = "") =>
  str.replace(
    /\w\S*/g,
    (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
  );

const getMediaUrl = (media) =>
  media?.productImgUrl || media?.image || media?.file || media?.url || "";

const ProductCard = memo(function ProductCard({ product }) {
  const [variantSheetOpen, setVariantSheetOpen] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [productDetailsOpen, setProductDetailsOpen] = useState(false);
  const [productDetailsVariantId, setProductDetailsVariantId] = useState(null);

  const {
    items = [],
    addToCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  const availableVariants = useMemo(() => {
    return (product?.variants ?? []).filter(
      (variant) =>
        variant?.is_active === true && Number(variant?.no_of_units) > 0,
    );
  }, [product?.variants]);

  const getVariantImages = (variant) => {
    return [
      ...new Set((variant?.all_media ?? []).map(getMediaUrl).filter(Boolean)),
    ];
  };

  const selectedVariant = useMemo(() => {
    return (
      availableVariants.find(
        (variant) => String(variant.id) === String(selectedVariantId),
      ) || availableVariants[0]
    );
  }, [availableVariants, selectedVariantId]);

  const selectedVariantImages = useMemo(() => {
    return getVariantImages(selectedVariant);
  }, [selectedVariant]);

  const getCartItem = (variant) => {
    return items.find(
      (item) =>
        String(item.productId) === String(product.id) &&
        String(item.variantId) === String(variant.id),
    );
  };

  const getCartQuantity = (variantId) => {
    return (
      items.find(
        (item) =>
          String(item.productId) === String(product.id) &&
          String(item.variantId) === String(variantId),
      )?.quantity || 0
    );
  };

  const getCartPayload = (variant) => ({
    productId: product.id,
    productName: product.name,
    variantId: variant.id,
    variantName: variant.name,
    packQuantity: variant.pack_quantity,
    packUnit: variant.pack_unit,
    price: Number(variant.price),
    availableUnits: Number(variant.no_of_units),
    seller: product?.seller_detail?.user_name || "Farmer",
    image: getVariantImages(variant)[0] || "",
    category: product.category,
  });

  const openVariantSheet = (variant) => {
    setSelectedVariantId(variant.id);
    setVariantSheetOpen(true);
  };

  const handleAdd = (variant) => {
    if (!variant || Number(variant.no_of_units) <= 0) {
      return;
    }

    if (availableVariants.length > 1) {
      openVariantSheet(variant);
      return;
    }

    addToCart(getCartPayload(variant));

    toast.success("Added to cart", {
      description: `${product.name} · ${variant.name || "Standard"}`,
    });
  };

  const handleIncrease = (variant) => {
    const quantity = getCartQuantity(variant.id);
    const available = Number(variant.no_of_units);

    if (quantity >= available) {
      return;
    }

    if (increaseQuantity) {
      increaseQuantity(product.id, variant.id);
      return;
    }

    addToCart(getCartPayload(variant));
  };

  const handleDecrease = (variant) => {
    const quantity = getCartQuantity(variant.id);

    if (quantity <= 0) {
      return;
    }

    if (decreaseQuantity) {
      decreaseQuantity(product.id, variant.id);
    }
  };

  const handleSheetAdd = () => {
    if (!selectedVariant) return;

    const quantity = getCartQuantity(selectedVariant.id);

    if (quantity === 0) {
      addToCart(getCartPayload(selectedVariant));

      toast.success("Added to cart", {
        description: `${product.name} · ${selectedVariant.name || "Standard"}`,
      });
    }
  };

  const renderCartControl = (variant) => {
    const cartQty = getCartQuantity(variant.id);

    if (cartQty === 0) {
      return (
        <Button
          type="button"
          disabled={Number(variant.no_of_units) <= 0}
          onClick={() => handleAdd(variant)}
          className="h-7 w-7  shrink-0 rounded-lg p-0 bg-primary/90 "
          aria-label="Add to cart"
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
      );
    }

    return (
      <div className="flex h-8 shrink-0 items-center overflow-hidden rounded-lg border border-border bg-white">
        <button
          type="button"
          onClick={() => handleDecrease(variant)}
          className="grid h-full w-7 place-items-center text-muted transition-colors active:bg-cream active:text-primary"
          aria-label="Decrease quantity"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>

        <span className="grid h-full min-w-7 place-items-center border-x border-border px-1 text-xs font-bold text-body-dark">
          {cartQty}
        </span>

        <button
          type="button"
          disabled={cartQty >= Number(variant.no_of_units)}
          onClick={() => handleIncrease(variant)}
          className="grid h-full w-7 place-items-center text-muted transition-colors active:bg-cream active:text-primary disabled:opacity-30"
          aria-label="Increase quantity"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  };

  if (!availableVariants.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="min-w-0"
      >
        <Card className="overflow-hidden border-border/80 bg-white shadow-xs">
          <Link to={`/products/${product.id}`} className="block p-1.5">
            <div className="overflow-hidden rounded-xl shadow-sm ring-1 ring-black/5">
              <ProductCarousel
                images={[]}
                alt={product?.name || "Product"}
                autoPlay
              />
            </div>
          </Link>

          <div className="p-3">
            <Link
              to={`/products/${product.id}`}
              className="block truncate text-[14px] font-semibold text-body-dark"
            >
              {product?.name}
            </Link>

            <p className="mt-1 text-xs text-red-500">Currently unavailable</p>
          </div>
        </Card>
      </motion.div>
    );
  }

  const openProductDetails = (variant) => {
    setProductDetailsVariantId(variant.id);
    setProductDetailsOpen(true);
  };

  return (
    <>
      {availableVariants.map((variant) => {
        const variantImages = getVariantImages(variant);

        return (
          <motion.div
            key={`${product.id}-${variant.id}`}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.35,
              ease: "easeOut",
            }}
            className="min-w-0"
          >
            <Card className="overflow-hidden rounded-2xl border-border/70 bg-white shadow-xs transition-all duration-200 active:scale-[0.99] md:hidden">
              <button
                type="button"
                onClick={() => openProductDetails(variant)}
                className="block w-full p-1.5 text-left"
              >
                <div className="relative overflow-hidden rounded-xl bg-cream shadow-sm ring-1 ring-black/5">
                  <ProductCarousel
                    images={variantImages}
                    alt={`${product?.name || "Product"} ${variant?.name || ""}`}
                    autoPlay
                  />

                  <div className="absolute right-2 top-2 z-10 flex h-6 items-center rounded-full border border-orange-200/80 bg-white/95 px-2 shadow-sm backdrop-blur-sm">
                    <span className="text-[10px] font-bold leading-none text-orange-700">
                      {variant.pack_quantity}
                    </span>

                    <span className="ml-0.5 text-[8px] font-semibold uppercase leading-none text-orange-600">
                      {variant.pack_unit}
                    </span>
                  </div>
                </div>
              </button>

              <div className="p-3 pt-1 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => openProductDetails(variant)}
                  className="w-fulll text-left break-all text-[14px] font-semibold leading-tight text-body-dark"
                >
                  {toTitleCase(product.name)}
                  {variant?.name && (
                    <span className="">
                      {" - "}
                      {toTitleCase(variant.name)}
                    </span>
                  )}
                </button>

                <Link
                  to={`/seller/${encodeURIComponent(
                    product?.seller_detail?.user_id || "",
                  )}`}
                  onClick={(e) => e.stopPropagation()}
                  className="-mt-1 flex w-fit max-w-full items-center gap-1 rounded-md bg-green-100 px-2 py-1 text-[10px] font-medium leading-none text-primary ring-1 ring-inset ring-green-200/70"
                >
                  <User2Icon className="h-2.5 w-2.5 shrink-0" />

                  <span className="truncate">
                    {product?.seller_detail?.user_name || "Farmer"}
                  </span>
                </Link>

                <div className=" flex justify-between">
                  <div className="flex flex-col items-baseline gap-1">
                    <span className="text-[18px] font-semibold leading-none tracking-tight text-body-dark">
                      {formatINR(variant.price)}
                    </span>

                    <span className=" text-[9px] font-medium leading-none text-muted">
                      per {variant.pack_quantity} {variant.pack_unit}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <div className="shrink-0">{renderCartControl(variant)}</div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="group hidden overflow-hidden border-border/80 bg-white shadow-xs transition-all duration-300 hover:shadow-sm md:block">
              <Link to={`/products/${product.id}`} className="block p-2">
                <div className="overflow-hidden rounded-xl shadow-sm ring-1 ring-black/5">
                  <ProductCarousel
                    images={variantImages}
                    alt={`${product?.name || "Product"} ${variant?.name || ""}`}
                    autoPlay
                  />
                </div>
              </Link>

              <div className="flex flex-col gap-3 p-4">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <Link
                      to={`/products/${product.id}`}
                      className="min-w-0 truncate text-left text-lg font-bold text-body-dark transition-colors hover:text-primary"
                    >
                      {product?.name}
                    </Link>

                    <span className="shrink-0 text-xs font-semibold text-orange-500">
                      {toTitleCase(variant.name || "Standard")}
                    </span>
                  </div>

                  <Link
                    to={`/seller/${encodeURIComponent(
                      product?.seller_detail?.user_id || "",
                    )}`}
                    className="mt-1 block w-fit max-w-full truncate text-[13px] text-muted transition-colors hover:text-primary"
                  >
                    Seller:{" "}
                    <span className="font-semibold text-body-light">
                      {product?.seller_detail?.user_name || "Farmer"}
                    </span>
                  </Link>
                </div>

                <div className="flex items-center justify-between gap-3 ">
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold leading-none tracking-tight text-body-dark">
                        {formatINR(variant.price)}
                      </span>

                      <span className="whitespace-nowrap text-[13px] leading-none text-muted">
                        {variant.pack_quantity} {variant.pack_unit} / pack
                      </span>
                    </div>
                  </div>

                  <span className="shrink-0 whitespace-nowrap text-sm font-bold text-primary">
                    {variant.no_of_units} available
                  </span>
                </div>

                <div>
                  {getCartQuantity(variant.id) === 0 ? (
                    <Button
                      type="button"
                      disabled={Number(variant.no_of_units) <= 0}
                      onClick={() => handleAdd(variant)}
                      className="h-10 w-full gap-2 text-sm"
                    >
                      <Plus className="h-4 w-4" />
                      Add to Cart
                    </Button>
                  ) : (
                    <div className="flex h-10 w-full items-center justify-between overflow-hidden rounded-xl border border-border bg-white">
                      <button
                        type="button"
                        onClick={() => handleDecrease(variant)}
                        className="grid h-full w-12 place-items-center text-muted hover:bg-cream hover:text-primary"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>

                      <span className="text-sm font-bold text-body-dark">
                        {getCartQuantity(variant.id)}
                      </span>

                      <button
                        type="button"
                        disabled={
                          getCartQuantity(variant.id) >=
                          Number(variant.no_of_units)
                        }
                        onClick={() => handleIncrease(variant)}
                        className="grid h-full w-12 place-items-center text-muted hover:bg-cream hover:text-primary disabled:opacity-30"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}

      <Sheet open={variantSheetOpen} onOpenChange={setVariantSheetOpen}>
        <SheetContent
          side="bottom"
          className="max-h-[88vh] overflow-hidden rounded-t-[28px] bg-white p-0"
        >
          <SheetHeader className="border-b border-border px-5 pb-4 pt-5 text-left">
            <SheetTitle className="text-xl font-semibold text-body-dark">
              Select variant
            </SheetTitle>

            <p className=" text-sm text-muted">Choose your preferred pack</p>
          </SheetHeader>

          <div className="overflow-y-auto px-5 pb-8 pt-4">
            <div className="flex gap-3 overflow-x-auto pb-2">
              {availableVariants.map((variant) => {
                const isSelected =
                  String(selectedVariant?.id) === String(variant.id);

                const images = getVariantImages(variant);

                return (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => setSelectedVariantId(variant.id)}
                    className={`w-33 shrink-0 rounded-2xl border bg-white p-2.5 text-left transition-all ${
                      isSelected
                        ? "border-primary ring-2 ring-primary/15"
                        : "border-border"
                    }`}
                  >
                    <div className="overflow-hidden rounded-xl bg-stone-50">
                      <ProductCarousel
                        images={images}
                        alt={`${product?.name} ${variant.name || ""}`}
                        autoPlay
                      />
                    </div>

                    <div className="mt-2">
                      <p className="truncate text-sm font-semibold text-body-dark">
                        {toTitleCase(variant.name || "Standard")}
                      </p>

                      <p className="mt-0.5 text-[11px] text-muted">
                        {variant.pack_quantity} {variant.pack_unit}
                      </p>

                      <p className="mt-1.5 text-base font-bold text-body-dark">
                        {formatINR(variant.price)}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
            <Separator className="mt-2 mb-4 bg-gray-100" />

            {selectedVariant && (
              <div className=" flex items-end justify-between gap-4">
                <div>
                  <p className="text-2xl font-semibold tracking-tight text-body-dark">
                    {formatINR(selectedVariant.price)}
                  </p>

                  <p className=" text-xs text-muted">
                    / {selectedVariant.pack_quantity}{" "}
                    {selectedVariant.pack_unit}
                  </p>
                </div>

                {getCartQuantity(selectedVariant.id) === 0 ? (
                  <Button
                    type="button"
                    disabled={Number(selectedVariant.no_of_units) <= 0}
                    onClick={handleSheetAdd}
                    className="h-11 rounded-xl px-5 text-sm font-semibold"
                  >
                    <ShoppingCart className="mr-1 h-4 w-4" />
                    Add
                  </Button>
                ) : (
                  <div className="flex h-11  items-center justify-between overflow-hidden rounded-xl border border-border bg-white">
                    <button
                      type="button"
                      onClick={() => handleDecrease(selectedVariant)}
                      className="grid h-full w-12 place-items-center text-muted hover:bg-cream hover:text-primary disabled:opacity-30"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-4 w-4" />
                    </button>

                    <span className="grid h-full min-w-10 place-items-center border-x border-white/20 text-base font-bold">
                      {getCartQuantity(selectedVariant.id)}
                    </span>

                    <button
                      type="button"
                      disabled={
                        getCartQuantity(selectedVariant.id) >=
                        Number(selectedVariant.no_of_units)
                      }
                      onClick={() => handleIncrease(selectedVariant)}
                      className="grid h-full w-12 place-items-center text-muted hover:bg-cream hover:text-primary disabled:opacity-30"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <ProductDetailsSheet
        open={productDetailsOpen}
        onOpenChange={setProductDetailsOpen}
        product={product}
        variantId={productDetailsVariantId}
      />
    </>
  );
});

export default ProductCard;
