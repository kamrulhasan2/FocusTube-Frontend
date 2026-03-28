export interface PlaylistThumbnail {
  url: string
  width: number
  height: number
}

export type PlaylistThumbnailSource = PlaylistThumbnail | string

export interface PlaylistThumbnailSet {
  default?: PlaylistThumbnailSource
  medium?: PlaylistThumbnailSource
  high?: PlaylistThumbnailSource
  standard?: PlaylistThumbnailSource
  maxres?: PlaylistThumbnailSource
}

export interface LibraryPlaylistProgressItem {
  enrollment_id: string
  playlist_id: string
  youtubePlaylistId: string
  title: string
  description?: string
  channelTitle: string
  thumbnails: PlaylistThumbnailSet
  enrollment_status: string
  enrolled_at: string
  total_videos: number
  completed_videos: number
  progress_percentage: number
}

export interface LibraryContinueWatchingItem {
  video_id: string
  playlist_id: string
  last_watched_second: number
  video_title: string
  thumbnail: string
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}
