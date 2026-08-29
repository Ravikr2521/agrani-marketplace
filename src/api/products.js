import { apiFetch } from "./client";

const TOKEN = "Bearer f47ac10b58cc4372a5670e02b2c3d4e5";

export async function getProducts({
  search = "",
  page = 1,
  perPage = 20,
  seller_id = "",
  stateCode = "",
  districtCode = "",
  blockCode = "",
} = {}) {
  const params = new URLSearchParams({
    qc_status: "approved",
    per_page: String(perPage),
    page: String(page),
  });

  if (search.trim()) {
    params.set("search", search.trim());
  }

  if (seller_id.trim()) {
    params.set("seller_id", seller_id.trim());
  }

  if (stateCode && stateCode.trim()) {
    params.set("state", stateCode.trim());
  }

  if (districtCode && districtCode.trim()) {
    params.set("district", districtCode.trim());
  }

  if (blockCode && blockCode.trim()) {
    params.set("block", blockCode.trim());
  }

  return apiFetch(`/marketplace/api/products/marketplace?${params.toString()}`);
}

export function getProductRecommendations(top = 5) {
  return apiFetch(`/marketplace/api/products/recommendations?top=${top}`, {
    headers: {
      Authorization: TOKEN,
    },
  });
}

export function getProductView(varient_id) {
  return apiFetch(`/marketplace/api/variant/${varient_id}/view`, {
    headers: {
      Authorization: TOKEN,
    },
  });
}

export function requestProductEdit(id) {
  return apiFetch(`/marketplace/api/products/${id}/edit-request/`, {
    method: "GET",
  });
}

export function toggleProduct(id, is_active) {
  return apiFetch(`/marketplace/api/product/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      is_active,
    }),
  });
}

export function getSellerOrders(seller_mobile) {
  const params = new URLSearchParams({
    seller_mobile: seller_mobile || "",
  });

  return apiFetch(`/marketplace/api/orders/?${params.toString()}`, {
    headers: {
      Authorization: TOKEN,
    },
  });
}

export function updateOrderStatus(orderId, status) {
  return apiFetch(`/marketplace/api/orders/${orderId}`, {
    method: "PATCH",
    headers: {
      Authorization: TOKEN,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status,
    }),
  });
}
