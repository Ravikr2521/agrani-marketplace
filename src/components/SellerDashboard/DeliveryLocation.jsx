import { useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronRight,
  Globe2,
  MapPin,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  createDeliveryLocation,
  getDeliveryLocation,
  getDistrictsByState,
  getStates,
  updateDeliveryLocation,
} from "@/api/marketplace";

const getResults = (response) =>
  response?.data?.results || response?.results || response?.data || [];

const getFirstRecord = (response) =>
  response?.data?.results?.[0] ||
  response?.results?.[0] ||
  response?.data?.[0] ||
  response?.data ||
  null;

export default function DeliveryLocation({ SellerMobile, onBack, onContinue }) {
  const [mode, setMode] = useState("allIndia");

  const [states, setStates] = useState([]);
  const [selectedStates, setSelectedStates] = useState({});

  const [expandedState, setExpandedState] = useState(null);
  const [districts, setDistricts] = useState({});
  const [loadingDistricts, setLoadingDistricts] = useState({});

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [existingLocation, setExistingLocation] = useState(null);
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);

    if (checked) {
      selectAllStates();
    } else {
      clearStates();
    }
  };

  useEffect(() => {
    loadData();
  }, [SellerMobile]);

  const loadData = async () => {
    try {
      setLoading(true);

      const [statesResponse, locationResponse] = await Promise.all([
        getStates(),
        SellerMobile ? getDeliveryLocation(SellerMobile) : null,
      ]);

      const stateList = getResults(statesResponse);

      const normalizedStates = stateList
        .map((state) => ({
          code: state.state_code,
          name: state.state_name,
        }))
        .filter((state) => state.code && state.name)
        .sort((a, b) => a.name.localeCompare(b.name));

      setStates(normalizedStates);

      const existing = getFirstRecord(locationResponse);

      if (existing) {
        setExistingLocation(existing);

        loadExistingLocation(existing, normalizedStates);
      }
    } catch (error) {
      console.error("Failed to load delivery location", error);

      toast.error("Unable to load delivery locations");
    } finally {
      setLoading(false);
    }
  };

  const loadExistingLocation = (location, stateList) => {
    const include = location?.coverage?.include;

    if (!include) return;

    if (include.all_states) {
      setMode("allIndia");
      setSelectedStates({});
      return;
    }

    if (!include.states?.length) return;

    const selections = {};

    include.states.forEach((item) => {
      const state = stateList.find(
        (stateItem) =>
          stateItem.name?.toLowerCase() === item.state_name?.toLowerCase(),
      );

      const code = state?.code || item.state_name;

      selections[code] = {
        stateName: item.state_name,
        allDistricts: item.all_districts ?? true,
        districts: item.districts || [],
      };
    });

    setMode("selective");
    setSelectedStates(selections);
  };

  const filteredStates = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return states;

    return states.filter((state) => state.name.toLowerCase().includes(value));
  }, [states, search]);

  const toggleState = (state) => {
    setSelectedStates((previous) => {
      const next = { ...previous };

      if (next[state.code]) {
        delete next[state.code];
      } else {
        next[state.code] = {
          stateName: state.name,
          allDistricts: true,
          districts: [],
        };
      }

      return next;
    });

    setExpandedState(null);
  };

  const openDistricts = async (state) => {
    const selected = selectedStates[state.code];

    if (!selected) return;

    if (expandedState === state.code) {
      setExpandedState(null);
      return;
    }

    setExpandedState(state.code);

    if (districts[state.code]) return;

    try {
      setLoadingDistricts((previous) => ({
        ...previous,
        [state.code]: true,
      }));

      const response = await getDistrictsByState(state.code);

      const list = getResults(response)
        .map((district) => ({
          code: district.district_code,
          name: district.district_name,
        }))
        .filter((district) => district.code && district.name);

      setDistricts((previous) => ({
        ...previous,
        [state.code]: list,
      }));
    } catch (error) {
      console.error("Failed to load districts", error);

      toast.error(`Unable to load districts for ${state.name}`);
    } finally {
      setLoadingDistricts((previous) => ({
        ...previous,
        [state.code]: false,
      }));
    }
  };

  const toggleAllDistricts = (state) => {
    setSelectedStates((previous) => {
      const current = previous[state.code];

      if (!current) return previous;

      return {
        ...previous,
        [state.code]: {
          ...current,
          allDistricts: !current.allDistricts,
          districts: [],
        },
      };
    });
  };

  const toggleDistrict = (state, district) => {
    setSelectedStates((previous) => {
      const current = previous[state.code];

      if (!current) return previous;

      const exists = current.districts.includes(district.name);

      const nextDistricts = exists
        ? current.districts.filter((name) => name !== district.name)
        : [...current.districts, district.name];

      return {
        ...previous,
        [state.code]: {
          ...current,
          allDistricts: false,
          districts: nextDistricts,
        },
      };
    });
  };

  const selectAllStates = () => {
    const all = {};

    states.forEach((state) => {
      all[state.code] = {
        stateName: state.name,
        allDistricts: true,
        districts: [],
      };
    });

    setSelectedStates(all);
  };

  const clearStates = () => {
    setSelectedStates({});
    setExpandedState(null);
  };

  const changeMode = (nextMode) => {
    setMode(nextMode);
    setSelectedStates({});
    setExpandedState(null);
    setSearch("");
  };

  const canContinue =
    mode === "allIndia" || Object.keys(selectedStates).length > 0;

  const buildPayload = () => {
    return {
      coverage: {
        include:
          mode === "allIndia"
            ? {
                all_states: true,
              }
            : {
                states: Object.values(selectedStates)
                  .filter(
                    (state) => state.allDistricts || state.districts.length > 0,
                  )
                  .map((state) => ({
                    state_name: state.stateName,
                    all_districts: state.allDistricts,
                    ...(state.allDistricts
                      ? {}
                      : {
                          districts: state.districts,
                        }),
                  })),
              },
        exclude: {},
      },
    };
  };

  const handleContinue = async () => {
    if (!canContinue) {
      toast.error("Select at least one delivery area");
      return;
    }

    const payload = buildPayload();

    try {
      setSaving(true);

      let result;

      if (existingLocation?.id) {
        result = await updateDeliveryLocation(existingLocation.id, {
          seller: SellerMobile,
          ...payload,
        });
      } else {
        result = await createDeliveryLocation({
          seller: SellerMobile,
          ...payload,
        });
      }

      const location = getFirstRecord(result);

      const locationId = location?.id || existingLocation?.id;

      if (!locationId) {
        throw new Error("Delivery location ID was not returned");
      }

      onContinue?.(
        locationId,
        location || {
          id: locationId,
          seller: SellerMobile,
          ...payload,
        },
      );
    } catch (error) {
      console.error("Failed to save delivery location", error);

      toast.error(error?.message || "Failed to save delivery location");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-24 w-full rounded-2xl" />

        <div className="rounded-2xl border border-border bg-white p-3">
          <Skeleton className="h-11 w-full rounded-xl" />

          <div className="mt-3 space-y-2">
            {[1, 2, 3, 4].map((item) => (
              <Skeleton key={item} className="h-12 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-bold text-body-dark">
          Where can you deliver?
        </p>

        <p className="mt-1 text-xs leading-5 text-muted">
          Choose the areas where customers can receive this product.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => changeMode("allIndia")}
          className={`rounded-2xl border p-4 text-left transition active:scale-[0.98] ${
            mode === "allIndia"
              ? "border-primary bg-primary/5 shadow-sm"
              : "border-border bg-white"
          }`}
        >
          <div
            className={`mb-3 grid h-10 w-10 place-items-center rounded-xl ${
              mode === "allIndia"
                ? "bg-primary text-white"
                : "bg-[#f4f3ee] text-muted"
            }`}
          >
            <Globe2 className="h-5 w-5" />
          </div>

          <p className="text-sm font-bold text-body-dark">All India</p>

          <p className="mt-1 text-[11px] leading-4 text-muted">
            Deliver across India
          </p>
        </button>

        <button
          type="button"
          onClick={() => changeMode("selective")}
          className={`rounded-2xl border p-4 text-left transition active:scale-[0.98] ${
            mode === "selective"
              ? "border-primary bg-primary/5 shadow-sm"
              : "border-border bg-white"
          }`}
        >
          <div
            className={`mb-3 grid h-10 w-10 place-items-center rounded-xl ${
              mode === "selective"
                ? "bg-primary text-white"
                : "bg-[#f4f3ee] text-muted"
            }`}
          >
            <MapPin className="h-5 w-5" />
          </div>

          <p className="text-sm font-bold text-body-dark">Select Areas</p>

          <p className="mt-1 text-[11px] leading-4 text-muted">
            Choose states & districts
          </p>
        </button>
      </div>

      {mode === "allIndia" ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex items-start gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-600">
              <Check className="h-4 w-4" />
            </div>

            <div>
              <p className="text-sm font-bold text-emerald-800">
                Delivery across India
              </p>

              <p className="mt-1 text-xs leading-5 text-emerald-700/80">
                This product will be available for delivery throughout India.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-white">
          <div className="flex items-center gap-2 border-b border-border bg-[#faf9f5] p-3">
            <Search className="h-4 w-4 shrink-0 text-muted" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search state..."
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
            />

            {Object.keys(selectedStates).length > 0 && (
              <span className="shrink-0 rounded-full bg-primary/10 px-2 py-1 text-[10px] font-bold text-primary">
                {Object.keys(selectedStates).length} selected
              </span>
            )}
          </div>

          <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
            <label className="flex items-center gap-2 text-xs font-bold text-primary cursor-pointer">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
                className="h-4 w-4 accent-primary mb-1"
              />
              Select all
            </label>

            {Object.keys(selectedStates).length > 0 && (
              <button
                type="button"
                onClick={clearStates}
                className="text-xs font-medium text-muted"
              >
                Clear
              </button>
            )}
          </div>

          <div className="space-y-2 p-3">
            {filteredStates.map((state) => {
              const selected = selectedStates[state.code];

              const isExpanded = expandedState === state.code;

              return (
                <div key={state.code}>
                  <div
                    className={`flex items-center gap-2 rounded-xl border p-3 transition ${
                      selected
                        ? "border-primary/40 bg-primary/5"
                        : "border-border bg-white"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleState(state)}
                      className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border transition ${
                        selected
                          ? "border-primary bg-primary text-white"
                          : "border-border bg-white"
                      }`}
                    >
                      {selected && <Check className="h-3 w-3" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleState(state)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <p className="truncate text-sm font-semibold text-body-dark">
                        {state.name}
                      </p>

                      {selected && (
                        <p className="mt-0.5 text-[10px] text-primary">
                          {selected.allDistricts
                            ? "All districts"
                            : `${selected.districts.length} districts`}
                        </p>
                      )}
                    </button>

                    <button
                      type="button"
                      disabled={!selected}
                      onClick={() => openDistricts(state)}
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#f5f4ef] text-muted disabled:opacity-40"
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {isExpanded && selected && (
                    <div className="ml-3 mt-2 rounded-xl bg-[#faf9f5] p-3">
                      <div className="mb-3 flex items-center justify-between gap-2">
                        <p className="text-xs font-bold text-body-dark">
                          Districts
                        </p>

                        <button
                          type="button"
                          onClick={() => toggleAllDistricts(state)}
                          className="text-[11px] font-bold text-primary"
                        >
                          {selected.allDistricts
                            ? "Choose districts"
                            : "All districts"}
                        </button>
                      </div>

                      {loadingDistricts[state.code] ? (
                        <div className="grid grid-cols-2 gap-2">
                          {[1, 2, 3, 4].map((item) => (
                            <Skeleton key={item} className="h-8 rounded-lg" />
                          ))}
                        </div>
                      ) : (
                        <div
                          className={`grid grid-cols-2 gap-1 ${
                            selected.allDistricts ? "opacity-40" : ""
                          }`}
                        >
                          {(districts[state.code] || []).map((district) => {
                            const checked =
                              selected.allDistricts ||
                              selected.districts.includes(district.name);

                            return (
                              <button
                                key={district.code}
                                type="button"
                                disabled={selected.allDistricts}
                                onClick={() => toggleDistrict(state, district)}
                                className="flex min-w-0 items-center gap-2 rounded-lg px-2 py-2 text-left transition hover:bg-white active:scale-[0.98]"
                              >
                                <span
                                  className={`grid h-4 w-4 shrink-0 place-items-center rounded border ${
                                    checked
                                      ? "border-primary bg-primary text-white"
                                      : "border-border bg-white"
                                  }`}
                                >
                                  {checked && <Check className="h-2.5 w-2.5" />}
                                </span>

                                <span className="truncate text-[11px] text-body-dark">
                                  {district.name}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {!filteredStates.length && (
              <div className="py-8 text-center">
                <MapPin className="mx-auto h-6 w-6 text-muted" />

                <p className="mt-2 text-xs font-semibold text-body-dark">
                  No states found
                </p>

                <p className="mt-1 text-[10px] text-muted">
                  Try a different search
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex gap-2 pt-2 pb-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={saving}
          className="h-12 flex-1 rounded-2xl font-bold"
        >
          Back
        </Button>

        <Button
          type="button"
          onClick={handleContinue}
          disabled={!canContinue || saving}
          className="h-12 flex-1 rounded-2xl font-bold"
        >
          {saving ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Saving...
            </>
          ) : (
            <>
              Continue
              <ChevronRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
