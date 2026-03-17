export type ThumbnailSource = { url: string } | string

export interface ThumbnailSet {
  default?: ThumbnailSource
  medium?: ThumbnailSource
  high?: ThumbnailSource
  standard?: ThumbnailSource
  maxres?: ThumbnailSource
}

export interface Video {
  id: string
  youtubeVideoId?: string
  title: string
  description?: string
  thumbnails: ThumbnailSet
  duration?: string
  is_completed?: boolean
}

export interface Playlist {
  id: string
  title: string
  description?: string
  channelTitle: string
  videos: Video[]
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface PlaylistApiVideo {
  _id?: string
  id?: string
  youtubeVideoId?: string
  title: string
  description?: string
  thumbnails?: ThumbnailSet
  duration?: string
  is_completed?: boolean
}

export interface PlaylistApi {
  _id?: string
  id?: string
  youtubePlaylistId?: string
  title: string
  description?: string
  channelTitle: string
  videos?: PlaylistApiVideo[]
}

export type PlayerHandle = {
  getCurrentTime?: () => number
  pauseVideo?: () => void
  seekTo?: (seconds: number, allowSeekAhead?: boolean) => void
}
