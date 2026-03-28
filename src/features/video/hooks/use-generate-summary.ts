"use client"

import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { toast } from "sonner"

import { VideoService } from "../services/video.service"
import type { VideoSummaryResponse } from "../types/video.types"

type ApiError = {
  message?: string
}

export const resolveSummaryErrorStatus = (error: unknown) => {
  if (error instanceof AxiosError) {
    return error.response?.status
  }
  return (error as { response?: { status?: number } })?.response?.status
}

export const resolveSummaryErrorMessage = (error: unknown) => {
  const status = resolveSummaryErrorStatus(error)
  if (status === 404) {
    return "Transcript not found. Please try again later."
  }
  if (status === 403) {
    return "Enroll in this playlist to unlock AI summaries."
  }
  if (status === 502) {
    return "AI service is currently unavailable."
  }
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiError | undefined
    return data?.message || "Something went wrong"
  }
  return "Something went wrong"
}

export const useGenerateSummary = (videoId: string) => {
  return useMutation<VideoSummaryResponse, unknown, void>({
    mutationFn: async () => {
      if (!videoId) {
        throw new Error("Missing video id.")
      }
      const response = await VideoService.generateSummary(videoId)
      return response.data
    },
    onSuccess: (data) => {
      if (data.cacheHit) {
        toast.success("Loaded from cache ⚡")
        return
      }
      toast.success("AI Summary generated ✨")
    },
    onError: (error) => {
      toast.error(resolveSummaryErrorMessage(error))
    },
  })
}
