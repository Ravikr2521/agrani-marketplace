import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Edit2,
  ImageOff,
  LockKeyhole,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { getBuyerMobileNumber } from "@/utils/mobileNumber";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useOrderApi } from "@/api/orders";
import { useCart } from "@/context/CartContext";
import { MobileNumberContext } from "@/context/MobileNumberContext";
import { useOrder } from "@/context/OrderContext";
import { formatINR } from "@/lib/utils";
import confetti from "canvas-confetti";
import { toast } from "sonner";

function CheckoutSteps({ step }) {
  const steps = [
    { label: "Review", key: 1 },
    { label: "Details", key: 2 },
    { label: "Done", key: 3 },
  ];

  return (
    <div className="px-4 py-3 sm:px-5">
      <div className="flex items-center">
        {steps.map(({ label, key }, index) => {
          const isDone = step > key;
          const isActive = step === key;

          return (
            <div
              key={key}
              className={`flex items-center ${
                index < steps.length - 1 ? "flex-1" : ""
              }`}
            >
              <div className="flex shrink-0 flex-col items-center gap-1">
                <div
                  className={`
                    flex h-7 w-7 items-center justify-center
                    rounded-full border-[1.5px] text-[10px] font-bold
                    transition-all duration-300
                    ${
                      isDone
                        ? "border-primary bg-primary text-white"
                        : isActive
                          ? "border-emerald-700 bg-light-blue text-primary"
                          : "border-border bg-white text-muted"
                    }
                  `}
                >
                  {isDone ? <CheckCircle2 className="h-3.5 w-3.5" /> : key}
                </div>

                <span
                  className={`
                    text-[10px] font-medium whitespace-nowrap
                    transition-colors duration-300
                    ${
                      isDone
                        ? "text-primary"
                        : isActive
                          ? "font-semibold text-primary"
                          : "text-muted"
                    }
                  `}
                >
                  {label}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`
                    mx-2 mb-4 h-0.5 flex-1 rounded-full
                    transition-colors duration-300
                    ${step > key ? "bg-primary" : "bg-border"}
                  `}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function validPhone(value) {
  return /^[6-9]\d{9}$/.test(value);
}

function validPin(value) {
  return /^[1-9]\d{5}$/.test(value);
}

export default function Cart() {
  const {
    items,
    getCartTotal,
    getCartItemCount,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();
  const { createOrder } = useOrderApi();

  const { saveOrder } = useOrder();
  const { requireMobileNumber, getCurrentMobile } =
    useContext(MobileNumberContext);

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [isMobileLocked, setIsMobileLocked] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    pincode: "",
  });

  const [errors, setErrors] = useState({});
  const [confirmedSummary, setConfirmedSummary] = useState({
    count: 0,
    total: 0,
  });

  const total = getCartTotal();
  const count = getCartItemCount();

  useEffect(() => {
    const savedPhone = getBuyerMobileNumber();

    if (savedPhone) {
      setForm((current) => ({
        ...current,
        phone: savedPhone,
      }));
      setIsMobileLocked(true);
    }
  }, []);

  const updateForm = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: "",
    }));
  };

  useEffect(() => {
    if (step === 3) {
      confetti({
        particleCount: 120,
        spread: 80,
        startVelocity: 40,
        origin: { y: 0.6 },
        zIndex: 9999,
      });
    }
  }, [step]);

  const validate = () => {
    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "Name is required";
    }

    if (!validPhone(form.phone)) {
      nextErrors.phone = "Enter a valid 10-digit mobile number";
    }

    if (!form.address.trim()) {
      nextErrors.address = "Delivery address is required";
    }

    if (!validPin(form.pincode)) {
      nextErrors.pincode = "Enter a valid 6-digit pincode";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const placeOrder = async () => {
    const verifiedMobile = getBuyerMobileNumber();
    if (!verifiedMobile) {
      toast.error("Mobile number verification required", {
        description: "Please verify your mobile number before placing order",
      });
      return;
    }

    if (form.phone !== verifiedMobile) {
      toast.error("Mobile number mismatch", {
        description: "Please use your verified mobile number",
      });
      return;
    }

    if (!validate() || submitting || items.length === 0) {
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        products: items.map((item) => ({
          no_of_units: item.quantity,
          variant: item.variantId,
        })),
        delivery_address: form.address.trim(),
        delivery_pincode: form.pincode,
        receiver_name: form.name.trim(),
        receiver_phone: form.phone,
        buyer_phone: verifiedMobile,
      };

      const response = await createOrder(payload);

      if (!response?.data) {
        throw new Error(response?.message || "Order was not created.");
      }

      saveOrder(response.data);

      setConfirmedSummary({
        count,
        total,
      });

      clearCart();

      setStep(3);
    } catch (error) {
      toast.error("Failed to place order", {
        description: error.message || "Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuantityDecrease = (item) => {
    decreaseQuantity(item.productId, item.variantId);
  };

  const handleQuantityIncrease = (item) => {
    increaseQuantity(item.productId, item.variantId);
  };

  return (
    <main className="mx-auto flex h-full max-w-180 flex-col overflow-hidden">
      <div className="sticky top-0 z-10 flex items-center gap-3  border border-stone-200 bg-white px-4 py-3 sm:px-5">
        <div
          className="
            grid
            h-10
            w-10
            shrink-0
            place-items-center
            rounded-xl
            bg-amber-600/80
            text-white
            shadow-sm
            sm:h-10
            sm:w-10
            sm:rounded-2xl
          "
        >
          {step === 3 ? (
            <CheckCircle2 className="h-4.5 w-4.5" />
          ) : (
            <ShoppingBag className="h-4.5 w-4.5" />
          )}
        </div>

        <div className="min-w-0">
          <h1 className="truncate text-lg font-bold tracking-tight text-body-dark sm:text-[18px]">
            {step === 1 && "Your Cart"}
            {step === 2 && "Delivery Details"}
            {step === 3 && "Order Confirmed"}
          </h1>

          <p className="truncate text-xs text-muted sm:text-[13px]">
            {step === 1 && (
              <>
                {count} item{count === 1 ? "" : "s"} in your basket
              </>
            )}

            {step === 2 && "Enter your delivery information"}

            {step === 3 && "Your order has been placed successfully"}
          </p>
        </div>
      </div>

      {items.length === 0 && step !== 3 ? (
        <div className="px-3 flex justify-center items-center h-full bg-[#fffdf8]">
          <div
            className="
            flex
            flex-col
            items-center
            justify-center
            rounded-2xl
            border
            border-border/80
            bg-white
            px-8
            py-16
            text-center
          "
          >
            <div className="h-40 w-40">
              <img src="/images/empty-cart.png" alt="Empty Cart" />
            </div>

            <h3 className="text-2xl font-bold tracking-tight text-body-dark">
              Your cart is empty
            </h3>

            <p className="mt-2 max-w-xs text-sm leading-6 text-muted">
              Pick a fresh variant from the marketplace and it will appear here.
            </p>

            <Button
              asChild
              size="lg"
              className="
              mt-6
              h-11
              rounded-xl
              px-6
              font-semibold
              shadow-sm
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:shadow-md
            "
            >
              <Link to="/">
                Browse Produce
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden border  border-border/80 bg-[#fffdf8]">
          <div className="shrink-0 border-b border-border/80">
            <CheckoutSteps step={step} />
          </div>

          {step === 1 && (
            <>
              <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-5 ">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-body-dark">
                      Review your order
                    </h2>

                    <p className="mt-0.5 text-xs text-muted">
                      Check your items before continuing.
                    </p>
                  </div>

                  <span
                    className="
                      rounded-full
                      bg-light-blue
                      px-2.5
                      py-1
                      text-[11px]
                      font-semibold
                      text-primary
                    "
                  >
                    {count} item{count !== 1 ? "s" : ""}
                  </span>
                </div>

                <div className="space-y-3">
                  {items.map((item) => {
                    const quantity = Number(item.quantity);
                    const availableUnits = Number(item.availableUnits);

                    const itemTotal = Number(item.price) * quantity;

                    const maxReached = quantity >= availableUnits;

                    return (
                      <div
                        key={`${item.productId}-${item.variantId}`}
                        className="
                          rounded-2xl
                          border
                          border-border
                          bg-white
                          p-3
                          shadow-sm
                        "
                      >
                        <div className="flex min-w-0 gap-3">
                          <div
                            className="
                              h-16
                              w-16
                              shrink-0
                              overflow-hidden
                              rounded-xl
                              border
                              border-border/70
                              bg-cream
                              sm:h-20
                              sm:w-20
                            "
                          >
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.productName}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-linear-to-br from-primary/8 via-cream to-orange-100/70 px-1 text-center text-primary">
                                <span className="grid h-7 w-7 place-items-center rounded-lg bg-white/80 shadow-xs sm:h-8 sm:w-8">
                                  <ImageOff className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                </span>
                                <span className="text-[8px] font-semibold leading-none sm:text-[9px]">
                                  No image
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start gap-2">
                              <div className="min-w-0 flex-1">
                                <div className="flex gap-2">
                                  <Link
                                    to={`/products/${item.productId}`}
                                    className="
                                      block
                                      truncate
                                      text-sm
                                      font-bold
                                      text-body-dark
                                      hover:text-primary
                                    "
                                  >
                                    {item.productName}
                                  </Link>

                                  <p className="mt-0.5 truncate text-xs font-semibold text-primary">
                                    ( {item.variantName || "Standard"} )
                                  </p>
                                </div>

                                <p className="mt-1 truncate text-[11px] text-muted">
                                  {item.packQuantity} {item.packUnit}
                                  <span className="mx-1 text-muted">•</span>
                                  {item.seller}
                                </p>
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  removeFromCart(item.productId, item.variantId)
                                }
                                className="
                                  grid
                                  h-7
                                  w-7
                                  shrink-0
                                  place-items-center
                                  rounded-lg
                                  text-muted
                                  hover:bg-red-50
                                  hover:text-red-600
                                  active:scale-90
                                "
                                aria-label={`Remove ${item.productName}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>

                            <div className="mt-3 flex items-center justify-between gap-2">
                              <div
                                className="
                                  inline-flex
                                  h-7
                                  items-center
                                  overflow-hidden
                                  rounded-lg
                                  border
                                  border-border
                                  bg-white
                                "
                              >
                                <button
                                  type="button"
                                  disabled={quantity <= 1}
                                  onClick={() => handleQuantityDecrease(item)}
                                  className="
                                    grid
                                    h-7
                                    w-7
                                    place-items-center
                                    text-muted
                                    hover:bg-cream
                                    disabled:opacity-30
                                  "
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="h-3.5 w-3.5" />
                                </button>

                                <span
                                  className="
                                    grid
                                    h-7
                                    min-w-7
                                    place-items-center
                                    border-x
                                    border-border
                                    px-1
                                    text-xs
                                    font-bold
                                    text-body-dark
                                  "
                                >
                                  {quantity}
                                </span>

                                <button
                                  type="button"
                                  disabled={maxReached}
                                  onClick={() => handleQuantityIncrease(item)}
                                  className="
                                    grid
                                    h-7
                                    w-7
                                    place-items-center
                                    text-muted
                                    hover:bg-cream
                                    disabled:cursor-not-allowed
                                    disabled:opacity-30
                                  "
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                </button>
                              </div>

                              <span className="truncate text-sm font-bold text-body-dark">
                                {formatINR(itemTotal)}
                              </span>
                            </div>

                            {maxReached && (
                              <p className="mt-1.5 text-[10px] font-medium text-amber-600">
                                Maximum available quantity reached
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div
                className="
                  sticky
                  bottom-0
                  shrink-0
                  rounded-b-2xl
                  border-t
                  border-border/80
                  bg-[#fffdf8]
                  px-4
                  py-3
                  shadow-[0_-10px_25px_rgba(0,0,0,0.06)]
                  sm:px-5
                "
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted">Items</span>

                  <span className="text-sm font-semibold text-body-light">
                    {count}
                  </span>
                </div>

                <div className="mt-1.5 flex items-center justify-between">
                  <span className="text-base font-semibold text-body-dark">
                    Subtotal
                  </span>

                  <span className="text-xl font-bold tracking-tight text-body-dark sm:text-2xl">
                    {formatINR(total)}
                  </span>
                </div>

                <p className=" text-right text-[10px] text-muted">
                  Taxes and delivery charges may apply
                </p>

                <Button
                  type="button"
                  size="lg"
                  className="
                    mt-3
                    h-11
                    w-full
                    rounded-xl
                    text-sm
                    font-bold
                    shadow-sm
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:shadow-lg
                  "
                  onClick={() => {
                    const verifiedMobile = getBuyerMobileNumber();

                    if (verifiedMobile) {
                      setStep(2);
                    } else {
                      requireMobileNumber((mobile) => {
                        setForm((current) => ({ ...current, phone: mobile }));
                        setIsMobileLocked(true);
                        setStep(2);
                      });
                    }
                  }}
                >
                  Continue to delivery
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <form
                className="flex-1 overflow-y-auto"
                onSubmit={(event) => {
                  event.preventDefault();
                  placeOrder();
                }}
              >
                <div className="px-4 py-4 sm:px-5">
                  <div className="mb-5">
                    <h2 className="text-base font-bold text-body-dark">
                      Delivery details
                    </h2>

                    <p className="mt-0.5 text-xs text-muted">
                      Where should we deliver your order?
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div>
                        <label className="mb-1.5 block text-sm font-semibold text-body-light">
                          Your name <span className="text-red-500">*</span>
                        </label>

                        <Input
                          value={form.name}
                          onChange={(event) =>
                            updateForm("name", event.target.value)
                          }
                          placeholder="Full name"
                          autoComplete="name"
                          className="h-11 rounded-xl"
                        />

                        {errors.name && (
                          <p className="mt-1 text-xs text-red-600">
                            {errors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <div className="mb-1.5 flex items-center justify-between">
                          <label className="block text-sm font-semibold text-body-light">
                            Mobile number{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          {isMobileLocked && (
                            <button
                              type="button"
                              onClick={() => {
                                requireMobileNumber((mobile) => {
                                  setForm((current) => ({
                                    ...current,
                                    phone: mobile,
                                  }));
                                });
                              }}
                              className="flex items-center gap-1 text-xs text-primary hover:underline"
                            >
                              <Edit2 className="h-3 w-3" />
                              Change
                            </button>
                          )}
                        </div>

                        <Input
                          inputMode="numeric"
                          maxLength={10}
                          value={form.phone}
                          onChange={(event) => {
                            if (!isMobileLocked) {
                              updateForm(
                                "phone",
                                event.target.value
                                  .replace(/\D/g, "")
                                  .slice(0, 10),
                              );
                            }
                          }}
                          placeholder="10-digit number"
                          autoComplete="tel"
                          className="h-11 rounded-xl"
                          disabled={isMobileLocked}
                        />

                        {errors.phone && (
                          <p className="mt-1 text-xs text-red-600">
                            {errors.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-body-light">
                        Delivery address <span className="text-red-500">*</span>
                      </label>

                      <Textarea
                        value={form.address}
                        onChange={(event) =>
                          updateForm("address", event.target.value)
                        }
                        placeholder="House / flat no., street, locality"
                        autoComplete="street-address"
                        className="min-h-25 resize-none rounded-xl"
                      />

                      {errors.address && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.address}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-body-light">
                        Pincode <span className="text-red-500">*</span>
                      </label>

                      <Input
                        inputMode="numeric"
                        maxLength={6}
                        value={form.pincode}
                        onChange={(event) =>
                          updateForm(
                            "pincode",
                            event.target.value.replace(/\D/g, "").slice(0, 6),
                          )
                        }
                        placeholder="6-digit pincode"
                        className="h-11 rounded-xl"
                      />

                      {errors.pincode && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.pincode}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 flex items-center gap-2 rounded-xl bg-light-blue px-3 py-2.5 text-xs text-primary">
                    <LockKeyhole className="h-4 w-4 shrink-0" />
                    Your delivery information is securely handled.
                  </div>
                </div>
              </form>

              <div
                className="
                  sticky
                  bottom-0
                  shrink-0
                  rounded-b-2xl
                  border-t
                  border-border/80
                  bg-[#fffdf8]
                  px-4
                  py-3
                  shadow-[0_-10px_25px_rgba(0,0,0,0.06)]
                  sm:px-5
                "
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm text-muted">Order total</span>

                  <span className="text-lg font-bold text-body-dark">
                    {formatINR(total)}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 flex-1 rounded-xl"
                    onClick={() => {
                      setErrors({});
                      setStep(1);
                    }}
                  >
                    <ArrowLeft className="mr-1.5 h-4 w-4" />
                    Back
                  </Button>

                  <Button
                    type="button"
                    className="h-11 flex-[1.5] rounded-xl font-bold"
                    disabled={submitting}
                    onClick={placeOrder}
                  >
                    {submitting ? "Placing order..." : "Place Order"}
                  </Button>
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="flex-1 overflow-y-auto px-4 py-8 sm:px-6">
                <div className="mx-auto flex w-full max-w-sm flex-col items-center text-center">
                  <div className="h-30 w-30 ">
                    <img
                      src="/images/check.jpg"
                      alt="Order Confirmed"
                      className="mix-blend-multiply"
                    />
                  </div>

                  <h2 className="mt-4 text-xl font-black tracking-tight text-body-dark">
                    Order confirmed!
                  </h2>

                  <p className="mt-2 max-w-xs text-sm leading-6 text-muted">
                    Thank you for your order. We've received it and will start
                    preparing it shortly.
                  </p>

                  <div className="mt-7 w-full overflow-hidden rounded-2xl border border-orange-100 bg-white text-left shadow-xs">
                    <div className="flex items-center justify-between gap-3 px-4 py-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-light-blue text-primary">
                          <ShoppingBag className="h-4 w-4" />
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs font-medium text-muted">
                            Order summary
                          </p>

                          <p className="mt-0.5 text-sm font-bold text-body-dark">
                            {confirmedSummary.count} item
                            {confirmedSummary.count !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>

                      <span className="shrink-0 text-lg font-black tracking-wide text-body-dark">
                        {formatINR(confirmedSummary.total)}
                      </span>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 divide-x divide-stone-200 bg-cream/70">
                      <div className="px-4 py-3">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                          Items
                        </p>

                        <p className="mt-1 text-sm font-bold text-body-light">
                          {confirmedSummary.count}
                        </p>
                      </div>

                      <div className="px-4 py-3">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                          Status
                        </p>

                        <p className="mt-1 text-sm font-bold text-primary">
                          Order placed
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex w-full items-start gap-3 rounded-2xl bg-light-blue/70 px-4 py-3 text-left">
                    <CheckCircle2 className=" h-4 w-4 shrink-0 text-primary" />

                    <div>
                      <p className="text-xs font-bold text-primary">
                        What's next?
                      </p>

                      <p className="mt-1 text-[11px] text-primary/80">
                        Your order has been received and will be prepared for
                        delivery.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="
                  sticky
                  bottom-0
                  shrink-0
                  rounded-b-2xl
                  border-t
                  border-border/80
                  bg-[#fffdf8]
                  px-4
                  py-3
                  shadow-[0_-8px_20px_rgba(0,0,0,0.04)]
                  sm:px-5
                "
              >
                <Button
                  asChild
                  size="lg"
                  className=" h-11 w-full rounded-xl font-bold shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <Link to="/">
                    Continue Shopping
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
