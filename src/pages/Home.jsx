import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import LoadingSkeleton from "@/components/common/LoadingSkeleton";
import ProductFilters from "@/components/products/ProductFilters";
import ProductGrid from "@/components/products/ProductGrid";
import useDebouncedValue from "@/hooks/useDebouncedValue";
import { useProducts } from "@/hooks/useProducts";

import MarketplaceHighlightCarousel from "../components/common/MarketplaceHighlightCarousel";
import ProductPromoCarousel from "../components/common/ProductPromoCarousel";
import WelcomCarousel from "../components/common/WelcomCarousel";
import BestSellingProducts from "../components/products/BestSellingProducts";
import ProductSection from "../components/products/ProductSection";

import { useProductApi } from "@/api/products";
import HomePageSkeleton from "@/components/common/HomePageSkeleton";
import ProductCard from "@/components/products/ProductCard";
import { useSearchParams } from "react-router-dom";
import SearchInput from "../components/common/SearchInput";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { getProducts, getProductRecommendations } = useProductApi();
  const { AgraniToken } = useAuth();

  const [input, setInput] = useState("");
  const [page, setPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();

  const debouncedSearch = useDebouncedValue(input, 400);

  const categoryFromUrl = searchParams.get("category");

  const categorySections = [
    {
      key: "FRUIT",
      title: "Fresh Fruits",
      description: "Fresh and naturally grown fruits from local sellers.",
    },
    {
      key: "VEGETABLE",
      title: "Fresh Vegetables",
      description: "Fresh vegetables sourced from verified  sellers.",
    },
    {
      key: "PULSES",
      title: "Pulses",
      description: "Quality pulses for your everyday needs.",
    },
  ];

  const [filters, setFilters] = useState({
    category: categoryFromUrl || "all",
    availability: "all",
    packUnit: "all",
    price: "all",
    state: "all",
    district: "all",
    block: "all",
  });

  const [isApplyingLocationFilter, setIsApplyingLocationFilter] =
    useState(false);

  useEffect(() => {
    const category = searchParams.get("category");

    setFilters((current) => ({
      ...current,
      category: category || "all",
    }));

    setPage(1);
  }, [searchParams]);

  const searchSuggestions = ["vegetables", "fruits", "pulses", "grains"];

  const { products, loading, error, retry } = useProducts({
    search: debouncedSearch,
    page,
    buyerMobile: localStorage.getItem("farmers_marketplace_buyer_phone"),
    filters,
  });

  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(true);
  const [bestSellingProducts, setBestSellingProducts] = useState([]);
  const [bestSellingLoading, setBestSellingLoading] = useState(true);

  useEffect(() => {
    if (!loading && isApplyingLocationFilter) {
      setIsApplyingLocationFilter(false);
    }
  }, [loading, isApplyingLocationFilter]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    const fetchSpecialProducts = async () => {
      try {
        setRecommendationsLoading(true);
        setBestSellingLoading(true);

        const token = localStorage.getItem("agrani_auth_token") || AgraniToken;
        if (!token) {
          setRecommendedProducts([]);
          setBestSellingProducts([]);
          setRecommendationsLoading(false);
          setBestSellingLoading(false);
          return;
        }

        const response = await getProductRecommendations(5);

        const recommendations = response?.data?.recommended_for_you || [];

        const bestSelling = response?.data?.best_selling_product || [];

        const recommendedIds = [
          ...new Set(recommendations.map((item) => item?.id).filter(Boolean)),
        ];

        const bestSellingIds = [
          ...new Set(bestSelling.map((item) => item?.id).filter(Boolean)),
        ];

        if (!recommendedIds.length && !bestSellingIds.length) {
          setRecommendedProducts([]);
          setBestSellingProducts([]);
          return;
        }

        const productResponse = await getProducts({
          page: 1,
          perPage: 100,
          buyerMobile: localStorage.getItem("farmers_marketplace_buyer_phone"),
        });

        const allProducts =
          productResponse?.data?.results ||
          productResponse?.results ||
          productResponse?.data ||
          [];

        const productMap = new Map(
          allProducts.map((product) => [String(product?.id), product]),
        );

        const matchedRecommendedProducts = recommendedIds
          .map((id) => {
            const product = productMap.get(String(id));

            if (!product) return null;

            return product;
          })
          .filter(Boolean);

        const matchedBestSellingProducts = bestSellingIds
          .map((id) => {
            const product = productMap.get(String(id));

            if (!product) {
              console.warn(
                "Best selling product not found in product API:",
                id,
              );

              return null;
            }

            const sellingInfo = bestSelling.find(
              (item) => String(item?.id) === String(id),
            );

            return {
              ...product,
              units_sold: Number(sellingInfo?.units_sold || 0),
            };
          })
          .filter(Boolean);

        setRecommendedProducts(matchedRecommendedProducts);

        setBestSellingProducts(matchedBestSellingProducts);
      } catch (err) {
        console.error("Failed to load marketplace recommendations:", err);

        setRecommendedProducts([]);
        setBestSellingProducts([]);
      } finally {
        setRecommendationsLoading(false);
        setBestSellingLoading(false);
      }
    };

    fetchSpecialProducts();
  }, [AgraniToken]);

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

  const filtered = useMemo(() => {
    return products.filter((product) => {
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
  }, [products, filters]);

  const activeFilterEntries = Object.entries(filters).filter(([key, value]) => {
    if (key.endsWith("Name")) return false;

    return value !== "all";
  });

  const activeFilters = activeFilterEntries.length;

  const categorizedProducts = useMemo(() => {
    return categorySections
      .map((section) => ({
        ...section,
        products: filtered.filter(
          (product) =>
            String(product?.category || "").toUpperCase() === section.key,
        ),
      }))
      .filter((section) => section.products.length > 0);
  }, [filtered]);

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

  const updateCategory = (nextFilters) => {
    const isLocationFilterChange =
      nextFilters.state !== filters.state ||
      nextFilters.district !== filters.district ||
      nextFilters.block !== filters.block;

    if (isLocationFilterChange) {
      setIsApplyingLocationFilter(true);
    }

    setFilters(nextFilters);
    setPage(1);

    const params = new URLSearchParams(searchParams);

    if (nextFilters.category === "all") {
      params.delete("category");
    } else {
      params.set("category", nextFilters.category);
    }

    setSearchParams(params);
  };

  const removeFilter = (key) => {
    setFilters((current) => {
      switch (key) {
        case "state":
          return {
            ...current,
            state: "all",
            stateName: "",
            district: "all",
            districtName: "",
            block: "all",
            blockName: "",
          };

        case "district":
          return {
            ...current,
            district: "all",
            districtName: "",
            block: "all",
            blockName: "",
          };

        case "block":
          return {
            ...current,
            block: "all",
            blockName: "",
          };

        case "category":
          return {
            ...current,
            category: "all",
          };

        case "availability":
          return {
            ...current,
            availability: "all",
          };

        case "packUnit":
          return {
            ...current,
            packUnit: "all",
          };

        case "price":
          return {
            ...current,
            price: "all",
          };

        default:
          return current;
      }
    });

    setPage(1);
  };

  return (
    <div>
      <main className="mx-auto mb-20 min-w-0 max-w-350 px-3 py-2 sm:px-6 lg:mb-0 lg:px-8 lg:py-6 lg:pt-5 pt-4">
        <WelcomCarousel />

        <section className="py-6 sm:py-8 lg:py-10">
          <div className="flex w-full flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div className="shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="h-6 w-1 rounded-full bg-orange-500" />

                <h1 className="text-[17px] font-semibold tracking-tight text-body-dark md:text-2xl">
                  Products Near By
                </h1>
              </div>

              <p className="pl-3.5 text-[13px] leading-6 text-muted sm:text-sm">
                Fresh products from verified agricultural sellers.
              </p>
            </div>

            <div className="hidden w-full max-w-xl flex-col gap-3 md:flex">
              <SearchInput
                value={input}
                onChange={(value) => {
                  setInput(value);
                  setPage(1);
                }}
                suggestions={searchSuggestions}
                placeholder="Search for"
                className="w-full"
              />

              {activeFilters > 0 && (
                <div className="flex flex-wrap gap-2">
                  {activeFilterEntries.map(([key, value]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => removeFilter(key)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-light-blue bg-light-blue px-3 py-1.5 text-xs font-semibold text-primary transition-all duration-200 hover:opacity-80"
                    >
                      <span>{formatFilterName(key)}:</span>

                      <span>{getFilterDisplayValue(key, value)}</span>

                      <X className="h-3 w-3" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Search + Filter */}
            <div className="flex w-full items-center gap-3 md:hidden">
              <SearchInput
                value={input}
                onChange={(value) => {
                  setInput(value);
                  setPage(1);
                }}
                suggestions={searchSuggestions}
                placeholder="Search for"
                className="flex-1"
              />

              <ProductFilters
                categories={categories}
                packUnits={packUnits}
                value={filters}
                onChange={updateCategory}
              />
            </div>
          </div>
        </section>

        <section className="min-w-0 pb-20 md:pb-7 md:-mt-3">
          <div className="grid min-w-0 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_250px] xl:gap-6">
            <div className="min-w-0">
              {loading ? (
                <HomePageSkeleton count={8} />
              ) : error ? (
                <ErrorState message={error} onRetry={retry} />
              ) : filtered.length ? (
                <ProductGrid products={filtered} />
              ) : (
                <EmptyState
                  title="No products found"
                  description="Try changing your search or filters."
                />
              )}
            </div>

            <aside className="hidden lg:sticky lg:top-3 lg:block">
              <ProductFilters
                categories={categories}
                packUnits={packUnits}
                value={filters}
                onChange={updateCategory}
              />
            </aside>
          </div>

          {!loading && filtered.length > 0 && (
            <div className="mt-12 space-y-8 lg:space-y-12">
              <BestSellingProducts products={bestSellingProducts} />

              <ProductPromoCarousel />

              {recommendationsLoading ? (
                <section>
                  <div className="mb-5">
                    <div className="flex items-center gap-2.5">
                      <span className="h-6 w-1 rounded-full bg-orange-500" />

                      <h2 className="text-xl font-semibold tracking-tight text-body-dark sm:text-2xl">
                        Top Recommendations
                      </h2>
                    </div>

                    <p className="pl-3.5 text-sm leading-6 text-muted">
                      Products picked especially for you.
                    </p>
                  </div>

                  <LoadingSkeleton count={4} />
                </section>
              ) : (
                recommendedProducts.length > 0 && (
                  <section>
                    <div className="mb-5">
                      <div className="flex items-center gap-2.5">
                        <span className="h-6 w-1 rounded-full bg-orange-500" />

                        <h2 className="text-xl font-semibold tracking-tight text-body-dark sm:text-2xl">
                          Top Recommendations
                        </h2>
                      </div>

                      <p className="pl-3.5 text-sm leading-6 text-muted">
                        Products picked especially for you.
                      </p>
                    </div>

                    <div className="grid min-w-0 grid-cols-2 gap-3 xs:gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                      {recommendedProducts.map((p) => (
                        <ProductCard key={p.id} product={p} />
                      ))}
                    </div>
                  </section>
                )
              )}

              <MarketplaceHighlightCarousel />

              {categorizedProducts.map((section) => (
                <section key={section.key}>
                  <div className="mb-5">
                    <div className="flex items-center gap-2.5">
                      <span className="h-6 w-1 rounded-full bg-orange-500" />

                      <h2 className="text-xl font-semibold tracking-tight text-body-dark sm:text-2xl">
                        {section.title}
                      </h2>
                    </div>

                    <p className="pl-3.5 text-sm leading-6 text-muted">
                      {section.description}
                    </p>
                  </div>

                  <ProductSection
                    products={section.products}
                    layout="carousel"
                  />
                </section>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
