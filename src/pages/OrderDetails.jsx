import { KeyRound, MapPin, PhoneCall, UserRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useOrderApi } from "@/api/orders";
import { useProductApi } from "@/api/products";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import ErrorState from "@/components/common/ErrorState";
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

function OrderDetailsSkeleton() {
  return (
    <main className="mx-auto max-w-6xl px-4 md:px-8">
      <div className="mt-5">
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <Skeleton className="h-4 w-36 rounded-md" />

            <Skeleton className="mt-2 h-7 w-40 rounded-md sm:h-8 sm:w-52" />
          </div>

          <Skeleton className="h-7 w-20 shrink-0 rounded-full" />
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded-2xl border border-border bg-white p-5 sm:p-6">
          <Skeleton className="h-5 w-36 rounded-md" />

          <div className="mt-4 divide-y divide-slate-200">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex gap-3 py-4 first:pt-0">
                <Skeleton className="h-20 w-20 shrink-0 rounded-xl" />

                <div className="min-w-0 flex-1">
                  <Skeleton className="h-4 w-32 rounded-md sm:h-5 sm:w-40" />

                  <Skeleton className="mt-2 h-4 w-28 rounded-md sm:w-36" />

                  <Skeleton className="mt-2 h-3 w-36 rounded-md sm:w-48" />
                </div>

                <div className="flex shrink-0 flex-col items-end">
                  <Skeleton className="h-5 w-20 rounded-md" />

                  <Skeleton className="mt-2 h-6 w-14 rounded-full" />
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-14 rounded-md" />
            <Skeleton className="h-7 w-24 rounded-md" />
          </div>
        </section>

        <aside className="space-y-4">
          <Card className="overflow-hidden border-border/80 bg-white p-0 shadow-xs">
            <div className="flex items-center justify-between gap-4 px-4 py-3.5">
              <div className="flex min-w-0 items-center gap-3">
                <Skeleton className="h-9 w-9 shrink-0 rounded-xl" />

                <div className="min-w-0">
                  <Skeleton className="h-3 w-12 rounded-md" />

                  <Skeleton className="mt-1.5 h-4 w-24 rounded-md" />
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-xl" />

                <Skeleton className="h-4 w-24 rounded-md" />
              </div>
            </div>
          </Card>

          <Card className="overflow-hidden border-border/80 bg-white p-0 shadow-xs">
            <div className="flex items-center gap-3 px-4 py-3.5">
              <Skeleton className="h-9 w-9 shrink-0 rounded-xl" />

              <div className="min-w-0 flex-1">
                <Skeleton className="h-3 w-28 rounded-md" />

                <Skeleton className="mt-1.5 h-4 w-36 rounded-md" />
              </div>
            </div>

            <div className="border-t border-border px-4 py-3">
              <Skeleton className="h-3 w-full rounded-md" />

              <Skeleton className="mt-2 h-3 w-4/5 rounded-md" />

              <Skeleton className="mt-2 h-3 w-20 rounded-md" />
            </div>
          </Card>
        </aside>
      </div>

      <Skeleton className="mt-6 h-10 w-40 rounded-lg" />
    </main>
  );
}

