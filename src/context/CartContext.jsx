import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  CART_ID_STORAGE_KEY,
  addCartItem,
  clearCartItems,
  createCart,
  deleteCart,
  deleteCartItem,
  getCart,
  getCartItems,
  updateCartItem,
} from "@/api/cart";
import { useAuth } from "@/context/AuthContext";

const CartContext = createContext(null);

const unwrap = (response) => response?.data ?? response;

function decodeJwtPayload(token) {
  try {
    const encoded = token?.split(".")[1];
    if (!encoded) return null;
    const padded = encoded
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(encoded.length / 4) * 4, "=");
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

function getBuyer(token) {
  const claims = decodeJwtPayload(token);
  if (!claims) return { buyer_phone: "", buyer_name: "", buyer_id: "" };

  return {
    buyer_phone: String(
      claims.preferred_username ||
        claims.mobile ||
        claims.phone_number ||
        claims.phone ||
        "",
    ),
    buyer_name:
      claims.name ||
      [claims.given_name, claims.family_name].filter(Boolean).join(" ") ||
      "",
    buyer_id: claims.sub || "",
  };
}

function toUiItem(item) {
  return {
    id: item.id,
    productId: item.product_id,
    productName: item.product_name,
    variantId: item.variant,
    variantName: item.variant_name,
    quantity: Number(item.quantity) || 0,
    price: Number(item.price_per_unit) || 0,
    availableUnits: Number(item.no_of_units) || Number.MAX_SAFE_INTEGER,
    image: item.image || "",
    seller: item.seller_name || item.seller_id || "Farmer",
    category: item.category,
    packQuantity: item.pack_quantity,
    packUnit: item.pack_unit,
  };
}

export function CartProvider({ children }) {
  const { AgraniToken } = useAuth();
  const token = localStorage.getItem("agrani_auth_token") || AgraniToken;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(
    Boolean(localStorage.getItem(CART_ID_STORAGE_KEY)),
  );
  const createRequest = useRef(null);

  const applyCart = useCallback((response) => {
    const cart = unwrap(response);
    if (cart && Array.isArray(cart.items)) setItems(cart.items.map(toUiItem));
  }, []);

  const applyItems = useCallback((response) => {
    const cartItems = unwrap(response);
    if (Array.isArray(cartItems)) setItems(cartItems.map(toUiItem));
  }, []);

  const getOrCreateCartId = useCallback(async () => {
    const savedCartId = localStorage.getItem(CART_ID_STORAGE_KEY);
    if (savedCartId) return savedCartId;

    if (!createRequest.current) {
      createRequest.current = createCart(getBuyer(token), token)
        .then((response) => {
          const cart = unwrap(response);
          if (!cart?.id) throw new Error("Cart API did not return a cart id.");
          localStorage.setItem(CART_ID_STORAGE_KEY, cart.id);
          applyCart(cart);
          return cart.id;
        })
        .finally(() => {
          createRequest.current = null;
        });
    }
    return createRequest.current;
  }, [applyCart, token]);

  const refreshCart = useCallback(async () => {
    const cartId = localStorage.getItem(CART_ID_STORAGE_KEY);
    if (!cartId) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const [cartResponse, itemsResponse] = await Promise.all([
        getCart(cartId, token),
        getCartItems(cartId, token),
      ]);
      applyCart(cartResponse);
      applyItems(itemsResponse);
    } catch {
      localStorage.removeItem(CART_ID_STORAGE_KEY);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [applyCart, applyItems, token]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = useCallback(
    async (item, quantity = 1) => {
      try {
        const cartId = await getOrCreateCartId();
        const existing = items.find(
          (entry) => String(entry.variantId) === String(item.variantId),
        );
        const nextQuantity = Math.min(
          (existing?.quantity || 0) + quantity,
          item.availableUnits,
        );
        const response = existing
          ? await updateCartItem(
              cartId,
              existing.id,
              { quantity: nextQuantity },
              token,
            )
          : await addCartItem(
              cartId,
              {
                variant: item.variantId,
                quantity: Math.min(quantity, item.availableUnits),
              },
              token,
            );
        applyCart(response);
        await refreshCart();
      } catch (error) {
        console.error("Unable to add item to cart", error);
      }
    },
    [applyCart, getOrCreateCartId, items, refreshCart, token],
  );

  const changeQuantity = useCallback(
    async (productId, variantId, quantity) => {
      const item = items.find(
        (entry) =>
          String(entry.productId) === String(productId) &&
          String(entry.variantId) === String(variantId),
      );
      if (!item) return;
      try {
        const cartId = localStorage.getItem(CART_ID_STORAGE_KEY);
        if (quantity <= 0) {
          await deleteCartItem(cartId, item.id, token);
          setItems((current) =>
            current.filter((entry) => entry.id !== item.id),
          );
          return;
        }
        applyCart(await updateCartItem(cartId, item.id, { quantity }, token));
        await refreshCart();
      } catch (error) {
        console.error("Unable to update cart item", error);
      }
    },
    [applyCart, items, refreshCart, token],
  );

  const value = useMemo(
    () => ({
      items,
      loading,
      addToCart,
      removeFromCart: (productId, variantId) =>
        changeQuantity(productId, variantId, 0),
      updateQuantity: (productId, variantId, quantity) =>
        changeQuantity(productId, variantId, quantity),
      increaseQuantity: (productId, variantId) => {
        const item = items.find(
          (entry) =>
            String(entry.productId) === String(productId) &&
            String(entry.variantId) === String(variantId),
        );
        return (
          item &&
          changeQuantity(
            productId,
            variantId,
            Math.min(item.quantity + 1, item.availableUnits),
          )
        );
      },
      decreaseQuantity: (productId, variantId) => {
        const item = items.find(
          (entry) =>
            String(entry.productId) === String(productId) &&
            String(entry.variantId) === String(variantId),
        );
        return item && changeQuantity(productId, variantId, item.quantity - 1);
      },
      clearCart: async () => {
        const cartId = localStorage.getItem(CART_ID_STORAGE_KEY);
        if (!cartId) return;
        try {
          await clearCartItems(cartId, token);
          await deleteCart(cartId, token);
          localStorage.removeItem(CART_ID_STORAGE_KEY);
          setItems([]);
        } catch (error) {
          console.error("Unable to clear cart", error);
        }
      },
      isInCart: (productId, variantId) =>
        items.some(
          (item) =>
            String(item.productId) === String(productId) &&
            String(item.variantId) === String(variantId),
        ),
      getCartTotal: () =>
        items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      getCartItemCount: () =>
        items.reduce((sum, item) => sum + item.quantity, 0),
      refreshCart,
    }),
    [addToCart, changeQuantity, items, loading, refreshCart, token],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
