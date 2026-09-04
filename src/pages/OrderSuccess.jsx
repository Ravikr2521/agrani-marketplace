import {
  ArrowRight,
  CheckCircle2,
  MapPin,
  PackageCheck,
  ShoppingBag,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useProductApi } from "@/api/products";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { useOrder } from "@/context/OrderContext";
import { formatDate, formatINR } from "@/lib/utils";

const getMediaUrl = (media) => {
  return (
    media?.productImgUrl || media?.image || media?.file || media?.url || ""
  );
};

const getItemImage = (item) => {
  const variantMedia = item?.variant?.all_media || [];
  const productMedia = item?.product?.all_media || [];

  return (
    getMediaUrl(variantMedia[0]) ||
    getMediaUrl(productMedia[0]) ||
    item?.image ||
    ""
  );
};

export default function OrderSuccess() {
  const { getProducts } = useProductApi();
  const { lastOrder } = useOrder();

  const [order, setOrder] = useState(lastOrder);
  const [loadingImages, setLoadingImages] = useState(true);

  useEffect(() => {
    if (!lastOrder?.items?.length) {
      setLoadingImages(false);
      return;
    }

    const loadProductImages = async () => {
      try {
        const data = await getProducts({ perPage: 100 });
        const products = data?.results || [];

        const enrichedItems = lastOrder.items.map((item) => {
          const product = products.find(
            (p) => String(p.id) === String(item?.product?.id),
          );

          if (!product) {
            return item;
          }

          const variant = (product.variants || []).find(
            (v) => String(v.id) === String(item?.variant?.id),
          );

          return {
            ...item,
            product: {
              ...item.product,
              ...product,
            },
            variant: {
              ...item.variant,
              ...(variant || {}),
            },
          };
        });

        setOrder({
          ...lastOrder,
          items: enrichedItems,
        });
      } catch (error) {
        setOrder(lastOrder);
      } finally {
        setLoadingImages(false);
      }
    };

    loadProductImages();
  }, [lastOrder]);

  if (!order) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-lg items-center px-4 py-10">
        <div className="w-full text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-light-blue text-primary">
            <PackageCheck className="h-8 w-8" />
          </div>

          <h1 className="mt-5 text-2xl font-bold tracking-tight text-body-dark">
            Order details unavailable
          </h1>

          <p className="mt-2 text-sm text-muted">
            We couldn't find your recent order.
          </p>

          <Button asChild className="mt-6 rounded-xl">
            <Link to="/products">
              Continue Shopping
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </main>
    );
  }

  const items = order.items || [];

  const total = items.reduce(
    (sum, item) =>
      sum +
      Number(item.price_per_unit || item.variant?.price || 0) *
        Number(item.no_of_units || 0),
    0,
  );

  const status = order.status || "Pending";

  return (
    <main className="mx-auto max-w-3xl px-4 py-7 sm:px-6 sm:py-10">
      <div className="overflow-hidden rounded-3xl border border-border bg-white shadow-sm">
        <div className="px-5 py-8 text-center sm:px-8 sm:py-9">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-light-blue text-primary">
            <CheckCircle2 className="h-9 w-9" />
          </div>

          <h1 className="mt-5 text-2xl font-bold tracking-tight text-body-dark sm:text-3xl">
            Order placed successfully
          </h1>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
            Thank you, {order.buyer_name}. Your order has been received and is
            being prepared.
          </p>

          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="rounded-full bg-cream px-3 py-1.5 text-xs font-semibold text-body-light">
              #{order.id}
            </span>

            <Badge
              variant={
                status.toLowerCase() === "delivered" ? "success" : "warning"
              }
              className="rounded-full"
            >
              {status}
            </Badge>
          </div>
        </div>

        <Separator />

        <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5">
          <div className="rounded-2xl bg-cream p-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />

              <span className="text-xs font-bold uppercase tracking-wide text-muted">
                Delivery
              </span>
            </div>

            <p className="mt-3 text-sm font-semibold leading-5 text-body-light">
              {order.delivery_address}
            </p>

            <p className="mt-1 text-xs text-muted">
              {order.delivery_state}, {order.delivery_district} ·{" "}
              {order.delivery_pincode}
            </p>
          </div>

          <div className="rounded-2xl bg-cream p-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-primary" />

              <span className="text-xs font-bold uppercase tracking-wide text-muted">
                Order
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm text-muted">Items</span>

              <span className="text-sm font-semibold text-body-light">
                {items.length}
              </span>
            </div>

            <div className="mt-1.5 flex items-center justify-between">
              <span className="text-sm text-muted">Placed</span>

              <span className="text-xs font-semibold text-body-light">
                {formatDate(order.created_at)}
              </span>
            </div>
          </div>
        </div>

        <div className="px-4 pb-4 sm:px-5 sm:pb-5">
          <div className="rounded-2xl border border-border bg-white">
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <h2 className="text-sm font-bold text-body-dark">
                  Order Items
                </h2>

                <p className="mt-0.5 text-xs text-muted">
                  {items.length} item
                  {items.length === 1 ? "" : "s"}
                </p>
              </div>

              <span className="text-sm font-bold text-body-dark">
                {formatINR(total)}
              </span>
            </div>

            <Separator />

            <div className="divide-y divide-stone-100">
              {items.map((item) => {
                const quantity = Number(item.no_of_units || 0);

                const price = Number(
                  item.price_per_unit || item.variant?.price || 0,
                );

                const image = getItemImage(item);

                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 px-4 py-3.5"
                  >
                    <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-cream">
                      {loadingImages ? (
                        <div className="h-full w-full animate-pulse bg-border" />
                      ) : image ? (
                        <img
                          src={image}
                          alt={item.product?.name || "Product"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="grid h-full w-full place-items-center">
                          <ShoppingBag className="h-5 w-5 text-muted" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-body-dark">
                        {item.product?.name || "Product"}
                      </p>

                      <p className="mt-0.5 truncate text-xs font-medium text-primary">
                        {item.variant?.name || "Standard"}
                      </p>

                      <p className="mt-0.5 text-xs text-muted">
                        {quantity} × {formatINR(price)}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-sm font-bold text-body-dark">
                        {formatINR(quantity * price)}
                      </p>

                      <p className="mt-0.5 text-[10px] font-medium text-muted">
                        {item.status || "Pending"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="border-t border-border bg-cream/60 px-4 py-4 sm:px-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-muted">Total</span>

            <span className="text-xl font-bold tracking-tight text-body-dark">
              {formatINR(total)}
            </span>
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button asChild variant="outline" className="h-10 rounded-xl">
              <Link to="/orders">View Orders</Link>
            </Button>

            <Button asChild className="h-10 rounded-xl">
              <Link to="/products">
                Continue Shopping
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
