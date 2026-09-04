import { cn } from "@/lib/utils";
export const Skeleton = ({ className, ...p }) => (
  <div
    className={cn("animate-pulse rounded-xl bg-gray-100", className)}
    {...p}
  />
);
