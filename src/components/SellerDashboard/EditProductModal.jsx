import { useProductApi } from "@/api/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import {
  AlertCircle,
  Camera,
  Check,
  CheckCircle,
  Loader2,
  Lock,
  Plus,
  Save,
  SendHorizonal,
  X,
  XCircle,
} from "lucide-react";
import { memo, useCallback, useRef, useState } from "react";
import { toast } from "sonner";

const SaveStatus = ({ status }) => {
  if (!status) return null;
  if (status === "saving")
    return (
      <span className="flex items-center gap-1 text-[11px] text-muted-foreground whitespace-nowrap">
        <Loader2 size={11} className="animate-spin" /> Saving…
      </span>
    );
  if (status === "saved")
    return (
      <span className="flex items-center gap-1 text-[11px] text-emerald-600 whitespace-nowrap">
        <CheckCircle size={11} /> Saved
      </span>
    );
  if (status === "error")
    return (
      <span className="flex items-center gap-1 text-[11px] text-red-500 whitespace-nowrap">
        <AlertCircle size={11} /> Failed
      </span>
    );
  return null;
};

const MediaThumb = memo(({ url, onDelete }) => (
  <div className="relative group w-20 h-20 rounded-lg overflow-hidden border border-border bg-muted shrink-0">
    <img src={url} alt="" className="w-full h-full object-cover" />
    {onDelete && (
      <button
        type="button"
        onClick={onDelete}
        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center transition-opacity sm:opacity-0 sm:group-hover:opacity-100"
      >
        <X size={10} />
      </button>
    )}
  </div>
));

const ImageFileCard = memo(({ file, onRemove }) => {
  const [preview, setPreview] = useState(null);

  useState(() => {
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
  });

  return (
    <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-border bg-muted shrink-0">
      {preview && (
        <img src={preview} alt="" className="w-full h-full object-cover" />
      )}
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center"
      >
        <X size={10} />
      </button>
    </div>
  );
});

const SectionLabel = ({ label, accent = "bg-primary", action }) => (
  <div className="flex items-center justify-between mb-3.5">
    <div className="flex items-center gap-2.5">
      <span className={`h-4 w-1 rounded-full ${accent}`} />
      <h3 className="text-[13px] font-bold tracking-tight text-body-dark">
        {label}
      </h3>
    </div>
    {action}
  </div>
);

