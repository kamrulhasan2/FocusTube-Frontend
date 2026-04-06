export type BillingInterval = "month" | "year"

export type BillingPaymentStatus = "succeeded" | "failed" | "pending"

export interface BillingPlan {
  _id: string
  name: string
  price: number
  interval: BillingInterval
  features: string[]
}

export interface BillingCheckoutRequest {
  plan_id: string
}

export interface BillingCheckoutData {
  checkout_url: string
}

export interface BillingHistoryItem {
  _id: string
  amount: number
  currency: string
  payment_status: BillingPaymentStatus
  created_at: string
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}
