import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ClipboardList,
  RefreshCw,
  ShoppingBag,
  Phone,
  CheckCircle2,
  Clock,
  Package,
  Truck,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import OtpGate from "@/components/auth/OtpGate";
import { getOrdersByPhone } from "@/api/orders";
import { formatDate, formatINR } from "@/lib/utils";

function OrderCardSkeleton() {
  return (
    <Card className="overflow-hidden rounded-xl border-border p-0 shadow-xs">
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="h-4 w-16 animate-pulse rounded bg-border" />
              <div className="h-5 w-16 animate-pulse rounded-full bg-border" />
            </div>
            <div className="mt-2 h-3 w-36 animate-pulse rounded bg-border" />
          </div>
          <div className="h-8 w-8 shrink-0 animate-pulse rounded-lg bg-cream" />
        </div>

        <div className="mt-4 flex items-end justify-between gap-3 border-t border-border pt-4">
          <div>
            <div className="h-5 w-20 animate-pulse rounded bg-border" />
            <div className="mt-1.5 h-3 w-14 animate-pulse rounded bg-border" />
          </div>
          <div className="h-9 w-24 animate-pulse rounded-xl bg-border" />
        </div>
      </div>
    </Card>
  );
}

function OrderCard({ order }) {
  const total = (order.items || []).reduce(
    (sum, item) =>
      sum +
      Number(item.price_per_unit || item.variant?.price || 0) *
        Number(item.no_of_units || 0),
    0,
  );

  const status = String(order.status || "Pending").toLowerCase();
  const isPending = status === "pending";
  const isDelivered = status === "delivered";
  const isShipped = status === "shipped";

  const getStatusIcon = () => {
    if (isDelivered)
      return <CheckCircle2 className="h-3.5 w-3.5 text-secondary" />;
    if (isShipped) return <Truck className="h-3.5 w-3.5 text-accent" />;
    return <Clock className="h-3.5 w-3.5 text-accent" />;
  };

  const getStatusColor = () => {
    if (isDelivered) return "bg-secondary/10 text-secondary";
    if (isShipped) return "bg-accent/10 text-accent";
    return "bg-accent/10 text-accent";
  };

  return (
    <Card className="group w-full overflow-hidden rounded-xl border-border bg-white p-0 shadow-xs transition-all duration-200 hover:shadow-sm">
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-center gap-2">
              <span className="truncate text-sm font-bold tracking-tight text-body-dark">
                #{order.id}
              </span>
              <Badge
                className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${getStatusColor()}`}
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
          </div>
          <ShoppingBag className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
        </div>
        <div className="mt-4 border-t border-border pt-3">
          <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-muted">
            Order total
          </p>
          <p className="mt-0.5 text-lg  font-semibold tracking-tight text-body-dark">
            {formatINR(total)}
          </p>
        </div>
        <div className="mt-1">
          <Button
            asChild
            variant="outline"
            className="group/button h-9 w-full rounded-xl border-border px-3 text-xs font-semibold hover:border-light-blue hover:bg-light-blue hover:text-primary"
          >
            <Link to={`/orders/${order.id}`}>
              View details
              <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform duration-200 group-hover/button:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}

function OrdersContent({ phone, onReset }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

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

  return (
    <div className="space-y-4 ">
      <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-white px-3.5 py-2.5">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
            Orders for
          </p>

          <div className="mt-0.5 flex min-w-0 items-center gap-1.5">
            <Phone className="h-3 w-3 shrink-0 text-primary" />

            <span className="truncate text-sm font-semibold text-body-dark">
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
            className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`}
          />
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <OrderCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-xl border border-border bg-cream p-4 text-center">
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
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-cream/50 p-6 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-xl border border-border bg-white shadow-xs">
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
        <div className="space-y-3">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}

      <div className="border-t border-border pt-3">
        <Button
          size="sm"
          variant="ghost"
          onClick={onReset}
          className="h-8 w-full rounded-xl text-xs font-semibold text-muted hover:bg-cream hover:text-body-dark underline"
        >
          Switch account
        </Button>
      </div>
    </div>
  );
}

export default function OrdersSheet({ open, onOpenChange }) {
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

  const closeSheet = () => {
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="
          flex
          h-dvh
          w-full
          max-w-full
          flex-col
          gap-0
          border-l
          border-border/80
          bg-[#fffdf8]
          p-0
          shadow-[-20px_0_60px_rgba(0,0,0,0.12)]
          sm:max-w-100
        "
      >
        <SheetHeader
          className="
            shrink-0
            border-b
            border-border/80
            bg-white
            px-4
            py-3
            pr-14
            sm:px-5
          "
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-600/80 text-white shadow-sm">
              <ClipboardList className="h-4.5 w-4.5" />
            </div>
            <div className="min-w-0">
              <SheetTitle className="truncate text-lg font-bold tracking-tight text-body-dark">
                My Orders
              </SheetTitle>
              <p className="truncate text-xs text-muted">
                View and manage your orders
              </p>
            </div>
          </div>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">
            {!verifiedPhone ? (
              <div className="space-y-4">
                <div className="rounded-xl border border-border bg-white p-5">
                  <OtpGate onVerified={handleVerified} compact />
                </div>
                <div className="rounded-xl bg-light-blue p-4 text-center">
                  <p className="text-sm text-primary">
                    Verify your mobile number to access your order history
                  </p>
                </div>
              </div>
            ) : (
              <OrdersContent phone={verifiedPhone} onReset={handleReset} />
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
