import { apiClient } from "@/services/api-client"

import type {
  ApiResponse,
  LibraryPlaylistProgressItem,
} from "../types/library.types"

export const LibraryService = {
  getMyLibrary: async (): Promise<
    ApiResponse<LibraryPlaylistProgressItem[]>
  > => {
    const response = await apiClient.get("/library/my-playlists")
    return response.data
  },
}
