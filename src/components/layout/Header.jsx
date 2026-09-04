import {
  ShoppingBag,
  ClipboardList,
  Home,
  Package,
  UserRoundCogIcon,
  Heart,
  HeartIcon,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import AgraniLogo from "../../../public/images/logo.svg";

import { useCart } from "@/context/CartContext";
import CartDrawer from "@/components/cart/CartDrawer";

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

  const isOrdersActive = location.pathname.startsWith("/orders") || ordersOpen;

  const isCartActive = location.pathname.startsWith("/cart") || cartOpen;

  const isSellerActive = location.pathname.startsWith("/seller") || ordersOpen;

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

      {/* Desktop Header */}
      <header className="fixed left-0 right-0 top-0 z-50 hidden border-b border-border bg-white/95 backdrop-blur-sm supports-backdrop-filter:bg-white/80 md:flex">
        <div className="mx-auto flex h-16 w-full max-w-350 items-center px-4 sm:px-6 lg:px-8">
          <div className="relative flex w-full items-center justify-between">
            <NavLink to="/" className="group flex shrink-0 items-center">
              <img
                src={AgraniLogo}
                alt="Agrani Marketplace"
                className="h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </NavLink>

            <div className="absolute left-1/2 flex h-full -translate-x-1/2 items-center gap-1 lg:gap-3">
              <NavLink
                to="/category"
                className={({ isActive }) =>
                  `group relative flex h-full items-center gap-2 px-3 text-sm font-medium transition-colors lg:px-4 ${
                    isActive
                      ? "text-primary"
                      : "text-muted hover:text-body-dark"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="relative">
                      <Package
                        className={`h-4 w-4 transition-all duration-300 ${
                          isActive
                            ? "scale-110 text-primary"
                            : "group-hover:scale-110 group-hover:text-primary"
                        }`}
                      />

                      {isActive && (
                        <span className="absolute -inset-1 rounded-full animate-pulse" />
                      )}
                    </div>

                    <span className="font-medium">Category</span>

                    <span
                      className={`absolute bottom-0 top-8 left-[53%] h-0.5 w-18 -translate-x-1/2 rounded-full bg-primary transition-all duration-300 ease-out ${
                        isActive
                          ? "scale-100 opacity-100"
                          : "scale-50 opacity-0"
                      }`}
                    />
                  </>
                )}
              </NavLink>

              <NavLink
                to="/orders"
                className={`group relative flex h-full items-center gap-2 px-3 text-sm font-medium transition-colors lg:px-4 ${
                  isOrdersActive
                    ? "text-primary"
                    : "text-muted hover:text-body-dark"
                }`}
              >
                <div className="relative">
                  <ClipboardList
                    className={`h-4 w-4 transition-all duration-300 ${
                      isOrdersActive
                        ? "scale-110 text-primary"
                        : "group-hover:scale-110 group-hover:text-primary"
                    }`}
                  />

                  {isOrdersActive && (
                    <span className="absolute -inset-1 rounded-full animate-pulse" />
                  )}
                </div>

                <span className="font-medium">Orders</span>

                <span
                  className={`absolute bottom-0 top-8 left-[53%] h-0.5 w-18 -translate-x-1/2 rounded-full bg-primary transition-all duration-300 ease-out ${
                    isOrdersActive
                      ? "scale-100 opacity-100"
                      : "scale-50 opacity-0"
                  }`}
                />
              </NavLink>

              {/* <NavLink
                to="/seller"
                className={`group relative flex h-full items-center gap-2 px-3 text-sm font-medium transition-colors lg:px-4 ${
                  isSellerActive
                    ? "text-primary"
                    : "text-muted hover:text-body-dark"
                }`}
              >
                <div className="relative">
                  <UserRoundCogIcon
                    className={`h-4 w-4 transition-all duration-300 ${
                      isSellerActive
                        ? "scale-110 text-primary"
                        : "group-hover:scale-110 group-hover:text-primary"
                    }`}
                  />

                  {isSellerActive && (
                    <span className="absolute -inset-1 animate-pulse" />
                  )}
                </div>

                <span className="font-medium">Seller</span>

                <span
                  className={`absolute bottom-0 top-8 left-[53%] h-0.5 w-18 -translate-x-1/2 rounded-full bg-primary transition-all duration-300 ease-out ${
                    isSellerActive
                      ? "scale-100 opacity-100"
                      : "scale-50 opacity-0"
                  }`}
                />   
              </NavLink> */}
            </div>

            <div className="ml-auto flex h-full items-center gap-1 ">
              <NavLink
                to="/wishlist"
                className={({ isActive }) =>
                  `group relative flex h-full items-center  text-sm font-medium transition-colors  ${
                    isActive
                      ? "text-primary"
                      : "text-muted hover:text-body-dark"
                  }`
                }
                aria-label="Wishlist"
              >
                {({ isActive }) => (
                  <>
                    <div className="relative">
                      <Heart
                        className={`h-5 w-5 transition-all duration-300 ${
                          isActive
                            ? "scale-110 fill-red-500 text-red-500"
                            : "group-hover:scale-110 group-hover:text-red-500"
                        }`}
                      />

                      {isActive && (
                        <span className="absolute -inset-1 rounded-full animate-pulse" />
                      )}
                    </div>

                    <span
                      className={`absolute bottom-0 top-6.5 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-primary transition-all duration-300 ease-out ${
                        isActive
                          ? "scale-100 opacity-100"
                          : "scale-50 opacity-0"
                      }`}
                    />
                  </>
                )}
              </NavLink>
              <button
                type="button"
                onClick={() => setCartOpen(true)}
                className={`group relative flex h-full items-center gap-2 px-3 text-sm font-medium transition-colors lg:px-4 ${
                  isCartActive
                    ? "text-primary"
                    : "text-muted hover:text-body-dark"
                }`}
                aria-label="Cart"
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

                  <div className="relative">
                    <ShoppingBag
                      className={`h-5 w-5 transition-all duration-300 ${
                        cartAnimating
                          ? "text-primary"
                          : isCartActive
                            ? "scale-110 text-primary"
                            : "group-hover:scale-110 group-hover:text-primary"
                      }`}
                      style={
                        cartAnimating
                          ? {
                              animation:
                                "cart-pop 650ms cubic-bezier(.2,.8,.2,1)",
                            }
                          : undefined
                      }
                    />

                    {count > 0 && (
                      <span
                        className="absolute -right-2 -top-2.5 grid h-4 min-w-4 place-items-center rounded-full bg-orange-500 text-[10px] font-semibold text-white shadow-sm"
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
                </div>

                {/* <span className="font-medium">Cart</span> */}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header  */}
      <nav className="fixed -bottom-1.5 left-0 right-0 z-50 rounded-t-2xl border-t border-border bg-white md:hidden">
        <div className="mx-auto flex h-17 max-w-350 items-center justify-around px-2">
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
            to="/wishlist"
            className={`flex flex-col items-center justify-center gap-1 px-4 py-2 transition-colors ${
              location.pathname.startsWith("/wishlist") || ordersOpen
                ? "text-primary"
                : "text-muted hover:text-body-dark"
            }`}
          >
            <HeartIcon className="h-5 w-5" />
            <span className="text-xs font-medium">Wishlist</span>
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

          {/* <NavLink
            to="/seller"
            className={`flex flex-col items-center justify-center gap-1 px-4 py-2 transition-colors ${
              location.pathname.startsWith("/seller") || ordersOpen
                ? "text-primary"
                : "text-muted hover:text-body-dark"
            }`}
          >
            <UserRoundCogIcon className="h-5 w-5" />
            <span className="text-xs font-medium">Seller</span>
          </NavLink> */}
        </div>
      </nav>

      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </>
  );
}
