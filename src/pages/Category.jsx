import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  SlidersHorizontal,
  ClipboardList,
  Globe,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ProductGrid from "@/components/products/ProductGrid";
import ProductFilters from "@/components/products/ProductFilters";
import LoadingSkeleton from "@/components/common/LoadingSkeleton";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import { useProducts } from "@/hooks/useProducts";
import CategorySidePanel from "../components/category/CategorySidePanel";
import SearchInput from "../components/common/SearchInput";
import useDebouncedValue from "../hooks/useDebouncedValue";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import ProductCard from "@/components/products/ProductCard";

export default function Category() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const categoryFromUrl = searchParams.get("category") || "all";

  const [input, setInput] = useState("");
  const [page, setPage] = useState(1);
  const search = useDebouncedValue(input, 400);

  const [filters, setFilters] = useState({
    category: categoryFromUrl,
    availability: "all",
    packUnit: "all",
    price: "all",
    state: "all",
    stateName: "",
    district: "all",
    districtName: "",
    block: "all",
    blockName: "",
  });

  useEffect(() => {
    setFilters((current) => ({
      ...current,
      category: categoryFromUrl,
    }));

    setPage(1);
  }, [categoryFromUrl]);

  const { products, count, next, previous, loading, error, retry } =
    useProducts({
      search,
      page,
      stateCode: filters.stateName,
      districtCode: filters.districtName,
      blockCode: filters.blockName,
    });

  const categories = useMemo(
    () =>
      Array.from(
        new Set(products.map((product) => product.category).filter(Boolean)),
      ).sort(),
    [products],
  );

  const packUnits = useMemo(
    () =>
      Array.from(
        new Set(
          products.flatMap((product) =>
            (product.variants || [])
              .filter((variant) => variant.is_active !== false)
              .map((variant) => variant.pack_unit)
              .filter(Boolean),
          ),
        ),
      ).sort(),
    [products],
  );

  const filtered = products.filter((product) => {
    const variants = (product.variants || []).filter(
      (variant) => variant.is_active !== false,
    );

    if (filters.category !== "all" && product.category !== filters.category) {
      return false;
    }

    if (
      filters.availability === "in" &&
      !variants.some((variant) => Number(variant.no_of_units) > 0)
    ) {
      return false;
    }

    if (
      filters.availability === "out" &&
      !variants.every((variant) => Number(variant.no_of_units) <= 0)
    ) {
      return false;
    }

    if (filters.packUnit !== "all") {
      const hasPackUnit = variants.some(
        (variant) =>
          String(variant.pack_unit).toUpperCase() ===
          String(filters.packUnit).toUpperCase(),
      );

      if (!hasPackUnit) {
        return false;
      }
    }

    if (filters.price !== "all") {
      const prices = variants
        .map((variant) => Number(variant.price))
        .filter(Number.isFinite);

      const min = prices.length ? Math.min(...prices) : Infinity;

      const match =
        filters.price === "0-250"
          ? min < 250
          : filters.price === "250-500"
            ? min >= 250 && min <= 500
            : filters.price === "500-1000"
              ? min > 500 && min <= 1000
              : min > 1000;

      if (!match) {
        return false;
      }
    }

    return true;
  });

  const filterKeys = [
    "category",
    "availability",
    "packUnit",
    "price",
    "state",
    "district",
    "block",
  ];

  const activeFilterEntries = filterKeys
    .map((key) => [key, filters[key]])
    .filter(([, value]) => value && value !== "all");

  const activeFilters = activeFilterEntries.length;

  const clearFilters = () => {
    setFilters({
      category: "all",
      availability: "all",
      packUnit: "all",
      price: "all",
      state: "all",
      stateName: "",
      district: "all",
      districtName: "",
      block: "all",
      blockName: "",
    });

    const params = new URLSearchParams(searchParams);
    params.delete("category");

    setSearchParams(params);
    setPage(1);
  };

  const removeFilter = (key) => {
    setFilters((current) => ({
      ...current,
      [key]: "all",
      ...(key === "state" && {
        stateName: "",
      }),
      ...(key === "district" && {
        districtName: "",
      }),
      ...(key === "block" && {
        blockName: "",
      }),
    }));

    if (key === "category") {
      const params = new URLSearchParams(searchParams);

      params.delete("category");
      setSearchParams(params);
    }

    setPage(1);
  };

  const formatFilterName = (key) => {
    const names = {
      category: "Category",
      availability: "Availability",
      packUnit: "Pack",
      price: "Price",
      state: "State",
      district: "District",
      block: "Block",
    };

    return names[key] || key;
  };

  const getFilterDisplayValue = (key, value) => {
    if (key === "state" && filters.stateName) {
      return filters.stateName;
    }

    if (key === "district" && filters.districtName) {
      return filters.districtName;
    }

    if (key === "block" && filters.blockName) {
      return filters.blockName;
    }

    return value;
  };

  const searchSuggestions = ["vegetables", "fruits", "pulses", "grains"];
  return (
    <main className="pb-20 md:px-8 lg:pb-8 lg:pt-4">
      {/* Mobile Header */}
      <div className="sticky top-0 z-50 flex items-center gap-3 border border-stone-200 bg-white px-4 py-3 sm:px-5 md:hidden">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-600/80 text-white shadow-sm">
          <Globe className="h-4.5 w-4.5" />
        </div>

        <div className="min-w-0">
          <h1 className="truncate text-lg font-bold tracking-tight text-stone-900">
            Explore fresh picks
          </h1>

          <p className="truncate text-xs text-stone-500">
            Fresh products direct from local farmers.
          </p>
        </div>
      </div>

      {/* Desktop Heading */}
      <div className=" hidden  md:flex items-center justify-between mb-10">
        <div className="">
          <div className="flex items-center gap-2.5">
            <span className="h-7 w-1 rounded-full bg-orange-500" />

            <h1 className="text-2xl font-bold tracking-tight text-body-dark/90 ">
              Explore fresh picks
            </h1>
          </div>

          <p className="mt-1 pl-3.5 text-sm text-muted">
            Fresh products direct from local farmers.
          </p>
        </div>
        <div className="flex w-120 items-center gap-3">
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
            suggestions={searchSuggestions}
            placeholder="Search for"
            className="flex-1"
          />

          <Button
            variant="outline"
            onClick={() => setFiltersOpen(true)}
            className="hidden lg:flex h-10.5"
          >
            <SlidersHorizontal className="h-4 w-4" />

            <span>Filters</span>

            {activeFilters > 0 && (
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
                {activeFilters}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Search */}
      <section className="mx-auto max-w-350 px-3 py-5 sm:px-3 md:py-6 lg:px-0 md:hidden block">
        <div className="flex w-full items-center gap-3">
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
            suggestions={searchSuggestions}
            placeholder="Search for"
            className="flex-1"
          />

          {/* Mobile Filter */}
          <div className="flex shrink-0 md:hidden">
            <ProductFilters
              categories={categories}
              packUnits={packUnits}
              value={filters}
              onChange={(nextFilters) => {
                setFilters(nextFilters);
                setPage(1);

                const params = new URLSearchParams(searchParams);

                if (nextFilters.category === "all") {
                  params.delete("category");
                } else {
                  params.set("category", nextFilters.category);
                }

                setSearchParams(params);
              }}
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto flex min-h-0 items-start md:gap-10   gap-3 px-2">
        {/* Category Sidebar */}
        <aside className="sticky top-20 md:top-3 w-fit min-w-0 shrink-0 self-start">
          <div className="flex items-start gap-2 ">
            <CategorySidePanel
              products={products}
              categories={categories}
              selectedCategory={filters.category}
              onSelect={(category) => {
                setFilters((current) => ({
                  ...current,
                  category,
                }));

                const params = new URLSearchParams(searchParams);

                if (category === "all") {
                  params.delete("category");
                } else {
                  params.set("category", category);
                }

                setSearchParams(params);
                setPage(1);
              }}
            />
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              {loading ? (
                <p className="text-sm text-muted">Loading produce...</p>
              ) : (
                <p className="text-sm text-muted">
                  <span className="font-semibold text-body-dark">
                    {filtered.length}
                  </span>{" "}
                  {filtered.length === 1 ? "listing" : "listings"} on this page
                </p>
              )}
            </div>

            {activeFilters > 0 && (
              <div className="hidden lg:flex items-center gap-2">
                <span className="text-xs font-semibold text-muted">
                  {activeFilters} active filter
                  {activeFilters > 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>

          {activeFilters > 0 && (
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <span className="mr-1 text-xs font-semibold text-muted">
                Active:
              </span>

              {activeFilterEntries.map(([key, value]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => removeFilter(key)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-light-blue bg-light-blue px-3 py-1.5 text-xs font-semibold text-primary transition-opacity hover:opacity-80"
                >
                  <span>{formatFilterName(key)}:</span>

                  <span>{getFilterDisplayValue(key, value)}</span>

                  <X className="h-3 w-3" />
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <LoadingSkeleton count={6} />
          ) : error ? (
            <ErrorState message={error} onRetry={retry} />
          ) : filtered.length ? (
            <div className="grid min-w-0 grid-cols-2 gap-3 xs:gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No products found"
              description="Try changing your search or filters."
            />
          )}
        </section>
      </div>

      {/* Desktop  */}
      <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
        <SheetContent
          side="right"
          className="hidden w-full max-w-xs border-l border-border bg-gray-100 p-0 lg:flex"
        >
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 overflow-y-auto p-4">
              <ProductFilters
                categories={categories}
                packUnits={packUnits}
                value={filters}
                onChange={(nextFilters) => {
                  setFilters(nextFilters);
                  setPage(1);

                  const params = new URLSearchParams(searchParams);

                  if (nextFilters.category === "all") {
                    params.delete("category");
                  } else {
                    params.set("category", nextFilters.category);
                  }

                  setSearchParams(params);
                }}
              />
            </div>

            {activeFilters > 0 && (
              <div className="border-t border-border p-5">
                <button
                  type="button"
                  onClick={() => {
                    const clearedFilters = {
                      ...filters,
                      category: "all",
                    };

                    setFilters(clearedFilters);
                    setPage(1);

                    const params = new URLSearchParams(searchParams);
                    params.delete("category");

                    setSearchParams(params);
                  }}
                  className="w-full rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-body-dark transition-colors hover:bg-muted/10"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </main>
  );
}
