export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface VideoSummaryResponse {
  cacheHit: boolean
  summary: string
}

export interface VideoMetadata {
  _id: string
  youtubeVideoId: string
  playlistId?: string | null
  title: string
  description?: string
  duration?: string
  thumbnails?: {
    default?: string
    medium?: string
    high?: string
    standard?: string
    maxres?: string
  }
}
