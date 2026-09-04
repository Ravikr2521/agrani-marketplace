import OtpGateModal from "@/components/auth/OtpGateModal";
import ScrollToTop from "@/components/common/ScrollToTop";
import Header from "@/components/layout/Header";
import { Toaster } from "@/components/ui/sonner";
import { MobileNumberContext } from "@/context/MobileNumberContext";
import { useContext } from "react";
import { Outlet } from "react-router-dom";

export default function Layout() {
  const { showOtpGate, handleOtpVerified, handleOtpClose } =
    useContext(MobileNumberContext);

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background text-foreground">
      <ScrollToTop />

      <Header />

      <main className="min-h-0 flex-1 overflow-y-auto pb-16 md:pb-0 md:pt-18 md:bg-[#f7f7f9b7]">
        <div className="mx-auto h-full w-full max-w-350 px-0">
          <Outlet />
        </div>
      </main>

      {/* <div className="md:block hidden">
        <Footer />
      </div> */}

      <div className="hidden md:block">
        <Toaster position="bottom-right" richColors closeButton />
      </div>

      <OtpGateModal
        open={showOtpGate}
        onOpenChange={handleOtpClose}
        onVerified={handleOtpVerified}
      />
    </div>
  );
}
