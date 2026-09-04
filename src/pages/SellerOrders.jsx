import {
  ArrowLeft,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Package,
  Phone,
  RefreshCw,
  ShoppingBag,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useOrderApi } from "@/api/orders";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";

const extractOrders = (data) =>
  Array.isArray(data)
    ? data
    : data?.results || data?.data?.results || data?.data || [];

const extractPagination = (data) => ({
  count:
    data?.count ?? data?.data?.count ?? data?.total ?? data?.data?.total ?? 0,
  next: data?.next ?? data?.data?.next ?? null,
  previous: data?.previous ?? data?.data?.previous ?? null,
});

const imageFor = (order) => {
  const media =
    order?.variant?.all_media?.[0] || order?.product?.all_media?.[0];

  return (
    media?.productImgUrl ||
    media?.image ||
    media?.file ||
    media?.url ||
    order?.product?.image ||
    ""
  );
};

const statusClass = (status = "") =>
  status.toLowerCase().includes("completed")
    ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
    : status.toLowerCase().includes("rejected")
      ? "bg-red-50 text-red-600 ring-red-100"
      : "bg-orange-50 text-orange-700 ring-orange-100";

export default function SellerOrders() {
  const navigate = useNavigate();
  const { SellerMobile } = useAuth();
  const { getSellerOrders } = useOrderApi();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
  });

  const loadOrders = async (isRefresh = false, targetPage = page) => {
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
    if (window.innerWidth < 768) {
      navigate("/seller", { replace: true });
      return;
    }

    if (SellerMobile) {
      loadOrders(false, page);
    }
  }, [SellerMobile, page]);

  const handleRefresh = () => {
    loadOrders(true, page);
  };

  const totalPages = Math.ceil(pagination.count / perPage);

  const goToPage = (newPage) => {
    if (newPage < 1 || newPage > totalPages || newPage === page) return;

    setPage(newPage);
  };

  return (
    <main className="min-h-full bg-[#f6f8f5] px-8 py-2">
      <div className="mx-auto max-w-350">
        <div className="flex items-center justify-between">
          <Link
            to="/seller"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted transition hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>

          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={loading || refreshing}
            className="rounded-xl"
          >
            <RefreshCw
              className={`mr-1.5 h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        <section className="mt-5 rounded-3xl bg-linear-to-br from-primary to-[#0f4e30] px-7 py-6 text-white shadow-xs">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/12">
              <ShoppingBag className="h-5 w-5" />
            </span>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/65">
                Seller workspace
              </p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight">
                Customer orders
              </h1>
            </div>
          </div>

          <p className="mt-4 text-sm text-white/72">
            Review delivery details and keep each order status up to date.
          </p>
        </section>

        <section className="mt-6 rounded-3xl border border-border/70 bg-white p-6 shadow-xs">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-body-dark">All orders</h2>

              <p className=" text-sm text-muted">
                ({" "}
                {loading
                  ? "Loading orders…"
                  : `${pagination.count || orders.length} ${
                      pagination.count === 1 ? "order" : "orders"
                    } received`}{" "}
                )
              </p>
            </div>

            {!loading && totalPages > 0 && (
              <div className="hidden text-xs font-medium text-muted sm:block">
                Page {page} of {totalPages}
              </div>
            )}
          </div>

          {error ? (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-5 text-sm text-red-700">
              {error}

              <Button
                variant="outline"
                onClick={() => loadOrders(false, page)}
                className="ml-4"
              >
                Try again
              </Button>
            </div>
          ) : loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-28 animate-pulse rounded-2xl bg-stone-100"
                />
              ))}
            </div>
          ) : orders.length ? (
            <>
              <div className="space-y-3">
                {orders.map((order) => (
                  <OrderRow
                    key={order.id}
                    order={order}
                    onUpdated={() => loadOrders(false, page)}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-6 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-muted">
                    Showing {(page - 1) * perPage + 1}–
                    {Math.min(page * perPage, pagination.count)} of{" "}
                    {pagination.count}
                  </p>

                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(page - 1)}
                      disabled={page === 1 || loading}
                      className="h-9  px-3"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="hidden sm:inline">Previous</span>
                    </Button>

                    <div className="flex items-center gap-1">
                      {Array.from(
                        { length: totalPages },
                        (_, index) => index + 1,
                      )
                        .filter(
                          (pageNumber) =>
                            pageNumber === 1 ||
                            pageNumber === totalPages ||
                            Math.abs(pageNumber - page) <= 1,
                        )
                        .map((pageNumber, index, visiblePages) => {
                          const previousPage = visiblePages[index - 1];

                          return (
                            <div
                              key={pageNumber}
                              className="flex items-center gap-1"
                            >
                              {previousPage &&
                                pageNumber - previousPage > 1 && (
                                  <span className="px-1 text-xs text-muted">
                                    ...
                                  </span>
                                )}

                              <Button
                                variant={
                                  pageNumber === page ? "default" : "outline"
                                }
                                size="sm"
                                onClick={() => goToPage(pageNumber)}
                                disabled={loading}
                                className="h-9 min-w-9  px-2.5 text-xs"
                              >
                                {pageNumber}
                              </Button>
                            </div>
                          );
                        })}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(page + 1)}
                      disabled={
                        page === totalPages || !pagination.next || loading
                      }
                      className="h-9 rounded-xl px-3"
                    >
                      <span className="hidden sm:inline">Next</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-[#fffdf8] text-center">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-light-blue text-primary">
                <ShoppingBag className="h-6 w-6" />
              </span>

              <h3 className="mt-4 font-bold text-body-dark">No orders yet</h3>

              <p className="mt-1 text-sm text-muted">
                Orders from your customers will appear here.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function OrderRow({ order, onUpdated }) {
  const { getOrderStatuses, updateOrderStatus } = useOrderApi();

  const [status, setStatus] = useState(order?.status || "");
  const [updating, setUpdating] = useState(false);
  const [orderStatuses, setOrderStatuses] = useState([]);

  const info = order?.order || {};

  const total =
    Number(order?.price_per_unit || 0) * Number(order?.no_of_units || 0);

  const image = imageFor(order);

  const update = async () => {
    if (status === order?.status) return;

    try {
      setUpdating(true);

      await updateOrderStatus(order.id, status);

      toast.success("Order status updated");

      onUpdated();
    } catch (err) {
      toast.error(err?.message || "Failed to update order");
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    getOrderStatuses().then((statuses) => {
      setOrderStatuses(statuses?.data || []);
    });
  }, []);

  useEffect(() => {
    setStatus(order?.status || "");
  }, [order?.status]);

  return (
    <article className="grid grid-cols-[88px_minmax(0,1.35fr)_minmax(190px,.8fr)_310px] items-center gap-5 rounded-2xl border border-border/70 p-4 transition hover:shadow-xs">
      <div className="h-22 w-22 overflow-hidden rounded-xl bg-gray-200/80">
        {image ? (
          <img
            src={image}
            alt={order?.product?.name || "Product"}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-gray-400">
            <Package className="h-7 w-7" />
          </div>
        )}
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="truncate font-bold text-body-dark">
            {order?.product?.name || "Product"}
          </h3>

          <span
            className={`rounded-full px-2.5 py-1 text-[10px] font-bold ring-1 ${statusClass(
              order?.status,
            )}`}
          >
            {order?.status || "Pending"}
          </span>
        </div>

        <p className="mt-1 text-xs text-muted">
          {order?.variant?.name || "Standard variant"} ·{" "}
          {order?.variant?.pack_quantity || "—"}{" "}
          {order?.variant?.pack_unit || ""}
        </p>

        <div className="mt-3 flex items-center gap-4 text-xs text-muted">
          <span className="inline-flex items-center gap-1 capitalize">
            <UserRound className="mb-0.5 h-3.5 w-3.5 text-primary" />
            {info?.buyer_name || "Customer"}
          </span>

          {order?.created_at && (
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5" />
              {new Date(order.created_at).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
              })}
            </span>
          )}
        </div>
      </div>

      <div className="border-l border-border pl-5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
          Delivery
        </p>

        <p className="mt-1 line-clamp-2 text-xs font-medium leading-5 text-body-dark">
          {[info.delivery_address, info.delivery_district, info.delivery_state]
            .filter(Boolean)
            .join(", ") || "Address unavailable"}
        </p>

        {info?.buyer_phone && (
          <a
            href={`tel:${info.buyer_phone}`}
            className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary"
          >
            <Phone className="h-3.5 w-3.5" />
            {info.buyer_phone}
          </a>
        )}
      </div>

      <div className="border-l border-border pl-5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
          Order value
        </p>

        <p className="mt-1 text-xl font-bold text-body-dark">
          ₹{total.toLocaleString("en-IN")}
        </p>

        <p className="mt-1 text-xs text-muted">
          {order?.no_of_units || 0} units
        </p>

        <div className="mt-3 flex gap-2">
          <Select value={status} onValueChange={setStatus} disabled={updating}>
            <SelectTrigger className="h-9 flex-1 rounded-lg text-xs">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>

            <SelectContent>
              {orderStatuses?.map((option) => (
                <SelectItem key={option} value={option} className="text-xs">
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            size="sm"
            onClick={update}
            disabled={updating || status === order?.status}
          >
            {updating ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </div>
    </article>
  );
}
