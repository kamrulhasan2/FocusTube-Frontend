"use client"

import { useMemo, type MutableRefObject } from "react"

import type { Note } from "../types/note.types"
import { NoteItem } from "./NoteItem"
import { NotesEmptyState } from "./NotesEmptyState"
import type { PlayerHandle } from "@/features/player/types/player.types"

type NoteListProps = {
  notes: Note[]
  activeVideoId?: string
  playerRef?: MutableRefObject<PlayerHandle | null>
  onEdit: (note: Note) => void
  onDelete: (id: string) => void
  onCreate?: () => void
}

export function NoteList({
  notes,
  activeVideoId,
  playerRef,
  onEdit,
  onDelete,
  onCreate,
}: NoteListProps) {
  const filteredNotes = useMemo(() => {
    if (!activeVideoId) return notes
    return notes.filter((note) => note.videoId === activeVideoId)
  }, [notes, activeVideoId])

  const sortedNotes = useMemo(() => {
    return [...filteredNotes].sort((a, b) => a.timestamp - b.timestamp)
  }, [filteredNotes])

  const handleSeek = (timestamp: number) => {
    playerRef?.current?.seekTo?.(timestamp, true)
  }

  if (sortedNotes.length === 0) {
    return <NotesEmptyState onCreate={onCreate} />
  }

  return (
    <div className="relative space-y-4 border-l border-slate-800 pl-6">
      {sortedNotes.map((note) => (
        <NoteItem
          key={note.id}
          note={note}
          onSeek={handleSeek}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
