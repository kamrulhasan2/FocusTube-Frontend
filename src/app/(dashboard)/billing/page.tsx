import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import BillingClient from "./BillingClient"

const BillingFallback = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-4 w-64" />
    </div>
    <div className="grid gap-6 lg:grid-cols-2">
      <Skeleton className="h-80 rounded-2xl" />
      <Skeleton className="h-80 rounded-2xl" />
    </div>
    <Skeleton className="h-40 rounded-2xl" />
  </div>
)

export default function BillingPage() {
  return (
    <Suspense fallback={<BillingFallback />}>
      <BillingClient />
    </Suspense>
  )
}