const TagsCheckbox = ({ tags = [], onChange, disabled }) => {
  const TAG_OPTIONS = ["Fruits", "Vegetables", "Pulses", "Oil", "Dry Fruits"];

  const toggleTag = (tag) => {
    if (disabled) return;
    const newTags = tags.includes(tag)
      ? tags.filter((t) => t !== tag)
      : [...tags, tag];
    onChange(newTags);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {TAG_OPTIONS.map((tag) => (
        <button
          key={tag}
          type="button"
          onClick={() => toggleTag(tag)}
          disabled={disabled}
          className={`px-3 py-1.5 flex gap-1.5 items-center rounded-full text-xs font-semibold transition-colors ${
            tags.includes(tag)
              ? "bg-primary text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {tags.includes(tag) && <Check className="h-3.5 w-3.5" />} {tag}
        </button>
      ))}
    </div>
  );
};

const ProductDetailsSection = ({ commodity, seller, isApproved }) => {
  const [name, setName] = useState(commodity.name ?? "");
  const [description, setDescription] = useState(commodity.description ?? "");
  const [category, setCategory] = useState(commodity.category ?? "");
  const [tags, setTags] = useState(
    Array.isArray(commodity.tags) ? commodity.tags : [],
  );
  const [saveStatus, setSaveStatus] = useState(null);
  const { updateProduct } = useProductApi();

  const handleSave = useCallback(async () => {
    if (!name.trim()) {
      toast.error("Product name is required");
      return;
    }
    setSaveStatus("saving");
    const result = await updateProduct(commodity.id, {
      name,
      description,
      category,
      tags,
      seller,
    });
    if (result.error) {
      setSaveStatus("error");
      toast.error("Failed to update product details");
    } else {
      setSaveStatus("saved");
      toast.success("Product details updated successfully");
    }
    setTimeout(() => setSaveStatus(null), 3000);
  }, [commodity.id, name, description, category, tags, seller, updateProduct]);

  return (
    <div>
      <SectionLabel
        label="Product details"
        accent="bg-primary"
        action={
          isApproved ? (
            <span className="flex items-center gap-1 text-[12px] text-amber-600 dark:text-amber-400 font-medium">
              <Lock size={10} /> Locked after approval
            </span>
          ) : null
        }
      />
      <div
        className={`grid grid-cols-1 sm:grid-cols-3 gap-2.5 ${
          isApproved ? "pointer-events-none opacity-50 select-none" : ""
        }`}
      >
        <div>
          <label className="text-xs font-semibold text-muted mb-1 block">
            Product Name
          </label>
          <Input
            placeholder="e.g. APPLE"
            value={name}
            onChange={(e) => setName(e.target.value.toUpperCase())}
            disabled={isApproved}
            className="text-[15px]!"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-muted mb-1 block">
            Category
          </label>
          <Input
            placeholder="e.g. FRUITS"
            value={category}
            onChange={(e) => setCategory(e.target.value.toUpperCase())}
            disabled={isApproved}
            className="text-[15px]!"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-muted mb-1 block">
            Description
          </label>
          <Input
            placeholder="e.g. Fresh seasonal fruits"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isApproved}
            className="text-[15px]!"
          />
        </div>
      </div>
      <div className="mt-2.5">
        <label className="text-xs font-semibold text-muted mb-1 block">
          Tags
        </label>
        <TagsCheckbox tags={tags} onChange={setTags} disabled={isApproved} />
      </div>
      {!isApproved && (
        <div className="flex items-center justify-end gap-2 mt-2">
          <SaveStatus status={saveStatus} />
          <Button
            size="sm"
            onClick={handleSave}
            disabled={saveStatus === "saving"}
            className="gap-1.5 text-xs font-semibold h-8 px-3"
          >
            <Save size={11} /> Save
          </Button>
        </div>
      )}
    </div>
  );
};

const SpecRow = ({
  spec,
  productId,
  seller,
  isNew,
  onRemoveNew,
  isApproved,
}) => {
  const [name, setName] = useState(spec.name ?? "");
  const [value, setValue] = useState(spec.value ?? "");
  const [description, setDescription] = useState(spec.description ?? "");
  const [saveStatus, setSaveStatus] = useState(null);
  const { createProductSpec, updateProductSpec } = useProductApi();

  const handleSave = useCallback(async () => {
    if (!name.trim()) {
      toast.error("Specification name is required");
      return;
    }
    if (!value.trim()) {
      toast.error("Specification value is required");
      return;
    }
    setSaveStatus("saving");
    const payload = {
      seller,
      product: productId,
      name,
      value,
      description,
      metadata: {},
    };
    const result = isNew
      ? await createProductSpec(payload)
      : await updateProductSpec(spec.id, payload);
    if (result.error) {
      setSaveStatus("error");
      toast.error("Failed to save specification");
    } else {
      setSaveStatus("saved");
      toast.success(isNew ? "Specification added" : "Specification updated");
      if (isNew) onRemoveNew?.();
    }
    setTimeout(() => setSaveStatus(null), 3000);
  }, [
    spec.id,
    productId,
    seller,
    name,
    value,
    description,
    isNew,
    createProductSpec,
    updateProductSpec,
    onRemoveNew,
  ]);

  return (
    <div
      className={`rounded-lg border p-2.5 space-y-1.5 ${
        isNew ? "border-primary/25 bg-primary/3" : "border-border/70 bg-white"
      }`}
    >
      {isNew && !isApproved && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onRemoveNew ?? (() => {})}
            className="cursor-pointer w-6 h-6 rounded-md flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
          >
            <X size={13} />
          </button>
        </div>
      )}
      <div
        className={`grid grid-cols-2 sm:grid-cols-3 gap-2 ${
          isApproved ? "pointer-events-none opacity-50 select-none" : ""
        }`}
      >
        <div>
          <label className="text-xs font-semibold text-muted mb-1 block">
            Name
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            disabled={isApproved}
            className="text-[15px]!"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-muted mb-1 block">
            Value
          </label>
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Value"
            disabled={isApproved}
            className="text-[15px]!"
          />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="text-xs font-semibold text-muted mb-1 block">
            Description (optional)
          </label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            disabled={isApproved}
            className="text-[15px]!"
          />
        </div>
      </div>
      {!isApproved && (
        <div className="flex items-center justify-end gap-2">
          <SaveStatus status={saveStatus} />
          <Button
            size="sm"
            onClick={handleSave}
            disabled={saveStatus === "saving"}
            className="gap-1.5 text-xs font-semibold h-8 px-3"
          >
            <Save size={11} /> {isNew ? "Add" : "Save"}
          </Button>
        </div>
      )}
    </div>
  );
};

const SpecificationsSection = ({ commodity, seller, isApproved }) => {
  const [newSpecs, setNewSpecs] = useState([]);
  const existingSpecs = commodity.specifications ?? [];

  const addSpecBtn = !isApproved ? (
    <button
      type="button"
      onClick={() => setNewSpecs((prev) => [...prev, { _tempId: Date.now() }])}
      className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/70 transition-colors cursor-pointer"
    >
      <Plus size={13} /> Add
    </button>
  ) : (
    <span className="flex items-center gap-1 text-[12px] text-amber-600 dark:text-amber-400 font-medium">
      <Lock size={10} /> Locked
    </span>
  );

  return (
    <div>
      <SectionLabel
        label="Specifications"
        accent="bg-sky-500"
        action={addSpecBtn}
      />
      {existingSpecs.length === 0 && newSpecs.length === 0 && (
        <p className="text-xs text-muted-foreground py-1">
          No specifications yet.
        </p>
      )}
      <div className="space-y-2">
        {existingSpecs.map((spec) => (
          <SpecRow
            key={spec.id}
            spec={spec}
            productId={commodity.id}
            seller={seller}
            isNew={false}
            isApproved={isApproved}
          />
        ))}
        {!isApproved &&
          newSpecs.map((s) => (
            <SpecRow
              key={s._tempId}
              spec={{}}
              productId={commodity.id}
              seller={seller}
              isNew
              isApproved={false}
              onRemoveNew={() =>
                setNewSpecs((prev) =>
                  prev.filter((x) => x._tempId !== s._tempId),
                )
              }
            />
          ))}
      </div>
    </div>
  );
};

const VariantRow = ({
  variant,
  productId,
  seller,
  isNew,
  onRemoveNew,
  isApproved,
  unitOptions,
}) => {
  const [name, setName] = useState(variant.name ?? "");
  const [packQty, setPackQty] = useState(String(variant.pack_quantity ?? ""));
  const [packUnit, setPackUnit] = useState(variant.pack_unit ?? "");
  const [price, setPrice] = useState(String(variant.price ?? ""));
  const [noOfUnits, setNoOfUnits] = useState(String(variant.no_of_units ?? ""));
  const [newFiles, setNewFiles] = useState([]);
  const [saveStatus, setSaveStatus] = useState(null);
  const fileInputRef = useRef(null);
  const {
    createProductVariant,
    updateProductVariant,
    uploadVariantMedia,
    deleteVariantMedia,
  } = useProductApi();

  const [deletedIds, setDeletedIds] = useState(() => new Set());
  const existingMedia = (variant.all_media ?? [])
    .map((m) => ({
      id: m?.id,
      url: m?.productImgUrl || m?.image || m?.file || m?.url,
    }))
    .filter((m) => m.url && !deletedIds.has(m.id));

  const handleDeleteMedia = useCallback(
    async (mediaId) => {
      if (!mediaId) return;
      const result = await deleteVariantMedia(mediaId);
      if (result.error) {
        toast.error("Failed to delete image");
      } else {
        setDeletedIds((prev) => new Set([...prev, mediaId]));
        toast.success("Image deleted");
      }
    },
    [deleteVariantMedia],
  );

  const handleSave = useCallback(async () => {
    if (!name.trim()) {
      toast.error("Variant name is required");
      return;
    }
    if (!packQty || Number(packQty) <= 0) {
      toast.error("Pack quantity is required");
      return;
    }
    if (!packUnit) {
      toast.error("Unit is required");
      return;
    }
    if (!price || Number(price) <= 0) {
      toast.error("Price is required");
      return;
    }
    if (!noOfUnits || Number(noOfUnits) <= 0) {
      toast.error("No. of units is required");
      return;
    }
    if (isNew && existingMedia.length === 0 && newFiles.length === 0) {
      toast.error("At least one image is required");
      return;
    }

    setSaveStatus("saving");
    const payload = {
      seller,
      product: productId,
      name,
      pack_quantity: Number(packQty),
      pack_unit: packUnit,
      price: Number(price),
      no_of_units: Number(noOfUnits),
    };

    const result = isNew
      ? await createProductVariant(payload)
      : await updateProductVariant(variant.id, payload);

    if (result.error) {
      setSaveStatus("error");
      toast.error("Failed to save variant");
      setTimeout(() => setSaveStatus(null), 3000);
      return;
    }

    const savedId = result.data?.id ?? result.data?.data?.id ?? variant.id;
    if (newFiles.length > 0 && savedId) {
      for (const file of newFiles) {
        const fd = new FormData();
        fd.append("variant", savedId);
        fd.append("file", file);
        fd.append("account", seller);
        fd.append("pattern", "master");
        fd.append("category", "Variant");
        fd.append("description", "variant image");
        await uploadVariantMedia(fd);
      }
      setNewFiles([]);
    }

    setSaveStatus("saved");
    toast.success(isNew ? "Variant added" : "Variant updated");
    if (isNew) onRemoveNew?.();
    setTimeout(() => setSaveStatus(null), 3000);
  }, [
    variant.id,
    productId,
    seller,
    name,
    packQty,
    packUnit,
    price,
    noOfUnits,
    newFiles,
    isNew,
    createProductVariant,
    updateProductVariant,
    uploadVariantMedia,
    onRemoveNew,
  ]);

  return (
    <div
      className={`rounded-xl border p-3 space-y-2 ${
        isNew ? "border-orange-200 bg-orange-50/40" : "border-border bg-white"
      }`}
    >
      <div className="flex items-center justify-end">
        {isNew && !isApproved && (
          <button
            type="button"
            onClick={onRemoveNew}
            className="w-6 h-6 rounded flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
          >
            <X size={13} />
          </button>
        )}
        {isApproved && !isNew && (
          <span className="flex items-center gap-1 text-[12px] text-amber-600 dark:text-amber-400 font-semibold">
            <Lock size={10} /> Only price & Unit editable
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        <div
          className={
            isApproved ? "pointer-events-none opacity-50 select-none" : ""
          }
        >
          <label className="text-xs font-semibold text-muted mb-1 block">
            Name
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Paddy"
            disabled={isApproved}
            className="text-[15px]!"
          />
        </div>
        <div
          className={
            isApproved ? "pointer-events-none opacity-50 select-none" : ""
          }
        >
          <label className="text-xs font-semibold text-muted mb-1 block">
            Pack Qty
          </label>
          <Input
            type="number"
            min="0"
            value={packQty}
            onChange={(e) => setPackQty(e.target.value)}
            placeholder="e.g. 2"
            disabled={isApproved}
            className="text-[15px]!"
          />
        </div>
        <div
          className={
            isApproved ? "pointer-events-none opacity-50 select-none" : ""
          }
        >
          <label className="text-xs font-semibold text-muted mb-1 block">
            Unit
          </label>
          <Select
            value={packUnit}
            onValueChange={setPackUnit}
            disabled={isApproved}
          >
            <SelectTrigger>
              <SelectValue placeholder="Unit" />
            </SelectTrigger>
            <SelectContent className="z-200">
              {unitOptions.map((unit) => (
                <SelectItem key={unit.value} value={unit.value}>
                  {unit.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs font-semibold text-muted mb-1 block">
            Price (₹)
          </label>
          <Input
            type="number"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="e.g. 100"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-muted mb-1 block">
            No. of Units
          </label>
          <Input
            type="number"
            min="0"
            value={noOfUnits}
            onChange={(e) => setNoOfUnits(e.target.value)}
            placeholder="e.g. 10"
          />
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-border/50">
        {!isApproved && (
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              setNewFiles((prev) => [
                ...prev,
                ...Array.from(e.target.files || []),
              ]);
              e.target.value = "";
            }}
          />
        )}
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold text-muted-foreground">
            Images {!isApproved && <span className="text-destructive">*</span>}
          </span>
          {!isApproved && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1 text-xs font-semibold text-primary cursor-pointer hover:text-primary/70 transition-colors"
            >
              <Plus size={11} /> Add Photo
            </button>
          )}
        </div>
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
          {existingMedia.map((m) => (
            <MediaThumb
              key={m.id ?? m.url}
              url={m.url}
              onDelete={!isApproved ? () => handleDeleteMedia(m.id) : undefined}
            />
          ))}
          {!isApproved &&
            newFiles.map((file, i) => (
              <ImageFileCard
                key={`${file.name}-${i}`}
                file={file}
                onRemove={() =>
                  setNewFiles((prev) => prev.filter((_, idx) => idx !== i))
                }
              />
            ))}
          {existingMedia.length === 0 &&
            newFiles.length === 0 &&
            !isApproved && (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center h-16 px-6 rounded-lg border-2 border-dashed border-primary/25 hover:border-primary/50 bg-primary/3 hover:bg-primary/6 cursor-pointer transition-all group"
              >
                <Camera
                  size={14}
                  className="text-primary/60 group-hover:text-primary transition-colors mx-2"
                />
                <span className="text-xs text-muted-foreground mx-3">
                  Upload image
                </span>
              </div>
            )}
        </div>
      </div>

      {!isNew && (
        <div className="flex items-center justify-end gap-2 pt-1">
          <SaveStatus status={saveStatus} />
          <Button
            size="sm"
            onClick={handleSave}
            disabled={saveStatus === "saving"}
            className="gap-1.5 text-xs font-semibold h-8 px-3"
          >
            <Save size={11} /> {isApproved ? "Save" : "Save Variant"}
          </Button>
        </div>
      )}
      {isNew && !isApproved && (
        <div className="flex items-center justify-end gap-2 pt-1">
          <SaveStatus status={saveStatus} />
          <Button
            size="sm"
            onClick={handleSave}
            disabled={saveStatus === "saving"}
            className="gap-1.5 text-xs font-semibold h-8 px-3"
          >
            <Save size={11} /> Add Variant
          </Button>
        </div>
      )}
    </div>
  );
};

const VariantsSection = ({ commodity, seller, isApproved, unitOptions }) => {
  const [newVariants, setNewVariants] = useState([]);
  const existingVariants = commodity.variants ?? [];

  const addVariantBtn = !isApproved ? (
    <button
      type="button"
      onClick={() =>
        setNewVariants((prev) => [...prev, { _tempId: Date.now() }])
      }
      className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/70 transition-colors cursor-pointer"
    >
      <Plus size={13} /> Add
    </button>
  ) : (
    ""
  );

  return (
    <div>
      <SectionLabel
        label="Variants"
        accent="bg-orange-500"
        action={addVariantBtn}
      />
      {existingVariants.length === 0 && newVariants.length === 0 && (
        <p className="text-xs text-muted-foreground py-1">No variants yet.</p>
      )}
      <div className="space-y-2 mt-1">
        {existingVariants.map((v) => (
          <VariantRow
            key={v.id}
            variant={v}
            productId={commodity.id}
            seller={seller}
            isNew={false}
            isApproved={isApproved}
            unitOptions={unitOptions}
          />
        ))}
        {!isApproved &&
          newVariants.map((v) => (
            <VariantRow
              key={v._tempId}
              variant={{}}
              productId={commodity.id}
              seller={seller}
              isNew
              isApproved={false}
              unitOptions={unitOptions}
              onRemoveNew={() =>
                setNewVariants((prev) =>
                  prev.filter((x) => x._tempId !== v._tempId),
                )
              }
            />
          ))}
      </div>
    </div>
  );
};

const EditProductModal = ({ commodity, seller, onClose, onBack }) => {
  if (!commodity) return null;

  const { SellerMobile } = useAuth();
  const isApproved = !!commodity.is_approved;
  const isRejected =
    commodity.qc_status === "Rejected" || commodity.status === "rejected";
  const [approvalSubmitted, setApprovalSubmitted] = useState(false);
  const { submitStockForApproval, getMasterUnits } = useProductApi();
  const [unitOptions, setUnitOptions] = useState([]);
  const [loadingUnits, setLoadingUnits] = useState(true);

  const handleRequestApproval = async () => {
    const result = await submitStockForApproval(commodity.id);
    if (result.error) {
      toast.error("Failed to submit for approval");
    } else {
      setApprovalSubmitted(true);
      toast.success("Submitted for admin approval");
    }
  };

  useState(() => {
    const fetchUnits = async () => {
      try {
        setLoadingUnits(true);
        const result = await getMasterUnits();
        if (result.data) {
          const list =
            result.data?.data || result.data?.results || result.data || [];
          const options = list
            .map((u) => ({
              value: u.name || u.unit || u,
              label: u.name || u.unit || u,
            }))
            .filter((o) => o.value);
          setUnitOptions(options);
        }
      } catch (error) {
        toast.error("Failed to load units");
      } finally {
        setLoadingUnits(false);
      }
    };
    fetchUnits();
  }, [getMasterUnits]);

  return (
    <div
      className="fixed inset-0 z-100 flex items-end sm:items-center justify-center sm:p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full bg-white max-w-4xl rounded-t-2xl sm:rounded-2xl border border-border shadow-xl overflow-hidden max-h-[92vh] h-[92vh] sm:h-auto flex flex-col">
        {/* Header */}
        <div className="px-4 py-3.5 border-b border-border shrink-0">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {/* {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all shrink-0"
                >
                  <ChevronLeft size={16} />
                </button>
              )} */}
              {/* <ShoppingBasket size={16} className="text-primary shrink-0" /> */}
              <div className="min-w-0">
                <p className="text-md font-bold text-foreground leading-tight">
                  {isApproved ? "Update Price & Quantity" : "Edit Product"}
                </p>
                <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 truncate">
                  {isApproved
                    ? "Approved listing — only price & quantity can be updated"
                    : "Update product details, specifications & variants"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onBack}
              className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-gray-50 transition-all shrink-0"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="px-4 py-4 space-y-6">
            {isRejected && (
              <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 overflow-hidden">
                <div className="flex items-start gap-2.5 px-3 py-2.5">
                  <XCircle
                    size={14}
                    className="text-red-600 dark:text-red-400 shrink-0 mt-0.5"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-red-700 dark:text-red-400">
                      Rejection Reason
                    </p>
                    <p className="text-xs text-red-600/80 dark:text-red-400/70 mt-0.5 leading-snug">
                      {commodity.remark ||
                        commodity.remarks ||
                        "No reason provided."}
                    </p>
                  </div>
                </div>
                <div className="px-3 pb-3 pt-1 border-t border-red-200 dark:border-red-700/50 bg-red-100/40 dark:bg-red-900/30">
                  {approvalSubmitted ? (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      <CheckCircle size={12} /> Submitted — admin will review
                      your corrections shortly
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[13px] text-red-600/70 dark:text-red-400/60 leading-snug">
                        Fix the issues above, then request re-review.
                      </p>
                      <Button
                        size="sm"
                        disabled={loadingUnits}
                        onClick={handleRequestApproval}
                        className="shrink-0 gap-1.5 text-xs font-semibold h-7 px-3 mt-2"
                      >
                        {loadingUnits ? (
                          <>
                            <Loader2 size={11} className="animate-spin" />{" "}
                            Submitting…
                          </>
                        ) : (
                          <>
                            <SendHorizonal size={11} /> Request Approval
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            <ProductDetailsSection
              commodity={commodity}
              seller={seller || SellerMobile}
              isApproved={isApproved}
            />

            <SpecificationsSection
              commodity={commodity}
              seller={seller || SellerMobile}
              isApproved={isApproved}
            />

            <VariantsSection
              commodity={commodity}
              seller={seller || SellerMobile}
              isApproved={isApproved}
              unitOptions={unitOptions}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;
