import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Clock,
  Phone,
  RefreshCw,
  ShoppingBag,
  Truck,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";

import { useOrderApi } from "@/api/orders";

import OtpGate from "@/components/auth/OtpGate";
import OrderDetailsSheet from "@/components/orders/OrderDetailsSheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { formatDate, formatINR } from "@/lib/utils";

function OrderCardSkeleton() {
  return (
    <Card className="w-full overflow-hidden rounded-xl border-border bg-white p-0 shadow-xs">
      <div className="p-4 lg:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <div className="h-4 w-28 animate-pulse rounded-md bg-border" />
              <div className="h-5 w-16 animate-pulse rounded-full bg-border" />
            </div>

            <div className="mt-1.5 flex items-center gap-2">
              <div className="h-3 w-20 animate-pulse rounded-md bg-border" />
              <div className="h-3 w-1 animate-pulse rounded-full bg-border" />
              <div className="h-3 w-10 animate-pulse rounded-md bg-border" />
            </div>
          </div>

          <div className="mt-0.5 h-4 w-4 shrink-0 animate-pulse rounded bg-border" />
        </div>

        <div className="mt-4 border-t border-border pt-3">
          <div className="h-2.5 w-16 animate-pulse rounded bg-border" />

          <div className="mt-1 h-6 w-20 animate-pulse rounded-md bg-border" />
        </div>

        <div className="mt-1">
          <div className="h-9 w-full animate-pulse rounded-xl bg-border" />
        </div>
      </div>
    </Card>
  );
}

