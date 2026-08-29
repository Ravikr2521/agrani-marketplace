import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  LockKeyhole,
  Minus,
  Plus,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import CheckoutSteps from "@/components/checkout/CheckoutSteps";
import { useCart } from "@/context/CartContext";
import { useOrder } from "@/context/OrderContext";
import { createOrder } from "@/api/orders";
import { formatINR } from "@/lib/utils";
import { toast } from "sonner";

function validPhone(v) {
  return /^[6-9]\d{9}$/.test(v);
}
function validPin(v) {
  return /^[1-9]\d{5}$/.test(v);
}
export default function Checkout() {
  const { items, getCartTotal, increaseQuantity, decreaseQuantity, clearCart } =
    useCart();
  const { saveOrder } = useOrder();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    pincode: "",
  });
  const [errors, setErrors] = useState({});
  const total = getCartTotal();
  const itemCount = items.reduce((s, i) => s + i.quantity, 0);
  useEffect(() => {
    const saved = localStorage.getItem("farmers_marketplace_buyer_phone");
    if (saved) setForm((f) => ({ ...f, phone: saved }));
  }, []);
  const canContinue = items.length > 0;
  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!validPhone(form.phone))
      e.phone = "Enter a valid 10-digit Indian mobile number";
    if (!form.address.trim()) e.address = "Delivery address is required";
    if (!validPin(form.pincode)) e.pincode = "Enter a valid 6-digit pincode";
    setErrors(e);
    return !Object.keys(e).length;
  };
  const place = async () => {
    if (!validate() || submitting) return;
    setSubmitting(true);
    try {
      const payload = {
        products: items.map((i) => ({
          no_of_units: i.quantity,
          variant: i.variantId,
          product: i.productId,
        })),
        delivery_address: form.address.trim(),
        delivery_pincode: form.pincode,
        buyer_name: form.name.trim(),
        buyer_phone: form.phone,
      };
      const response = await createOrder(payload);
      if (!response?.data)
        throw new Error(response?.message || "Order was not created.");
      localStorage.setItem("farmers_marketplace_buyer_phone", form.phone);
      saveOrder(response.data);
      clearCart();
      window.scrollTo(0, 0);
      navigate("/order-success");
    } catch (e) {
      toast.error("Failed to place order", {
        description: e.message || "Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };
  if (!canContinue)
    return (
      <main className="mx-auto max-w-3xl px-4 py-10 text-center">
        <ShoppingBag className="mx-auto h-10 w-10 text-primary" />
        <h1 className="mt-4 text-2xl font-black">Your cart is empty</h1>
        <p className="mt-2 text-muted">Add products before checking out.</p>
        <Button asChild className="mt-5">
          <Link to="/products">Browse products</Link>
        </Button>
      </main>
    );
  return (
    <main className="">
      <div className="mx-auto max-w-280 ">
        <div className="flex items-center justify-between">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" /> Cart
          </Link>
          <div className="hidden items-center gap-2 text-xs text-muted sm:flex">
            <LockKeyhole className="h-3.5 w-3.5" /> Secure checkout
          </div>
        </div>
        <div className="mt-4 grid gap-5 lg:grid-cols-[1fr_360px] lg:items-start">
          <section className="min-w-0 overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
            <div className="border-b border-border">
              <div className="px-5 pt-5 sm:px-6">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-orange-50 text-orange-700">
                    <ShoppingBag className="h-5 w-5" />
                  </span>
                  <div>
                    <h1 className="text-xl font-black">Checkout</h1>
                    <p className="text-xs text-muted">
                      {step === 1
                        ? "Review your order"
                        : step === 2
                          ? "Enter delivery details"
                          : "Order confirmed"}
                    </p>
                  </div>
                </div>
              </div>
              <CheckoutSteps step={step} />
            </div>
            {step === 1 && (
              <div className="p-5 sm:p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex w-full justify-between items-center">
                    <h2 className="font-bold">Review order</h2>

                    <Badge variant="success">
                      {itemCount} item{itemCount !== 1 ? "s" : ""}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={`${item.productId}-${item.variantId}`}
                      className="flex items-center gap-3 rounded-xl border border-border bg-white p-3"
                    >
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-cream">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.productName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="grid h-full w-full place-items-center text-xs text-muted">
                            No image
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold text-body-dark">
                          {item.productName}
                        </div>
                        <div className="truncate text-xs text-muted">
                          {item.variantName || "Standard"} · {item.packQuantity}{" "}
                          {item.packUnit}
                        </div>
                        <div className="text-xs text-muted">
                          Seller: {item.seller}
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <div className="text-sm font-bold text-body-dark">
                          {formatINR(item.price * item.quantity)}
                        </div>
                        <div className="text-xs text-muted">
                          {item.quantity} × {formatINR(item.price)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  className="mt-6 w-full"
                  size="lg"
                  onClick={() => setStep(2)}
                >
                  Continue to delivery
                </Button>
              </div>
            )}
            {step === 2 && (
              <form
                className="p-5 sm:p-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  place();
                }}
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold">
                      Your name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      placeholder="Full name"
                      autoComplete="name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold">
                      Mobile number <span className="text-red-500">*</span>
                    </label>
                    <Input
                      inputMode="numeric"
                      maxLength={10}
                      value={form.phone}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                        })
                      }
                      placeholder="10-digit number"
                      autoComplete="tel"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-semibold">
                      Delivery address <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      value={form.address}
                      onChange={(e) =>
                        setForm({ ...form, address: e.target.value })
                      }
                      placeholder="House / flat no., street, locality"
                      autoComplete="street-address"
                    />
                    {errors.address && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.address}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold">
                      Pincode <span className="text-red-500">*</span>
                    </label>
                    <Input
                      inputMode="numeric"
                      maxLength={6}
                      value={form.pincode}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          pincode: e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 6),
                        })
                      }
                      placeholder="6-digit pincode"
                    />
                    {errors.pincode && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.pincode}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-6 flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-[1.5]"
                    disabled={submitting}
                  >
                    {submitting ? "Placing order…" : "Place Order"}
                  </Button>
                </div>
              </form>
            )}
          </section>
          <aside className="order-first lg:order-last">
            <div className="rounded-2xl border border-border bg-white p-5 shadow-xs lg:sticky lg:top-24">
              <div className="flex items-center justify-between">
                <h2 className="font-bold">Order summary</h2>
                <Badge variant="muted">{itemCount} items</Badge>
              </div>
              <div className="mt-4 space-y-3">
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.variantId}`}
                    className="flex justify-between gap-3 text-sm"
                  >
                    <div className="min-w-0">
                      <div className="truncate font-medium">
                        {item.productName}
                      </div>
                      <div className="text-xs text-muted">
                        {item.quantity} × {formatINR(item.price)}
                      </div>
                    </div>
                    <span className="font-semibold">
                      {formatINR(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <div className="flex items-center justify-between">
                <span className="font-semibold">Total</span>
                <span className="text-2xl font-black">{formatINR(total)}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
