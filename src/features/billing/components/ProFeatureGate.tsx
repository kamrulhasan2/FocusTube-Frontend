"use client"

import type { ReactNode } from "react"
import { useRouter } from "next/navigation"
import { Lock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/store/use-auth-store"

type ProFeatureGateProps = {
  children: ReactNode
  className?: string
  message?: string
  ctaLabel?: string
  isPro?: boolean
  onUpgrade?: () => void
}

export const ProFeatureGate = ({
  children,
  className,
  message = "Upgrade to Pro to unlock this feature",
  ctaLabel = "Upgrade",
  isPro,
  onUpgrade,
}: ProFeatureGateProps) => {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const hasPro = isPro ?? Boolean(user?.isPro)
  const isLocked = !hasPro

  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "transition-all",
          isLocked && "pointer-events-none select-none blur-sm"
        )}
      >
        {children}
      </div>
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl border border-white/10 bg-slate-950/60 backdrop-blur-sm">
          <div className="flex max-w-md flex-col items-center gap-3 px-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900/70 text-indigo-300">
              <Lock className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Pro Feature</h3>
              <p className="text-sm text-slate-300">{message}</p>
            </div>
            <Button
              onClick={() => {
                if (onUpgrade) {
                  onUpgrade()
                  return
                }
                router.push("/billing")
              }}
            >
              {ctaLabel}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
