import { Minus, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { formatINR } from "@/lib/utils";

export default function CartItem({ item }) {
  const { increaseQuantity, decreaseQuantity, updateQuantity, removeFromCart } =
    useCart();

  const quantity = Number(item.quantity);
  const availableUnits = Number(item.availableUnits);

  const handleQuantityChange = (value) => {
    if (value === "") {
      updateQuantity(item.productId, item.variantId, value);
      return;
    }

    const nextQuantity = Number(value);

    if (Number.isNaN(nextQuantity)) {
      return;
    }

    if (nextQuantity < 1) {
      updateQuantity(item.productId, item.variantId, 1);
      return;
    }

    if (nextQuantity > availableUnits) {
      updateQuantity(item.productId, item.variantId, availableUnits);
      return;
    }

    updateQuantity(item.productId, item.variantId, nextQuantity);
  };

  return (
    <div
      className="
        group
        rounded-2xl
        border
        border-border
        bg-white
        p-3
        shadow-xs
        transition-all
        duration-200
        hover:border-border
        hover:shadow-xs 
      "
    >
      <div className="flex min-w-0 gap-3">
        <div
          className="
            h-19
            w-19
            shrink-0
            overflow-hidden
            rounded-xl
            bg-cream
          "
        >
          {item.image ? (
            <img
              src={item.image}
              alt={item.productName}
              className="
                h-full
                w-full
                object-cover
                transition-transform
                duration-500
                group-hover:scale-105
              "
            />
          ) : (
            <div
              className="
                grid
                h-full
                w-full
                place-items-center
                text-xs
                text-muted
              "
            >
              No image
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex gap-3">
                <h3
                  className="
                  truncate
                  text-[15px]
                  font-bold
                  text-body-dark
                "
                >
                  {item.productName}
                </h3>

                <p
                  className="
                  mt-0.5
                  truncate
                  text-sm
                  font-semibold
                  text-primary
                "
                >
                  ( {item.variantName || "Standard"} )
                </p>
              </div>

              <p
                className="
                  mt-1
                  truncate
                  text-xs
                  text-muted
                "
              >
                {item.packQuantity} {item.packUnit}
                <span className="mx-1.5 text-muted">•</span>
                {item.seller}
              </p>
            </div>

            <button
              type="button"
              className="
                grid
                h-7
                w-7
                shrink-0
                place-items-center
                rounded-lg
                text-muted
                transition-all
                duration-200
                hover:bg-red-50
                hover:text-red-600
                active:scale-90
              "
              onClick={() => removeFromCart(item.productId, item.variantId)}
              aria-label={`Remove ${item.productName}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-2 flex min-w-0 items-center justify-between gap-3 ">
            <div
              className="
                inline-flex
                h-8
                shrink-0
                items-center
                overflow-hidden
                rounded-xl
                border
                border-border
                bg-white
              "
            >
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={quantity <= 1}
                className="
                  h-8
                  w-8
                  shrink-0
                  rounded-none
                  text-muted
                  hover:bg-cream
                  hover:text-primary
                  disabled:opacity-30
                "
                onClick={() => decreaseQuantity(item.productId, item.variantId)}
              >
                <Minus className="h-3.5 w-3.5" />
              </Button>

              <input
                type="number"
                min="1"
                max={availableUnits}
                value={item.quantity}
                onChange={(e) => handleQuantityChange(e.target.value)}
                className="
                  h-8
                  w-10
                  shrink-0
                  border-x
                  border-border
                  bg-transparent
                  p-0
                  text-center
                  text-sm
                  font-semibold
                  text-body-dark
                  outline-none
                  [appearance:textfield]
                  focus:bg-cream
                  [&::-webkit-inner-spin-button]:appearance-none
                  [&::-webkit-outer-spin-button]:appearance-none
                "
                aria-label="Quantity"
              />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={quantity >= availableUnits}
                className="
                  h-9
                  w-9
                  shrink-0
                  rounded-none
                  text-muted
                  hover:bg-cream
                  hover:text-primary
                  disabled:opacity-25
                "
                onClick={() => increaseQuantity(item.productId, item.variantId)}
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>

            <div
              className="
                shrink-0
                text-base
                font-bold
                tracking-tight
                text-body-dark
              "
            >
              {formatINR(Number(item.price) * quantity)}
            </div>
          </div>

          {quantity >= availableUnits && (
            <p
              className="
                mt-1.5
                text-[10px]
                font-medium
                text-amber-600
              "
            >
              Maximum available quantity reached
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
