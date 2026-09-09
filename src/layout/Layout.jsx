import OtpGateModal from "@/components/auth/OtpGateModal";
import ScrollToTop from "@/components/common/ScrollToTop";
import Header from "@/components/layout/Header";
import { MobileNumberContext } from "@/context/MobileNumberContext";
import { useContext } from "react";
import { Outlet, useSearchParams } from "react-router-dom";
import { Toaster } from "sonner";

export default function Layout() {
  const { showOtpGate, handleOtpVerified, handleOtpClose } =
    useContext(MobileNumberContext);
  const [searchParams] = useSearchParams();
  const paramHideHeader = searchParams.get("showHeader") === "false";

  if (paramHideHeader) {
    sessionStorage.setItem("hideHeader", "true");
  }
  const hideHeader =
    paramHideHeader || sessionStorage.getItem("hideHeader") === "true";

  console.log(hideHeader, "boolean");

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background text-foreground">
      <ScrollToTop />

      {!hideHeader && <Header />}

      <main
        className={`min-h-0 flex-1 overflow-y-auto pb-16 md:pb-0 ${hideHeader ? "md:pt-0" : "md:pt-18"}  md:bg-[#f7f7f9b7]`}
      >
        <div
          className={`mx-auto h-full w-full ${hideHeader ? "max-w-full" : "max-w-350"} px-0`}
        >
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
