import { Flame, Package, Phone, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useProductApi } from "@/api/products";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import ErrorState from "@/components/common/ErrorState";
import LoadingSkeleton from "@/components/common/LoadingSkeleton";
import ProductCard from "@/components/products/ProductCard";
import { getLanguageFromQuery, useTranslation } from "@/i18n";

export default function SellerPage() {
  const { getProducts } = useProductApi();
  const { seller_id } = useParams();
  const { t } = useTranslation();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const language = getLanguageFromQuery();

  const loadSellerProducts = async () => {
    if (!seller_id) {
      setError(t("Seller information is not available."));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await getProducts({
        seller_id,
        page: 1,
        perPage: 20,
        lang: language,
      });

      setProducts(data?.results || []);
    } catch (error) {
      console.error("Failed to load seller products:", error);

      setError(error?.message || t("Unable to load seller products."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSellerProducts();
  }, [seller_id]);

  const seller = products[0]?.seller_detail;

  if (loading) {
    return (
      <main className="mx-auto max-w-330  pb-20 px-3 md:px-0 mt-5">
        <div className="mb-8 h-32 animate-pulse rounded-2xl bg-gray-200/80" />

        <LoadingSkeleton count={4} />
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-330 px-4 sm:px-6 lg:px-4">
        <ErrorState message={error} onRetry={loadSellerProducts} />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-330  pb-20 px-3 md:px-0">
      {/* <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to marketplace
      </Link> */}

      <Card className="mt-5 overflow-hidden border-border bg-white shadow-none">
        <div className="px-4 py-3.5 xs:px-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-light-blue text-primary xs:h-12 xs:w-12">
              <UserRound className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-primary">
                {t("Seller")}
              </p>

              <h1 className="mt-0.5 truncate text-base font-bold tracking-tight text-body-dark xs:text-lg">
                {seller?.user_name || t("Farmer")}
              </h1>

              <div className="mt-1 flex items-center gap-1.5 text-[11px] text-muted xs:text-xs">
                <Package className="h-3 w-3 text-primary xs:h-3.5 xs:w-3.5" />

                <span>
                  {products.length}{" "}
                  {products.length === 1 ? t("product") : t("products")}{" "}
                  {t("available")}
                </span>
              </div>
            </div>

            {seller?.user_mobile && (
              <div className="shrink-0 text-right">
                <p className="mb-0.5 text-[10px] font-medium uppercase tracking-wide text-muted">
                  {t("Contact")}
                </p>

                <div className="flex items-center justify-end gap-1.5 text-xs font-semibold text-body-dark xs:text-sm">
                  <Phone className="h-3.5 w-3.5 text-primary" />
                  <span>{seller.user_mobile}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      <section className="mt-8">
        <div className="mb-5">
          <div className="flex items-center gap-2.5 ">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-orange-50 text-orange-600">
              <Flame className="h-4 w-4" />
            </span>

            <h2 className="text-xl font-semibold tracking-tight text-body-dark sm:text-2xl">
              {t("Products by")} {seller?.user_name || t("Seller")}
            </h2>
          </div>

          <p className="pl-9 text-sm leading-5 text-muted">
            {t("Browse products currently available from this seller.")}
          </p>
        </div>

        {products.length > 0 ? (
          <div className="grid min-w-0 grid-cols-2 gap-3 xs:gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-cream px-4 xs:px-5 py-8 xs:py-10 text-center">
            <div className="mx-auto grid h-10 w-10 xs:h-12 xs:w-12 place-items-center rounded-full bg-white">
              <Package className="h-4 w-4 xs:h-5 xs:w-5 text-muted" />
            </div>

            <h3 className="mt-3 text-sm font-bold text-body-dark">
              {t("No products available")}
            </h3>

            <p className="mx-auto mt-1 max-w-sm text-sm text-muted">
              {t(
                "This seller doesn't have any products available in the marketplace right now.",
              )}
            </p>

            <Button asChild variant="outline" className="mt-5">
              <Link to="/products">{t("Browse marketplace")}</Link>
            </Button>
          </div>
        )}
      </section>
    </main>
  );
}
