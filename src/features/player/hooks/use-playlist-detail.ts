"use client"

import { useQuery } from "@tanstack/react-query"

import { PlaylistDetailService } from "../services/playlist.service"

export const usePlaylistDetail = (playlistId?: string) => {
  const query = useQuery({
    queryKey: ["playlist-detail", playlistId],
    queryFn: async () => {
      if (!playlistId) {
        throw new Error("Playlist id is required")
      }
      const response = await PlaylistDetailService.getPlaylistDetail(playlistId)
      return response.data
    },
    enabled: Boolean(playlistId),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })

  const errorMessage =
    query.error instanceof Error ? query.error.message : undefined

  return {
    playlist: query.data,
    videos: query.data?.videos ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    errorMessage,
  }
}
