"use client"

import { memo, useMemo } from "react"
import { formatDistanceToNow } from "date-fns"
import { Edit3, Trash2 } from "lucide-react"
import ReactMarkdown from "react-markdown"

import { Button } from "@/components/ui/button"
import type { Note } from "../types/note.types"

type NoteItemProps = {
  note: Note
  onSeek: (timestamp: number) => void
  onEdit: (note: Note) => void
  onDelete: (id: string) => void
}

const formatTimestamp = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const remaining = Math.floor(seconds % 60)
  return `${String(minutes).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`
}

function NoteItemComponent({ note, onSeek, onEdit, onDelete }: NoteItemProps) {
  const relativeTime = useMemo(() => {
    return formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })
  }, [note.createdAt])

  return (
    <div className="group relative">
      <span className="absolute -left-[22px] top-7 h-2.5 w-2.5 rounded-full bg-indigo-500 shadow-[0_0_0_4px_rgba(15,23,42,0.9)]" />
      <div className="rounded-lg border border-slate-800 bg-slate-900 p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => onSeek(note.timestamp)}
            className="rounded-full bg-indigo-600/20 px-3 py-1 text-xs font-semibold text-indigo-300 transition hover:bg-indigo-600/30"
          >
            {formatTimestamp(note.timestamp)}
          </button>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>{relativeTime}</span>
            <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-slate-300 hover:bg-slate-800"
                onClick={() => onEdit(note)}
              >
                <Edit3 className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-rose-300 hover:bg-rose-500/10"
                onClick={() => onDelete(note.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-3 border-l-2 border-indigo-600 pl-4">
          <div className="prose prose-invert prose-sm max-w-none text-slate-200">
            <ReactMarkdown>{note.content}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  )
}

export const NoteItem = memo(NoteItemComponent)
