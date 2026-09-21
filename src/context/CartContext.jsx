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
  deleteCartItem,
  getCart,
  updateCartItem,
} from "@/api/cart";
import { useAuth } from "@/context/AuthContext";

const CartContext = createContext(null);

const unwrap = (response) => response?.data ?? response;

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
    seller: item.seller?.user_name,
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

  const saveCart = useCallback(
    (response) => {
      const cart = unwrap(response);
      if (!cart?.id) throw new Error("Cart API did not return a cart id.");
      localStorage.setItem(CART_ID_STORAGE_KEY, cart.id);
      applyCart(cart);
      return cart.id;
    },
    [applyCart],
  );

  const getCartId = useCallback(() => {
    const savedCartId = localStorage.getItem(CART_ID_STORAGE_KEY);
    return savedCartId || null;
  }, []);

  const refreshCart = useCallback(async () => {
    const cartId = localStorage.getItem(CART_ID_STORAGE_KEY);
    if (!cartId) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      applyCart(await getCart(cartId, token));
    } catch {
      localStorage.removeItem(CART_ID_STORAGE_KEY);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [applyCart, token]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = useCallback(
    async (item, quantity = 1) => {
      try {
        const cartId = getCartId();
        const existing = items.find(
          (entry) => String(entry.variantId) === String(item.variantId),
        );
        const nextQuantity = Math.min(
          (existing?.quantity || 0) + quantity,
          item.availableUnits,
        );
        if (!cartId) {
          if (!createRequest.current) {
            createRequest.current = createCart(
              {
                items: [{ variant: item.variantId, quantity: nextQuantity }],
              },
              token,
            )
              .then(saveCart)
              .finally(() => {
                createRequest.current = null;
              });
          }
          await createRequest.current;
          return true;
        }

        const response = existing
          ? await updateCartItem(
              cartId,
              existing.id,
              // { items: [{ variant: item.variantId, quantity: nextQuantity }] },
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
        return true;
      } catch (error) {
        console.error("Unable to add item to cart", error);
        return false;
      }
    },
    [applyCart, getCartId, items, saveCart, token],
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
        const cartId = getCartId();
        if (quantity <= 0) {
          await deleteCartItem(cartId, item.id, token);
          setItems((current) =>
            current.filter((entry) => entry.id !== item.id),
          );
          return;
        }
        applyCart(
          await updateCartItem(
            cartId,
            item.id,
            // { items: [{ variant: item.variantId, quantity }] },
            { quantity: quantity },
            token,
          ),
        );
      } catch (error) {
        console.error("Unable to update cart item", error);
      }
    },
    [applyCart, getCartId, items, token],
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

        localStorage.removeItem(CART_ID_STORAGE_KEY);
        setItems([]);

        if (!cartId) return true;

        try {
          await clearCartItems(cartId, token);
          return true;
        } catch (error) {
          console.error("Unable to clear cart", error);
          return false;
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
