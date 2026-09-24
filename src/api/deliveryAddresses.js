import { apiFetch } from "./client";

function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const addressPath = "/marketplace/api/delivery-address/";

export async function getDeliveryAddresses({ AgraniToken, SellerMobile }) {
  const response = await apiFetch(
    `${addressPath}?buyer_phone=${encodeURIComponent(SellerMobile)}`,
    {
      headers: authHeaders(AgraniToken),
    },
  );

  return Array.isArray(response)
    ? response
    : response?.data?.results || response?.results || [];
}
export async function createDeliveryAddress(payload, token) {
  const response = await apiFetch(addressPath, {
    method: "POST",
    body: payload,
    headers: authHeaders(token),
  });
  return response?.data || response;
}

export async function updateDeliveryAddress(
  id,
  payload,
  token,
  { deliveryFlow = false } = {},
) {
  const query = deliveryFlow ? "?delivery-flow=true" : "";
  const response = await apiFetch(`${addressPath}${encodeURIComponent(id)}/${query}`, {
    method: "PATCH",
    body: payload,
    headers: authHeaders(token),
  });
  return response?.data || response;
}

export function deleteDeliveryAddress(id, token) {
  return apiFetch(`${addressPath}${encodeURIComponent(id)}/`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
}
