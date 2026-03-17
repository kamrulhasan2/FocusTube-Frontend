"use client"

import { useQuery } from "@tanstack/react-query"

import { NotesService } from "../services/notes.service"
import type { Note } from "../types/note.types"

export function useNotes(videoId?: string) {
  const query = useQuery({
    queryKey: ["notes", videoId],
    queryFn: async () => {
      if (!videoId) return []
      const response = await NotesService.getNotesByVideo(videoId)
      return response.data
    },
    enabled: Boolean(videoId),
    staleTime: 1000 * 60 * 5,
    select: (notes: Note[]) =>
      [...notes].sort((a, b) => a.timestamp_in_seconds - b.timestamp_in_seconds),
  })

  return {
    notes: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  }
}
