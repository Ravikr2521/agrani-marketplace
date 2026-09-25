import { useProductApi } from "@/api/products";
import { useCallback, useEffect, useState } from "react";

export function useProducts({
  search = "",
  page = 1,
  state = "",
  buyerMobile = "",
  district = "",
  block = "",
  qc_status = "approved",
  seller_mobile = "",
} = {}) {
  const { getProducts } = useProductApi();
  const [productState, setProductState] = useState({
    products: [],
    count: 0,
    next: null,
    previous: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setProductState((s) => ({
      ...s,
      loading: true,
      error: null,
    }));

    try {
      const data = await getProducts({
        search,
        page,
        buyerMobile,
        state,
        district,
        block,
        qc_status,
        seller_mobile,
      });

      setProductState({
        products: data?.results || [],
        count: data?.count || 0,
        next: data?.next || null,
        previous: data?.previous || null,
        loading: false,
        error: null,
      });
    } catch (e) {
      setProductState((s) => ({
        ...s,
        loading: false,
        error: e.message || "Unable to load products.",
      }));
    }
  }, [search, page, state, district, block, qc_status]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    ...productState,
    retry: fetchData,
  };
}
