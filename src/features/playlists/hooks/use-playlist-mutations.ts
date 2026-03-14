"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { toast } from "sonner"

import { PlaylistService } from "../services/playlist.service"
import type { ImportPlaylistResponse } from "../types/import.types"

type ApiError = {
  message?: string
}

const resolveErrorStatus = (error: unknown) => {
  if (error instanceof AxiosError) {
    return error.response?.status
  }
  return undefined
}

export const useImportPlaylistMutation = () => {
  return useMutation<ImportPlaylistResponse, unknown, string>({
    mutationFn: async (url) => {
      const response = await PlaylistService.importPlaylist(url)
      return response.data
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.code === "ECONNABORTED") {
        toast.error("Request timed out. Please try again.")
        return
      }
      const status = resolveErrorStatus(error)
      if (status === 400) {
        toast.error("Please enter a valid YouTube playlist link.")
        return
      }
      if (status === 409) {
        toast.error("This playlist is already in your library.")
        return
      }
      if (status === 429) {
        toast.error("YouTube quota exceeded. Please try again later.")
        return
      }
      if (error instanceof AxiosError) {
        const data = error.response?.data as ApiError | undefined
        toast.error(data?.message || "Something went wrong. Please try again.")
        return
      }
      toast.error("Something went wrong. Please try again.")
    },
  })
}

export const useEnrollPlaylistMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<null, unknown, string>({
    mutationFn: async (playlist_id) => {
      const response = await PlaylistService.enrollPlaylist(playlist_id)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-library"] })
    },
    onError: (error) => {
      const status = resolveErrorStatus(error)
      if (status === 409) {
        toast.error("This playlist is already in your library.")
        return
      }
      if (error instanceof AxiosError) {
        const data = error.response?.data as ApiError | undefined
        toast.error(data?.message || "Something went wrong. Please try again.")
        return
      }
      toast.error("Something went wrong. Please try again.")
    },
  })
}
