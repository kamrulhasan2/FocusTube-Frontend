import { apiClient } from "@/services/api-client"

import type { ApiResponse, ImportPlaylistResponse } from "../types/import.types"

export const PlaylistService = {
  importPlaylist: async (
    url: string
  ): Promise<ApiResponse<ImportPlaylistResponse>> => {
    const response = await apiClient.post(
      "/playlists/import",
      { url }
    )
    return response.data
  },
  enrollPlaylist: async (playlist_id: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.post("/library/enroll", { playlist_id })
    return response.data
  },
}
