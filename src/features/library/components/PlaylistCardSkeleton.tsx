import { Skeleton } from "@/components/ui/skeleton"

export function PlaylistCardSkeleton() {
  return (
    <div className="flex h-full flex-col gap-4 rounded-xl border border-slate-800 bg-slate-900 p-4">
      <div className="relative overflow-hidden rounded-lg border border-slate-800 bg-slate-950/70">
        <div className="relative w-full pb-[56.25%]">
          <Skeleton className="absolute inset-0" />
        </div>
      </div>

      <div className="space-y-3">
        <div className="space-y-2">
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="h-4 w-2/5" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    </div>
  )
}
