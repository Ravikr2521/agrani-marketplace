import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { formatINR } from "@/lib/utils";
export default function CartSummary() {
  const { getCartTotal, getCartItemCount } = useCart();
  const total = getCartTotal();
  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-xs">
      <div className="flex justify-between text-sm">
        <span className="text-muted">Items</span>
        <span className="font-medium">{getCartItemCount()}</span>
      </div>
      <div className="mt-3 flex justify-between text-sm">
        <span className="text-muted">Subtotal</span>
        <span className="font-medium">{formatINR(total)}</span>
      </div>
      <Separator className="my-4" />
      <div className="flex justify-between">
        <span className="font-semibold">Total</span>
        <span className="text-xl font-extrabold">{formatINR(total)}</span>
      </div>
      <Button asChild className="mt-5 w-full">
        <Link to="/checkout">
          Proceed to Checkout <ArrowRight />
        </Link>
      </Button>
    </div>
  );
}
