import { Dialog, DialogContent } from "@/components/ui/dialog";
import OtpGate from "./OtpGate";

export default function OtpGateModal({ open, onOpenChange, onVerified }) {
  const handleVerified = (mobileNumber) => {
    onVerified(mobileNumber);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <OtpGate onVerified={handleVerified} />
      </DialogContent>
    </Dialog>
  );
}
