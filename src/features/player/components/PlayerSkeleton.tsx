import { Skeleton } from "@/components/ui/skeleton"

export function PlayerSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[3fr_1fr]">
      <div className="space-y-4">
        <Skeleton className="aspect-video w-full rounded-xl bg-slate-900/60" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-9 w-28 rounded-md bg-slate-900/60" />
          <Skeleton className="h-5 w-40 rounded-md bg-slate-900/60" />
          <Skeleton className="h-9 w-28 rounded-md bg-slate-900/60" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-6 w-48 rounded-md bg-slate-900/60" />
          <Skeleton className="h-24 w-full rounded-xl bg-slate-900/60" />
        </div>
      </div>
      <div className="space-y-3">
        <Skeleton className="h-5 w-24 rounded-md bg-slate-900/60" />
        <Skeleton className="h-[520px] w-full rounded-xl bg-slate-900/60" />
      </div>
    </div>
  )
}
