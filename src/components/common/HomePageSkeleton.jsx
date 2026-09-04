import { Skeleton } from "@/components/ui/skeleton";

export default function HomePageSkeleton({ count = 8 }) {
  return (
    <div className="grid min-w-0 grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="min-w-0">
          {/* Mobile */}
          <div className="overflow-hidden rounded-2xl border border-border/70 bg-white shadow-xs md:hidden">
            <div className="p-1.5">
              <Skeleton className="aspect-3/2 w-full rounded-xl" />
            </div>

            <div className="flex flex-col gap-1.5 p-2.5 pt-1.5">
              <Skeleton className="h-3.5 w-4/5 rounded-md" />

              <Skeleton className="h-5 w-20 rounded-md" />

              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-4 w-14 rounded-md" />
                  <Skeleton className="h-2.5 w-16 rounded-md" />
                </div>

                <Skeleton className="h-7 w-7 shrink-0 rounded-lg" />
              </div>
            </div>
          </div>

          {/* Desktop */}
          <div className="hidden overflow-hidden rounded-2xl border border-border/70 bg-white shadow-xs md:block">
            <div className="p-2">
              <Skeleton className="aspect-3/2 w-full rounded-xl" />
            </div>

            <div className="flex flex-col px-4 pb-4">
              <Skeleton className="h-4.5 w-3/4 rounded-md" />

              <Skeleton className="mt-2 h-6 w-28 rounded-lg" />

              <div className="my-3 h-px bg-border/60" />

              <div className="flex items-end justify-between gap-3">
                <div className="flex flex-col gap-1.5">
                  <Skeleton className="h-5 w-16 rounded-md" />
                  <Skeleton className="h-3 w-20 rounded-md" />
                </div>

                <Skeleton className="h-9 w-28 shrink-0 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
