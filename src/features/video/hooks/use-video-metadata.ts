"use client"

import { useQuery } from "@tanstack/react-query"

import { VideoService } from "../services/video.service"

export const useVideoMetadata = (videoId?: string) => {
  const query = useQuery({
    queryKey: ["video-metadata", videoId],
    queryFn: async () => {
      if (!videoId) {
        throw new Error("Video id is required")
      }
      const response = await VideoService.getVideoMetadata(videoId)
      return response.data
    },
    enabled: Boolean(videoId),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })

  return {
    video: query.data,
    isLoading: query.isLoading,
  }
}
