import { useAuth } from "@/context/AuthContext";
import { getLanguageFromQuery, normaliseLanguage } from "@/i18n";
import { apiFetch } from "./client";

export function marketPlaceApi() {
  const { AgraniToken } = useAuth();

  const getAgraniToken = () => {
    const savedToken = localStorage.getItem("agrani_auth_token");
    return savedToken || AgraniToken;
  };

  const agraniAuthHeaders = {
    Authorization: `Bearer ${getAgraniToken()}`,
  };

  const getStates = (language = getLanguageFromQuery()) => {
    const params = new URLSearchParams({ lang: normaliseLanguage(language) });
    return apiFetch(`/api/v1/master/states?${params}`);
  };

  const getDistrictsByState = (stateCode, language = getLanguageFromQuery()) => {
    const params = new URLSearchParams({
      state_code: stateCode,
      lang: normaliseLanguage(language),
    });
    return apiFetch(`/api/v1/master/districts?${params}`);
  };

  const getDeliveryLocation = (sellerMobile) => {
    return apiFetch(
      `/marketplace/api/me/delivery-locations/?seller_mobile=${sellerMobile}`,
      {
        headers: agraniAuthHeaders,
      },
    );
  };

  const createDeliveryLocation = (payload) => {
    return apiFetch("/marketplace/api/me/delivery-locations/", {
      method: "POST",
      body: payload,
      headers: agraniAuthHeaders,
    });
  };

  const updateDeliveryLocation = (id, payload) => {
    return apiFetch(`/marketplace/api/me/delivery-locations/${id}/`, {
      method: "PATCH",
      body: payload,
      headers: agraniAuthHeaders,
    });
  };

  return {
    getStates,
    getDistrictsByState,
    getDeliveryLocation,
    createDeliveryLocation,
    updateDeliveryLocation,
  };
}
