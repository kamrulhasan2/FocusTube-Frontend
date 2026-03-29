"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { apiClient } from "@/services/api-client"
import type { ApiResponse, LibraryPlaylistProgressItem } from "@/features/library/types/library.types"

type UpdateProgressPayload = {
  playlistId: string
  videoId: string
  watchedSecond: number
}

type UpdateProgressResponse = {
  success: boolean
  message: string
  data: unknown
}

export const useUpdateProgress = () => {
  const queryClient = useQueryClient()

  return useMutation<
    UpdateProgressResponse,
    unknown,
    UpdateProgressPayload,
    { previousLibrary?: ApiResponse<LibraryPlaylistProgressItem[]> }
  >({
    mutationFn: async (payload) => {
      const body = {
        video_id: payload.videoId,
        playlist_id: payload.playlistId,
        watched_second: payload.watchedSecond,
      }
      const response = await apiClient.patch<UpdateProgressResponse>(
        "/library/progress",
        body
      )
      return response.data
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["my-library"] })
      const previousLibrary = queryClient.getQueryData<
        ApiResponse<LibraryPlaylistProgressItem[]>
      >(["my-library"])

      if (previousLibrary?.data?.length) {
        const nextData = previousLibrary.data.map((item) => {
          if (item.playlist_id !== variables.playlistId) return item
          const nextProgress =
            variables.watchedSecond > 0
              ? Math.max(item.progress_percentage || 0, 1)
              : item.progress_percentage || 0
          return {
            ...item,
            progress_percentage: nextProgress,
          }
        })
        queryClient.setQueryData(["my-library"], {
          ...previousLibrary,
          data: nextData,
        })
      }

      return { previousLibrary }
    },
    onError: (_error, _variables, context) => {
      if (context?.previousLibrary) {
        queryClient.setQueryData(["my-library"], context.previousLibrary)
      }
      toast.error("Failed to sync progress")
    },
    retry: 2,
  })
}
