import { useEffect, useMemo, useState } from "react";
import {
  MapPin,
  UserRound,
  KeyRound,
  PhoneCall,
  ShoppingBag,
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import { getOrdersByPhone } from "@/api/orders";
import { getProducts } from "@/api/products";

import ErrorState from "@/components/common/ErrorState";
import { formatDate, formatINR } from "@/lib/utils";

const getMediaUrl = (media) =>
  media?.productImgUrl || media?.image || media?.file || media?.url || "";

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

function OrderDetailsLoading() {
  return (
    <div className="space-y-4 p-4">
      <div className="rounded-2xl border border-border bg-white p-4">
        <div className="flex items-center justify-between gap-3">
          <Skeleton className="h-5 w-36 rounded-md" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>

        <Skeleton className="mt-2 h-4 w-44 rounded-md" />
      </div>

      <div className="rounded-2xl border border-border bg-white p-4">
        <Skeleton className="h-5 w-36 rounded-md" />

        <div className="mt-4 divide-y divide-border">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex gap-3 py-4 first:pt-0">
              <Skeleton className="h-20 w-20 shrink-0 rounded-xl" />

              <div className="min-w-0 flex-1">
                <Skeleton className="h-4 w-32 rounded-md" />
                <Skeleton className="mt-2 h-3 w-28 rounded-md" />
                <Skeleton className="mt-2 h-3 w-40 rounded-md" />
              </div>

              <Skeleton className="h-5 w-16 shrink-0 rounded-md" />
            </div>
          ))}
        </div>

        <Separator className="my-4" />

        <div className="flex justify-between">
          <Skeleton className="h-5 w-12 rounded-md" />
          <Skeleton className="h-6 w-24 rounded-md" />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-white p-4">
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="mt-3 h-10 w-full rounded-xl" />
      </div>
    </div>
  );
}

