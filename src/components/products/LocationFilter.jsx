import { useEffect, useState } from "react";
import { Combobox } from "@/components/ui/combobox";
import { Skeleton } from "@/components/ui/skeleton";
import { locationApi } from "@/api/location";

const sortAlphabetically = (items) =>
  [...items].sort((a, b) =>
    a.label.localeCompare(b.label, "en", { sensitivity: "base" }),
  );

export function LocationFilter({
  value = {},
  onChange = () => {},
  showLabels = true,
}) {
  const { state = "all", district = "all", block = "all" } = value;

  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingBlocks, setLoadingBlocks] = useState(false);
  const [statesLoaded, setStatesLoaded] = useState(false);

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

  useEffect(() => {
    const fetchDistricts = async () => {
      if (!state || state === "all") {
        setDistricts([]);
        setBlocks([]);
        return;
      }

      try {
        setLoadingDistricts(true);
        const districtsData = await locationApi.getDistricts(state);
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

    fetchDistricts();
  }, [state]);

  useEffect(() => {
    const fetchBlocks = async () => {
      if (!district || district === "all") {
        setBlocks([]);
        return;
      }

      try {
        setLoadingBlocks(true);
        const blocksData = await locationApi.getBlocks(district);
        setBlocks(blocksData);
      } catch (error) {
        console.error("Failed to fetch blocks:", error);
        setBlocks([]);
      } finally {
        setLoadingBlocks(false);
      }
    };

    fetchBlocks();
  }, [district]);

  // Helper to get the name from code
  const getLocationName = (code, options) => {
    if (code === "all" || !code) return "";
    const option = options.find((opt) => opt.value === code);
    return option ? option.name : "";
  };

  const handleStateChange = (newState) => {
    const stateName = getLocationName(newState, states);
    onChange({
      state: newState || "all",
      stateName: stateName,
      district: "all",
      districtName: "",
      block: "all",
      blockName: "",
    });
  };

  const handleDistrictChange = (newDistrict) => {
    const districtName = getLocationName(newDistrict, districts);
    onChange({
      ...value,
      district: newDistrict || "all",
      districtName: districtName,
      block: "all",
      blockName: "",
    });
  };

  const handleBlockChange = (newBlock) => {
    const blockName = getLocationName(newBlock, blocks);
    onChange({
      ...value,
      block: newBlock || "all",
      blockName: blockName,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        {showLabels && (
          <label className="mb-2 block text-xs font-bold tracking-[0.12em] text-muted">
            State
          </label>
        )}
        {loadingStates ? (
          <Skeleton className="h-10 w-full rounded-md" />
        ) : (
          <Combobox
            value={state}
            onValueChange={handleStateChange}
            options={[{ value: "all", label: "All states" }, ...states]}
            placeholder="Select state"
            isLoading={loadingStates}
            disabled={false}
            emptyMessage="No states found"
          />
        )}
      </div>

      <div>
        {showLabels && (
          <label className="mb-2 block text-xs font-bold tracking-[0.12em] text-muted">
            District
          </label>
        )}
        {loadingDistricts ? (
          <Skeleton className="h-10 w-full rounded-md" />
        ) : (
          <Combobox
            value={district}
            onValueChange={handleDistrictChange}
            options={[{ value: "all", label: "All districts" }, ...districts]}
            placeholder={
              state === "all" ? "Select state first" : "Select district"
            }
            isLoading={loadingDistricts}
            disabled={state === "all" || districts.length === 0}
            emptyMessage="No districts found"
          />
        )}
      </div>

      <div>
        {showLabels && (
          <label className="mb-2 block text-xs font-bold tracking-[0.12em] text-muted">
            Block
          </label>
        )}
        {loadingBlocks ? (
          <Skeleton className="h-10 w-full rounded-md" />
        ) : (
          <Combobox
            value={block}
            onValueChange={handleBlockChange}
            options={[{ value: "all", label: "All blocks" }, ...blocks]}
            placeholder={
              district === "all" ? "Select district first" : "Select block"
            }
            isLoading={loadingBlocks}
            disabled={district === "all" || blocks.length === 0}
            emptyMessage="No blocks found"
          />
        )}
      </div>
    </div>
  );
}
