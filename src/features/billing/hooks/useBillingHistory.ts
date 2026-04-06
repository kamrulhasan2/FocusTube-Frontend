"use client"

import { useQuery } from "@tanstack/react-query"

import { BillingService } from "../services/billing.service"
import type { BillingHistoryItem } from "../types/billing.types"

export const useBillingHistory = () => {
  const query = useQuery({
    queryKey: ["billing", "history"],
    queryFn: () => BillingService.getBillingHistory(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })

  const history: BillingHistoryItem[] = query.data?.data ?? []

  return {
    history,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  }
}
