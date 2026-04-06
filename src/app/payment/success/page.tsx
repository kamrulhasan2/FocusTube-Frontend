import Link from "next/link"
import { CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"

type PaymentSuccessPageProps = {
  searchParams?: { session_id?: string }
}

export default function PaymentSuccessPage({ searchParams }: PaymentSuccessPageProps) {
  const sessionId = searchParams?.session_id

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6">
      <div className="w-full max-w-xl space-y-6 rounded-2xl border border-white/10 bg-slate-950/70 p-8 text-center text-white shadow-xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Payment successful</h1>
          <p className="text-sm text-slate-300">
            Your subscription is active. You now have full access to FocusTube Pro features.
          </p>
          {sessionId && (
            <p className="text-xs text-slate-500">Session: {sessionId}</p>
          )}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href="/billing">Go to Billing</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
