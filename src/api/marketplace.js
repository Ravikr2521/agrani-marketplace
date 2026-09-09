import { useAuth } from "@/context/AuthContext";
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

  const getStates = () => {
    return apiFetch("/api/v1/master/states");
  };

  const getDistrictsByState = (stateCode) => {
    return apiFetch(`/api/v1/master/districts?state_code=${stateCode}`);
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