export default function OrderDetails() {
  const { getOrdersByPhone } = useOrderApi();
  const { getProducts } = useProductApi();
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
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

      const found = results.find((x) => String(x.id) === String(id));

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
    } catch (e) {
      setError(e.message || "Unable to load order.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const total = useMemo(() => {
    return (order?.items || []).reduce(
      (sum, item) =>
        sum +
        Number(item.price_per_unit || item.variant?.price || 0) *
          Number(item.no_of_units || 0),
      0,
    );
  }, [order]);

  if (loading) {
    return <OrderDetailsSkeleton />;
  }

  if (error) {
    const phone =
      localStorage.getItem("farmers_marketplace_verified_phone") ||
      localStorage.getItem("farmers_marketplace_buyer_phone");

    if (!phone) {
      return (
        <main className="mx-auto max-w-6xl md:px-8 px-4">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="w-16 h-16 rounded-2xl bg-light-blue border border-light-blue flex items-center justify-center mb-4">
              <KeyRound className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-body-dark mb-2">
              Verification Required
            </h2>
            <p className="text-muted mb-6 max-w-md">
              You need to verify your mobile number to view order details.
            </p>
            <div className="flex gap-3">
              <Button asChild variant="outline">
                <Link to="/orders">Verify Mobile</Link>
              </Button>
              <Button asChild>
                <Link to="/products">Browse Products</Link>
              </Button>
            </div>
          </div>
        </main>
      );
    }

    return (
      <main className="mx-auto max-w-6xl md:px-8 px-4">
        <ErrorState message={error} onRetry={load} />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl md:px-8 px-4">
      <div className="mt-5 flex gap-4 justify-between ">
        <div className=" w-full">
          <div className="flex w-full justify-between items-end">
            <p className="text-sm text-muted ">
              Order placed {formatDate(order.created_at)}
            </p>
            <Badge variant="warning">{order.status || "Pending"}</Badge>
          </div>

          <h1 className="mt-1 break-all md:text-2xl text-md font-semibold  text-body-dark">
            #{order.id}
          </h1>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_320px]">
        <section className="rounded-2xl border border-border bg-white p-5 sm:p-6">
          <h2 className="font-bold text-body-dark">Ordered products</h2>

          <div className="mt-4 divide-y divide-slate-200">
            {order.items?.map((item) => {
              const image = getItemImage(item);

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
                    <div className="font-semibold text-body-dark">
                      {item.product?.name || "Product"}
                    </div>

                    <div className="mt-0.5 text-sm text-muted">
                      {item.variant?.name || "Standard"} ·{" "}
                      {item.variant?.pack_quantity} {item.variant?.pack_unit}
                    </div>

                    <div className="mt-1 text-xs text-muted">
                      Seller: {item.seller?.user_name || "Farmer"} · Qty{" "}
                      {item.no_of_units}
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col items-end">
                    <div className="font-bold text-body-dark">
                      {formatINR(
                        Number(
                          item.price_per_unit || item.variant?.price || 0,
                        ) * Number(item.no_of_units || 0),
                      )}
                    </div>

                    <Badge variant="success" className="mt-2">
                      {item.status}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>

          <Separator className="my-4" />

          <div className="flex justify-between text-lg">
            <span className="font-bold text-body-dark">Total</span>

            <span className="font-black text-body-dark">
              {formatINR(total)}
            </span>
          </div>
        </section>

        <aside className="space-y-4">
          <Card className="overflow-hidden border-border/80 bg-white p-0 shadow-xs flex justify-between items-center px-4 py-3.5">
            <div className="flex items-center gap-3 ">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-light-blue text-primary">
                <UserRound className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium text-muted">Buyer</p>

                <p className="truncate text-sm font-bold text-body-dark">
                  {order.buyer_name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-light-blue text-primary">
                <PhoneCall className="h-4 w-4" />
              </div>{" "}
              <p className="text-sm text-muted">{order.buyer_phone}</p>
            </div>
          </Card>

          <Card className="overflow-hidden border-border/80 bg-white p-0 shadow-xs">
            <div className="flex items-center gap-3 px-4 py-3.5">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-light-blue text-primary">
                <MapPin className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium text-muted">
                  Delivery address
                </p>

                <p className="text-sm font-bold text-body-dark">
                  {order.delivery_address}
                </p>
              </div>
            </div>

            <div className="border-t border-border px-4 py-3">
              <p className="text-xs leading-5 text-muted">
                {order.delivery_state}, {order.delivery_district},{" "}
                {order.delivery_block}
                <br />
                <span className="font-semibold text-body-light">
                  PIN {order.delivery_pincode}
                </span>
              </p>
            </div>
          </Card>
        </aside>
      </div>

      <Button asChild variant="outline" className="mt-6">
        <Link to="/products">Continue shopping</Link>
      </Button>
    </main>
  );
}
