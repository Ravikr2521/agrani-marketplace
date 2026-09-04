import "swiper/css";

import { ChevronLeft, ChevronRight, Plus, User2Icon } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatINR } from "@/lib/utils";
import ProductCarousel from "./ProductCarousel";
import ProductDetailsSheet from "./ProductDetailsSheet";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { Pagination } from "swiper/modules";

const getMediaUrl = (media) =>
  media?.productImgUrl || media?.image || media?.file || media?.url || "";

function getVariantImages(variant) {
  if (!variant) return [];

  return [
    ...new Set((variant?.all_media || []).map(getMediaUrl).filter(Boolean)),
  ];
}

function getAvailableVariants(product) {
  return (product?.variants || []).filter(
    (variant) =>
      variant?.is_active !== false && Number(variant?.no_of_units) > 0,
  );
}

function MiniProductCard({ product, variant }) {
  const { items, addToCart, increaseQuantity, decreaseQuantity } = useCart();

  const [productDetailsOpen, setProductDetailsOpen] = useState(false);
  const [productDetailsVariantId, setProductDetailsVariantId] = useState(null);

  const variantImages = useMemo(() => getVariantImages(variant), [variant]);

  const cartItem = items?.find(
    (item) =>
      String(item?.productId) === String(product?.id) &&
      String(item?.variantId) === String(variant?.id),
  );

  const quantity = Number(cartItem?.quantity || 0);

  const openProductDetails = () => {
    setProductDetailsVariantId(variant.id);
    setProductDetailsOpen(true);
  };

  const handleAdd = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!variant || Number(variant.no_of_units) <= 0) {
      toast.error("Product unavailable");
      return;
    }

    addToCart({
      productId: product.id,
      productName: product.name,

      variantId: variant.id,
      variantName: variant.name,

      packQuantity: variant.pack_quantity,
      packUnit: variant.pack_unit,

      price: Number(variant.price),
      availableUnits: Number(variant.no_of_units),

      seller: product?.seller_detail?.user_name || "Farmer",

      image: variantImages[0] || "",

      category: product.category,
    });

    toast.success("Added to cart", {
      description: `${product.name} · ${variant.name || "Standard"}`,
    });
  };

  const handleIncrease = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (quantity >= Number(variant?.no_of_units || 0)) {
      toast.error("Maximum available quantity reached");
      return;
    }

    increaseQuantity(product.id, variant.id);
  };

  const handleDecrease = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (quantity > 0) {
      decreaseQuantity(product.id, variant.id);
    }
  };

  return (
    <>
      <Card className="group relative overflow-hidden rounded-2xl border border-border/70 bg-white shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md">
        <Link
          to={`/products/${product?.id}`}
          className="absolute inset-0 z-10 hidden md:block"
          aria-label={`View ${product?.name}`}
        />

        <div className="relative overflow-hidden bg-gray-100">
          <ProductCarousel
            images={variantImages}
            alt={`${product?.name || "Product"} ${variant?.name || ""}`}
            autoPlay
          />

          <div className="absolute right-2 top-2 z-20 rounded-full border border-orange-200 bg-white/95 px-2.5 py-1 text-[9px] font-semibold text-orange-600 shadow-sm backdrop-blur-sm">
            {variant?.pack_quantity} {variant?.pack_unit}
          </div>
        </div>

        <div className="relative z-20 p-2.5 md:p-3.5">
          <div className="flex  items-start justify-between gap-2">
            <div className="w-full  flex  justify-between ">
              <button
                type="button"
                onClick={openProductDetails}
                className="block w-full truncate text-left text-md md:text-[17px] font-semibold leading-tight text-body-dark md:pointer-events-none "
              >
                {product?.name}
              </button>

              <Link
                to={`/seller/${encodeURIComponent(
                  product?.seller_detail?.user_id || "",
                )}`}
                onClick={(event) => event.stopPropagation()}
                className="relative z-30  flex w-fit max-w-full items-center gap-1 text-xs  text-muted transition-colors hover:text-orange-600 md:text-xs"
              >
                <User2Icon className="h-3 w-3 shrink-0 mb-0.5" />

                <span className="truncate">
                  Seller:{" "}
                  <span className="font-medium text-body-dark">
                    {product?.seller_detail?.user_name || "Farmer"}
                  </span>
                </span>
              </Link>
            </div>
          </div>

          <div className="mt-2  flex min-w-0 gap-1 truncate text-xs font-medium ">
            <span className="shrink-0 text-gray-600">Note:</span>

            <span className="truncate text-muted">
              {product?.description || "Fresh quality product"}
            </span>
          </div>

          <div className="mt-2.5 flex items-center justify-between gap-2 md:mt-3 border-t border-border/70 pt-2.5 md:pt-3">
            <div className="min-w-0">
              <div className="text-[16px] font-bold leading-none tracking-wide text-body-dark md:text-lg">
                {formatINR(variant?.price)}
              </div>

              <div className="mt-1 truncate text-[10px] text-muted md:text-[11px]">
                {variant?.pack_quantity} {variant?.pack_unit}
              </div>
            </div>

            <div
              className="relative z-30 shrink-0"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
              }}
            >
              {quantity > 0 ? (
                <div className="flex h-7 items-center overflow-hidden rounded-lg border border-orange-200 bg-orange-50 md:h-8">
                  <button
                    type="button"
                    onClick={handleDecrease}
                    className="grid h-7 w-7 place-items-center text-orange-600 transition hover:bg-orange-100 active:bg-orange-200 md:h-8 md:w-8"
                    aria-label={`Decrease ${product?.name} quantity`}
                  >
                    <span className="text-lg font-semibold leading-none">
                      −
                    </span>
                  </button>

                  <span className="min-w-6 text-center text-xs font-bold text-body-dark md:min-w-7 md:text-sm">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={handleIncrease}
                    disabled={quantity >= Number(variant?.no_of_units || 0)}
                    className="grid h-7 w-7 place-items-center text-orange-600 transition hover:bg-orange-100 active:bg-orange-200 disabled:cursor-not-allowed disabled:opacity-40 md:h-8 md:w-8"
                    aria-label={`Increase ${product?.name} quantity`}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <Button
                  type="button"
                  onClick={handleAdd}
                  disabled={Number(variant?.no_of_units) <= 0}
                  className="h-7 w-7 rounded-lg p-0 md:h-8 md:w-8"
                  aria-label={`Add ${product?.name} ${
                    variant?.name || ""
                  } to cart`}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>

      <div className="md:hidden">
        <ProductDetailsSheet
          open={productDetailsOpen}
          onOpenChange={setProductDetailsOpen}
          product={product}
          variantId={productDetailsVariantId}
        />
      </div>
    </>
  );
}

