"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { NotesService } from "../services/notes.service"
import type { CreateNoteDto, Note } from "../types/note.types"

type OptimisticContext = {
  previousNotes?: Note[]
  optimisticId?: string
}

const resolveErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error === "object" && error && "message" in error) {
    const message = String((error as { message?: string }).message)
    if (message) return message
  }
  return fallback
}

export function useCreateNote(videoId?: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateNoteDto) => NotesService.createNote(payload),
    onMutate: async (payload) => {
      if (!videoId) return {}
      await queryClient.cancelQueries({ queryKey: ["notes", videoId] })
      const previousNotes =
        queryClient.getQueryData<Note[]>(["notes", videoId]) ?? []
      const optimisticId = `temp-${crypto.randomUUID()}`
      const optimisticNote: Note = {
        id: optimisticId,
        title: payload.title,
        content: payload.content,
        video_id: payload.video_id,
        playlist_id: payload.playlist_id,
        timestamp_in_seconds: payload.timestamp_in_seconds,
        created_at: new Date().toISOString(),
      }
      queryClient.setQueryData<Note[]>(["notes", videoId], (current = []) => [
        ...current,
        optimisticNote,
      ])
      return { previousNotes, optimisticId }
    },
    onError: (error, _payload, context) => {
      if (videoId && context?.previousNotes) {
        queryClient.setQueryData(["notes", videoId], context.previousNotes)
      }
      toast.error(resolveErrorMessage(error, "Unable to save note."))
    },
    onSuccess: (response, _payload, context) => {
      if (!videoId) return
      const createdNote = response.data
      queryClient.setQueryData<Note[]>(["notes", videoId], (current = []) =>
        current.map((note) =>
          note.id === context?.optimisticId ? createdNote : note
        )
      )
      toast.success("Note saved")
    },
    onSettled: () => {
      if (!videoId) return
      void queryClient.invalidateQueries({ queryKey: ["notes", videoId] })
    },
  })
}

export function useUpdateNote(videoId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, content }: { id: string; content: string }) =>
      NotesService.updateNote(id, content),
    onMutate: async ({ id, content }) => {
      await queryClient.cancelQueries({ queryKey: ["notes", videoId] })
      const previousNotes =
        queryClient.getQueryData<Note[]>(["notes", videoId]) ?? []
      queryClient.setQueryData<Note[]>(["notes", videoId], (current = []) =>
        current.map((note) =>
          note.id === id
            ? { ...note, content, updated_at: new Date().toISOString() }
            : note
        )
      )
      return { previousNotes }
    },
    onError: (error, _payload, context) => {
      if (context?.previousNotes) {
        queryClient.setQueryData(["notes", videoId], context.previousNotes)
      }
      toast.error(resolveErrorMessage(error, "Unable to update note."))
    },
    onSuccess: (response) => {
      const updatedNote = response.data
      queryClient.setQueryData<Note[]>(["notes", videoId], (current = []) =>
        current.map((note) => (note.id === updatedNote.id ? updatedNote : note))
      )
      toast.success("Note updated")
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["notes", videoId] })
    },
  })
}

export function useDeleteNote(videoId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => NotesService.deleteNote(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["notes", videoId] })
      const previousNotes =
        queryClient.getQueryData<Note[]>(["notes", videoId]) ?? []
      queryClient.setQueryData<Note[]>(["notes", videoId], (current = []) =>
        current.filter((note) => note.id !== id)
      )
      return { previousNotes }
    },
    onError: (error, _payload, context) => {
      if (context?.previousNotes) {
        queryClient.setQueryData(["notes", videoId], context.previousNotes)
      }
      toast.error(resolveErrorMessage(error, "Unable to delete note."))
    },
    onSuccess: () => {
      toast.success("Note deleted")
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["notes", videoId] })
    },
  })
}
