import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Minus,
  Plus,
  ShoppingCart,
  UserRound,
} from "lucide-react";

import { getProducts } from "@/api/products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import VariantSelector from "@/components/products/VariantSelector";

import ErrorState from "@/components/common/ErrorState";

import { useCart } from "@/context/CartContext";
import { formatINR } from "@/lib/utils";
import { toast } from "sonner";

import ProductGrid from "@/components/products/ProductGrid";
import LoadingSkeleton from "@/components/common/LoadingSkeleton";

export default function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [variantId, setVariantId] = useState();
  const [sellerOpen, setSellerOpen] = useState(false);
  const [qty, setQty] = useState(1);

  const [relatedVariants, setRelatedVariants] = useState([]);

  const [selectedImage, setSelectedImage] = useState(0);

  const { addToCart } = useCart();

  const load = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getProducts({ perPage: 100 });

      const found = (data.results || []).find(
        (p) => String(p.id) === String(id),
      );

      if (!found) {
        throw new Error("Product not found.");
      }

      console.log(found, "found");

      setProduct(found);

      const activeVariants = (found.variants || []).filter(
        (v) => v.is_active !== false,
      );

      setVariantId(activeVariants[0]?.id);

      setRelatedVariants(activeVariants);
    } catch (e) {
      setError(e.message);
      setProduct(null);
      setRelatedVariants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const variants = useMemo(
    () => product?.variants?.filter((v) => v.is_active !== false) || [],
    [product],
  );

  const variant =
    variants.find((v) => String(v.id) === String(variantId)) || variants[0];

  const galleryImages = useMemo(() => {
    if (!product?.variants) return [];

    const result = [];

    product.variants
      .filter((v) => v.is_active !== false)
      .forEach((currentVariant) => {
        (currentVariant.all_media || []).forEach((media) => {
          const url =
            media?.file || media?.productImgUrl || media?.image || media?.url;

          if (url) {
            result.push({
              url,
              variantId: currentVariant.id,
              variantName: currentVariant.name,
            });
          }
        });
      });

    const unique = [];
    const seen = new Set();

    for (const image of result) {
      if (!seen.has(image.url)) {
        seen.add(image.url);
        unique.push(image);
      }
    }

    return unique;
  }, [product]);

  useEffect(() => {
    setQty(1);
  }, [variantId]);

  useEffect(() => {
    if (galleryImages.length > 0 && selectedImage >= galleryImages.length) {
      setSelectedImage(0);
    }
  }, [galleryImages.length, selectedImage]);

  const deliveryStates = useMemo(() => {
    return product?.delivery_location_detail?.coverage?.include?.states || [];
  }, [product]);

  const add = () => {
    if (!variant) return;

    const variantImage =
      galleryImages.find(
        (image) => String(image.variantId) === String(variant.id),
      )?.url ||
      galleryImages[0]?.url ||
      "";

    addToCart(
      {
        productId: product.id,
        productName: product.name,
        variantId: variant.id,
        variantName: variant.name,
        packQuantity: variant.pack_quantity,
        packUnit: variant.pack_unit,
        price: Number(variant.price),
        availableUnits: Number(variant.no_of_units || 0),
        seller: product.seller_detail?.user_name || "Farmer",
        image: variantImage,
        category: product.category,
      },
      qty,
    );

    toast.success("Added to cart", {
      description: `${product.name} · ${variant.name || "Standard"}`,
    });
  };

  const previousImage = () => {
    if (galleryImages.length < 2) return;

    setSelectedImage((current) =>
      current === 0 ? galleryImages.length - 1 : current - 1,
    );
  };

  const nextImage = () => {
    if (galleryImages.length < 2) return;

    setSelectedImage((current) =>
      current === galleryImages.length - 1 ? 0 : current + 1,
    );
  };

  const handleThumbnailClick = (image, index) => {
    setSelectedImage(index);

    if (image.variantId && String(image.variantId) !== String(variantId)) {
      setVariantId(image.variantId);
    }
  };

  const currentImage =
    galleryImages[selectedImage]?.url || galleryImages[0]?.url;

  if (loading) {
    return (
      <main className="mx-auto max-w-300 px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-7 lg:grid-cols-[1.05fr_.95fr]">
          <div className="aspect-square animate-pulse rounded-3xl bg-cream" />

          <div className="space-y-5">
            <div className="h-6 w-24 animate-pulse rounded-lg bg-cream" />
            <div className="h-12 w-3/4 animate-pulse rounded-lg bg-cream" />
            <div className="h-20 animate-pulse rounded-xl bg-cream" />
            <div className="h-14 animate-pulse rounded-xl bg-cream" />
            <div className="h-12 animate-pulse rounded-xl bg-cream" />
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-300 px-4 py-10 sm:px-6 lg:px-8">
        <ErrorState message={error} onRetry={load} />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-300 px-4 md:px-0 py-5">
      {/* <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to marketplace
      </Link> */}

      <div className="mt-2 grid gap-7 lg:grid-cols-[1.05fr_.95fr] lg:items-start lg:gap-9">
        <section>
          <Card className="overflow-hidden bg-transparent">
            <div className="flex flex-col gap-3 p-3 sm:p-4 lg:flex-row">
              {galleryImages.length > 1 && (
                <div className="order-2 flex shrink-0 gap-2 overflow-x-auto pb-0.5 md:order-2 lg:order-1 lg:w-17 lg:flex-col lg:overflow-x-visible lg:overflow-y-auto">
                  {galleryImages.map((image, index) => {
                    const active = index === selectedImage;

                    return (
                      <button
                        key={`${image.url}-${index}`}
                        type="button"
                        onClick={() => handleThumbnailClick(image, index)}
                        className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 bg-cream transition-all duration-200 ${
                          active
                            ? "border-primary ring-2 ring-light-blue"
                            : "border-transparent hover:border-border"
                        }`}
                        aria-label={`View image ${index + 1}`}
                      >
                        <img
                          src={image.url}
                          alt={image.variantName || "Product image"}
                          className="h-full w-full object-cover"
                        />

                        {active && (
                          <span className="absolute inset-0 bg-primary/10" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="order-1 relative min-w-0 flex-1 overflow-hidden rounded-2xl bg-cream lg:order-2">
                <div className="aspect-3/2 w-full overflow-hidden md:aspect-square">
                  {currentImage ? (
                    <img
                      src={currentImage}
                      alt={product.name}
                      className="h-full w-full object-cover transition-all duration-300"
                    />
                  ) : (
                    <div className="grid h-full place-items-center text-sm text-muted">
                      No image available
                    </div>
                  )}
                </div>

                {galleryImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={previousImage}
                      className="absolute left-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-border bg-white/90 text-body-light shadow-sm backdrop-blur transition hover:bg-white hover:text-primary"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={nextImage}
                      className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-border bg-white/90 text-body-light shadow-sm backdrop-blur transition hover:bg-white hover:text-primary"
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>

                    <div className="absolute bottom-3 right-3 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
                      {selectedImage + 1} / {galleryImages.length}
                    </div>
                  </>
                )}
              </div>
            </div>
          </Card>
        </section>

        <section className="min-w-0">
          <div className="flex items-center gap-2">
            <Badge variant="success">{product.category || "Produce"}</Badge>

            {variant && Number(variant.no_of_units) > 0 && (
              <span className="text-xs font-medium text-primary">In stock</span>
            )}
          </div>

          <h1 className="mt-3 text-2xl font-bold tracking-tight text-body-dark sm:text-4xl">
            {product.name}
          </h1>

          <Link
            to={`/seller/${encodeURIComponent(
              product?.seller_detail?.user_mobile || "",
            )}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="mt-2 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-primary"
              onClick={() => setSellerOpen(true)}
            >
              <UserRound className="h-4 w-4" />

              <span>{product.seller_detail?.user_name || "Farmer"}</span>

              <span className="text-muted">·</span>

              <span className="font-medium">Seller details</span>
            </button>
          </Link>

          <p className="mt-4 text-sm leading-6 text-muted sm:text-[15px]">
            {product.description ||
              "Fresh agricultural produce available from this verified marketplace seller."}
          </p>

          <Separator className="my-4 bg-gray-100" />

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-bold text-body-dark/80">
                Choose variant
              </label>

              {variants.length > 1 && (
                <span className="text-xs text-muted">
                  {variants.length} options
                </span>
              )}
            </div>

            <VariantSelector
              variants={variants}
              value={variant?.id}
              onChange={(value) => {
                setVariantId(value);

                const firstImageIndex = galleryImages.findIndex(
                  (image) => String(image.variantId) === String(value),
                );

                if (firstImageIndex >= 0) {
                  setSelectedImage(firstImageIndex);
                }
              }}
            />
          </div>

          {variant && (
            <>
              <div className="mt-5 rounded-2xl bg-white/90 md:p-4">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <div className="text-3xl font-bold tracking-tight text-body-dark">
                      {formatINR(variant.price)}
                    </div>

                    <div className="mt-1 text-xs text-muted">
                      per {variant.pack_quantity} {variant.pack_unit}
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`text-xs font-bold ${
                        Number(variant.no_of_units) > 0
                          ? "text-primary"
                          : "text-red-600"
                      }`}
                    >
                      {Number(variant.no_of_units) > 0
                        ? `${variant.no_of_units} available`
                        : "Out of stock"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-2.5">
                <div className="flex h-12 shrink-0 items-center overflow-hidden rounded-xl border border-border bg-white">
                  <button
                    type="button"
                    className="grid h-12 w-11 place-items-center text-muted transition-colors hover:bg-cream hover:text-primary disabled:opacity-30"
                    disabled={qty <= 1}
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>

                  <span className="grid h-12 min-w-9 place-items-center border-x border-border px-1 text-sm font-bold text-body-dark">
                    {qty}
                  </span>

                  <button
                    type="button"
                    className="grid h-12 w-11 place-items-center text-muted transition-colors hover:bg-cream hover:text-primary disabled:opacity-30"
                    disabled={qty >= Number(variant.no_of_units)}
                    onClick={() =>
                      setQty((q) =>
                        Math.min(Number(variant.no_of_units), q + 1),
                      )
                    }
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <Button
                  size="lg"
                  className="h-12 flex-1 rounded-xl font-semibold shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                  disabled={Number(variant.no_of_units) < 1}
                  onClick={add}
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add {qty} to Cart
                </Button>
              </div>
            </>
          )}

          {deliveryStates.length > 0 && (
            <div className="mt-6 rounded-2xl border border-border bg-white p-4">
              <div className="flex items-start gap-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-light-blue text-primary">
                  <MapPin className="h-4 w-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-body-dark">
                    Delivery available in
                  </h3>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {deliveryStates.map((location) => (
                      <div
                        key={location.state_name}
                        className="rounded-lg border border-border bg-cream px-3 py-2"
                      >
                        <div className="text-xs font-semibold text-body-light">
                          {location.state_name}
                        </div>

                        {location.all_districts ? (
                          <div className="mt-0.5 text-[11px] text-primary">
                            All districts
                          </div>
                        ) : location.districts?.length > 0 ? (
                          <div className="mt-0.5 text-[11px] text-muted">
                            {location.districts.join(", ")}
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      <section className="mt-12 border-t border-border pt-8 sm:mt-16 sm:pt-10">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
              Available options
            </p>

            <h2 className="mt-1 text-xl font-bold tracking-tight text-body-dark sm:text-3xl">
              More variants
            </h2>

            <p className="mt-1 text-[13px] text-muted">
              Choose another variety or pack of {product.name}.
            </p>
          </div>

          <Button asChild variant="outline" className="hidden sm:inline-flex">
            <Link to="/products">
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {relatedVariants.length > 0 ? (
          <ProductGrid
            products={(product?.variants || [])
              .filter((variant) => variant.is_active !== false)
              .map((variant) => ({
                ...product,
                variants: [variant],
              }))}
          />
        ) : (
          <div className="rounded-2xl border border-border bg-cream px-5 py-8 text-center">
            <p className="text-sm text-muted">
              No other variants available right now.
            </p>
          </div>
        )}

        <Button asChild variant="outline" className="mt-5 w-full sm:hidden">
          <Link to="/products">
            View all products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </section>
    </main>
  );
}
