import { useEffect, useState } from "react";
import { LockKeyhole } from "lucide-react";
import { useTranslation } from "@/i18n";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const emptyAddress = {
  receiver_name: "",
  receiver_phone: "",
  address: "",
  pincode: "",
  address_type: "home",
};

export function normaliseAddress(address) {
  return {
    receiver_name: address?.receiver_name || "",
    receiver_phone: address?.receiver_phone || "",
    address: address?.address || address?.delivery_address || "",
    pincode: address?.pincode || address?.delivery_pincode || "",
    address_type: address?.address_type || "home",
  };
}

export default function AddressForm({
  address,
  onCancel,
  onSave,
  saving = false,
  submitLabel = "Save address",
}) {
  const [form, setForm] = useState(emptyAddress);
  const [errors, setErrors] = useState({});
  const isEditing = Boolean(address?.id);
  const { t } = useTranslation();

  useEffect(() => setForm(normaliseAddress(address)), [address]);

  const change = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const submit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.receiver_name.trim())
      nextErrors.receiver_name = t("Enter the receiver's name.");
    if (!/^[6-9]\d{9}$/.test(form.receiver_phone))
      nextErrors.receiver_phone = t("Enter a valid 10-digit mobile number.");
    if (!form.address.trim())
      nextErrors.address = t("Enter the delivery address.");
    if (!/^[1-9]\d{5}$/.test(form.pincode))
      nextErrors.pincode = t("Enter a valid 6-digit pincode.");
    setErrors(nextErrors);
    if (!Object.keys(nextErrors).length)
      onSave({ ...form, address: form.address.trim() });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t("Receiver name")} error={errors.receiver_name}>
          <Input
            value={form.receiver_name}
            onChange={(event) => change("receiver_name", event.target.value)}
            autoComplete="name"
            className="h-11 rounded-xl"
          />
        </Field>
        <Field label={t("Mobile number")} error={errors.receiver_phone}>
          <Input
            value={form.receiver_phone}
            onChange={(event) =>
              change(
                "receiver_phone",
                event.target.value.replace(/\D/g, "").slice(0, 10),
              )
            }
            inputMode="numeric"
            autoComplete="tel"
            className="h-11 rounded-xl"
          />
        </Field>
      </div>
      <Field
        label={t("Complete address")}
        error={errors.address}
        locked={isEditing}
      >
        <Textarea
          value={form.address}
          onChange={(event) => change("address", event.target.value)}
          autoComplete="street-address"
          className="min-h-24 resize-none rounded-xl disabled:cursor-not-allowed disabled:border-stone-200 disabled:bg-stone-100 disabled:text-stone-500 disabled:opacity-100"
          placeholder={t("House / flat no., street, locality")}
          disabled={isEditing}
        />
        {isEditing && (
          <p className="mt-1 text-xs text-muted">
            {t("This delivery address is locked after saving.")}
          </p>
        )}
      </Field>
      <Field label={t("Pincode")} error={errors.pincode} locked={isEditing}>
        <Input
          value={form.pincode}
          onChange={(event) =>
            change("pincode", event.target.value.replace(/\D/g, "").slice(0, 6))
          }
          inputMode="numeric"
          className="h-11 rounded-xl disabled:cursor-not-allowed disabled:border-stone-200 disabled:bg-stone-100 disabled:text-stone-500 disabled:opacity-100"
          disabled={isEditing}
        />
        {isEditing && (
          <p className="mt-1 text-xs text-muted">
            {t("This pincode is locked after saving.")}
          </p>
        )}
      </Field>
      <Field label={t("Address type")}>
        {isEditing ? (
          <div className="flex h-11 items-center rounded-xl border border-stone-200 bg-stone-100 px-3 text-sm font-medium capitalize text-stone-600">
            {t(form.address_type)}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {["Home", "Work", "Other"].map((type) => (
              <label
                key={type}
                className={`flex cursor-pointer items-center justify-center rounded-xl border px-2 py-2.5 text-sm font-medium capitalize transition ${
                  form.address_type === type
                    ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                    : "border-stone-200 text-body-light hover:border-emerald-300"
                }`}
              >
                <input
                  type="radio"
                  name="address_type"
                  value={type}
                  checked={form.address_type === type}
                  onChange={() => change("address_type", type)}
                  className="sr-only"
                />
                {t(type)}
              </label>
            ))}
          </div>
        )}
      </Field>
      <div className="flex justify-end gap-2 pt-1">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            onClick={onCancel}
          >
            {t("Cancel")}
          </Button>
        )}
        <Button type="submit" className="rounded-xl" disabled={saving}>
          {saving ? t("Saving...") : t(submitLabel)}
        </Button>
      </div>
    </form>
  );
}

function Field({ label, error, locked, children }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center gap-1.5">
        <label className="text-sm font-semibold text-body-light">
          {label} <span className="text-red-500">*</span>
        </label>
        {locked && (
          <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-semibold text-stone-500">
            <LockKeyhole className="h-2.5 w-2.5" />
            Locked
          </span>
        )}
      </div>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
