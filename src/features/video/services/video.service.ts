import { apiClient } from "@/services/api-client"

import type { ApiResponse, VideoSummaryResponse } from "../types/video.types"

export const VideoService = {
  generateSummary: async (
    videoId: string
  ): Promise<ApiResponse<VideoSummaryResponse>> => {
    const response = await apiClient.post<ApiResponse<VideoSummaryResponse>>(
      `/videos/${videoId}/summary`
    )
    return response.data
  },
}
