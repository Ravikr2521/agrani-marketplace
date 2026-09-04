import { apiFetch } from "./client";

export function getOTP(phone_number) {
  return apiFetch(`/api/v1/auth/login/OTP_verification/${phone_number}`);
}

export function verifyOTP(payload) {
  return apiFetch(`/marketplace/api/auth/login`, {
    method: "POST",
    body: payload,
  });
}
