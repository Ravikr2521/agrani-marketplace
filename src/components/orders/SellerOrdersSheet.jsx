import { useEffect, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  Clock3,
  IndianRupee,
  MapPin,
  Package,
  Phone,
  RefreshCw,
  ShoppingBag,
  UserRound,
  XCircle,
  CheckCircle2,
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { getSellerOrders, updateOrderStatus } from "@/api/products";

import { toast } from "sonner";

const STATUS_OPTIONS = ["Order Pending", "Order Completed", "Order Rejected"];

function extractOrders(data) {
  if (!data) return [];

  if (Array.isArray(data)) return data;
  if (Array.isArray(data.results)) return data.results;
  if (Array.isArray(data.data?.results)) return data.data.results;
  if (Array.isArray(data.data)) return data.data;

  return [];
}

function formatDate(value) {
  if (!value) return "";

  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatMoney(value) {
  return Number(value || 0).toLocaleString("en-IN");
}

function getMediaUrl(media) {
  return (
    media?.productImgUrl || media?.image || media?.file || media?.url || ""
  );
}

function getOrderImage(order) {
  const variantImages = order?.variant?.all_media || [];
  const productImages = order?.product?.all_media || [];

  return (
    getMediaUrl(variantImages[0]) ||
    getMediaUrl(productImages[0]) ||
    order?.product?.image ||
    order?.image ||
    ""
  );
}

function StatusBadge({ status }) {
  const value = String(status || "").toLowerCase();

  if (value.includes("completed")) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
        <CheckCircle2 className="h-3 w-3" />
        Completed
      </span>
    );
  }

  if (value.includes("rejected")) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-bold text-red-600">
        <XCircle className="h-3 w-3" />
        Rejected
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700">
      <Clock3 className="h-3 w-3" />
      Pending
    </span>
  );
}

function OrderSkeleton() {
  return (
    <div className="rounded-[22px] border border-border bg-white p-3">
      <div className="flex gap-3">
        <Skeleton className="h-20 w-20 shrink-0 rounded-2xl" />

        <div className="min-w-0 flex-1">
          <Skeleton className="h-4 w-32 rounded-md" />
          <Skeleton className="mt-2 h-3 w-24 rounded-md" />
          <Skeleton className="mt-3 h-5 w-20 rounded-full" />
        </div>
      </div>

      <div className="mt-3 border-t border-border pt-3">
        <div className="flex justify-between">
          <Skeleton className="h-3 w-20 rounded-md" />
          <Skeleton className="h-5 w-24 rounded-md" />
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="rounded-2xl bg-[#faf8f3] px-3 py-3">
      <p className="text-[9px] font-semibold uppercase tracking-wider text-muted">
        {label}
      </p>

      <p className="mt-1 truncate text-xs font-bold text-body-dark">
        {value || "—"}
      </p>
    </div>
  );
}

