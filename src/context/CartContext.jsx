import { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "farmers_marketplace_cart";
const CartContext = createContext(null);

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);
  useEffect(
    () => localStorage.setItem(STORAGE_KEY, JSON.stringify(items)),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      addToCart(item, quantity = 1) {
        setItems((prev) => {
          const index = prev.findIndex(
            (x) =>
              x.productId === item.productId && x.variantId === item.variantId,
          );
          if (index === -1)
            return [
              ...prev,
              { ...item, quantity: Math.min(quantity, item.availableUnits) },
            ];
          return prev.map((x, i) =>
            i === index
              ? {
                  ...x,
                  quantity: Math.min(x.quantity + quantity, x.availableUnits),
                }
              : x,
          );
        });
      },
      removeFromCart(productId, variantId) {
        setItems((prev) =>
          prev.filter(
            (x) => !(x.productId === productId && x.variantId === variantId),
          ),
        );
      },
      updateQuantity(productId, variantId, quantity) {
        setItems((prev) =>
          prev.map((x) =>
            x.productId === productId && x.variantId === variantId
              ? {
                  ...x,
                  quantity: Math.max(
                    1,
                    Math.min(Number(quantity) || 1, x.availableUnits),
                  ),
                }
              : x,
          ),
        );
      },
      increaseQuantity(productId, variantId) {
        setItems((prev) => {
          const index = prev.findIndex(
            (x) => x.productId === productId && x.variantId === variantId,
          );

          if (index === -1) {
            return prev; // Item not in cart, nothing to increase
          }

          return prev.map((x, i) =>
            i === index
              ? { ...x, quantity: Math.min(x.quantity + 1, x.availableUnits) }
              : x,
          );
        });
      },
      decreaseQuantity(productId, variantId) {
        setItems((prev) =>
          prev
            .map((x) =>
              x.productId === productId && x.variantId === variantId
                ? { ...x, quantity: x.quantity - 1 }
                : x,
            )
            .filter((x) => x.quantity > 0),
        );
      },
      clearCart() {
        setItems([]);
      },
      isInCart(productId, variantId) {
        return items.some(
          (x) => x.productId === productId && x.variantId === variantId,
        );
      },
      getCartTotal() {
        return items.reduce((sum, x) => sum + x.price * x.quantity, 0);
      },
      getCartItemCount() {
        return items.reduce((sum, x) => sum + x.quantity, 0);
      },
    }),
    [items],
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export function useCart() {
  return useContext(CartContext);
}
