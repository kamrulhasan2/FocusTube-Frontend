"use client"

import { useCallback, useState } from "react"

import type { Note } from "../types/note.types"

export function useNotes(initialNotes: Note[] = []) {
  const [notes, setNotes] = useState<Note[]>(initialNotes)

  const addNote = useCallback((note: Note) => {
    setNotes((prev) => [note, ...prev])
  }, [])

  const updateNote = useCallback((id: string, content: string) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id
          ? { ...note, content, updatedAt: new Date().toISOString() }
          : note
      )
    )
  }, [])

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id))
  }, [])

  return {
    notes,
    addNote,
    updateNote,
    deleteNote,
  }
}
