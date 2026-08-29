import { apiFetch } from "./client";

export function getOTP(phone_number) {
  return apiFetch(`/api/v1/auth/OTP_verification/${phone_number}`);
}

export function verifyOTP(phone_number, otp) {
  const formData = new FormData();
  formData.append("OTP", otp);

  return apiFetch(`/api/v1/auth/OTP_verification/${phone_number}`, {
    method: "POST",
    body: formData,
  });
}
