"use client"

import { useQuery } from "@tanstack/react-query"
import { Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/store/use-auth-store"

import { useCheckout } from "../hooks/useCheckout"
import { BillingService } from "../services/billing.service"
import type { BillingPlan } from "../types/billing.types"

const freeFeatures = [
  "Basic playlist imports",
  "Focused video player",
  "Timestamped notes",
  "Standard progress tracking",
]

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price)

const resolveProPlan = (plans: BillingPlan[]) => {
  if (!plans.length) return null
  return plans.find((plan) => plan.name.toLowerCase().includes("pro")) || plans[0]
}

export const PricingTable = () => {
  const user = useAuthStore((state) => state.user)
  const isPro = Boolean(user?.isPro)
  const checkout = useCheckout()

  const plansQuery = useQuery({
    queryKey: ["billing", "plans"],
    queryFn: () => BillingService.getPlans(),
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  })

  const plans = plansQuery.data?.data ?? []
  const proPlan = resolveProPlan(plans)

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white">Pricing</h2>
        <p className="text-sm text-slate-400">
          Choose the plan that matches your learning intensity.
        </p>
      </div>

      {plansQuery.isLoading ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <Skeleton key={index} className="h-105 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="bg-slate-950/80">
            <CardHeader>
              <CardTitle>Free</CardTitle>
              <CardDescription>Everything you need to start learning.</CardDescription>
              <div className="pt-4 text-4xl font-semibold text-white">
                {formatPrice(0)}
                <span className="text-sm font-medium text-slate-400">/mo</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-3 text-sm text-slate-300">
                {freeFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-400" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full" disabled>
                Current Plan
              </Button>
            </CardContent>
          </Card>

          <Card
            className={cn(
              "relative overflow-hidden border-indigo-500/70 bg-linear-to-br from-slate-950/90 via-slate-900/80 to-slate-950/90 shadow-[0_0_30px_rgba(99,102,241,0.25)]",
              !proPlan && "opacity-70"
            )}
          >
            <div className="absolute right-6 top-6 rounded-full border border-indigo-400/50 bg-indigo-500/20 px-3 py-1 text-xs font-semibold uppercase text-indigo-200">
              Most Popular
            </div>
            <CardHeader>
              <CardTitle>Pro</CardTitle>
              <CardDescription>Unlock deep focus and AI acceleration.</CardDescription>
              <div className="pt-4 text-4xl font-semibold text-white">
                {formatPrice(proPlan?.price ?? 49)}
                <span className="text-sm font-medium text-slate-400">
                  /{proPlan?.interval ?? "mo"}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-3 text-sm text-slate-200">
                {(proPlan?.features?.length
                  ? proPlan.features
                  : [
                      "Unlimited playlist imports",
                      "AI summaries & insights",
                      "Advanced analytics",
                      "Priority processing",
                    ]
                ).map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-400" />
                    {feature}
                  </li>
                ))}
              </ul>
                <Button
                  className="w-full"
                  onClick={() => {
                  if (proPlan?._id) {
                    checkout.mutate({ plan_id: proPlan._id })
                  }
                }}
                disabled={isPro || !proPlan?._id || checkout.isPending}
                >
                {isPro ? "Current Plan" : "Upgrade to Pro"}
                </Button>
                {!proPlan?._id && (
                  <p className="text-xs text-slate-400">
                    No active billing plan is configured yet.
                  </p>
                )}
            </CardContent>
          </Card>
        </div>
      )}
    </section>
  )
}
