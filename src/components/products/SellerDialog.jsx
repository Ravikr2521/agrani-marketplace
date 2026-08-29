import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { UserRound, Phone, Mail, BadgeCheck } from "lucide-react";

export default function SellerDialog({ seller, open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-lg overflow-hidden rounded-2xl border border-border bg-cream p-0 shadow-2xl sm:rounded-2xl">
        <div className="border-b border-border bg-white px-5 py-4 sm:px-6 sm:py-2">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-orange-100 text-orange-700">
              <UserRound className="h-4 w-4" />
            </div>

            <div className="min-w-0">
              <DialogTitle className="truncate text-md font-semibold text-body-dark sm:text-xl">
                {seller?.user_name || "Farmer"}
              </DialogTitle>

              <DialogDescription className="-mt-0.5 text- text-muted">
                Seller information
              </DialogDescription>
            </div>
          </div>
        </div>

        <div className="px-5 py-5 sm:px-6 sm:py-6">
          <div className="rounded-xl border border-border bg-white">
            <div className="flex items-center gap-3 px-4 py-3.5">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-cream text-muted">
                <Phone className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium text-muted">Mobile</p>

                <p className="mt-0.5 truncate text-sm font-semibold text-body-dark">
                  {seller?.user_mobile || "Not available"}
                </p>
              </div>
            </div>

            <Separator />

            <div className="flex items-center gap-3 px-4 py-3.5">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-cream text-muted">
                <Mail className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium text-muted">Email</p>

                <p className="mt-0.5 break-all text-sm font-semibold text-body-dark">
                  {seller?.email || "Not available"}
                </p>
              </div>
            </div>

            {seller?.user_id && (
              <>
                <Separator />

                <div className="flex items-center gap-3 px-4 py-3.5">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-cream text-muted">
                    <BadgeCheck className="h-4 w-4" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-medium text-muted">
                      Seller ID
                    </p>

                    <p className="mt-0.5 break-all font-mono text-xs font-medium text-body-light">
                      {seller.user_id}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
