import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import LoadingSkeleton from "@/components/common/LoadingSkeleton";
import SellerOrdersSheet from "@/components/orders/SellerOrdersSheet";
import AddProduct from "@/components/products/AddProduct";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  ClipboardList,
  Boxes,
  Filter,
  LayoutDashboard,
  Plus,
  RotateCcw,
  Check,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SearchInput from "../components/common/SearchInput";
import SellerCard from "../components/SellerDashboard/SelllerCard";
import useDebouncedValue from "../hooks/useDebouncedValue";
import { useAuth } from "@/context/AuthContext";
import { useProducts } from "@/hooks/useProducts";

const STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "edit_requested", label: "Edit Requested" },
  // { value: "order completed", label: "Order Completed" },
];

const Seller = () => {
  const { SellerMobile } = useAuth();

  const [input, setInput] = useState("");
  const [page, setPage] = useState(1);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [status, setStatus] = useState("all");

  const search = useDebouncedValue(input, 400);

  const { products, loading, error, retry } = useProducts({
    search,
    page,
    qc_status: status === "all" ? "approved" : status,
  });

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const variants = (product.variants || []).filter(
        (variant) => variant.is_active !== false,
      );

      return variants.length > 0 || status === "all";
    });
  }, [products, status]);

  const selectedStatus = STATUS_FILTER_OPTIONS.find(
    (option) => option.value === status,
  );

  const clearFilter = () => {
    setStatus("all");
    setPage(1);
  };

  const activeListings = products.filter(
    (product) => product.is_active !== false,
  ).length;
  const availableVariants = products.reduce(
    (total, product) =>
      total +
      (product.variants || []).filter(
        (variant) =>
          variant.is_active !== false && Number(variant.no_of_units) > 0,
      ).length,
    0,
  );

  return (
    <div>
      <main className="min-h-full pb-20 md:bg-[#f6f8f5] md:px-8 md:py-4">
        <div className="sticky top-0 z-50 flex items-center justify-between gap-3 border border-stone-200 bg-white px-4 py-3 sm:px-5 md:static md:mx-auto md:hidden md:max-w-350">
          <div className="flex min-w-0 items-center gap-2">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-amber-600/80 text-white shadow-sm">
              <LayoutDashboard className="h-4 w-4" />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-md font-semibold tracking-tight text-stone-900">
                My Dashboard
              </h1>
            </div>
          </div>

          <div className="flex shrink-0 gap-2">
            <Button
              variant="outline"
              onClick={() => setOrdersOpen(true)}
              size="sm"
            >
              <ClipboardList className="h-3.5 w-3.5" />
              Orders
            </Button>

            <Link to="/seller/add-product">
              <Button className="bg-orange-500" size="sm">
                Add Product
              </Button>
            </Link>
          </div>
        </div>

        <div className="mx-auto max-w-350 md:space-y-6">
          <section className="hidden overflow-hidden rounded-3xl bg-linear-to-br from-primary via-[#086c3b] to-[#0f4e30] p-5 text-white shadow-xs md:block lg:p-6">
            <div className="flex items-start justify-between gap-8">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/85">
                  <LayoutDashboard className="h-3.5 w-3.5" /> Seller workspace
                </div>
                <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">
                  Manage your marketplace
                </h1>
                <p className="mt-2 max-w-xl text-sm leading-5 text-white/75">
                  Keep your listings current, add fresh inventory, and stay on
                  top of customer orders.
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <Button
                  variant="outline"
                  asChild
                  className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                >
                  <Link to="/seller/orders">
                    <ClipboardList className="h-4 w-4" /> View orders
                  </Link>
                </Button>
                <Button
                  onClick={() => setAddProductOpen(true)}
                  className="bg-orange-500 text-white hover:bg-orange-600"
                >
                  <Plus className="h-4 w-4" /> Add product
                </Button>
              </div>
            </div>
            <div className="mt-5 grid max-w-xl grid-cols-3 divide-x divide-white/15">
              <DashboardStat label="Listings" value={products.length} />
              <DashboardStat label="Live now" value={activeListings} />
              <DashboardStat
                label="In-stock variants"
                value={availableVariants}
              />
            </div>
          </section>

          <section className="grid min-w-0 gap-6 px-3 py-5 md:grid-cols-[minmax(0,1fr)_280px] md:px-0 md:py-0">
            <div className="min-w-0 rounded-2xl md:rounded-3xl md:border md:border-border/70 md:bg-white md:p-6 md:shadow-xs">
              <div className="flex w-full items-center gap-2">
                <SearchInput
                  value={input}
                  onChange={(value) => {
                    setInput(value);
                    setPage(1);
                  }}
                  onClear={() => {
                    setInput("");
                    setPage(1);
                  }}
                  suggestions={["vegetables", "fruits", "pulses", "grains"]}
                  placeholder="Search your listings"
                  className="min-w-0 flex-1"
                />

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setFilterOpen(true)}
                  className={`relative h-11 shrink-0 rounded-xl px-3 md:hidden ${status !== "all" ? "border-primary/30 bg-light-blue text-primary" : ""}`}
                >
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">Filter</span>
                </Button>
              </div>

              {status !== "all" && (
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-xs text-muted">Filtered by</span>
                  <button
                    type="button"
                    onClick={clearFilter}
                    className="inline-flex items-center gap-1.5 rounded-full border border-light-blue bg-light-blue px-3 py-1.5 text-xs font-semibold text-primary"
                  >
                    {selectedStatus?.label}
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}

              <section className="min-w-0 pt-6">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    {loading ? (
                      <p className="text-sm text-muted">Loading products...</p>
                    ) : (
                      <p className="text-sm text-muted">
                        <span className="font-semibold text-body-dark">
                          {filtered.length}
                        </span>{" "}
                        {filtered.length === 1 ? "listing" : "listings"} on this
                        page
                      </p>
                    )}
                  </div>

                  {status !== "all" && (
                    <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[10px] font-semibold text-stone-600">
                      {selectedStatus?.label}
                    </span>
                  )}
                </div>

                {loading ? (
                  <LoadingSkeleton count={6} />
                ) : error ? (
                  <ErrorState message={error} onRetry={retry} />
                ) : filtered.length ? (
                  <div className="grid min-w-0 grid-cols-2 gap-3 xs:gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filtered.map((product) => (
                      <SellerCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="No products found"
                    description={
                      status !== "all"
                        ? `No products with ${selectedStatus?.label.toLowerCase()} status.`
                        : "Try changing your search or filters."
                    }
                  />
                )}
              </section>
            </div>

            <aside className="hidden h-fit rounded-3xl border border-border/70 bg-white p-5 shadow-xs md:block">
              <div className="flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Filter className="h-4 w-4" />
                </span>
                <div>
                  <h2 className="text-sm font-bold text-body-dark">
                    Listing status
                  </h2>
                  <p className="text-[11px] text-muted">
                    Refine your workspace
                  </p>
                </div>
              </div>
              <div className="mt-5 space-y-1.5">
                {STATUS_FILTER_OPTIONS.map((option) => {
                  const selected = status === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setStatus(option.value);
                        setPage(1);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${selected ? "bg-primary text-white shadow-sm" : "text-muted hover:bg-primary/5 hover:text-primary"}`}
                    >
                      <span>{option.label}</span>
                      {selected && <Check className="h-4 w-4" />}
                    </button>
                  );
                })}
              </div>
              {status !== "all" && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={clearFilter}
                  className="md:mt-0 mt-4 w-full text-muted hover:bg-gray-100"
                >
                  <RotateCcw className="h-4 w-4" /> Clear filter
                </Button>
              )}
              <div className="mt-5 rounded-2xl bg-cream p-4">
                <Boxes className="h-5 w-5 text-orange-600" />
                <p className="mt-2 text-xs font-bold text-body-dark">
                  Keep inventory fresh
                </p>
                <p className="mt-1 text-[11px] leading-4 text-muted">
                  Update stock and product details so buyers see accurate
                  listings.
                </p>
              </div>
            </aside>
          </section>
        </div>
      </main>

      <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
        <SheetContent
          side="bottom"
          className="rounded-t-[28px] bg-[#fffdf8] px-4 pb-8"
        >
          <SheetHeader className="mb-3 text-left border-b pb-3 border-border">
            <SheetTitle className="text-lg font-semibold text-body-dark">
              Filter products
            </SheetTitle>

            <p className="text-xs text-muted">
              Filter your listings by approval status.
            </p>
          </SheetHeader>

          <div className="space-y-2">
            {STATUS_FILTER_OPTIONS.map((option) => {
              const selected = status === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setStatus(option.value);
                    setPage(1);
                    setFilterOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3.5 text-left transition ${
                    selected
                      ? "border-primary/30 bg-light-blue text-primary"
                      : "border-border bg-white text-body-dark active:bg-stone-50"
                  }`}
                >
                  <span className="text-sm font-semibold">{option.label}</span>

                  {selected && (
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-primary text-white">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {status !== "all" && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                clearFilter();
                setFilterOpen(false);
              }}
              className="mt-4 w-full rounded-xl text-muted"
            >
              <RotateCcw className="h-4 w-4" />
              Clear filter
            </Button>
          )}
        </SheetContent>
      </Sheet>

      <SellerOrdersSheet
        open={ordersOpen}
        onOpenChange={setOrdersOpen}
        SellerMobile={SellerMobile}
      />

      <Dialog open={addProductOpen} onOpenChange={setAddProductOpen}>
        <DialogContent className="h-[90dvh] max-w-4xl overflow-y-auto rounded-3xl p-0 md:w-[min(94vw,1180px)]">
          <AddProduct
            embedded
            onClose={() => setAddProductOpen(false)}
            onCompleted={() => {
              setAddProductOpen(false);
              retry();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Seller;

function DashboardStat({ label, value }) {
  return (
    <div className="px-5 first:pl-0">
      <p className="text-2xl font-bold">{value}</p>
      <p className="mt-1 text-xs font-medium text-white/65">{label}</p>
    </div>
  );
}
