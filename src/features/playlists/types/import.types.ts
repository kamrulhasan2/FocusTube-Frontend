export interface ImportPlaylistResponse {
  cacheHit?: boolean
  playlist: {
    _id: string
    youtubePlaylistId: string
    title: string
    description?: string
    channelTitle: string
    thumbnails: {
      default?: { url: string } | string
      medium?: { url: string } | string
      high?: { url: string } | string
      maxres?: { url: string } | string
    }
  }
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}
