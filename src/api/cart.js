import { apiFetch } from "./client";

export const CART_ID_STORAGE_KEY = "farmers_marketplace_cart_id";
const CART_API_BASE_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "");

function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function createCart(payload, token) {
  return apiFetch("/marketplace/api/carts/", {
    baseUrl: CART_API_BASE_URL,
    method: "POST",
    body: payload,
    headers: authHeaders(token),
  });
}

export function getCart(cartId, token) {
  return apiFetch(`/marketplace/api/carts/${encodeURIComponent(cartId)}`, {
    baseUrl: CART_API_BASE_URL,
    headers: authHeaders(token),
  });
}

export function addCartItem(cartId, payload, token) {
  return apiFetch(
    `/marketplace/api/carts/${encodeURIComponent(cartId)}/items/`,
    {
      baseUrl: CART_API_BASE_URL,
      method: "POST",
      body: payload,
      headers: authHeaders(token),
    },
  );
}

export function getCartItems(cartId, token) {
  return apiFetch(
    `/marketplace/api/carts/${encodeURIComponent(cartId)}/items/`,
    {
      baseUrl: CART_API_BASE_URL,
      headers: authHeaders(token),
    },
  );
}

export function updateCartItem(cartId, itemId, payload, token) {
  return apiFetch(
    `/marketplace/api/carts/${encodeURIComponent(cartId)}/items/${encodeURIComponent(itemId)}/`,
    {
      baseUrl: CART_API_BASE_URL,
      method: "PATCH",
      body: payload,
      headers: authHeaders(token),
    },
  );
}

export function deleteCartItem(cartId, itemId, token) {
  return apiFetch(
    `/marketplace/api/carts/${encodeURIComponent(cartId)}/items/${encodeURIComponent(itemId)}/`,
    {
      baseUrl: CART_API_BASE_URL,
      method: "DELETE",
      headers: authHeaders(token),
    },
  );
}

export function clearCartItems(cartId, token) {
  return apiFetch(
    `/marketplace/api/carts/${encodeURIComponent(cartId)}/items/`,
    {
      baseUrl: CART_API_BASE_URL,
      method: "DELETE",
      headers: authHeaders(token),
    },
  );
}

export function deleteCart(cartId, token) {
  return apiFetch(`/marketplace/api/carts/${encodeURIComponent(cartId)}`, {
    baseUrl: CART_API_BASE_URL,
    method: "DELETE",
    headers: authHeaders(token),
  });
}