function OrderCard({ order, onViewDetails }) {
  const total = (order.items || []).reduce(
    (sum, item) =>
      sum +
      Number(item.price_per_unit || item.variant?.price || 0) *
        Number(item.no_of_units || 0),
    0,
  );

  const status = String(order.status || "Pending").toLowerCase();

  const isDelivered = status === "delivered";
  const isShipped = status === "shipped";
  const isCompleted = status === "completed";

  const getStatusIcon = () => {
    if (isDelivered || isCompleted) {
      return <CheckCircle2 className="h-3 w-3 text-secondary" />;
    }

    if (isShipped) {
      return <Truck className="h-3 w-3 text-accent" />;
    }

    return <Clock className="h-3 w-3 text-accent" />;
  };

  const getStatusColor = () => {
    if (isDelivered || isCompleted) {
      return "bg-secondary/10 text-secondary";
    }

    if (isShipped) {
      return "bg-accent/10 text-accent";
    }

    return "bg-accent/10 text-accent";
  };

  return (
    <Card className="group w-full overflow-hidden rounded-xl border-border bg-white p-0 shadow-xs transition-colors duration-200 lg:hover:border-primary/30">
      <div className="p-4 lg:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-center gap-2">
              <span className="truncate text-sm font-bold tracking-tight text-body-dark lg:text-[15px]">
                #{order.id}
              </span>

              <Badge
                className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${getStatusColor()}`}
              >
                <span className="flex items-center gap-1">
                  {getStatusIcon()}
                  {order.status || "Pending"}
                </span>
              </Badge>
            </div>

            <div className="mt-1.5 flex items-center gap-2 text-[11px] text-muted">
              <span>{formatDate(order.created_at)}</span>

              <span className="text-muted">•</span>

              <span>
                {order.items?.length || 0}{" "}
                {order.items?.length === 1 ? "item" : "items"}
              </span>
            </div>

            {order.buyer_name && (
              <div className="mt-2 flex min-w-0 items-center gap-1.5">
                <UserRound className="h-3 w-3 shrink-0 text-primary" />

                <span className="truncate text-[11px] font-medium text-muted">
                  {order.buyer_name}
                </span>
              </div>
            )}
          </div>

          <ShoppingBag className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
        </div>

        <div className="flex justify-between items-center border-t border-border/60 mt-4 pt-3 lg:mt-3 lg:pt-4">
          <div className="">
            <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-muted">
              Order total
            </p>

            <p className="mt-0.5 text-lg font-semibold tracking-tight text-body-dark lg:text-xl">
              {formatINR(total)}
            </p>
          </div>

          <div className="">
            <Button
              type="button"
              variant="outline"
              onClick={() => onViewDetails(order.id)}
              size="sm"
            >
              View details
              <ArrowRight className=" h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

function OrdersContent({ phone, onReset }) {
  const { getOrdersByPhone } = useOrderApi();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);

  const loadOrders = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError(null);

    try {
      const data = await getOrdersByPhone(phone);

      setOrders(data?.data?.results || data?.results || []);

      localStorage.setItem("farmers_marketplace_buyer_phone", phone);
    } catch (e) {
      setError(e.message || "Unable to load orders.");
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadOrders();
  }, [phone]);

  const handleRefresh = () => {
    loadOrders(true);
  };

  const openOrderDetails = (orderId) => {
    setSelectedOrderId(orderId);
    setOrderDetailsOpen(true);
  };

  const handleOrderDetailsChange = (open) => {
    setOrderDetailsOpen(open);

    if (!open) {
      setSelectedOrderId(null);
    }
  };

  return (
    <div className="space-y-4 lg:space-y-5">
      <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-white px-3.5 py-2.5 lg:px-4 lg:py-3">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
            Orders for
          </p>

          <div className="mt-0.5 flex min-w-0 items-center gap-1.5">
            <Phone className="h-3 w-3 shrink-0 text-primary" />

            <span className="truncate text-sm font-semibold text-body-dark lg:text-[15px]">
              {phone}
            </span>

            {!refreshing && orders.length > 0 && (
              <span className="shrink-0 rounded-full bg-light-blue px-2 py-0.5 text-[10px] font-bold text-primary">
                {orders.length}
              </span>
            )}
          </div>
        </div>

        <Button
          size="icon"
          variant="ghost"
          onClick={handleRefresh}
          disabled={refreshing}
          className="h-8 w-8 shrink-0 rounded-lg text-muted hover:bg-light-blue hover:text-primary"
          aria-label="Refresh orders"
        >
          <RefreshCw
            className={refreshing ? "h-3.5 w-3.5 animate-spin" : "h-3.5 w-3.5"}
          />
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <OrderCardSkeleton key={index} />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-xl border border-border bg-cream p-4 text-center lg:p-6">
          <p className="text-sm font-medium text-body-dark">{error}</p>

          <Button
            size="sm"
            variant="outline"
            onClick={() => loadOrders()}
            className="mt-3 h-8 rounded-xl px-3 text-xs"
          >
            Try Again
          </Button>
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-cream/50 p-6 text-center lg:p-10">
          <div className="grid h-14 w-14 place-items-center rounded-xl border border-border bg-white">
            <ShoppingBag className="h-6 w-6 text-muted" />
          </div>

          <div className="mt-4">
            <p className="font-semibold text-body-light">No orders yet</p>

            <p className="mx-auto mt-1 max-w-xs text-xs leading-relaxed text-muted">
              Orders you place on the marketplace will appear here.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onViewDetails={openOrderDetails}
            />
          ))}
        </div>
      )}

      <div className="border-t border-border pt-3 md:hidden flex">
        <Button
          size="sm"
          variant="ghost"
          onClick={onReset}
          className="h-8 w-full rounded-xl text-xs font-semibold text-muted underline hover:bg-cream hover:text-body-dark"
        >
          Switch account
        </Button>
      </div>

      <OrderDetailsSheet
        open={orderDetailsOpen}
        onOpenChange={handleOrderDetailsChange}
        orderId={selectedOrderId}
      />
    </div>
  );
}

export default function Orders() {
  const [verifiedPhone, setVerifiedPhone] = useState(
    () => localStorage.getItem("farmers_marketplace_verified_phone") || null,
  );

  const handleVerified = (phone) => {
    setVerifiedPhone(phone);

    localStorage.setItem("farmers_marketplace_verified_phone", phone);
  };

  const handleReset = () => {
    setVerifiedPhone(null);

    localStorage.removeItem("farmers_marketplace_verified_phone");

    localStorage.removeItem("farmers_marketplace_buyer_phone");
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-280 md:px-8 md:max-w-350 flex-col md:bg-transparent bg-[#fffdf8] lg:pt-4">
      <div className="sticky top-0 z-10 flex items-center gap-3 border border-stone-200 bg-white  px-4 py-3 sm:px-5 md:hidden">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-600/80 text-white shadow-sm">
          <ClipboardList className="h-4.5 w-4.5" />
        </div>

        <div className="min-w-0">
          <h1 className="truncate text-lg font-bold tracking-tight text-stone-900">
            Order history
          </h1>

          <p className="truncate text-xs text-stone-500">
            {verifiedPhone
              ? "View and manage your marketplace orders"
              : "Verify your mobile number to access your order history"}
          </p>
        </div>
      </div>
      <div className=" hidden  md:flex justify-between lg:items-center">
        <div className=" max-w-350 px-3 pb-2  lg:px-0">
          <div className="flex items-center gap-2.5">
            <span className="h-7 w-1 rounded-full bg-orange-500" />

            <h1 className="text-xl font-bold tracking-tight text-body-dark/90 lg:text-2xl">
              Order history
            </h1>
          </div>

          <p className="mt-1 pl-3.5 text-sm text-muted">
            {verifiedPhone
              ? "View and manage your marketplace orders"
              : "Verify your mobile number to access your order history"}
          </p>
        </div>

        <div className=" border-border pt-3 ">
          <Button
            size="sm"
            variant="outline"
            onClick={handleReset}
            className="h-8 text-xs font-semibold text-muted"
          >
            Switch account
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:px-2 px-4 pb-20 pt-5 ">
        {!verifiedPhone ? (
          <div className="flex flex-1 items-center justify-center pb-6">
            <div className="w-full max-w-sm rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
              <OtpGate onVerified={handleVerified} />
            </div>
          </div>
        ) : (
          <OrdersContent phone={verifiedPhone} onReset={handleReset} />
        )}
      </div>
    </main>
  );
}