export default function OrderDetailsSheet({ open, onOpenChange, orderId }) {
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadOrder = async () => {
    if (!orderId) return;

    setLoading(true);
    setError(null);

    const phone =
      localStorage.getItem("farmers_marketplace_verified_phone") ||
      localStorage.getItem("farmers_marketplace_buyer_phone");

    if (!phone) {
      setError("Please verify your mobile number first to view order details.");
      setLoading(false);
      return;
    }

    try {
      const [orderResponse, productsResponse] = await Promise.all([
        getOrdersByPhone(phone),
        getProducts({ perPage: 100 }),
      ]);

      const results =
        orderResponse?.data?.results || orderResponse?.results || [];

      const found = results.find((item) => String(item.id) === String(orderId));

      if (!found) {
        throw new Error("Order not found.");
      }

      const products = productsResponse?.results || [];

      const enrichedItems = (found.items || []).map((item) => {
        const product = products.find(
          (product) => String(product.id) === String(item.product?.id),
        );

        if (!product) {
          return item;
        }

        const variant = (product.variants || []).find(
          (variant) => String(variant.id) === String(item.variant?.id),
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
        ...found,
        items: enrichedItems,
      });
    } catch (error) {
      setError(error.message || "Unable to load order.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open || !orderId) return;

    loadOrder();
  }, [open, orderId]);

  const total = useMemo(() => {
    return (order?.items || []).reduce(
      (sum, item) =>
        sum +
        Number(item.price_per_unit || item.variant?.price || 0) *
          Number(item.no_of_units || 0),
      0,
    );
  }, [order]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="
          max-h-[94vh]
          overflow-hidden
          rounded-t-[28px]
          border-t
          border-border
          bg-[#fffdf8]
          p-0
        "
      >
        <SheetHeader className="border-b border-border bg-white px-4 py-4 text-left sm:px-6">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-light-blue text-primary">
              <ShoppingBag className="h-4.5 w-4.5" />
            </div>

            <div className="min-w-0">
              <SheetTitle className="truncate text-lg font-bold text-body-dark">
                Order details
              </SheetTitle>

              {order && (
                <p className="mt-0.5 truncate text-xs text-muted">
                  #{order.id}
                </p>
              )}
            </div>
          </div>
        </SheetHeader>

        <div className="max-h-[calc(94vh-76px)] overflow-y-auto">
          {loading ? (
            <OrderDetailsLoading />
          ) : error ? (
            <div className="p-4 sm:p-6">
              <ErrorState message={error} onRetry={loadOrder} />
            </div>
          ) : !order ? (
            <div className="p-6 text-center text-sm text-muted">
              Order not found.
            </div>
          ) : (
            <div className="space-y-4 p-4 sm:p-6">
              <div className="rounded-2xl border border-border bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs text-muted">Order placed</p>

                    <p className="mt-1 text-sm font-semibold text-body-dark">
                      {formatDate(order.created_at)}
                    </p>

                    <p className="mt-1  text-sm font-semibold text-body-dark">
                      #{order.id}
                    </p>
                  </div>

                  <Badge variant="warning" className="shrink-0">
                    {order.status || "Pending"}
                  </Badge>
                </div>
              </div>

              <section className="rounded-2xl border border-border bg-white p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-bold text-body-dark">Ordered products</h2>

                  <span className="text-xs text-muted">
                    {order.items?.length || 0}{" "}
                    {order.items?.length === 1 ? "item" : "items"}
                  </span>
                </div>

                <div className="mt-4 divide-y divide-border">
                  {order.items?.map((item) => {
                    const image = getItemImage(item);

                    const itemTotal =
                      Number(item.price_per_unit || item.variant?.price || 0) *
                      Number(item.no_of_units || 0);

                    return (
                      <div key={item.id} className="flex gap-3 py-4 first:pt-0">
                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-cream">
                          {image ? (
                            <img
                              src={image}
                              alt={item.product?.name || "Product"}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="grid h-full w-full place-items-center text-xs text-muted">
                              No image
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-body-dark">
                            {item.product?.name || "Product"}
                          </p>

                          <p className="mt-0.5 text-xs text-muted">
                            {item.variant?.name || "Standard"} ·{" "}
                            {item.variant?.pack_quantity}{" "}
                            {item.variant?.pack_unit}
                          </p>

                          <p className="mt-1 text-[11px] text-muted">
                            Seller: {item.seller?.user_name || "Farmer"}
                          </p>

                          <p className="mt-0.5 text-[11px] text-muted">
                            Quantity: {item.no_of_units}
                          </p>
                        </div>

                        <div className="flex shrink-0 flex-col items-end gap-2">
                          <p className="text-sm font-semibold text-body-dark">
                            {formatINR(itemTotal)}
                          </p>

                          <Badge variant="success" className="text-[10px]">
                            {item.status}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Separator className="my-3 bg-gray-100" />

                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-body-dark">
                    Total
                  </span>

                  <span className="text-xl font-black text-body-dark">
                    {formatINR(total)}
                  </span>
                </div>
              </section>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-border bg-white p-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-light-blue text-primary">
                      <UserRound className="h-4 w-4" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-medium text-muted">Buyer</p>

                      <p className="truncate text-sm font-bold text-body-dark capitalize">
                        {order.buyer_name}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-3 border-t border-border pt-3">
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-light-blue text-primary">
                      <PhoneCall className="h-3.5 w-3.5" />
                    </div>

                    <p className="text-sm text-muted">{order.buyer_phone}</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-white p-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-light-blue text-primary">
                      <MapPin className="h-4 w-4" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-medium text-muted">
                        Delivery address
                      </p>

                      <p className="mt-1 text-sm font-bold leading-5 text-body-dark">
                        {order.delivery_address}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 border-t border-border pt-3">
                    <p className="text-xs leading-5 text-muted">
                      {order.delivery_state}, {order.delivery_district},{" "}
                      {order.delivery_block}
                      <br />
                      <span className="font-semibold text-body-light">
                        PIN {order.delivery_pincode}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
