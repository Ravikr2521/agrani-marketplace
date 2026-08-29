import {
  ShoppingBag,
  ClipboardList,
  Home,
  Package,
  UserRoundCogIcon,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import { useCart } from "@/context/CartContext";

export default function Header() {
  const { getCartItemCount } = useCart();

  const [cartOpen, setCartOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [cartAnimating, setCartAnimating] = useState(false);

  const location = useLocation();

  const count = getCartItemCount();
  const previousCount = useRef(count);

  useEffect(() => {
    if (count > previousCount.current) {
      setCartAnimating(true);

      const timer = setTimeout(() => {
        setCartAnimating(false);
      }, 650);

      previousCount.current = count;

      return () => clearTimeout(timer);
    }

    previousCount.current = count;
  }, [count]);

  return (
    <>
      <style>
        {`
          @keyframes cart-pop {
            0% {
              transform: scale(1) translateY(0);
            }
            25% {
              transform: scale(1.18) translateY(-3px);
            }
            45% {
              transform: scale(0.94) translateY(1px);
            }
            65% {
              transform: scale(1.08) translateY(-1px);
            }
            100% {
              transform: scale(1) translateY(0);
            }
          }

          @keyframes cart-badge {
            0% {
              transform: scale(0.4);
              opacity: 0;
            }
            45% {
              transform: scale(1.25);
              opacity: 1;
            }
            70% {
              transform: scale(0.92);
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }

          @keyframes cart-ring {
            0% {
              transform: scale(0.7);
              opacity: 0.5;
            }
            70% {
              transform: scale(1.45);
              opacity: 0;
            }
            100% {
              transform: scale(1.45);
              opacity: 0;
            }
          }
        `}
      </style>

      <nav className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl border-t border-border bg-white md:hidden">
        <div className="mx-auto flex h-16 max-w-350 items-center justify-around px-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 px-4 py-2 transition-colors ${
                isActive ? "text-primary" : "text-muted hover:text-body-dark"
              }`
            }
          >
            <Home className="h-5 w-5" />
            <span className="text-xs font-medium">Home</span>
          </NavLink>

          <NavLink
            to="/category"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 px-4 py-2 transition-colors ${
                isActive ? "text-primary" : "text-muted hover:text-body-dark"
              }`
            }
          >
            <Package className="h-5 w-5" />
            <span className="text-xs font-medium">Category</span>
          </NavLink>

          <NavLink
            to="/orders"
            className={`flex flex-col items-center justify-center gap-1 px-4 py-2 transition-colors ${
              location.pathname.startsWith("/orders") || ordersOpen
                ? "text-primary"
                : "text-muted hover:text-body-dark"
            }`}
          >
            <ClipboardList className="h-5 w-5" />
            <span className="text-xs font-medium">Orders</span>
          </NavLink>

          <NavLink
            to="/cart"
            className={`flex flex-col items-center justify-center gap-1 px-4 py-2 transition-colors ${
              location.pathname.startsWith("/cart") || cartOpen
                ? "text-primary"
                : "text-muted hover:text-body-dark"
            }`}
          >
            <div className="relative">
              {cartAnimating && (
                <span
                  className="pointer-events-none absolute inset-0 rounded-full border-2 border-primary/40"
                  style={{
                    animation: "cart-ring 650ms cubic-bezier(.2,.8,.2,1)",
                  }}
                />
              )}

              <ShoppingBag
                className={`h-5 w-5 transition-transform ${
                  cartAnimating ? "text-primary" : ""
                }`}
                style={
                  cartAnimating
                    ? {
                        animation: "cart-pop 650ms cubic-bezier(.2,.8,.2,1)",
                      }
                    : undefined
                }
              />

              {count > 0 && (
                <span
                  className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-0.5 text-[8px] font-bold text-white"
                  style={
                    cartAnimating
                      ? {
                          animation:
                            "cart-badge 450ms cubic-bezier(.2,.8,.2,1)",
                        }
                      : undefined
                  }
                >
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </div>

            <span className="text-xs font-medium">Cart</span>
          </NavLink>

          <NavLink
            to="/seller"
            className={`flex flex-col items-center justify-center gap-1 px-4 py-2 transition-colors ${
              location.pathname.startsWith("/seller") || ordersOpen
                ? "text-primary"
                : "text-muted hover:text-body-dark"
            }`}
          >
            <UserRoundCogIcon className="h-5 w-5" />
            <span className="text-xs font-medium">Seller</span>
          </NavLink>
        </div>
      </nav>
    </>
  );
}
