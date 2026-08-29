import ScrollToTop from "@/components/common/ScrollToTop";
import Header from "@/components/layout/Header";
import { Toaster } from "@/components/ui/sonner";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background text-foreground">
      <ScrollToTop />
      <Header />

      <main className="min-h-0 flex-1 overflow-y-auto pb-16 md:pb-0">
        <div className="mx-auto h-full w-full max-w-350 px-0 md:px-0">
          <Outlet />
        </div>
      </main>

      {/* <Toaster position="top-center" richColors closeButton /> */}
    </div>
  );
}
