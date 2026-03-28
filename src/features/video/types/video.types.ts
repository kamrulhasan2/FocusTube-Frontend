export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface VideoSummaryResponse {
  cacheHit: boolean
  summary: string
}
