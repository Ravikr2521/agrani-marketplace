import { useState } from "react";
import { Flame, ShoppingBag, TrendingUp } from "lucide-react";

import ProductDetailsSheet from "./ProductDetailsSheet";

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
        <div className="mb-4 flex items-end justify-between gap-3">
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

        <div className="flex snap-x gap-3 overflow-x-auto scrollbar-none">
          {products.map((product, index) => {
            const image = getProductImage(product);
            const variant = getAvailableVariant(product);

            return (
              <button
                key={product.id}
                type="button"
                onClick={() => openProductDetails(product)}
                disabled={!variant}
                className="
                  group
                  relative
                  flex
                  w-55
                  shrink-0
                  snap-start
                  overflow-hidden
                  rounded-2xl
                  border
                  border-border
                  bg-white
                  p-2.5
                  text-left
                  shadow-xs
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:shadow-sm
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                  sm:w-60
                "
              >
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-cream">
                  {image ? (
                    <img
                      src={image}
                      alt={product.name}
                      className="
                        h-full
                        w-full
                        object-cover
                        transition-transform
                        duration-300
                        group-hover:scale-105
                      "
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
