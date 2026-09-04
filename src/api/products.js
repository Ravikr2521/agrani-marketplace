import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "./client";

export function useProductApi() {
  const { token, AgraniToken } = useAuth();

  const authHeaders = {
    Authorization: `Bearer ${token}`,
  };

  const getAgraniToken = () => {
    return localStorage.getItem("agrani_auth_token") || AgraniToken;
  };

  const agraniFetch = (path, options = {}) => {
    const agraniToken = getAgraniToken();

    if (!agraniToken) {
      return Promise.reject(new Error("No authentication token available"));
    }

    return apiFetch(path, {
      ...options,
      headers: {
        Authorization: `Bearer ${agraniToken}`,
        ...(options.headers || {}),
      },
    });
  };

  async function getProducts({
    search = "",
    page = 1,
    perPage = 20,
    buyerMobile = "",
    seller_id = "",
    stateCode = "",
    districtCode = "",
    blockCode = "",
    qc_status = "approved",
  } = {}) {
    const params = new URLSearchParams({
      qc_status,
      per_page: String(perPage),
      page: String(page),
    });

    if (search.trim()) {
      params.set("search", search.trim());
    }

    if (buyerMobile?.trim()) {
      params.set("buyer", buyerMobile?.trim());
    }

    if (seller_id?.trim()) {
      params.set("seller_id", seller_id.trim());
    }

    if (stateCode?.trim()) {
      params.set("state", stateCode.trim());
    }

    if (districtCode?.trim()) {
      params.set("district", districtCode.trim());
    }

    if (blockCode?.trim()) {
      params.set("block", blockCode.trim());
    }

    return apiFetch(
      `/marketplace/api/products/marketplace?${params.toString()}`,
      {
        headers: authHeaders,
      },
    );
  }

  function getProductRecommendations(top = 5) {
    return agraniFetch(`/marketplace/api/products/recommendations?top=${top}`);
  }

  function getProductView(varient_id) {
    return agraniFetch(`/marketplace/api/variant/${varient_id}/view`);
  }

  function requestProductEdit(id) {
    return agraniFetch(`/marketplace/api/products/${id}/edit-request/`, {
      method: "GET",
    });
  }

  function toggleProduct(id, is_active) {
    return agraniFetch(`/marketplace/api/product/${id}`, {
      method: "PATCH",
      body: {
        is_active,
      },
    });
  }

  function getMasterUnits() {
    return agraniFetch(`/marketplace/api/master/units/?is_enabled=true`);
  }

  function createProduct(payload) {
    return agraniFetch("/marketplace/api/product/", {
      method: "POST",
      body: payload,
    });
  }

  function uploadVariantMedia(formData) {
    return agraniFetch("/marketplace/api/media-storage/variant/", {
      method: "POST",
      body: formData,
    });
  }

  function submitStockForApproval(stockId) {
    return agraniFetch(
      `/marketplace/api/products/${stockId}/submit-for-approval/`,
    );
  }

  function getWishlist(buyerMobile) {
    return agraniFetch(`/marketplace/api/wishlist?buyer=${buyerMobile}`);
  }

  function addtoWishlist({ buyerMobile, variantId }) {
    return agraniFetch(`/marketplace/api/wishlist`, {
      method: "POST",
      body: {
        buyer: buyerMobile,
        variant: variantId,
      },
    });
  }

  return {
    getProducts,
    getProductRecommendations,
    getProductView,
    requestProductEdit,
    toggleProduct,
    getMasterUnits,
    createProduct,
    uploadVariantMedia,
    submitStockForApproval,
    addtoWishlist,
    getWishlist,
  };
}
