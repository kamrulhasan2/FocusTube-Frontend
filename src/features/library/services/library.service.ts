import { apiClient } from "@/services/api-client"

import type {
  ApiResponse,
  LibraryContinueWatchingItem,
  LibraryPlaylistProgressItem,
} from "../types/library.types"

export const LibraryService = {
  getMyLibrary: async (): Promise<
    ApiResponse<LibraryPlaylistProgressItem[]>
  > => {
    const response = await apiClient.get("/library/my-playlists")
    return response.data
  },
  getContinueWatching: async (): Promise<
    ApiResponse<LibraryContinueWatchingItem | null>
  > => {
    const response = await apiClient.get("/library/continue-watching")
    return response.data
  },
}
