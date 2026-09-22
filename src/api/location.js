import { apiFetch } from "./client";
import { getLanguageFromQuery, normaliseLanguage } from "@/i18n";

const sortAlphabetically = (items) =>
  [...items].sort((a, b) =>
    a.label.localeCompare(b.label, "en", { sensitivity: "base" }),
  );

export const locationApi = {
  getStates: async (language = getLanguageFromQuery()) => {
    try {
      const params = new URLSearchParams({
        lang: normaliseLanguage(language),
      });
      const response = await apiFetch(`/api/v1/master/states?${params}`);
      const results = response?.data?.results ?? [];
      const formatted = results.map((state) => ({
        value: String(state.state_code),
        label: state.state_name,
        name: state.state_name,
        code: String(state.state_code),
      }));
      return sortAlphabetically(formatted);
    } catch (error) {
      console.error("Failed to fetch states:", error);
      return [];
    }
  },

  getDistricts: async (stateCode, language = getLanguageFromQuery()) => {
    if (!stateCode || stateCode === "all") return [];

    try {
      const params = new URLSearchParams({
        state_code: stateCode,
        lang: normaliseLanguage(language),
      });
      const response = await apiFetch(`/api/v1/master/districts?${params}`);
      const results = response?.data?.results ?? [];
      const formatted = results.map((district) => ({
        value: String(district.district_code),
        label: district.district_name,
        name: district.district_name,
        code: String(district.district_code),
      }));
      return sortAlphabetically(formatted);
    } catch (error) {
      console.error("Failed to fetch districts:", error);
      return [];
    }
  },

  getBlocks: async (districtCode, language = getLanguageFromQuery()) => {
    if (!districtCode || districtCode === "all") return [];

    try {
      const params = new URLSearchParams({
        district_code: districtCode,
        lang: normaliseLanguage(language),
      });
      const response = await apiFetch(`/api/v1/master/blocks?${params}`);
      const results = response?.data?.results ?? [];
      const formatted = results.map((block) => ({
        value: String(block.block_code),
        label: block.block_name,
        name: block.block_name,
        code: String(block.block_code),
      }));
      return sortAlphabetically(formatted);
    } catch (error) {
      console.error("Failed to fetch blocks:", error);
      return [];
    }
  },
};
