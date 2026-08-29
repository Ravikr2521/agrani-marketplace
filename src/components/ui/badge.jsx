import { cn } from "@/lib/utils";
export const Badge = ({ className, variant = "default", ...p }) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold",
      variant === "success"
        ? "bg-light-blue text-primary"
        : variant === "warning"
          ? "bg-amber-100 text-amber-800"
          : variant === "muted"
            ? "bg-cream text-muted"
            : "bg-primary text-white",
      className,
    )}
    {...p}
  />
);
