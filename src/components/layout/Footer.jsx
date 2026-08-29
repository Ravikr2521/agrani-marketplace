import { Sprout } from "lucide-react";
export default function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-white">
      <div className="mx-auto flex max-w-350  gap-4 px-4 py-3 sm:px-6  items-center justify-between lg:px-8">
        <div>
          <div className="flex items-center gap-2 font-bold text-emerald-950">
            <Sprout className="h-5 w-5" /> Agrani
          </div>
          {/* <p className="mt-1 text-sm text-muted">
            Fresh produce from verified farmers.
          </p> */}
        </div>
        <p className="text-xs text-muted">
          © {new Date().getFullYear()} Agrani Marketplace
        </p>
      </div>
    </footer>
  );
}
