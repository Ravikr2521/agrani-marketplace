import { motion } from "framer-motion";
import { memo, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { formatINR } from "@/lib/utils";
import ProductCarousel from "../products/ProductCarousel";
import ProductDetailsSheet from "../products/ProductDetailsSheet";

import { requestProductEdit, toggleProduct } from "@/api/products";
import { toast } from "sonner";
import { MoreVertical, Pencil, Power } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const toTitleCase = (str = "") =>
  str.replace(
    /\w\S*/g,
    (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
  );

const getMediaUrl = (media) =>
  media?.productImgUrl || media?.image || media?.file || media?.url || "";

const SellerCard = memo(function SellerCard({ product, onProductUpdated }) {
  const [variantSheetOpen, setVariantSheetOpen] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState(null);

  const [productDetailsOpen, setProductDetailsOpen] = useState(false);
  const [productDetailsVariantId, setProductDetailsVariantId] = useState(null);

  const [actionSheetOpen, setActionSheetOpen] = useState(false);
  const [actionType, setActionType] = useState(null);

  const [isActive, setIsActive] = useState(product?.is_active === true);
  const [actionLoading, setActionLoading] = useState(false);

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

  const openVariantSheet = (variant) => {
    setSelectedVariantId(variant.id);
    setVariantSheetOpen(true);
  };

  const openProductDetails = (variant) => {
    setProductDetailsVariantId(variant.id);
    setProductDetailsOpen(true);
  };

  const openActionSheet = (type) => {
    setActionType(type);
    setActionSheetOpen(true);
  };

  const handleToggleConfirm = async () => {
    const nextValue = !isActive;

    try {
      setActionLoading(true);

      await toggleProduct(product.id, nextValue);

      setIsActive(nextValue);
      setActionSheetOpen(false);

      toast.success(nextValue ? "Product activated" : "Product deactivated");

      onProductUpdated?.({
        ...product,
        is_active: nextValue,
      });
    } catch (error) {
      toast.error(error?.message || "Failed to update product");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRequestEdit = async () => {
    try {
      setActionLoading(true);

      await requestProductEdit(product.id);

      setActionSheetOpen(false);

      toast.success("Edit request sent");
    } catch (error) {
      toast.error(error?.message || "Failed to request edit");
    } finally {
      setActionLoading(false);
    }
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
          <div className="p-1.5">
            <div className="overflow-hidden rounded-xl shadow-sm ring-1 ring-black/5">
              <ProductCarousel
                images={[]}
                alt={product?.name || "Product"}
                autoPlay
              />
            </div>
          </div>

          <div className="p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-[14px] font-semibold text-body-dark">
                  {toTitleCase(product?.name || "")}
                </p>

                <p className="mt-1 text-xs text-red-500">
                  Currently unavailable
                </p>
              </div>

              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    aria-label="Product actions"
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-border bg-white text-muted shadow-xs transition hover:bg-stone-50 hover:text-body-dark active:scale-95"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  sideOffset={8}
                  className="w-52 rounded-2xl border-border/70 bg-white p-1.5 shadow-xl"
                >
                  <button
                    type="button"
                    onClick={() => openActionSheet("toggle")}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-stone-50"
                  >
                    <div
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${isActive ? "bg-red-50 text-red-500" : "bg-emerald-50 text-emerald-600"}`}
                    >
                      <Power className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-body-dark">
                        {isActive ? "Disable product" : "Enable product"}
                      </p>
                      <p className="mt-0.5 text-[10px] text-muted">
                        {isActive
                          ? "Hide from marketplace"
                          : "Show on marketplace"}
                      </p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => openActionSheet("edit")}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-stone-50"
                  >
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-orange-50 text-orange-600">
                      <Pencil className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-body-dark">
                        Request edit
                      </p>
                      <p className="mt-0.5 text-[10px] text-muted">
                        Request product changes
                      </p>
                    </div>
                  </button>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </Card>

        <ActionSheet
          open={actionSheetOpen}
          onOpenChange={setActionSheetOpen}
          actionType={actionType}
          product={product}
          isActive={isActive}
          loading={actionLoading}
          onToggleConfirm={handleToggleConfirm}
          onRequestEdit={handleRequestEdit}
        />
      </motion.div>
    );
  }

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
            <Card className="overflow-hidden rounded-2xl border-border/70 bg-white shadow-xs transition-all duration-200  md:hidden">
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

              <div className="flex flex-col gap-3 p-3 pt-1">
                <div className="flex items-start justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => openProductDetails(variant)}
                    className="min-w-0 flex-1 break-all text-left text-[14px] font-semibold leading-tight text-body-dark"
                  >
                    {toTitleCase(product.name)}

                    {variant?.name && (
                      <span>
                        {" - "}
                        {toTitleCase(variant.name)}
                      </span>
                    )}
                  </button>
                </div>

                <div className="flex items-end justify-between gap-3">
                  <div className="flex flex-col items-baseline gap-1">
                    <span className="text-[18px] font-semibold leading-none tracking-tight text-body-dark">
                      {formatINR(variant.price)}
                    </span>

                    <span className="text-[9px] font-medium leading-none text-muted">
                      per {variant.pack_quantity} {variant.pack_unit}
                    </span>
                  </div>

                  {/* <span className="shrink-0 text-[10px] font-semibold text-primary">
                    {variant.no_of_units} available
                  </span> */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        aria-label="Product actions"
                        className="grid w-8 h-8 shrink-0 place-items-center rounded-lg border border-border bg-white text-muted shadow-none transition hover:bg-stone-50 hover:text-body-dark active:scale-95"
                      >
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      align="end"
                      sideOffset={8}
                      className="w-48 rounded-2xl border-border/70 bg-white p-1 shadow-xl"
                    >
                      <button
                        type="button"
                        onClick={() => openActionSheet("toggle")}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-3 text-left hover:bg-stone-50"
                      >
                        <div
                          className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl ${isActive ? "bg-red-50 text-red-500" : "bg-emerald-50 text-emerald-600"}`}
                        >
                          <Power className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-body-dark">
                            {isActive ? "Disable product" : "Enable product"}
                          </p>
                          <p className=" text-[10px] text-muted">
                            {isActive
                              ? "Hide from marketplace"
                              : "Show on marketplace"}
                          </p>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => openActionSheet("edit")}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-3 text-left hover:bg-stone-50"
                      >
                        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-orange-50 text-orange-600">
                          <Pencil className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-body-dark">
                            Request edit
                          </p>
                          <p className=" text-[10px] text-muted">
                            Request product changes
                          </p>
                        </div>
                      </button>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* <Button
                  type="button"
                  variant="outline"
                  onClick={() => openActionSheet("edit")}
                  className="h-9 w-full rounded-xl text-xs"
                >
                  <Pencil className="mr-1.5 h-3.5 w-3.5" />
                  Request Edit
                </Button> */}
              </div>
            </Card>

            <Card className="group hidden overflow-hidden border-border/80 bg-white shadow-xs transition-all duration-300 hover:shadow-sm md:block">
              <div className="p-2">
                <div className="overflow-hidden rounded-xl shadow-sm ring-1 ring-black/5">
                  <ProductCarousel
                    images={variantImages}
                    alt={`${product?.name || "Product"} ${variant?.name || ""}`}
                    autoPlay
                  />
                </div>
              </div>

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

                <div className="flex items-center justify-between gap-3">
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

                <div className="flex items-center justify-between gap-3 border-t border-border pt-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${isActive ? "bg-emerald-500" : "bg-stone-400"}`}
                    />
                    <span
                      className={`text-xs font-semibold ${isActive ? "text-primary" : "text-muted"}`}
                    >
                      {isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        aria-label="Product actions"
                        className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-white text-muted shadow-xs transition hover:bg-stone-50 hover:text-body-dark active:scale-95"
                      >
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      align="end"
                      side="top"
                      sideOffset={8}
                      className="w-52 rounded-2xl border-border/70 bg-white p-1.5 shadow-xl"
                    >
                      <button
                        type="button"
                        onClick={() => openActionSheet("toggle")}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-stone-50"
                      >
                        <div
                          className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${isActive ? "bg-red-50 text-red-500" : "bg-emerald-50 text-emerald-600"}`}
                        >
                          <Power className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-body-dark">
                            {isActive ? "Disable product" : "Enable product"}
                          </p>
                          <p className="mt-0.5 text-[10px] text-muted">
                            {isActive
                              ? "Hide from marketplace"
                              : "Show on marketplace"}
                          </p>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => openActionSheet("edit")}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-stone-50"
                      >
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-orange-50 text-orange-600">
                          <Pencil className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-body-dark">
                            Request edit
                          </p>
                          <p className="mt-0.5 text-[10px] text-muted">
                            Request product changes
                          </p>
                        </div>
                      </button>
                    </PopoverContent>
                  </Popover>
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

            <p className="text-sm text-muted">Choose your preferred pack</p>
          </SheetHeader>

          <div className="overflow-y-auto px-5 pb-8 pt-4">
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
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

            <Separator className="mb-4 mt-2 bg-gray-100" />

            {selectedVariant && (
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-2xl font-semibold tracking-tight text-body-dark">
                    {formatINR(selectedVariant.price)}
                  </p>

                  <p className="text-xs text-muted">
                    / {selectedVariant.pack_quantity}{" "}
                    {selectedVariant.pack_unit}
                  </p>
                </div>

                <p className="text-xs font-semibold text-primary">
                  {selectedVariant.no_of_units} available
                </p>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <ActionSheet
        open={actionSheetOpen}
        onOpenChange={setActionSheetOpen}
        actionType={actionType}
        product={product}
        isActive={isActive}
        loading={actionLoading}
        onToggleConfirm={handleToggleConfirm}
        onRequestEdit={handleRequestEdit}
      />

      <ProductDetailsSheet
        open={productDetailsOpen}
        onOpenChange={setProductDetailsOpen}
        product={product}
        variantId={productDetailsVariantId}
      />
    </>
  );
});

function ActionSheet({
  open,
  onOpenChange,
  actionType,
  product,
  isActive,
  loading,
  onToggleConfirm,
  onRequestEdit,
}) {
  const isToggle = actionType === "toggle";
  const action = isToggle
    ? isActive
      ? "Deactivate"
      : "Activate"
    : "Request Edit";

  const productImage =
    product?.variants?.[0]?.all_media?.[0]?.file ||
    product?.variants?.[0]?.all_media?.[0]?.image ||
    "";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="overflow-hidden rounded-t-[30px] border-0 bg-white px-4 pb-6 pt-3 shadow-2xl sm:px-6"
      >
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-stone-200" />

        <SheetHeader className="space-y-0 text-left">
          <div className="flex items-center gap-3">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-stone-100 ring-1 ring-black/5">
              {productImage ? (
                <img
                  src={productImage}
                  alt={product?.name || "Product"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="grid h-full w-full place-items-center text-xl">
                  🌱
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <SheetTitle className="truncate text-base font-bold text-body-dark">
                {toTitleCase(product?.name || "Product")}
              </SheetTitle>

              <div className="mt-1 flex items-center gap-1.5">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isActive ? "bg-emerald-500" : "bg-stone-400"
                  }`}
                />

                <span className="text-xs font-medium text-muted">
                  {isActive ? "Currently active" : "Currently inactive"}
                </span>
              </div>
            </div>
          </div>
        </SheetHeader>

        <div className="mt-2 rounded-2xl border border-border/70 bg-stone-50/70 p-4">
          <div className="flex items-start gap-3">
            <div
              className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${
                isToggle
                  ? isActive
                    ? "bg-red-50 text-red-500"
                    : "bg-emerald-50 text-emerald-600"
                  : "bg-orange-50 text-orange-600"
              }`}
            >
              {isToggle ? (
                <Power className="h-4 w-4" />
              ) : (
                <Pencil className="h-4 w-4" />
              )}
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-body-dark">
                {isToggle
                  ? `${action} this product`
                  : "Request changes to this product"}
              </p>

              <SheetDescription className="mt-1 text-xs leading-5 text-muted">
                {isToggle
                  ? isActive
                    ? "The product will no longer be available to customers until you activate it again."
                    : "The product will become available to customers after activation."
                  : "Send a request to edit the product details. Your request will be reviewed before changes are made."}
              </SheetDescription>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="h-12 rounded-2xl border-border bg-white text-sm font-semibold text-body-dark hover:bg-stone-50"
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={isToggle ? onToggleConfirm : onRequestEdit}
            disabled={loading}
            className={`h-12 rounded-2xl text-sm font-semibold shadow-sm ${
              isToggle && isActive ? "bg-red-500 hover:bg-red-600" : ""
            }`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Please wait
              </span>
            ) : (
              action
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default SellerCard;
