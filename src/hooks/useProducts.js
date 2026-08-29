import { useCallback, useEffect, useState } from "react";
import { getProducts } from "@/api/products";
export function useProducts({
  search = "",
  page = 1,
  stateCode = "",
  districtCode = "",
  blockCode = "",
} = {}) {
  const [state, setState] = useState({
    products: [],
    count: 0,
    next: null,
    previous: null,
    loading: true,
    error: null,
  });
  const fetchData = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await getProducts({
        search,
        page,
        stateCode,
        districtCode,
        blockCode,
      });
      setState({
        products: data?.results || [],
        count: data?.count || 0,
        next: data?.next || null,
        previous: data?.previous || null,
        loading: false,
        error: null,
      });
    } catch (e) {
      setState((s) => ({
        ...s,
        loading: false,
        error: e.message || "Unable to load products.",
      }));
    }
  }, [search, page, stateCode, districtCode, blockCode]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  return { ...state, retry: fetchData };
}
