import { Check, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

export default function showCartToast(product, variant) {
  const image = variant?.all_media?.[0]?.file;

  toast.custom(() => (
    <div className="flex w-90 items-center gap-3 rounded-xl border border-border bg-white p-3 shadow-lg">
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-100">
        {image && (
          <img
            src={image}
            alt={product.name}
            className="h-full w-full object-cover"
            style={{
              animation: "toast-product-pop 500ms cubic-bezier(.2,.8,.2,1)",
            }}
          />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-body-dark">Added to cart</p>

        <p className="truncate text-xs text-muted">
          {product.name} · {variant?.name || "Standard"}
        </p>
      </div>

      <div className="relative flex h-9 w-9 shrink-0 items-center justify-center">
        <span
          className="absolute inset-0 rounded-full border-2 border-primary/30"
          style={{
            animation: "cart-ring 650ms cubic-bezier(.2,.8,.2,1)",
          }}
        />

        <ShoppingBag
          className="h-5 w-5 text-primary toast-product-pop"
          style={{
            animation: "cart-pop 650ms cubic-bezier(.2,.8,.2,1)",
          }}
        />

        <span
          className="absolute -right-1 -top-1 grid h-3.5 min-w-3.5 place-items-center rounded-full bg-accent px-0.5 text-[7px] font-bold text-white"
          style={{
            animation: "cart-badge 450ms cubic-bezier(.2,.8,.2,1)",
          }}
        >
          ✓
        </span>
      </div>

      {/* <Check className="h-4 w-4 text-green-500" /> */}
    </div>
  ));
}