export default function ProductSection({ products = [], title, description }) {
  const swiperRef = useRef(null);

  const variantProducts = useMemo(() => {
    return products.flatMap((product) => {
      const variants = getAvailableVariants(product);

      return variants.map((variant) => ({
        product,
        variant,
      }));
    });
  }, [products]);

  if (!variantProducts.length) {
    return null;
  }

  return (
    <section className="min-w-0">
      {(title || description) && (
        <div className="mb-3 flex items-end justify-between gap-3">
          <div className="min-w-0">
            {title && (
              <div className="flex items-center gap-2.5">
                <span className="h-6 w-1 shrink-0 rounded-full bg-orange-500" />

                <h2 className="truncate text-lg font-bold tracking-tight text-body-dark md:text-2xl">
                  {title}
                </h2>
              </div>
            )}

            {description && (
              <p className="mt-1 pl-3.5 text-xs leading-5 text-muted sm:text-sm">
                {description}
              </p>
            )}
          </div>

          {variantProducts.length > 1 && (
            <div className="hidden shrink-0 items-center gap-1.5 sm:flex">
              <button
                type="button"
                onClick={() => swiperRef.current?.slidePrev()}
                className="grid h-8 w-8 place-items-center rounded-full border border-border bg-white text-body-dark shadow-xs transition hover:bg-stone-50"
                aria-label="Previous products"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => swiperRef.current?.slideNext()}
                className="grid h-8 w-8 place-items-center rounded-full border border-border bg-white text-body-dark shadow-xs transition hover:bg-stone-50"
                aria-label="Next products"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}

      <div className="relative min-w-0 overflow-hidden pb-5">
        <Swiper
          modules={[Pagination]}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          slidesPerView={1.35}
          spaceBetween={10}
          speed={500}
          grabCursor
          watchOverflow
          pagination={{
            clickable: true,
          }}
          className="marketplace-feature-carousel overflow-visible!"
          breakpoints={{
            480: {
              slidesPerView: 1.5,
              spaceBetween: 10,
            },
            640: {
              slidesPerView: 2.2,
              spaceBetween: 12,
            },
            768: {
              slidesPerView: 2.6,
              spaceBetween: 14,
            },
            1024: {
              slidesPerView: 3.2,
              spaceBetween: 16,
            },
            1280: {
              slidesPerView: 4,
              spaceBetween: 16,
            },
          }}
        >
          {variantProducts.map(({ product, variant }) => (
            <SwiperSlide
              key={`${product.id}-${variant.id}`}
              className="h-auto!"
            >
              <MiniProductCard product={product} variant={variant} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style>
        {`
      .marketplace-feature-carousel .swiper-pagination {
        bottom: -20px !important;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
      }

      .marketplace-feature-carousel .swiper-pagination-bullet {
        width: 5px;
        height: 5px;
        margin: 0 !important;
        border-radius: 999px;
        background: #a8a29e;
        opacity: 0.35;
        transition:
          width 250ms ease,
          opacity 250ms ease,
          transform 250ms ease;
      }

      .marketplace-feature-carousel .swiper-pagination-bullet-active {
        width: 18px;
        opacity: 1;
        transform: none;
        border-radius: 999px;
        background: #f97316;
      }

      .marketplace-feature-carousel .swiper-pagination-bullet:hover {
        opacity: 0.7;
      }
      `}
      </style>
    </section>
  );
}
