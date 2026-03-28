import { apiClient } from "@/services/api-client"

import type {
  ApiResponse,
  Playlist,
  PlaylistApi,
  ThumbnailSet,
  ThumbnailSource,
  Video,
} from "../types/player.types"

type PlaylistApiVideo = NonNullable<PlaylistApi["videos"]>[number]

const resolveThumbnail = (source: ThumbnailSource | undefined) => {
  if (!source) return undefined
  if (typeof source === "string") return { url: source }
  if (typeof source === "object" && "url" in source) {
    return { url: source.url }
  }
  return undefined
}

const normalizeThumbnails = (thumbnails?: ThumbnailSet): ThumbnailSet => ({
  default: resolveThumbnail(thumbnails?.default),
  medium: resolveThumbnail(thumbnails?.medium),
  high: resolveThumbnail(thumbnails?.high),
  standard: resolveThumbnail(thumbnails?.standard),
  maxres: resolveThumbnail(thumbnails?.maxres),
})

const normalizeVideo = (video: PlaylistApiVideo): Video => ({
  id: video._id || video.id || video.youtubeVideoId || "",
  mongoId: video._id,
  youtubeVideoId: video.youtubeVideoId,
  title: video.title,
  description: video.description,
  thumbnails: normalizeThumbnails(video.thumbnails),
  duration: video.duration,
  is_completed: video.is_completed,
  aiSummary: video.aiSummary,
})

const normalizePlaylist = (playlist: PlaylistApi): Playlist => ({
  id: playlist._id || playlist.id || playlist.youtubePlaylistId || "",
  title: playlist.title,
  description: playlist.description,
  channelTitle: playlist.channelTitle || "",
  videos: (playlist.videos ?? []).map(normalizeVideo),
})

export const PlaylistDetailService = {
  getPlaylistDetail: async (
    playlistId: string
  ): Promise<ApiResponse<Playlist>> => {
    const response = await apiClient.get<ApiResponse<PlaylistApi>>(
      `/playlists/${playlistId}`
    )
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Playlist not found")
    }
    return {
      ...response.data,
      data: normalizePlaylist(response.data.data),
    }
  },
}
