import { apiFetch } from "./client";

export function createOrder(payload) {
  return apiFetch("/marketplace/api/order", {
    method: "POST",
    body: payload,
  });
}
export function getOrdersByPhone(phone) {
  return apiFetch(
    `/marketplace/api/order?buyer_phone=${encodeURIComponent(phone)}`,
  );
}
