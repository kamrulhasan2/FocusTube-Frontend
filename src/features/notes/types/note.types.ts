export interface Note {
  id: string
  title: string
  content: string
  video_id: string
  playlist_id: string
  timestamp_in_seconds: number
  created_at: string
  updated_at?: string
}

export interface CreateNoteDto {
  title: string
  content: string
  video_id: string
  playlist_id: string
  timestamp_in_seconds: number
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}
