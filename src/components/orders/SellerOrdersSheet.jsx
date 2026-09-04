import {
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  Clock3,
  IndianRupee,
  MapPin,
  Package,
  Phone,
  RefreshCw,
  ShoppingBag,
  UserRound,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";

import { useOrderApi } from "@/api/orders";
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

function SellerOrderCard({ order }) {
  const { updateOrderStatus, getOrderStatuses } = useOrderApi();
  const [orderStatuses, setOrderStatuses] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(
    order?.status || STATUS_OPTIONS[0],
  );
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    getOrderStatuses().then((statuses) => {
      setOrderStatuses(statuses?.data);
    });
  }, []);

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

                  <div className="flex gap-2 justify-between items-center">
                    {info?.buyer_phone && (
                      <a
                        href={`tel:${info.buyer_phone}`}
                        onClick={(event) => event.stopPropagation()}
                        className="grid h-9 w-9 place-items-center rounded-xl bg-[#fff1df] text-orange-600 transition-transform active:scale-95"
                      >
                        <Phone className="h-4 w-4" />
                      </a>
                    )}
                    {info?.buyer_phone && (
                      <div className=" text-[11px] text-muted">
                        {info.buyer_phone}
                      </div>
                    )}
                  </div>
                </div>
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
                  placeholder="Update Status"
                >
                  <SelectTrigger className="h-10 flex-1 rounded-xl border-border bg-[#faf8f3] text-xs font-medium">
                    <SelectValue placeholder="Update Status" />
                  </SelectTrigger>

                  <SelectContent>
                    {orderStatuses?.map((status) => (
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
                  className="h-10  px-4 text-xs font-bold"
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
  SellerMobile,
  desktopPage = false,
}) {
  const { getSellerOrders } = useOrderApi();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
  });

  const extractPagination = (data) => ({
    count:
      data?.count ?? data?.data?.count ?? data?.total ?? data?.data?.total ?? 0,
    next: data?.next ?? data?.data?.next ?? null,
    previous: data?.previous ?? data?.data?.previous ?? null,
  });

  const loadOrders = async (isRefresh = false, targetPage = page) => {
    if (!SellerMobile) return;

    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await getSellerOrders({
        seller_mobile: SellerMobile,
        page: targetPage,
        perPage,
      });

      setOrders(extractOrders(response));
      setPagination(extractPagination(response));
      setPage(targetPage);
    } catch (err) {
      setError(err?.message || "Unable to load seller orders.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!open || !SellerMobile) return;

    loadOrders(false, page);
  }, [open, SellerMobile, page]);

  const totalPages = Math.max(1, Math.ceil(pagination.count / perPage));

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className={`flex max-h-[94dvh] flex-col gap-0 rounded-t-[30px] border-0 p-0 ${
          desktopPage
            ? "md:inset-0 md:max-h-none md:w-full md:translate-x-0 md:translate-y-0 md:rounded-none"
            : ""
        }`}
      >
        <SheetHeader className="shrink-0 border-b border-border px-4 text-left">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary text-white shadow-sm">
                <ShoppingBag className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <SheetTitle className="text-lg font-bold tracking-tight text-body-dark">
                  Orders
                </SheetTitle>

                <p className="text-[11px] text-muted">
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
                  onClick={() => loadOrders(false, page)}
                  className="mt-4 h-9 rounded-xl px-4 text-xs"
                >
                  Try again
                </Button>
              </div>
            ) : orders.length === 0 ? (
              <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-white px-6 text-center">
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

                  <div className="flex items-end gap-2">
                    {!loading && orders.length > 0 && (
                      <div className="rounded-xl bg-orange-100 px-2.5 py-1.5 text-[10px] font-bold text-orange-600">
                        {pagination.count || orders.length}
                      </div>
                    )}

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => loadOrders(true, page)}
                      disabled={refreshing}
                      className="h-9 w-9 rounded-xl bg-white text-muted shadow-xs hover:bg-light-blue hover:text-primary"
                    >
                      <RefreshCw
                        className={`h-4 w-4 ${
                          refreshing ? "animate-spin" : ""
                        }`}
                      />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  {orders.map((order) => (
                    <SellerOrderCard key={order.id} order={order} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-5 rounded-2xl border border-border bg-white p-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setPage((current) => Math.max(1, current - 1))
                        }
                        disabled={page === 1 || loading}
                        className="h-9  px-3 text-xs"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>

                      <div className="flex min-w-0 items-center gap-1 overflow-x-auto px-1">
                        {Array.from(
                          { length: totalPages },
                          (_, index) => index + 1,
                        ).map((pageNumber) => (
                          <Button
                            key={pageNumber}
                            type="button"
                            variant={pageNumber === page ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setPage(pageNumber)}
                            disabled={loading}
                            className="h-8 min-w-8 shrink-0 rounded-lg px-2 text-xs"
                          >
                            {pageNumber}
                          </Button>
                        ))}
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setPage((current) =>
                            Math.min(totalPages, current + 1),
                          )
                        }
                        disabled={page >= totalPages || loading}
                        className="h-9 rounded-xl px-3 text-xs"
                      >
                        Next
                      </Button>
                    </div>

                    <p className="mt-2 text-center text-[10px] font-medium text-muted">
                      Page {page} of {totalPages}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
