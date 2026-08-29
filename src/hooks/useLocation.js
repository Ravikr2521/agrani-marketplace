import { useState, useEffect } from "react";
import { locationApi } from "@/api/location";

export function useLocation() {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingBlocks, setLoadingBlocks] = useState(false);
  const [statesLoaded, setStatesLoaded] = useState(false);

  // Fetch states on mount
  useEffect(() => {
    const fetchStates = async () => {
      if (statesLoaded) return;

      try {
        setLoadingStates(true);
        const statesData = await locationApi.getStates();
        setStates(statesData);
        setStatesLoaded(true);
      } catch (error) {
        console.error("Failed to fetch states:", error);
        setStates([]);
      } finally {
        setLoadingStates(false);
      }
    };

    fetchStates();
  }, [statesLoaded]);

  const fetchDistricts = async (stateCode) => {
    if (!stateCode || stateCode === "all") {
      setDistricts([]);
      setBlocks([]);
      return;
    }

    try {
      setLoadingDistricts(true);
      const districtsData = await locationApi.getDistricts(stateCode);
      setDistricts(districtsData);
      setBlocks([]);
    } catch (error) {
      console.error("Failed to fetch districts:", error);
      setDistricts([]);
      setBlocks([]);
    } finally {
      setLoadingDistricts(false);
    }
  };

  const fetchBlocks = async (districtCode) => {
    if (!districtCode || districtCode === "all") {
      setBlocks([]);
      return;
    }

    try {
      setLoadingBlocks(true);
      const blocksData = await locationApi.getBlocks(districtCode);
      setBlocks(blocksData);
    } catch (error) {
      console.error("Failed to fetch blocks:", error);
      setBlocks([]);
    } finally {
      setLoadingBlocks(false);
    }
  };

  return {
    states,
    districts,
    blocks,
    loadingStates,
    loadingDistricts,
    loadingBlocks,
    fetchStates: () => fetchStates(),
    fetchDistricts,
    fetchBlocks,
    statesLoaded,
  };
}
