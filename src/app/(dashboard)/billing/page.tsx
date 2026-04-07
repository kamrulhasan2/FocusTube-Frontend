import { Suspense } from "react"

import { BillingClient } from "./BillingClient"

export default function BillingPage() {
  return (
    <Suspense fallback={null}>
      <BillingClient />
    </Suspense>
  )
}
