import { apiClient } from "@/services/api-client"

import type {
  ApiResponse,
  VideoMetadata,
  VideoSummaryResponse,
} from "../types/video.types"

export const VideoService = {
  getVideoMetadata: async (
    videoId: string
  ): Promise<ApiResponse<VideoMetadata>> => {
    const response = await apiClient.get<ApiResponse<VideoMetadata>>(
      `/videos/${videoId}`
    )
    return response.data
  },
  generateSummary: async (
    videoId: string
  ): Promise<ApiResponse<VideoSummaryResponse>> => {
    const response = await apiClient.post<ApiResponse<VideoSummaryResponse>>(
      `/videos/${videoId}/summary`
    )
    return response.data
  },
}
