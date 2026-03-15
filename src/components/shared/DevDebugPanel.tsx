"use client"

import { useEffect, useState } from "react"
import Cookies from "js-cookie"

import { CONFIG } from "@/config/configEnv"
import { cn } from "@/lib/utils"

export function DevDebugPanel() {
  const [open, setOpen] = useState(false)
  const [debug, setDebug] = useState({
    cookieToken: null as string | null,
    storageToken: null as string | null,
    stateToken: null as string | null,
    userEmail: null as string | null,
    isAuthenticated: false,
  })

  useEffect(() => {
    if (typeof window === "undefined") return
    const cookieToken = Cookies.get(CONFIG.auth.cookieName) ?? null
    const storageToken =
      window.localStorage.getItem(CONFIG.storageKeys.authToken) ?? null
    let stateToken: string | null = null
    let userEmail: string | null = null
    let isAuthenticated = false

    try {
      const raw = window.localStorage.getItem(CONFIG.storageKeys.authState)
      if (raw) {
        const parsed = JSON.parse(raw) as {
          state?: {
            token?: string | null
            user?: { email?: string }
            isAuthenticated?: boolean
          }
        }
        stateToken = parsed?.state?.token ?? null
        userEmail = parsed?.state?.user?.email ?? null
        isAuthenticated = Boolean(parsed?.state?.isAuthenticated)
      }
    } catch {
      // ignore malformed state
    }

    setDebug({
      cookieToken,
      storageToken,
      stateToken,
      userEmail,
      isAuthenticated,
    })
  }, [open])

  if (process.env.NODE_ENV === "production") return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-full border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-medium text-slate-200 shadow-lg transition hover:bg-slate-800"
      >
        {open ? "Hide Debug" : "Dev Debug"}
      </button>
      <div
        className={cn(
          "mt-3 w-[320px] rounded-xl border border-slate-800 bg-slate-950/95 p-4 text-xs text-slate-200 shadow-xl backdrop-blur",
          open ? "block" : "hidden"
        )}
      >
        <div className="space-y-2">
          <div>
            <p className="font-semibold text-white">Auth</p>
            <p>Authenticated: {String(debug.isAuthenticated)}</p>
            <p>User: {debug.userEmail || "none"}</p>
            <p>State token: {debug.stateToken ? "present" : "missing"}</p>
            <p>Cookie token: {debug.cookieToken ? "present" : "missing"}</p>
            <p>Storage token: {debug.storageToken ? "present" : "missing"}</p>
          </div>
          <div>
            <p className="font-semibold text-white">Config</p>
            <p>API Base: {CONFIG.api.baseUrl}</p>
            <p>Cookie Name: {CONFIG.auth.cookieName}</p>
            <p>Token Key: {CONFIG.storageKeys.authToken}</p>
            <p>State Key: {CONFIG.storageKeys.authState}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
