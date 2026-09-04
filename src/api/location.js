import { apiFetch } from "./client";

const sortAlphabetically = (items) =>
  [...items].sort((a, b) =>
    a.label.localeCompare(b.label, "en", { sensitivity: "base" }),
  );

export const locationApi = {
  getStates: async () => {
    try {
      const response = await apiFetch("/api/v1/master/states");
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

  getDistricts: async (stateCode) => {
    if (!stateCode || stateCode === "all") return [];

    try {
      const response = await apiFetch(
        `/api/v1/master/districts?state_code=${stateCode}`,
      );
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

  getBlocks: async (districtCode) => {
    if (!districtCode || districtCode === "all") return [];

    try {
      const response = await apiFetch(
        `/api/v1/master/blocks?district_code=${districtCode}`,
      );
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
