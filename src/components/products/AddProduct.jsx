import {
  ArrowLeft,
  Check,
  ChevronRight,
  ImagePlus,
  Layers3,
  Package,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useProductApi } from "@/api/products";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import DeliveryLocation from "../SellerDashboard/DeliveryLocation";
import { useAuth } from "@/context/AuthContext";

const TAG_OPTIONS = ["Fruits", "Vegetables", "Pulses", "Oil", "Dry Fruits"];

const emptyVariant = () => ({
  id: crypto.randomUUID(),
  name: "",
  pack_quantity: "",
  pack_unit: "",
  price: "",
  no_of_units: "",
  files: [],
  errors: {},
});

const emptySpec = () => ({
  id: crypto.randomUUID(),
  name: "",
  value: "",
  errors: {},
});

export default function AddProduct({ embedded = false, onClose, onCompleted }) {
  const { SellerMobile } = useAuth();
  const {
    getMasterUnits,
    createProduct,
    uploadVariantMedia,
    submitStockForApproval,
  } = useProductApi();

  const navigate = useNavigate();

  const [units, setUnits] = useState([]);
  const [loadingUnits, setLoadingUnits] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);

  const [specifications, setSpecifications] = useState([emptySpec()]);

  const [variants, setVariants] = useState([emptyVariant()]);

  const [step, setStep] = useState(1);

  const [deliveryLocation, setDeliveryLocation] = useState(null);

  const [deliveryLocationId, setDeliveryLocationId] = useState(null);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadUnits();
  }, []);

  const loadUnits = async () => {
    try {
      const response = await getMasterUnits();

      const list = response?.data || response?.results || response || [];

      setUnits(
        Array.isArray(list)
          ? list.map((item) => item?.name || item?.unit || item).filter(Boolean)
          : [],
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingUnits(false);
    }
  };

  const addSpecification = () => {
    setSpecifications((items) => [...items, emptySpec()]);
  };

  const removeSpecification = (id) => {
    setSpecifications((items) => items.filter((item) => item.id !== id));
  };

  const updateSpecification = (id, field, value) => {
    setSpecifications((items) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
              errors: {
                ...item.errors,
                [field]: undefined,
              },
            }
          : item,
      ),
    );

    if (errors.specifications) {
      setErrors((current) => ({
        ...current,
        specifications: undefined,
      }));
    }
  };

  const addVariant = () => {
    setVariants((items) => [...items, emptyVariant()]);
  };

  const removeVariant = (id) => {
    setVariants((items) => items.filter((item) => item.id !== id));
  };

  const updateVariant = (id, field, value) => {
    setVariants((items) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
              errors: {
                ...item.errors,
                [field]: undefined,
              },
            }
          : item,
      ),
    );
  };

  const addVariantImages = (id, files) => {
    if (!files?.length) return;

    const selectedImages = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setVariants((items) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              files: [...item.files, ...selectedImages],
              errors: {
                ...item.errors,
                files: undefined,
              },
            }
          : item,
      ),
    );
  };

  const removeVariantImage = (variantId, index) => {
    setVariants((items) =>
      items.map((item) => {
        if (item.id !== variantId) return item;

        const image = item.files[index];

        if (image?.preview) {
          URL.revokeObjectURL(image.preview);
        }

        return {
          ...item,
          files: item.files.filter((_, i) => i !== index),
        };
      }),
    );
  };

  const handleTagSelect = (option) => {
    setTags((current) =>
      current.includes(option)
        ? current.filter((tag) => tag !== option)
        : [...current, option],
    );

    setErrors((current) => ({
      ...current,
      tags: undefined,
    }));
  };

  const validateStepOne = () => {
    const nextErrors = {};

    if (!name.trim()) {
      nextErrors.name = "Product name is required";
    }

    if (!category.trim()) {
      nextErrors.category = "Category is required";
    }

    if (!tags.length) {
      nextErrors.tags = "Select at least one tag";
    }

    const hasValidSpecification = specifications.some(
      (item) => item.name.trim() && item.value.trim(),
    );

    if (!hasValidSpecification) {
      nextErrors.specifications = "Add at least one specification";
    }

    const updatedVariants = variants.map((variant) => {
      const variantErrors = {};

      if (!variant.name.trim()) {
        variantErrors.name = "Variant name is required";
      }

      if (!variant.pack_quantity || Number(variant.pack_quantity) <= 0) {
        variantErrors.pack_quantity = "Pack quantity is required";
      }

      if (!variant.pack_unit) {
        variantErrors.pack_unit = "Pack unit is required";
      }

      if (!variant.price || Number(variant.price) <= 0) {
        variantErrors.price = "Price is required";
      }

      if (!variant.no_of_units || Number(variant.no_of_units) <= 0) {
        variantErrors.no_of_units = "Available stock is required";
      }

      if (!variant.files.length) {
        variantErrors.files = "At least one image is required";
      }

      return {
        ...variant,
        errors: variantErrors,
      };
    });

    setVariants(updatedVariants);
    setErrors(nextErrors);

    const variantsValid = updatedVariants.every(
      (variant) => Object.keys(variant.errors).length === 0,
    );

    return Object.keys(nextErrors).length === 0 && variantsValid;
  };

  const handleContinue = () => {
    if (!validateStepOne()) {
      return;
    }

    setStep(2);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDeliveryContinue = (locationId, location) => {
    if (!locationId) {
      return;
    }

    setDeliveryLocationId(locationId);
    setDeliveryLocation(location);

    handleSubmit(locationId);
  };

  const handleSubmit = async (locationId) => {
    if (!locationId) {
      return;
    }

    if (!validateStepOne()) {
      setStep(1);
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        seller: SellerMobile,
        name: name.trim(),
        description: description.trim(),
        category: category.trim(),
        tags,
        delivery_location: locationId,

        specifications: specifications
          .filter((item) => item.name.trim() && item.value.trim())
          .map((item) => ({
            name: item.name.trim(),
            value: item.value.trim(),
            description: "",
          })),

        variants: variants.map((variant) => ({
          name: variant.name.trim(),
          pack_quantity: Number(variant.pack_quantity),
          pack_unit: variant.pack_unit,
          price: Number(variant.price),
          no_of_units: Number(variant.no_of_units),
        })),
      };

      const result = await createProduct(payload);

      const returnedVariants = result?.variants || result?.data?.variants || [];

      for (let i = 0; i < variants.length; i++) {
        const variant = variants[i];

        const returnedVariant =
          returnedVariants.find((item) => item.name === variant.name) ||
          returnedVariants[i];

        if (!returnedVariant?.id) {
          continue;
        }

        for (const image of variant.files) {
          const formData = new FormData();

          formData.append("account", SellerMobile);
          formData.append("file", image.file);
          formData.append("pattern", "master");
          formData.append("category", "Variant");
          formData.append("variant", String(returnedVariant.id));
          formData.append("description", "Product image");

          await uploadVariantMedia(formData);
        }
      }

      const productId = result?.id || result?.data?.id;

      if (productId) {
        await submitStockForApproval(productId);
      }

      toast.success("Product added successfully");

      if (onCompleted) {
        onCompleted();
      } else {
        navigate("/seller");
      }
    } catch (error) {
      console.error(error);

      toast.error(error?.message || "Failed to add product");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    if (embedded) {
      onClose?.();
    } else {
      navigate(-1);
    }
  };

  return (
    <div
      className={`flex flex-col bg-gray-100 ${embedded ? "min-h-full md:bg-gray-100" : "min-h-dvh"}`}
    >
      <header className="sticky top-0 z-30 border-b border-border/70 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-xl items-center gap-3 px-4 md:hidden">
          <button
            type="button"
            onClick={handleBack}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#f6f4ee] text-body-dark transition active:scale-95"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <div className="min-w-0 flex-1">
            <h1 className="text-base font-bold text-body-dark">
              {step === 1 ? "Add Product" : "Delivery Location"}
            </h1>

            <p className="text-[10px] text-muted">
              {step === 1
                ? "Create a new product listing"
                : "Choose where you can deliver"}
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <span
              className={`h-1.5 w-7 rounded-full transition-all ${
                step === 1 ? "bg-primary" : "bg-border"
              }`}
            />

            <span
              className={`h-1.5 w-7 rounded-full transition-all ${
                step === 2 ? "bg-primary" : "bg-border"
              }`}
            />
          </div>
        </div>

        <div className="mx-auto hidden h-18 max-w-5xl items-center justify-between px-7 md:flex">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleBack}
              className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-white text-body-dark transition hover:border-primary/25 hover:bg-primary/5 hover:text-primary"
              aria-label="Close add product"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-body-dark">
                  {step === 1
                    ? "Create a new listing"
                    : "Set delivery coverage"}
                </h1>
                <span className="rounded-full bg-orange-50 px-2.5 py-1 text-[10px] font-bold text-orange-700">
                  Draft
                </span>
              </div>
              <p className="mt-0.5 text-xs text-muted">
                {step === 1
                  ? "Add product information, variants and photos."
                  : "Choose the locations where this product is available."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`flex items-center gap-2 text-xs font-semibold ${step === 1 ? "text-primary" : "text-muted"}`}
            >
              <span
                className={`grid h-6 w-6 place-items-center rounded-full text-[10px] ${step === 1 ? "bg-primary text-white" : "bg-stone-100 text-muted"}`}
              >
                1
              </span>
              Product
            </span>
            <span className="h-px w-7 bg-border" />
            <span
              className={`flex items-center gap-2 text-xs font-semibold ${step === 2 ? "text-primary" : "text-muted"}`}
            >
              <span
                className={`grid h-6 w-6 place-items-center rounded-full text-[10px] ${step === 2 ? "bg-primary text-white" : "bg-stone-100 text-muted"}`}
              >
                2
              </span>
              Delivery
            </span>
          </div>
        </div>
      </header>

      <main className="mb-14 md:mb-2 flex-1 px-3 py-4 md:px-6 md:py-5">
        <div className="mx-auto max-w-xl space-y-3 md:max-w-5xl md:space-y-5">
          {step === 1 && (
            <>
              <div className="hidden items-center justify-between rounded-2xl border border-primary/10 bg-primary/4 px-5 py-3 md:flex">
                <div className="flex items-center gap-3">
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary/10 text-xs font-bold text-primary">
                    1
                  </span>
                  <div>
                    <p className="text-sm font-bold text-body-dark">
                      Product information
                    </p>
                    <p className="text-[11px] text-muted">
                      Start with the basic details that customers see first.
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-primary">
                  Required fields marked *
                </span>
              </div>
              <div className="md:grid md:grid-cols-[minmax(0,1fr)_360px] md:items-start md:gap-5">
                <section className="rounded-[22px] border border-border/70 bg-white p-4 shadow-xs md:p-5">
                  <SectionTitle icon={Package} title="Product details" />

                  <div className="mt-4 space-y-3">
                    <div className="md:grid md:grid-cols-2 md:gap-3 flex flex-col gap-2  ">
                      <Field
                        label="Product name"
                        required
                        placeholder="e.g. Fresh Tomato"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);

                          setErrors((current) => ({
                            ...current,
                            name: undefined,
                          }));
                        }}
                        error={errors.name}
                      />

                      <Field
                        label="Category"
                        required
                        placeholder="e.g. Vegetables"
                        value={category}
                        onChange={(e) => {
                          setCategory(e.target.value);

                          setErrors((current) => ({
                            ...current,
                            category: undefined,
                          }));
                        }}
                        error={errors.category}
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-[11px] md:text-[13px] font-semibold text-body-light">
                        Description
                      </label>

                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Add a short description"
                        rows={3}
                        className="w-full resize-none placeholder:text-sm rounded-xl border border-border bg-[#f5f4f3] px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-[11px] md:text-[13px] font-semibold text-body-light">
                        Tags
                        <span className="ml-0.5 text-red-500">*</span>
                      </label>

                      <div className="flex flex-wrap gap-2">
                        {TAG_OPTIONS.map((option) => {
                          const isSelected = tags.includes(option);

                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() => handleTagSelect(option)}
                              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-all  ${
                                isSelected
                                  ? "border-primary bg-primary text-white shadow-sm"
                                  : "border-border bg-white text-muted-foreground hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
                              }`}
                            >
                              {isSelected && (
                                <Check size={10} strokeWidth={3} />
                              )}

                              {option}
                            </button>
                          );
                        })}
                      </div>

                      {errors.tags && (
                        <p className="mt-1.5 text-xs text-red-500">
                          {errors.tags}
                        </p>
                      )}
                    </div>
                  </div>
                </section>

                <div className="space-y-4 md:sticky md:top-1 md:mt-0 mt-5">
                  <section className="rounded-[22px] border border-border/70 bg-white p-4 shadow-xs md:p-5">
                    <div className="flex items-center justify-between gap-3">
                      <SectionTitle icon={Layers3} title="Specifications" />

                      <AddButton onClick={addSpecification} label="Add" />
                    </div>

                    {errors.specifications && (
                      <p className="mt-3 text-xs text-red-500">
                        {errors.specifications}
                      </p>
                    )}

                    <div className="mt-4 space-y-2">
                      {specifications.map((specification, index) => (
                        <div
                          key={specification.id}
                          className="rounded-2xl bg-[#faf9f5] p-3"
                        >
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
                              Specification {index + 1}
                            </span>

                            {specifications.length > 1 && (
                              <button
                                type="button"
                                onClick={() =>
                                  removeSpecification(specification.id)
                                }
                                className="grid h-7 w-7 place-items-center rounded-lg text-muted transition hover:bg-red-50 hover:text-red-500"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <Field
                              placeholder="Name"
                              value={specification.name}
                              onChange={(e) =>
                                updateSpecification(
                                  specification.id,
                                  "name",
                                  e.target.value,
                                )
                              }
                              error={specification.errors?.name}
                            />

                            <Field
                              placeholder="Value"
                              value={specification.value}
                              onChange={(e) =>
                                updateSpecification(
                                  specification.id,
                                  "value",
                                  e.target.value,
                                )
                              }
                              error={specification.errors?.value}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <aside className="hidden rounded-[22px] border border-primary/10 bg-linear-to-br from-primary/7 via-white to-orange-50 p-5 md:block">
                    <p className="text-xs font-bold text-body-dark">
                      A strong listing gets noticed
                    </p>
                    <p className=" text-[11px] leading-5 text-muted">
                      Complete these details before you publish.
                    </p>
                    <div className="mt-3 space-y-3">
                      {[
                        "Use a clear product name",
                        "Add the pack size and available stock",
                        "Upload bright, high-quality photos",
                      ].map((tip) => (
                        <div
                          key={tip}
                          className="flex items-start gap-2.5 text-[11px] font-medium text-body-dark"
                        >
                          <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-primary text-white">
                            <Check className="h-2.5 w-2.5" />
                          </span>
                          {tip}
                        </div>
                      ))}
                    </div>
                  </aside>
                </div>
              </div>

              <section className="rounded-[22px] border border-border/70 bg-white p-4 shadow-xs">
                <div className="flex items-center justify-between gap-3">
                  <SectionTitle icon={Layers3} title="Variants" />

                  <AddButton onClick={addVariant} label="Add variant" />
                </div>

                {errors.variants && (
                  <p className="mt-3 text-xs text-red-500">
                    Please complete all variant fields.
                  </p>
                )}

                <div className="mt-4 space-y-3">
                  {variants.map((variant, index) => (
                    <VariantCard
                      key={variant.id}
                      variant={variant}
                      index={index}
                      units={units}
                      loadingUnits={loadingUnits}
                      onChange={updateVariant}
                      onRemove={removeVariant}
                      onAddImages={addVariantImages}
                      onRemoveImage={removeVariantImage}
                    />
                  ))}
                </div>
              </section>

              <div className="flex flex-end gap-2 pt-3 ">
                <Button
                  type="button"
                  onClick={handleContinue}
                  disabled={submitting}
                  className="w-full shadow-none!"
                >
                  Continue
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}

          {step === 2 && (
            <DeliveryLocation
              SellerMobile={SellerMobile}
              onBack={handleBack}
              onContinue={handleDeliveryContinue}
            />
          )}
        </div>
      </main>
    </div>
  );
}

function SectionTitle({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-orange-100 text-orange-600">
        <Icon className="h-4 w-4" />
      </div>

      <h2 className="text-sm md:text-[15px] font-bold text-body-dark">
        {title}
      </h2>
    </div>
  );
}

function AddButton({ onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-xl bg-primary/8 px-3 py-2 text-[11px] font-bold text-primary transition active:scale-95"
    >
      <Plus className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

function Field({
  label,
  required,
  placeholder,
  value,
  onChange,
  type = "text",
  error,
}) {
  return (
    <div>
      {label && (
        <label className="mb-1.5 block text-[11px] md:text-[13px] font-semibold text-body-light">
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
      )}

      <Input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`h-10 rounded-xl bg-[#f5f4f3] text-sm! shadow-none! ${
          error
            ? "border-red-400 focus-visible:ring-red-500/10"
            : "border-border"
        }`}
      />

      {error && <p className="mt-1 text-[11px] text-red-500">{error}</p>}
    </div>
  );
}

function ImagePreview({ image, onRemove }) {
  return (
    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-border bg-white shadow-xs">
      <img
        src={image.preview}
        alt={image.file.name}
        className="h-full w-full object-cover"
      />

      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent px-1.5 pb-1.5 pt-5">
        <p className="truncate text-[8px] font-medium text-white">
          {image.file.name}
        </p>
      </div>

      <button
        type="button"
        onClick={onRemove}
        className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/65 text-white"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function VariantCard({
  variant,
  index,
  units,
  loadingUnits,
  onChange,
  onRemove,
  onAddImages,
  onRemoveImage,
}) {
  return (
    <div className="rounded-[20px] border border-border/70 bg-[#faf9f5] p-3.5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs  font-bold text-body-dark">
            Variant {index + 1}
          </p>

          <p className="mt-0.5 text-[9px] md:text-[10px] text-muted">
            Price, pack size and stock
          </p>
        </div>

        {index > 0 && (
          <button
            type="button"
            onClick={() => onRemove(variant.id)}
            className="grid h-8 w-8 place-items-center rounded-xl text-muted transition hover:bg-red-50 hover:text-red-500"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="mt-3 space-y-2">
        <Field
          label="Variant name"
          required
          placeholder="e.g. Premium"
          value={variant.name}
          onChange={(e) => onChange(variant.id, "name", e.target.value)}
          error={variant.errors?.name}
        />

        <div className="grid grid-cols-2 gap-2">
          <Field
            label="Pack quantity"
            required
            type="number"
            placeholder="10"
            value={variant.pack_quantity}
            onChange={(e) =>
              onChange(variant.id, "pack_quantity", e.target.value)
            }
            error={variant.errors?.pack_quantity}
          />

          <div>
            <label className="mb-1.5 block text-[11px] md:text-[13px] font-semibold text-body-light">
              Unit
              <span className="text-red-500"> *</span>
            </label>

            <Select
              value={variant.pack_unit}
              onValueChange={(value) =>
                onChange(variant.id, "pack_unit", value)
              }
              disabled={loadingUnits}
            >
              <SelectTrigger
                className={`h-10 w-full rounded-xl bg-[#f5f4f3] px-3 text-sm! ${
                  variant.errors?.pack_unit ? "border-red-400" : "border-border"
                }`}
              >
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>

              <SelectContent>
                {units.map((unit) => (
                  <SelectItem key={unit} value={unit} className="text-sm!">
                    {unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {variant.errors?.pack_unit && (
              <p className="mt-1 text-[11px] text-red-500">
                {variant.errors.pack_unit}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Field
            label="Price"
            required
            type="number"
            placeholder="₹ 100"
            value={variant.price}
            onChange={(e) => onChange(variant.id, "price", e.target.value)}
            error={variant.errors?.price}
          />

          <Field
            label="Available stock"
            required
            type="number"
            placeholder="20"
            value={variant.no_of_units}
            onChange={(e) =>
              onChange(variant.id, "no_of_units", e.target.value)
            }
            error={variant.errors?.no_of_units}
          />
        </div>

        <div className="pt-2">
          <div className="mb-2.5 flex items-center justify-between">
            <div>
              <p className="text-[11px] md:text-[13px] font-bold text-body-dark">
                Product images
                <span className="ml-1 text-red-500">*</span>
              </p>

              <p className="mt-0.5 text-[9px] md:text-[11px] text-muted">
                Add clear photos of this variant
              </p>
            </div>

            <label className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-primary/8 px-3 py-2 text-[10px] md:text-[12px] font-bold text-primary transition active:scale-95">
              <Plus className="h-3.5 w-3.5" />
              Add photo
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  onAddImages(variant.id, e.target.files);

                  e.target.value = "";
                }}
              />
            </label>
          </div>

          {variant.files.length > 0 ? (
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {variant.files.map((image, imageIndex) => (
                <ImagePreview
                  key={`${image.file.name}-${image.file.lastModified}-${imageIndex}`}
                  image={image}
                  onRemove={() => onRemoveImage(variant.id, imageIndex)}
                />
              ))}

              <label className="flex h-20 w-20 shrink-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-primary/25 bg-primary/3 text-primary transition active:scale-95">
                <ImagePlus className="h-5 w-5" />

                <span className="text-[9px] font-bold">Add more</span>

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    onAddImages(variant.id, e.target.files);
                    e.target.value = "";
                  }}
                />
              </label>
            </div>
          ) : (
            <label className="flex h-24 cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary/20 bg-primary/3">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10">
                <ImagePlus className="h-4 w-4 text-primary" />
              </div>

              <div>
                <p className="text-[11px] md:text-[13px] font-bold text-body-dark">
                  Add product photos
                </p>

                <p className="mt-0.5 text-[9px] md:text-[11px] text-muted">
                  Tap to choose images
                </p>
              </div>

              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  onAddImages(variant.id, e.target.files);
                  e.target.value = "";
                }}
              />
            </label>
          )}
          {variant.errors?.files && (
            <p className="mt-1 text-[11px] text-red-500">
              {variant.errors.files}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
