"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { BillingHistory } from "@/features/billing/components/BillingHistory"
import { PricingTable } from "@/features/billing/components/PricingTable"

export default function BillingPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const queryClient = useQueryClient()

  useEffect(() => {
    const success = searchParams.get("success")
    const canceled = searchParams.get("canceled")

    if (!success && !canceled) return

    if (success) {
      toast.success("Payment successful")
      void queryClient.invalidateQueries({ queryKey: ["billing"] })
    }

    if (canceled) {
      toast.info("Payment canceled")
    }

    router.replace("/billing")
  }, [queryClient, router, searchParams])

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-white">Billing</h1>
        <p className="text-sm text-slate-400">
          View your subscription and payment history.
        </p>
      </div>
      <PricingTable />
      <BillingHistory />
    </div>
  )
}
