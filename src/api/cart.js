import { apiFetch } from "./client";
import { getLanguageFromQuery } from "@/i18n";

export const CART_ID_STORAGE_KEY = "farmers_marketplace_cart_id";
const CART_API_BASE_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "");

function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function withLanguage(path, language = getLanguageFromQuery()) {
  const params = new URLSearchParams({ lang: language });
  return `${path}?${params.toString()}`;
}

export function createCart(payload, token, language) {
  return apiFetch(withLanguage("/marketplace/api/carts/", language), {
    baseUrl: CART_API_BASE_URL,
    method: "POST",
    body: payload,
    headers: authHeaders(token),
  });
}

export function getCart(cartId, token, language) {
  return apiFetch(
    withLanguage(
      `/marketplace/api/carts/${encodeURIComponent(cartId)}/`,
      language,
    ),
    {
      baseUrl: CART_API_BASE_URL,
      headers: authHeaders(token),
    },
  );
}

export function bindCart(cartId, token, language) {
  return apiFetch(withLanguage("/marketplace/api/carts/bind/", language), {
    baseUrl: CART_API_BASE_URL,
    method: "POST",
    body: cartId ? { cart_id: cartId } : {},
    headers: authHeaders(token),
  });
}

export function addCartItem(cartId, payload, token, language) {
  return apiFetch(
    withLanguage(
      `/marketplace/api/carts/${encodeURIComponent(cartId)}/items/`,
      language,
    ),
    {
      baseUrl: CART_API_BASE_URL,
      method: "POST",
      body: payload,
      headers: authHeaders(token),
    },
  );
}

export function updateCartItem(cartId, itemId, payload, token, language) {
  return apiFetch(
    withLanguage(
      `/marketplace/api/carts/${encodeURIComponent(cartId)}/items/${encodeURIComponent(itemId)}/`,
      language,
    ),
    {
      baseUrl: CART_API_BASE_URL,
      method: "PATCH",
      body: payload,
      headers: authHeaders(token),
    },
  );
}

export function deleteCartItem(cartId, itemId, token, language) {
  return apiFetch(
    withLanguage(
      `/marketplace/api/carts/${encodeURIComponent(cartId)}/items/${encodeURIComponent(itemId)}/`,
      language,
    ),
    {
      baseUrl: CART_API_BASE_URL,
      method: "DELETE",
      headers: authHeaders(token),
    },
  );
}

export function clearCartItems(cartId, token, language) {
  return apiFetch(
    withLanguage(
      `/marketplace/api/carts/${encodeURIComponent(cartId)}/items/`,
      language,
    ),
    {
      baseUrl: CART_API_BASE_URL,
      method: "DELETE",
      headers: authHeaders(token),
    },
  );
}

export function getStoredCartId() {
  return localStorage.getItem(CART_ID_STORAGE_KEY) || "";
}
