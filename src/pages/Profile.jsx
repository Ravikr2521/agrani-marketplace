import {
  AlertTriangle,
  Edit2,
  MapPin,
  Phone,
  Plus,
  Trash2,
  UserCircle,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import {
  createDeliveryAddress,
  deleteDeliveryAddress,
  getDeliveryAddresses,
  updateDeliveryAddress,
} from "@/api/deliveryAddresses";
import AddressForm from "@/components/delivery/AddressForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "@/i18n";

function getName(token) {
  try {
    return (
      JSON.parse(
        atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
      )?.name || "Buyer"
    );
  } catch {
    return "Buyer";
  }
}

export default function Profile() {
  const { AgraniToken, SellerMobile } = useAuth();
  const { t } = useTranslation();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const buyerName = useMemo(() => getName(AgraniToken || ""), [AgraniToken]);

  const loadAddresses = useCallback(async () => {
    setLoading(true);

    try {
      setAddresses(
        await getDeliveryAddresses({
          AgraniToken,
          SellerMobile,
        }),
      );
    } catch (error) {
      toast.error(t("Could not load delivery addresses"), {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  }, [AgraniToken, SellerMobile]);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  const saveAddress = async (payload) => {
    setSaving(true);
    try {
      if (editing?.id)
        await updateDeliveryAddress(editing.id, payload, AgraniToken, {
          deliveryFlow: true,
        });
      else await createDeliveryAddress(payload, AgraniToken);
      toast.success(t(editing?.id ? "Address updated" : "Address added"));
      setFormOpen(false);
      setEditing(null);
      loadAddresses();
    } catch (error) {
      toast.error(t("Could not save address"), { description: error.message });
    } finally {
      setSaving(false);
    }
  };

  const removeAddress = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteDeliveryAddress(deleteTarget.id, AgraniToken);
      setAddresses((current) =>
        current.filter((item) => item.id !== deleteTarget.id),
      );
      setDeleteTarget(null);
      toast.success(t("Address deleted"));
    } catch (error) {
      toast.error(t("Could not delete address"), {
        description: error.message,
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-5 pb-24 sm:px-6 md:py-8 md:bg-transparent bg-gray-50 md:h-auto h-svh">
      <section className="overflow-hidden rounded-3xl border-border bg-white shadow-xs">
        <div className="bg-linear-to-r from-emerald-700 to-emerald-600 px-5 py-6 text-white sm:px-8 sm:py-8">
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/15">
              <UserCircle className="h-8 w-8" />
            </div>
            <div>
              {/* <p className="text-sm text-emerald-50">{t("Your Account")}</p> */}
              <h1 className="text-xl font-bold sm:text-2xl">{buyerName}</h1>
              <p className="mt-0.5 text-sm text-emerald-50">
                {SellerMobile || t("Your marketplace profile")}
              </p>
            </div>
          </div>
        </div>
        <div className="p-5 sm:p-8">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-bold text-body-dark">
                {t("Saved addresses")}
              </h2>

              <p className="mt-0.5 text-sm leading-5 text-muted hidden md:flex">
                {t("Choose and manage the places where you receive orders.")}
              </p>
            </div>

            <Button
              className="hidden shrink-0 md:flex h-10 px-3"
              onClick={() => {
                setEditing(null);
                setFormOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              {t("Add New")}
            </Button>

            <Button
              size="sm"
              className="flex shrink-0  md:hidden"
              onClick={() => {
                setEditing(null);
                setFormOpen(true);
              }}
            >
              <Plus className="h-3.5 w-3.5" />
              {t("Add New")}
            </Button>
          </div>
          <div className="mt-4 sm:mt-6 grid gap-3 sm:gap-4 lg:grid-cols-2">
            {loading ? (
              <p className="text-sm text-muted">{t("Loading addresses...")}</p>
            ) : addresses.length ? (
              addresses.map((address) => (
                <article
                  key={address.id}
                  className="group rounded-xl sm:rounded-2xl border border-stone-200 bg-linear-to-br from-white to-stone-50 p-3.5 sm:p-5 shadow-xs transition hover:-translate-y-0.5 hover:shadow-sm"
                >
                  <div className="flex gap-2.5 sm:gap-3">
                    <div className="grid h-7 w-7 sm:h-8 sm:w-8 shrink-0 place-items-center rounded-lg bg-orange-100 text-orange-700 shadow-xs">
                      <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
                        <h3 className="truncate text-sm sm:text-base font-semibold text-body-dark">
                          {address.receiver_name}
                        </h3>

                        {address.address_type && (
                          <span className="shrink-0 rounded-full border border-green-200 bg-green-50 px-1.5 py-0.5 text-[9px] sm:px-2 sm:text-[10px] font-semibold capitalize text-green-800">
                            {t(String(address.address_type).toLowerCase())}
                          </span>
                        )}
                      </div>

                      <p className="mt-1 flex items-center gap-1 text-xs sm:text-sm text-muted">
                        <Phone className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        {address.receiver_phone}
                      </p>

                      <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm leading-4 sm:leading-5 text-body-light line-clamp-2">
                        {address.address || address.delivery_address}
                      </p>

                      <p className="mt-1.5 sm:mt-2 inline-flex rounded-md sm:rounded-lg bg-stone-100 px-1.5 py-0.5 sm:px-2 sm:py-1 text-[10px] sm:text-xs font-semibold text-body-dark">
                        {address.pincode || address.delivery_pincode}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2.5 sm:mt-2 flex justify-end gap-1.5 sm:gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 rounded-lg bg-white px-2.5 text-xs shadow-xs hover:bg-gray-50 sm:h-9 sm:px-3 sm:text-sm"
                      onClick={() => {
                        setEditing(address);
                        setFormOpen(true);
                      }}
                    >
                      <Edit2 className="mb-0.5 h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      {t("Edit")}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 rounded-lg border-red-200 px-2.5 text-xs text-red-600 hover:bg-red-50 hover:text-red-700 sm:h-9 sm:px-3 sm:text-sm"
                      onClick={() => setDeleteTarget(address)}
                    >
                      <Trash2 className="mb-0.5 h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      {t("Delete")}
                    </Button>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-xl sm:rounded-2xl border border-dashed border-stone-300 p-6 sm:p-8 text-center lg:col-span-2">
                <MapPin className="mx-auto h-7 w-7 sm:h-8 sm:w-8 text-stone-400" />

                <h3 className="mt-2 sm:mt-3 text-sm sm:text-base font-semibold text-body-dark">
                  {t("No saved addresses yet")}
                </h3>

                <p className="mt-1 text-xs sm:text-sm text-muted">
                  {t("Add one now to make checkout faster.")}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
      <Dialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditing(null);
        }}
      >
        <DialogContent className="max-h-[90dvh] overflow-y-auto border-emerald-100 p-5 sm:p-6">
          <DialogTitle>
            {t(editing ? "Edit delivery address" : "Add delivery address")}
          </DialogTitle>
          <DialogDescription className="-mt-0.5 text-[13px]!">
            {editing
              ? t("Update the saved delivery details.")
              : t("Save an address for quicker checkout.")}
          </DialogDescription>
          <div className="mt-5">
            <AddressForm
              address={editing}
              saving={saving}
              onSave={saveAddress}
              onCancel={() => setFormOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && !deleting && setDeleteTarget(null)}
      >
        <DialogContent className="max-w-sm border-red-100 p-6">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-red-50 text-red-600">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <DialogTitle className="mt-4">
            {t("Delete this address?")}
          </DialogTitle>
          <DialogDescription>
            {t(
              "Orders can no longer use this saved address. This action cannot be undone.",
            )}
          </DialogDescription>
          <div className="mt-6 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              disabled={deleting}
              onClick={() => setDeleteTarget(null)}
            >
              {t("Keep address")}
            </Button>
            <Button
              type="button"
              className="rounded-xl bg-red-600 hover:bg-red-700"
              disabled={deleting}
              onClick={removeAddress}
            >
              {t(deleting ? "Deleting..." : "Delete address")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
