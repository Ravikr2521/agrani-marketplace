import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FilePenLine,
  FileText,
  MapPin,
  XCircle,
  Edit,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import { formatINR } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import EditProductModal from "./EditProductModal";

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= 768,
  );

  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    const handleChange = (event) => setIsDesktop(event.matches);

    query.addEventListener("change", handleChange);

    return () => query.removeEventListener("change", handleChange);
  }, []);

  return isDesktop;
}

function getMediaUrl(media) {
  return (
    media?.file || media?.productImgUrl || media?.image || media?.url || ""
  );
}

function toTitleCase(str = "") {
  return str.replace(
    /\w\S*/g,
    (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
  );
}

function getQcStatus(status) {
  const normalized = String(status || "")
    .trim()
    .toLowerCase();

  const statuses = {
    pending: {
      label: "Pending review",
      description: "Your listing is currently being reviewed by the admin.",
      icon: Clock3,
      iconClass: "text-blue-600",
      iconBg: "bg-blue-50",
      border: "border-blue-100",
      bg: "bg-blue-50/60",
      text: "text-blue-700",
      subText: "text-blue-600/80",
    },
    approved: {
      label: "Approved",
      description:
        "Your listing has been approved and is ready for the marketplace.",
      icon: CheckCircle2,
      iconClass: "text-emerald-600",
      iconBg: "bg-emerald-50",
      border: "border-emerald-100",
      bg: "bg-emerald-50/60",
      text: "text-emerald-700",
      subText: "text-emerald-600/80",
    },
    rejected: {
      label: "Listing rejected",
      description: "This listing was rejected during quality review.",
      icon: XCircle,
      iconClass: "text-red-600",
      iconBg: "bg-red-50",
      border: "border-red-100",
      bg: "bg-red-50/60",
      text: "text-red-700",
      subText: "text-red-600/80",
    },
    draft: {
      label: "Draft",
      description:
        "This listing has not been submitted for quality review yet.",
      icon: FileText,
      iconClass: "text-slate-600",
      iconBg: "bg-slate-100",
      border: "border-slate-200",
      bg: "bg-slate-50",
      text: "text-slate-700",
      subText: "text-slate-600/80",
    },
    "edit requested": {
      label: "Edit requested",
      description:
        "Your edit request is currently being reviewed by the admin.",
      icon: FilePenLine,
      iconClass: "text-cyan-600",
      iconBg: "bg-cyan-50",
      border: "border-cyan-100",
      bg: "bg-cyan-50/60",
      text: "text-cyan-700",
      subText: "text-cyan-600/80",
    },
  };

  return (
    statuses[normalized] || {
      label: toTitleCase(status || "Unknown"),
      description: "Product review status is currently unavailable.",
      icon: Clock3,
      iconClass: "text-stone-500",
      iconBg: "bg-stone-100",
      border: "border-stone-200",
      bg: "bg-stone-50",
      text: "text-stone-700",
      subText: "text-stone-500",
    }
  );
}

function PreviewBody({ product, variantId, setVariantId }) {
  const [selectedImage, setSelectedImage] = useState(0);

  const variants = useMemo(
    () => (product?.variants || []).filter((v) => v?.is_active !== false),
    [product],
  );

  const variant =
    variants.find((v) => String(v.id) === String(variantId)) || variants[0];

  const images = useMemo(() => {
    if (!variant) return [];

    return [
      ...new Set((variant.all_media || []).map(getMediaUrl).filter(Boolean)),
    ];
  }, [variant]);

  useEffect(() => {
    setSelectedImage(0);
  }, [variant?.id]);

  const previousImage = () => {
    if (images.length < 2) return;

    setSelectedImage((current) =>
      current === 0 ? images.length - 1 : current - 1,
    );
  };

  const nextImage = () => {
    if (images.length < 2) return;

    setSelectedImage((current) =>
      current === images.length - 1 ? 0 : current + 1,
    );
  };

  const deliveryCoverage = useMemo(() => {
    const include = product?.delivery_location_detail?.coverage?.include;

    return {
      allStates: include?.all_states === true,
      states: include?.states || [],
    };
  }, [product]);

  const qcStatus = getQcStatus(product?.qc_status);
  const StatusIcon = qcStatus.icon;

  const rejectionRemark =
    product?.rejection_remark ||
    product?.rejectionRemark ||
    product?.qc_remark ||
    product?.remark ||
    "";

  if (!variant) return null;

  return (
    <div className="space-y-4 md:grid md:grid-cols-[1fr_1fr] md:items-stretch md:gap-6 md:space-y-0">
      <div className="flex min-h-0 flex-col">
        <div className="relative overflow-hidden rounded-2xl border border-stone-200 bg-stone-50 shadow-sm">
          <div className="aspect-4/3 w-full md:aspect-[1.12/1]">
            {images[selectedImage] ? (
              <img
                src={images[selectedImage]}
                alt={product?.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="grid h-full place-items-center text-sm text-muted">
                No image available
              </div>
            )}
          </div>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={previousImage}
                className="absolute left-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-body-dark shadow-md transition hover:bg-white active:scale-95"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={nextImage}
                className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-body-dark shadow-md transition hover:bg-white active:scale-95"
                aria-label="Next image"
              >
                <ChevronRight className="h-4 w-4" />
              </button>

              <div className="absolute bottom-3 right-3 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-semibold text-white">
                {selectedImage + 1} / {images.length}
              </div>
            </>
          )}
        </div>

        {/* {images.length > 1 && (
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {images.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setSelectedImage(index)}
                className={`h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-white p-0.5 transition-all ${
                  index === selectedImage
                    ? "ring-2 ring-primary ring-offset-1"
                    : "border border-stone-200 hover:border-stone-300"
                }`}
              >
                <img
                  src={image}
                  alt=""
                  className="h-full w-full rounded-md object-cover"
                />
              </button>
            ))}
          </div>
        )} */}

        {variants.length > 1 && (
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-bold text-body-dark">Variants</p>

              <span className="text-[10px] font-medium text-muted">
                {variants.length} options
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {variants.map((v) => {
                const active = String(v.id) === String(variant.id);

                const thumb = (v.all_media || [])
                  .map(getMediaUrl)
                  .find(Boolean);

                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setVariantId(v.id)}
                    className={`flex h-20.5 items-center gap-2 rounded-xl border bg-white p-1.5 text-left transition-all ${
                      active
                        ? "border-primary bg-primary/3 ring-2 ring-primary/15"
                        : "border-border hover:border-stone-300 hover:shadow-sm"
                    }`}
                  >
                    <div className="h-17 w-17 shrink-0 overflow-hidden rounded-lg bg-cream">
                      {thumb ? (
                        <img
                          src={thumb}
                          alt={v.name || "Variant"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="grid h-full place-items-center text-[9px] text-muted">
                          No image
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-[11px] font-bold text-body-dark">
                        {v.name || "Standard"}
                      </p>

                      <p className="mt-0.5 text-[10px] text-muted">
                        {v.pack_quantity} {v.pack_unit}
                      </p>

                      <p className="mt-1 text-xs font-bold text-body-dark">
                        {formatINR(v.price)}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="flex min-h-0 flex-col">
        <div className="flex-1">
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="success">{product?.category || "Produce"}</Badge>

              <span
                className={`inline-flex items-center gap-1.5 text-xs font-bold ${
                  Number(variant.no_of_units) > 0
                    ? "text-primary"
                    : "text-red-600"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    Number(variant.no_of_units) > 0
                      ? "bg-emerald-500"
                      : "bg-red-500"
                  }`}
                />

                {Number(variant.no_of_units) > 0
                  ? `${variant.no_of_units} available`
                  : "Out of stock"}
              </span>
            </div>

            {/* <div
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 ${qcStatus.border} ${qcStatus.bg}`}
            >
              <StatusIcon className={`h-3.5 w-3.5 ${qcStatus.iconClass}`} />

              <span className={`text-[10px] font-bold ${qcStatus.text}`}>
                {qcStatus.label}
              </span>
            </div> */}
          </div>

          <h2 className="mt-3 text-xl font-bold leading-tight tracking-tight text-body-dark">
            {toTitleCase(product?.name || "")}

            {variant.name && (
              <span className="font-semibold text-orange-600">
                {" "}
                - {toTitleCase(variant.name)}
              </span>
            )}
          </h2>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight text-body-dark">
              {formatINR(variant.price)}
            </span>

            <span className="text-xs font-medium text-muted">
              per {variant.pack_quantity} {variant.pack_unit}
            </span>
          </div>

          <div
            className={`mt-5 rounded-2xl border p-3.5 ${qcStatus.border} ${qcStatus.bg}`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${qcStatus.iconBg}`}
              >
                <StatusIcon className={`h-4 w-4 ${qcStatus.iconClass}`} />
              </div>

              <div className="min-w-0">
                <p className={`text-sm font-bold ${qcStatus.text}`}>
                  {qcStatus.label}
                </p>

                <p
                  className={`mt-0.5 text-[11px] leading-4 ${qcStatus.subText}`}
                >
                  {qcStatus.description}
                </p>

                {String(product?.qc_status || "").toLowerCase() ===
                  "rejected" &&
                  rejectionRemark && (
                    <div className="mt-2 rounded-xl bg-white/70 px-3 py-2">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-red-600/70">
                        Reason
                      </p>

                      <p className="mt-0.5 text-[11px] leading-4 text-red-700">
                        {rejectionRemark}
                      </p>
                    </div>
                  )}
              </div>
            </div>
          </div>

          {product?.description && (
            <div className="mt-5">
              <Separator className="mb-4 bg-gray-100" />

              <p className="text-sm leading-6 text-muted">
                {product.description}
              </p>
            </div>
          )}

          {(deliveryCoverage.allStates ||
            deliveryCoverage.states.length > 0) && (
            <div className="mt-5 rounded-2xl border border-border bg-stone-50/70 p-4">
              <div className="flex items-start gap-3">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-red-50 text-red-600">
                  <MapPin className="h-4 w-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-body-dark">
                    Delivery available in
                  </h3>

                  {deliveryCoverage.allStates ? (
                    <div className="mt-2 inline-flex items-center rounded-lg border border-orange-100 bg-white px-3 py-2">
                      <span className="text-xs font-semibold text-orange-600">
                        All over India
                      </span>
                    </div>
                  ) : (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {deliveryCoverage.states.map((location) => (
                        <div
                          key={location.state_name}
                          className="rounded-lg border border-gray-200 bg-white px-3 py-2"
                        >
                          <div className="text-xs font-semibold text-body-light">
                            {location.state_name}
                          </div>

                          {location.all_districts ? (
                            <div className="mt-0.5 text-[11px] text-gray-600">
                              All districts
                            </div>
                          ) : location.districts?.length > 0 ? (
                            <div className="mt-0.5 text-[11px] text-gray-600">
                              {location.districts.join(", ")}
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-5 rounded-2xl border border-orange-100 bg-orange-50/60 p-4">
          <p className="text-xs font-bold text-orange-800">
            Product information
          </p>

          <p className="mt-1 text-[11px] leading-4 text-orange-700/80">
            Review the selected variant, pricing, inventory and delivery
            coverage before closing the preview.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SellerProductPreview({
  open,
  onOpenChange,
  product,
  variantId,
}) {
  const isDesktop = useIsDesktop();
  const { SellerMobile } = useAuth();
  const [activeVariantId, setActiveVariantId] = useState(variantId);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setActiveVariantId(variantId);
    }
  }, [open, variantId]);

  if (!product) return null;

  if (isDesktop) {
    return (
      <>
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="w-[calc(100vw-48px)] max-w-240 overflow-hidden rounded-3xl border-0 bg-white p-0 shadow-2xl">
            <div className="max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-stone-100 bg-gray-50 px-6 py-3">
                <div>
                  <DialogTitle className="text-base font-bold text-body-dark">
                    Product preview
                  </DialogTitle>

                  <p className="text-xs text-muted">
                    Review product details and variants
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => {
                    onOpenChange(false);
                    setEditModalOpen(true);
                  }}
                  className="gap-1.5 mr-8"
                >
                  <Edit className="h-3.5 w-3.5" />
                  Edit
                </Button>
              </div>

              <div className="p-6">
                <PreviewBody
                  product={product}
                  variantId={activeVariantId}
                  setVariantId={setActiveVariantId}
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
        {editModalOpen && (
          <EditProductModal
            commodity={product}
            seller={SellerMobile}
            onClose={() => setEditModalOpen(false)}
            onBack={() => {
              setEditModalOpen(false);
              setTimeout(() => onOpenChange(true), 100);
            }}
          />
        )}
      </>
    );
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          className="max-h-[92vh] overflow-hidden rounded-t-[28px] bg-white p-0"
        >
          <SheetHeader className="flex items-center justify-between border-b border-border bg-white px-4 pb-3 pt-4">
            <div className="text-left">
              <SheetTitle className="text-lg font-bold text-body-dark">
                Product preview
              </SheetTitle>
            </div>
            <Button
              size="sm"
              onClick={() => {
                onOpenChange(false);
                setEditModalOpen(true);
              }}
              className="gap-1.5 mr-8"
            >
              <Edit className="h-3.5 w-3.5" />
              Edit
            </Button>
          </SheetHeader>

          <div className="max-h-[calc(92vh-64px)] overflow-y-auto p-4 sm:p-5">
            <PreviewBody
              product={product}
              variantId={activeVariantId}
              setVariantId={setActiveVariantId}
            />
          </div>
        </SheetContent>
      </Sheet>

      {editModalOpen && (
        <EditProductModal
          commodity={product}
          seller={SellerMobile}
          onClose={() => setEditModalOpen(false)}
          onBack={() => {
            setEditModalOpen(false);
            // Re-open the product preview after editing
            setTimeout(() => onOpenChange(true), 100);
          }}
        />
      )}
    </>
  );
}