function SellerOrderCard({ order }) {
  const [expanded, setExpanded] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(
    order?.status || STATUS_OPTIONS[0],
  );
  const [updating, setUpdating] = useState(false);

  const info = order?.order || {};
  const product = order?.product;
  const variant = order?.variant;

  const image = getOrderImage(order);

  const total =
    Number(order?.price_per_unit || 0) * Number(order?.no_of_units || 0);

  const hasChanged = selectedStatus !== order?.status;

  const handleUpdate = async (event) => {
    event.stopPropagation();

    if (!hasChanged) return;

    try {
      setUpdating(true);

      await updateOrderStatus(order.id, selectedStatus);

      toast.success("Order status updated");
    } catch (error) {
      toast.error(error?.message || "Failed to update order status");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div
      className={`overflow-hidden rounded-[22px] border bg-white shadow-xs transition-all duration-300 ${
        expanded ? "border-primary/30 shadow-md" : "border-border/70"
      }`}
    >
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="w-full p-3 text-left"
      >
        <div className="flex gap-3">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-[#f5f1e8]">
            {image ? (
              <img
                src={image}
                alt={product?.name || "Product"}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="grid h-full w-full place-items-center text-primary/50">
                <Package className="h-7 w-7" />
              </div>
            )}

            {variant?.pack_quantity && (
              <div className="absolute bottom-1.5 left-1.5 rounded-lg bg-black/65 px-1.5 py-1 text-[8px] font-bold text-white backdrop-blur-sm">
                {variant.pack_quantity} {variant.pack_unit}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-[14px] font-bold tracking-tight text-body-dark">
                  {product?.name || "Order"}
                </p>

                {variant?.name && (
                  <p className="mt-0.5 truncate text-[10px] font-medium text-muted">
                    {variant.name}
                  </p>
                )}
              </div>

              <ChevronDown
                className={`mt-1 h-4 w-4 shrink-0 text-muted transition-transform duration-300 ${
                  expanded ? "rotate-180 text-primary" : ""
                }`}
              />
            </div>

            <div className="mt-2.5 flex items-center gap-2">
              <StatusBadge status={order?.status} />

              {order?.created_at && (
                <span className="flex items-center gap-1 text-[9px] text-muted">
                  <CalendarDays className="h-3 w-3" />
                  {formatDate(order.created_at)}
                </span>
              )}
            </div>

            {info?.buyer_name && (
              <div className="mt-2 flex min-w-0 items-center gap-1.5">
                <UserRound className="h-3 w-3 shrink-0 text-primary" />

                <span className="truncate text-[10px] font-medium text-muted">
                  {info.buyer_name}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between rounded-2xl bg-[#f8f6f0] px-3 py-2.5">
          <div>
            <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-muted">
              Order total
            </p>

            <p className="mt-0.5 flex items-center text-[17px] font-black tracking-tight text-body-dark">
              <IndianRupee className="h-3.5 w-3.5" />
              {formatMoney(total)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-muted">
                Qty
              </p>

              <p className="mt-0.5 text-sm font-bold text-body-dark">
                {order?.no_of_units || "—"}
              </p>
            </div>

            <div className="h-8 w-px bg-border" />

            <div className="grid h-8 w-8 place-items-center rounded-xl bg-white text-primary shadow-xs">
              <ShoppingBag className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </button>

      <div
        className={`grid transition-all duration-300 ${
          expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="border-t border-border bg-[#fffdf8] p-3">
            <div className="rounded-[20px] bg-white p-3.5 shadow-xs">
              <div className="flex gap-3">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-[#f5f1e8]">
                  {image ? (
                    <img
                      src={image}
                      alt={product?.name || "Product"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-primary/40">
                      <Package className="h-6 w-6" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-body-dark">
                    {product?.name || "Product"}
                  </p>

                  <p className="mt-1 text-[11px] text-muted">
                    {variant?.name || "Standard variant"}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {variant?.pack_quantity && (
                      <span className="rounded-lg bg-light-blue px-2 py-1 text-[9px] font-semibold text-primary">
                        {variant.pack_quantity} {variant.pack_unit}
                      </span>
                    )}

                    <span className="rounded-lg bg-[#f6f3ec] px-2 py-1 text-[9px] font-semibold text-body-light">
                      {order?.no_of_units || 0} units
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <InfoItem
                label="Price / unit"
                value={`₹${formatMoney(order?.price_per_unit)}`}
              />

              <InfoItem
                label="Quantity"
                value={`${order?.no_of_units || 0} units`}
              />
            </div>

            {info?.buyer_name && (
              <div className="mt-2 rounded-[20px] border border-border/70 bg-white p-3.5">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#fff1df] text-orange-600">
                    <UserRound className="h-4 w-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-muted">
                      Customer
                    </p>

                    <p className="mt-0.5 truncate text-sm font-bold text-body-dark">
                      {info.buyer_name}
                    </p>
                  </div>

                  {info?.buyer_phone && (
                    <a
                      href={`tel:${info.buyer_phone}`}
                      onClick={(event) => event.stopPropagation()}
                      className="grid h-9 w-9 place-items-center rounded-xl bg-light-blue text-primary transition-transform active:scale-95"
                    >
                      <Phone className="h-4 w-4" />
                    </a>
                  )}
                </div>

                {info?.buyer_phone && (
                  <div className="mt-3 border-t border-border pt-3 text-[11px] text-muted">
                    {info.buyer_phone}
                  </div>
                )}
              </div>
            )}

            {(info?.delivery_address ||
              info?.delivery_state ||
              info?.delivery_district) && (
              <div className="mt-2 rounded-[20px] border border-border/70 bg-white p-3.5">
                <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#e9f6ee] text-emerald-600">
                    <MapPin className="h-4 w-4" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-muted">
                      Delivery address
                    </p>

                    <p className="mt-1 text-xs font-semibold leading-5 text-body-dark">
                      {[
                        info.delivery_address,
                        info.delivery_block,
                        info.delivery_district,
                        info.delivery_state,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </p>

                    {info.delivery_pincode && (
                      <span className="mt-2 inline-flex rounded-lg bg-[#f6f3ec] px-2 py-1 text-[9px] font-bold text-body-light">
                        PIN {info.delivery_pincode}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-3 rounded-[20px] border border-border/70 bg-white p-3.5">
              <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.12em] text-muted">
                Change order status
              </p>

              <div className="flex gap-2">
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                  disabled={updating}
                >
                  <SelectTrigger className="h-10 flex-1 rounded-xl border-border bg-[#faf8f3] text-xs font-medium">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    {STATUS_OPTIONS.map((status) => (
                      <SelectItem
                        key={status}
                        value={status}
                        className="text-xs"
                      >
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  type="button"
                  onClick={handleUpdate}
                  disabled={!hasChanged || updating}
                  className="h-10 rounded-xl px-4 text-xs font-bold"
                >
                  {updating ? (
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    "Update"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SellerOrdersSheet({
  open,
  onOpenChange,
  sellerMobile,
}) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadOrders = async (isRefresh = false) => {
    if (!sellerMobile) return;

    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await getSellerOrders(sellerMobile);

      setOrders(extractOrders(response));
    } catch (err) {
      setError(err?.message || "Unable to load seller orders.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!open || !sellerMobile) return;

    loadOrders();
  }, [open, sellerMobile]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="flex max-h-[94dvh] flex-col gap-0 rounded-t-[30px] border-0  p-0"
      >
        {/* <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-border" /> */}

        <SheetHeader className="shrink-0 border-b border-border  px-4 text-left">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary text-white shadow-sm">
                <ShoppingBag className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <SheetTitle className="text-lg font-bold tracking-tight text-body-dark">
                  Orders
                </SheetTitle>

                <p className="mt-0.5 text-[11px] text-muted">
                  Orders received from customers
                </p>
              </div>
            </div>
          </div>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto bg-[#fffdf8]">
          <div className="px-4 py-4 pb-8">
            {loading ? (
              <div className="space-y-3">
                <OrderSkeleton />
                <OrderSkeleton />
                <OrderSkeleton />
              </div>
            ) : error ? (
              <div className="rounded-[22px] border border-red-100 bg-white p-6 text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-red-50 text-red-500">
                  <XCircle className="h-6 w-6" />
                </div>

                <p className="mt-4 text-sm font-bold text-body-dark">
                  Couldn't load orders
                </p>

                <p className="mt-1 text-xs leading-5 text-muted">{error}</p>

                <Button
                  variant="outline"
                  onClick={() => loadOrders()}
                  className="mt-4 h-9 rounded-xl px-4 text-xs"
                >
                  Try again
                </Button>
              </div>
            ) : orders.length === 0 ? (
              <div className="flex min-h-72 flex-col items-center justify-center rounded-[24px] border border-dashed border-border bg-white px-6 text-center">
                <div className="grid h-16 w-16 place-items-center rounded-2xl bg-light-blue text-primary">
                  <ShoppingBag className="h-7 w-7" />
                </div>

                <p className="mt-4 text-sm font-bold text-body-dark">
                  No orders yet
                </p>

                <p className="mt-1 max-w-xs text-xs leading-5 text-muted">
                  New orders for your products will appear here.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-body-dark">
                      Recent orders
                    </p>

                    <p className="mt-0.5 text-[10px] text-muted">
                      Tap an order to see more
                    </p>
                  </div>

                  <div className="flex gap-2 items-end">
                    {!loading && orders.length > 0 && (
                      <div className="rounded-xl bg-orange-100 text-orange-600 px-2.5 py-1.5 text-[10px] font-bold ">
                        {orders.length}
                      </div>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => loadOrders(true)}
                      disabled={refreshing}
                      className="h-9 w-9 rounded-xl bg-white text-muted shadow-xs hover:bg-light-blue hover:text-primary"
                    >
                      <RefreshCw
                        className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                      />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  {orders.map((order) => (
                    <SellerOrderCard key={order.id} order={order} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
