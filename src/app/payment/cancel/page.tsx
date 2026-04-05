import Link from "next/link"
import { XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function PaymentCancelPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6">
      <div className="w-full max-w-xl space-y-6 rounded-2xl border border-white/10 bg-slate-950/70 p-8 text-center text-white shadow-xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-500/15 text-rose-300">
          <XCircle className="h-7 w-7" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Payment canceled</h1>
          <p className="text-sm text-slate-300">
            No charge was made. You can retry the upgrade whenever you are ready.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href="/billing">Retry Upgrade</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
