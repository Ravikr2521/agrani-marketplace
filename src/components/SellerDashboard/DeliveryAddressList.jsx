import {
  AlertCircle,
  Ban,
  ChevronLeft,
  ChevronRight,
  Globe,
  MapPin,
  Pencil,
  Plus,
  RefreshCw,
} from "lucide-react";
import { useEffect, useState } from "react";

import { marketPlaceApi } from "@/api/marketplace";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import DeliveryLocation from "./DeliveryLocation";

const extractList = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.data?.results)) return data.data.results;
  if (Array.isArray(data?.data)) return data.data;
  if (data?.id != null) return [data];
  if (data?.data?.id != null) return [data.data];
  return [];
};

const getIncludedStates = (coverage) => {
  if (!coverage) return [];
  return (
    coverage.include?.states?.map((s) => s.state_name || s.name || s) || []
  );
};

const getExclusions = (coverage) => {
  if (!coverage?.exclude) return null;
  const ex = coverage.exclude;
  const states = ex.states?.map((s) => s.state_name || s.name || s) || [];
  const districts =
    ex.districts?.map((d) => d.district_name || d.name || d) || [];
  const pincodes = ex.pincodes?.map((p) => p.pincode || p) || [];
  if (!states.length && !districts.length && !pincodes.length) return null;
  return { states, districts, pincodes };
};

const VISIBLE_STATES = 2;

