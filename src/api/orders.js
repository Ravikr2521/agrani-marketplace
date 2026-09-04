import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "./client";

export function useOrderApi() {
  const { token, AgraniToken, SellerMobile } = useAuth();

  const getAgraniToken = () => {
    const savedToken = localStorage.getItem("agrani_auth_token");
    if (savedToken) return savedToken;
    return AgraniToken;
  };

  const agraniAuthHeaders = {
    Authorization: `Bearer ${getAgraniToken()}`,
  };

  const authHeaders = {
    Authorization: `Bearer ${token}`,
  };

  function createOrder(payload) {
    return apiFetch("/marketplace/api/order", {
      method: "POST",
      headers: agraniAuthHeaders,
      body: payload,
    });
  }

  function getOrdersByPhone(phone) {
    return apiFetch(
      `/marketplace/api/order?buyer_phone=${encodeURIComponent(phone)}`,
      {
        headers: agraniAuthHeaders,
      },
    );
  }

  function getOrderStatuses() {
    return apiFetch(
      "/marketplace/api/master/order-statuses/?is_default=false&is_enabled=true",
      {
        headers: agraniAuthHeaders,
      },
    );
  }
  function getSellerOrders({ seller_mobile, page = 1, perPage = 10 }) {
    const params = new URLSearchParams({
      seller_mobile: seller_mobile || "",
      per_page: String(perPage),
      page: String(page),
    });

    return apiFetch(`/marketplace/api/orders/?${params.toString()}`, {
      headers: agraniAuthHeaders,
    });
  }

  function updateOrderStatus(orderId, status) {
    return apiFetch(`/marketplace/api/orders/${orderId}`, {
      method: "PATCH",
      headers: agraniAuthHeaders,
      body: {
        status,
      },
    });
  }

  return {
    createOrder,
    getOrdersByPhone,
    getOrderStatuses,
    getSellerOrders,
    updateOrderStatus,
  };
}
