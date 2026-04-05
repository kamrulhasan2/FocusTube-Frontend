import { apiClient } from "@/services/api-client"

import type {
  ApiResponse,
  BillingCheckoutData,
  BillingCheckoutRequest,
  BillingHistoryItem,
  BillingPlan,
} from "../types/billing.types"

export const BillingService = {
  getPlans: async (): Promise<ApiResponse<BillingPlan[]>> => {
    const response = await apiClient.get("/billing/plans")
    return response.data as ApiResponse<BillingPlan[]>
  },
  checkout: async (
    payload: BillingCheckoutRequest
  ): Promise<ApiResponse<BillingCheckoutData>> => {
    const response = await apiClient.post("/billing/checkout", payload)
    return response.data as ApiResponse<BillingCheckoutData>
  },
  getBillingHistory: async (): Promise<ApiResponse<BillingHistoryItem[]>> => {
    const response = await apiClient.get("/billing/history")
    return response.data as ApiResponse<BillingHistoryItem[]>
  },
}
