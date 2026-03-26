import { apiClient } from "@/services/api-client"

import type { ApiResponse, CreateNoteDto, Note } from "../types/note.types"

type RawNote = Note & {
  _id?: string
  createdAt?: string
  updatedAt?: string
}

const normalizeNote = (note: RawNote): Note => ({
  id: note.id || note._id || "",
  title: note.title,
  content: note.content,
  video_id: note.video_id,
  playlist_id: note.playlist_id,
  timestamp_in_seconds: note.timestamp_in_seconds ?? 0,
  created_at: note.created_at || note.createdAt || new Date().toISOString(),
  updated_at: note.updated_at || note.updatedAt,
})

export const NotesService = {
  getNotesByVideo: async (videoId: string): Promise<ApiResponse<Note[]>> => {
    const response = await apiClient.get(`/notes/video/${videoId}`)
    const payload = response.data as ApiResponse<RawNote[]>
    return { ...payload, data: payload.data.map(normalizeNote) }
  },
  createNote: async (payload: CreateNoteDto): Promise<ApiResponse<Note>> => {
    const response = await apiClient.post("/notes", payload)
    const data = response.data as ApiResponse<RawNote>
    return { ...data, data: normalizeNote(data.data) }
  },
  updateNote: async (
    id: string,
    content: string
  ): Promise<ApiResponse<Note>> => {
    const response = await apiClient.patch(`/notes/${id}`, { content })
    const data = response.data as ApiResponse<RawNote>
    return { ...data, data: normalizeNote(data.data) }
  },
  deleteNote: async (id: string): Promise<ApiResponse<Record<string, never>>> => {
    const response = await apiClient.delete(`/notes/${id}`)
    return response.data
  },
}
