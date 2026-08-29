import { LayoutDashboard } from "lucide-react";
import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import SearchInput from "../components/common/SearchInput";
import useDebouncedValue from "../hooks/useDebouncedValue";
import LoadingSkeleton from "@/components/common/LoadingSkeleton";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import { useProducts } from "@/hooks/useProducts";
import ProductGrid from "@/components/products/ProductGrid";
import SellerCard from "../components/SellerDashboard/SelllerCard";

const Seller = () => {
  const [input, setInput] = useState("");
  const [page, setPage] = useState(1);
  const search = useDebouncedValue(input, 400);

  const { products, count, next, previous, loading, error, retry } =
    useProducts({
      search,
      page,
    });

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const variants = (product.variants || []).filter(
        (variant) => variant.is_active !== false,
      );

      return true;
    });
  }, [products]);

  return (
    <div>
      <main className="pb-20 md:px-8 ">
        <div className="sticky top-0 z-50 flex justify-between items-center border border-stone-200 bg-white px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-amber-600/80 text-white shadow-sm">
              <LayoutDashboard className="h-4 w-4" />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-md font-semibold tracking-tight text-stone-900">
                My Dashboard
              </h1>
            </div>
          </div>
          <div className="flex gap-2 ">
            <Button size="sm" variant="outline">
              Orders
            </Button>
            <Button className="bg-orange-500" size="sm">
              Add Product
            </Button>
          </div>
        </div>

        <section className="px-3 py-5">
          <div className="flex  flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex w-full items-center justify-between gap-3">
              <SearchInput
                value={input}
                onChange={(value) => {
                  setInput(value);
                  setPage(1);
                }}
                suggestions={["vegetables", "fruits", "pulses", "grains"]}
                placeholder="Search for"
                className="flex-1"
              />
            </div>
          </div>
          <section className="min-w-0 py-5">
            <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                {loading ? (
                  <p className="text-sm text-muted">Loading produce...</p>
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
            </div>

            {loading ? (
              <LoadingSkeleton count={4} />
            ) : error ? (
              <ErrorState message={error} onRetry={retry} />
            ) : filtered.length ? (
              <div className="grid min-w-0 grid-cols-2 gap-3 xs:gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map((p) => (
                  <SellerCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No products found"
                description="Try changing your search or filters."
              />
            )}
          </section>
        </section>
      </main>
    </div>
  );
};

export default Seller;
