import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingSkeleton({ count = 8 }) {
  return (
    <div className="grid min-w-0 grid-cols-2 gap-2.5 xs:gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-xl border border-border/80 bg-white shadow-xs sm:rounded-2xl"
        >
          <div className="p-1.5 sm:p-2">
            <Skeleton className="aspect-2/1 w-full rounded-xl" />
          </div>

          <div className="px-2.5 pb-2.5 pt-1.5 sm:flex sm:flex-col sm:gap-3 sm:p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <Skeleton className="h-3.5 w-3/4 rounded-md sm:h-5 sm:w-2/3" />
                <Skeleton className="mt-1.5 h-2.5 w-1/2 rounded-md sm:h-3.5 sm:w-1/3" />
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between gap-2 sm:mt-1">
              <Skeleton className="h-7 w-20 rounded-lg sm:h-10 sm:w-full" />

              <Skeleton className="h-7 w-7 shrink-0 rounded-lg sm:hidden" />

              <Skeleton className="hidden h-8 w-20 shrink-0 rounded-xl sm:block" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
