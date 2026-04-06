"use client"

import { format } from "date-fns"

import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

import { useBillingHistory } from "../hooks/useBillingHistory"

const statusStyles: Record<string, string> = {
  succeeded: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  failed: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  pending: "bg-amber-500/15 text-amber-300 border-amber-500/30",
}

const formatCurrency = (amount: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount)

export const BillingHistory = () => {
  const { history, isLoading } = useBillingHistory()

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-white">Billing History</h2>
        <p className="text-sm text-slate-400">
          Track your recent payments and subscription status.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/70">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-white/10 text-slate-400">
              <tr>
                <th className="px-4 py-3 font-medium">Plan</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading &&
                Array.from({ length: 3 }).map((_, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-32" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-20" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-24" />
                    </td>
                  </tr>
                ))}

              {!isLoading && history.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                    No transactions yet.
                  </td>
                </tr>
              )}

              {!isLoading &&
                history.map((item) => (
                  <tr key={item._id} className="text-slate-200">
                    <td className="px-4 py-3 font-medium">
                      {"FocusTube Pro"}
                    </td>
                    <td className="px-4 py-3">
                      {formatCurrency(item.amount, item.currency)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase",
                          statusStyles[item.payment_status] || statusStyles.pending
                        )}
                      >
                        {item.payment_status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {format(new Date(item.created_at), "MMM dd, yyyy")}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
