import { useState } from "react";
import { Flame, ShoppingBag, TrendingUp } from "lucide-react";

import ProductDetailsSheet from "./ProductDetailsSheet";
import { Link } from "react-router-dom";

function getProductImage(product) {
  const variants = product?.variants || [];

  for (const variant of variants) {
    const media = variant?.all_media?.[0];

    const image =
      media?.productImgUrl || media?.image || media?.file || media?.url;

    if (image) return image;
  }

  return "";
}

function getAvailableVariant(product) {
  return (product?.variants || []).find(
    (variant) =>
      variant?.is_active !== false && Number(variant?.no_of_units) > 0,
  );
}

export default function BestSellingProducts({ products = [] }) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariantId, setSelectedVariantId] = useState(null);

  if (!products.length) return null;

  const openProductDetails = (product) => {
    const variant = getAvailableVariant(product);

    if (!variant) return;

    setSelectedProduct(product);
    setSelectedVariantId(variant.id);
    setDetailsOpen(true);
  };

  return (
    <>
      <section>
        <div className="mb-4 flex items-end justify-between gap-3 lg:mb-5">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-orange-50 text-orange-600">
                <Flame className="h-4 w-4" />
              </span>

              <h2 className="text-xl font-semibold tracking-tight text-body-dark sm:text-2xl">
                Best Sellers
              </h2>
            </div>

            <p className="pl-9 text-sm leading-5 text-muted">
              Popular products shoppers are buying now.
            </p>
          </div>

          <TrendingUp className="hidden h-5 w-5 text-orange-500 sm:block" />
        </div>

        {/* Mobile - */}
        <div className="flex snap-x gap-3 overflow-x-auto scrollbar-none md:hidden">
          {products.map((product, index) => {
            const image = getProductImage(product);
            const variant = getAvailableVariant(product);

            return (
              <button
                key={product.id}
                type="button"
                onClick={() => openProductDetails(product)}
                disabled={!variant}
                className="group relative flex w-55 shrink-0 snap-start overflow-hidden rounded-2xl border border-border bg-white p-2.5 text-left shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-60 sm:w-60"
              >
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-cream">
                  {image ? (
                    <img
                      src={image}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-muted">
                      <ShoppingBag className="h-6 w-6" />
                    </div>
                  )}

                  <span className="absolute left-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-lg bg-white/95 text-[10px] font-black text-orange-600 shadow-sm">
                    #{index + 1}
                  </span>
                </div>

                <div className="flex min-w-0 flex-1 flex-col justify-between px-2 py-1">
                  <div>
                    <p className="truncate text-sm font-bold text-body-dark">
                      {product.name}
                    </p>

                    <p className="mt-0.5 truncate text-[11px] text-muted">
                      {product.category}
                    </p>

                    {variant && (
                      <p className="mt-1 text-xs font-bold text-body-dark">
                        ₹{variant.price}
                      </p>
                    )}
                  </div>

                  <div className="mt-2 flex items-center gap-1.5">
                    <TrendingUp className="h-3 w-3 text-orange-500" />

                    <span className="text-[11px] font-bold text-orange-600">
                      Best selling
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Desktop */}
        <div className="hidden md:flex gap-4 overflow-x-auto pb-2 scrollbar-none lg:gap-5">
          {products.map((product, index) => {
            const image = getProductImage(product);
            const variant = getAvailableVariant(product);

            return (
              <Link to={`/products/${product.id}`}>
                <button
                  key={product.id}
                  type="button"
                  disabled={!variant}
                  className="group relative flex  p-2 shrink-0 overflow-hidden rounded-2xl border border-border/70 bg-white text-left shadow-xs transition-all duration-300  hover:border-orange-200 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-60 lg:w-76 xl:w-80"
                >
                  <div className="relative h-36 w-36 shrink-0 overflow-hidden bg-cream ">
                    {image ? (
                      <img
                        src={image}
                        alt={product.name}
                        className="h-full w-full object-cover rounded-lg  "
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center text-muted">
                        <ShoppingBag className="h-8 w-8" />
                      </div>
                    )}

                    <span className="absolute left-2.5 top-2.5 grid h-7 min-w-7 place-items-center rounded-lg bg-white/95 px-1.5 text-[10px] font-black text-orange-600 shadow-sm backdrop-blur-sm">
                      #{index + 1}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex min-w-0 flex-1 flex-col justify-between p-4">
                    <div className="min-w-0">
                      <p className="truncate text-[15px] font-bold tracking-tight text-body-dark">
                        {product.name}
                      </p>

                      {product.category && (
                        <p className="mt-1 truncate text-xs text-muted">
                          {product.category}
                        </p>
                      )}

                      {variant && (
                        <div className="mt-3">
                          <span className="text-xl font-bold leading-none text-body-dark">
                            ₹{variant.price}
                          </span>

                          <span className="ml-1 text-[10px] text-muted">
                            / {variant.pack_quantity} {variant.pack_unit}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-2.5 py-1.5 text-[10px] font-bold text-orange-600">
                        <TrendingUp className="h-3 w-3" />
                        Best selling
                      </span>
                    </div>
                  </div>
                </button>
              </Link>
            );
          })}
        </div>
      </section>

      <ProductDetailsSheet
        open={detailsOpen}
        onOpenChange={(open) => {
          setDetailsOpen(open);

          if (!open) {
            setSelectedProduct(null);
            setSelectedVariantId(null);
          }
        }}
        product={selectedProduct}
        variantId={selectedVariantId}
      />
    </>
  );
}
