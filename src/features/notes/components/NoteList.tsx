"use client"

import { type MutableRefObject } from "react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import type { PlayerHandle } from "@/features/player/types/player.types"
import { useNotes } from "../hooks/use-notes"
import { NoteItem } from "./NoteItem"
import { NotesEmptyState } from "./NotesEmptyState"

type NoteListProps = {
  videoId?: string
  playerRef?: MutableRefObject<PlayerHandle | null>
  onCreate?: () => void
}

export function NoteList({ videoId, playerRef, onCreate }: NoteListProps) {
  const { notes, isLoading, isError, refetch } = useNotes(videoId)

  const handleSeek = (timestamp: number) => {
    playerRef?.current?.seekTo?.(timestamp, true)
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="rounded-lg border border-slate-800 p-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="mt-3 h-3 w-full" />
            <Skeleton className="mt-2 h-3 w-5/6" />
          </div>
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
        <p>Unable to load notes for this video.</p>
        <Button size="sm" className="mt-3" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    )
  }

  if (notes.length === 0) {
    return <NotesEmptyState onCreate={onCreate} />
  }

  return (
    <div className="relative space-y-4 border-l border-slate-800 pl-6">
      {notes.map((note) => (
        <NoteItem key={note.id} note={note} onSeek={handleSeek} />
      ))}
    </div>
  )
}
