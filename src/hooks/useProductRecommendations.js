import { useCallback, useEffect, useState } from "react";
import { getProductRecommendations, getProducts } from "@/api/products";

export function useProductRecommendations(top = 5) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecommendations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const recommendationResponse = await getProductRecommendations(top);

      const recommendations =
        recommendationResponse?.data?.recommended_for_you || [];

      const ids = [
        ...new Set(recommendations.map((item) => item?.id).filter(Boolean)),
      ];

      if (!ids.length) {
        setProducts([]);
        return;
      }

      const productResponse = await getProducts({
        perPage: 100,
        page: 1,
      });

      const allProducts =
        productResponse?.data?.results ||
        productResponse?.data ||
        productResponse?.results ||
        [];

      const recommended = ids
        .map((id) =>
          allProducts.find((product) => String(product.id) === String(id)),
        )
        .filter(Boolean);

      setProducts(recommended);
    } catch (err) {
      setError(err?.message || "Failed to load recommendations.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [top]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  return {
    products,
    loading,
    error,
    retry: fetchRecommendations,
  };
}
