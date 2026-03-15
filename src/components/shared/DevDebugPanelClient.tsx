"use client"

import { useEffect, useState } from "react"

import { DevDebugPanel } from "@/components/shared/DevDebugPanel"

export function DevDebugPanelClient() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return <DevDebugPanel />
}