function AddressCard({ record, selected, onSelect, onEdit }) {
  const isAllIndia = record.coverage?.include?.all_states;
  const includedStates = getIncludedStates(record.coverage);
  const exclusions = getExclusions(record.coverage);
  const [showAllStates, setShowAllStates] = useState(false);
  const [showExcl, setShowExcl] = useState(false);

  const visibleStates = showAllStates
    ? includedStates
    : includedStates.slice(0, VISIBLE_STATES);
  const hiddenCount = includedStates.length - VISIBLE_STATES;

  return (
    <div
      onClick={() => onSelect(selected ? null : record.id)}
      className={`w-full cursor-pointer rounded-2xl border p-4 text-left transition active:scale-[0.99] ${
        selected
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-border bg-white hover:border-primary/30"
      }`}
    >
      <div className="mb-2 flex items-center gap-2">
        <div
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${
            selected ? "bg-primary text-white" : "bg-[#f4f3ee] text-muted"
          }`}
        >
          {isAllIndia ? <Globe size={15} /> : <MapPin size={15} />}
        </div>

        <p className="flex-1 text-sm font-bold leading-tight text-body-dark">
          {isAllIndia ? "All India" : "Selected Areas"}
        </p>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(record);
          }}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-muted transition hover:bg-[#f5f4ef] hover:text-primary"
          title="Edit address"
        >
          <Pencil size={14} />
        </button>

        <div
          className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 transition ${
            selected ? "border-primary bg-primary" : "border-border bg-white"
          }`}
        >
          {selected && <div className="h-2 w-2 rounded-full bg-white" />}
        </div>
      </div>

      <div className="min-w-0">
        {isAllIndia ? (
          <p className="text-xs text-muted">Delivering across all of India</p>
        ) : includedStates.length > 0 ? (
          <div className="flex flex-wrap items-center gap-1">
            {visibleStates.map((s, i) => (
              <span
                key={i}
                className="rounded-full border border-primary/20 bg-primary/8 px-2 py-0.5 text-[10px] font-semibold text-primary"
              >
                {s}
              </span>
            ))}

            {hiddenCount > 0 && !showAllStates && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAllStates(true);
                }}
                className="text-[11px] font-bold text-primary hover:underline"
              >
                +{hiddenCount} more
              </button>
            )}

            {showAllStates && hiddenCount > 0 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAllStates(false);
                }}
                className="text-[11px] font-bold text-primary hover:underline"
              >
                Show less
              </button>
            )}
          </div>
        ) : (
          <p className="text-xs text-muted">Custom delivery areas</p>
        )}

        {exclusions && (
          <div className="mt-2">
            <div className="mb-1.5 flex items-center gap-1.5">
              <Ban size={11} className="shrink-0 text-amber-600" />
              <span className="text-[11px] font-bold text-amber-600">
                Exclusions (
                {exclusions.states.length +
                  exclusions.districts.length +
                  exclusions.pincodes.length}
                )
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowExcl((p) => !p);
                }}
                className="ml-auto text-[11px] font-medium text-amber-600/70 underline hover:text-amber-600"
              >
                {showExcl ? "Hide" : "Show"}
              </button>
            </div>

            {showExcl && (
              <div className="space-y-1.5" onClick={(e) => e.stopPropagation()}>
                {exclusions.states.length > 0 && (
                  <div>
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-muted">
                      Excluded States
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {exclusions.states.map((s, i) => (
                        <span
                          key={i}
                          className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {exclusions.districts.length > 0 && (
                  <div>
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-muted">
                      Excluded Districts
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {exclusions.districts.map((d, i) => (
                        <span
                          key={i}
                          className="rounded-full border border-orange-200 bg-orange-50 px-2 py-0.5 text-[10px] font-semibold text-orange-700"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {exclusions.pincodes.length > 0 && (
                  <div>
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-muted">
                      Excluded Pincodes
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {exclusions.pincodes.map((p, i) => (
                        <span
                          key={i}
                          className="rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-700"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function DeliveryAddressList({
  SellerMobile,
  onBack,
  onContinue,
}) {
  const { getDeliveryLocation } = marketPlaceApi();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [selectedId, setSelectedId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [editRecord, setEditRecord] = useState(null);
  const [triedContinue, setTriedContinue] = useState(false);

  const loadAddresses = async (isRefresh = false) => {
    if (!SellerMobile) return;

    try {
      isRefresh ? setRefreshing(true) : setLoading(true);

      const response = await getDeliveryLocation(SellerMobile);

      setAddresses(extractList(response));
    } catch (error) {
      console.error("Failed to load delivery locations", error);
    } finally {
      isRefresh ? setRefreshing(false) : setLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, [SellerMobile]);

  const handleContinue = () => {
    if (!selectedId) {
      setTriedContinue(true);
      return;
    }

    const record = addresses.find((a) => a.id === selectedId) ?? null;

    onContinue(selectedId, record);
  };

  const handleFormSave = (locationId, location) => {
    setShowForm(false);

    loadAddresses(true);

    if (locationId) {
      setSelectedId(locationId);
      setTriedContinue(false);
      onContinue(locationId, location);
    }
  };

  if (showForm) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white text-body-dark transition active:scale-95"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div>
            <p className="text-sm font-bold text-body-dark">
              {formMode === "edit"
                ? "Edit delivery address"
                : "Add delivery address"}
            </p>
            <p className="text-xs text-muted">
              Set your delivery coverage area
            </p>
          </div>
        </div>

        <DeliveryLocation
          SellerMobile={SellerMobile}
          editRecord={formMode === "edit" ? editRecord : null}
          onBack={() => setShowForm(false)}
          onContinue={handleFormSave}
        />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* <div>
        <p className="text-sm font-bold text-body-dark">Delivery location</p>
        <p className=" text-xs leading-5 text-muted">
          Select a saved address or add a new one.
        </p>
      </div> */}

      {triedContinue && !selectedId && (
        <div className="flex items-center gap-2.5 rounded-2xl border border-red-200 bg-red-50 px-3.5 py-3">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          <p className="text-sm font-semibold text-red-600">
            Please select a delivery address to continue
          </p>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
        </div>
      ) : addresses.length > 0 ? (
        <>
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted">
              Saved addresses
            </p>

            <Button
              onClick={() => loadAddresses(true)}
              disabled={refreshing}
              size="sm"
              variant="outline"
            >
              <RefreshCw
                className={`h-3 w-3 ${refreshing ? "animate-spin" : ""}`}
              />
            </Button>
          </div>

          <div className="space-y-3">
            {addresses.map((address) => (
              <AddressCard
                key={address.id}
                record={address}
                selected={selectedId === address.id}
                onSelect={(id) => {
                  setSelectedId(id);
                  setTriedContinue(false);
                }}
                onEdit={(record) => {
                  setEditRecord(record);
                  setFormMode("edit");
                  setShowForm(true);
                }}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-10 text-center bg-white">
          <div className="mb-3 grid h-12 w-12 place-items-center rounded-xl bg-[#f4f3ee]">
            <MapPin className="h-5 w-5 text-muted" />
          </div>
          <p className="text-sm font-bold text-body-dark">No saved addresses</p>
          <p className="mt-1 text-xs text-muted">
            Add a delivery location to continue
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={() => {
          setFormMode("create");
          setEditRecord(null);
          setShowForm(true);
        }}
        className="flex w-full items-center gap-3 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/3 p-4 text-left transition hover:border-primary/60 hover:bg-primary/6 active:scale-[0.99]"
      >
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
          <Plus className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-bold text-primary">Add new address</p>
          <p className="text-xs text-muted">
            Configure a new delivery coverage area
          </p>
        </div>
      </button>

      <div className="flex gap-2 pt-2 pb-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="h-12 flex-1 rounded-2xl font-bold"
        >
          Back
        </Button>

        <Button
          type="button"
          onClick={handleContinue}
          className="h-12 flex-1 rounded-2xl font-bold"
        >
          Continue
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
