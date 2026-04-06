"use client"

import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { toast } from "sonner"

import { BillingService } from "../services/billing.service"
import type { BillingCheckoutRequest } from "../types/billing.types"

type ApiError = {
  message?: string
}

const resolveCheckoutErrorMessage = (error: unknown) => {
  const status =
    error instanceof AxiosError
      ? error.response?.status
      : (error as { response?: { status?: number } })?.response?.status

  if (status === 400) return "Invalid plan selected."
  if (status === 401) return "Please sign in to continue."
  if (status === 403) return "You already have an active subscription."
  if (status === 500) return "Server error. Please try again."

  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiError | undefined
    return data?.message || "Something went wrong."
  }

  if (error instanceof Error && error.message) return error.message
  return "Something went wrong."
}

export const useCheckout = () => {
  return useMutation({
    mutationFn: (payload: BillingCheckoutRequest) =>
      BillingService.checkout(payload),
    onSuccess: (response) => {
      const url = response.data?.checkout_url
      if (!url) {
        toast.error("Unable to start checkout. Please try again.")
        return
      }
      toast.success("Redirecting to secure payment...")
      window.location.href = url
    },
    onError: (error) => {
      toast.error(resolveCheckoutErrorMessage(error))
    },
  })
}
