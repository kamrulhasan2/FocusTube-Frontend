"use client"

import { memo, useEffect, useMemo, useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Edit3, Save, Trash2, X } from "lucide-react"
import ReactMarkdown from "react-markdown"

import { Button } from "@/components/ui/button"
import { noteSchema } from "../schemas/note.schema"
import { useDeleteNote, useUpdateNote } from "../hooks/use-note-mutations"
import type { Note } from "../types/note.types"

type NoteItemProps = {
  note: Note
  onSeek: (timestamp: number) => void
}

const formatTimestamp = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const remaining = Math.floor(seconds % 60)
  return `${String(minutes).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`
}

function NoteItemComponent({ note, onSeek }: NoteItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(note.content)
  const [error, setError] = useState<string | null>(null)
  const { mutate: updateNote, isPending: isUpdating } = useUpdateNote(
    note.video_id
  )
  const { mutate: deleteNote, isPending: isDeleting } = useDeleteNote(
    note.video_id
  )
  const relativeTime = useMemo(() => {
    return formatDistanceToNow(new Date(note.created_at), { addSuffix: true })
  }, [note.created_at])

  useEffect(() => {
    setDraft(note.content)
  }, [note.content])

  const handleStartEdit = () => {
    setError(null)
    setDraft(note.content)
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setError(null)
    setDraft(note.content)
    setIsEditing(false)
  }

  const handleSaveEdit = () => {
    const payload = draft.trim()
    const validation = noteSchema.safeParse(payload)
    if (!validation.success) {
      setError(
        validation.error.issues[0]?.message ?? "Note content is invalid."
      )
      return
    }
    updateNote({ id: note.id, content: payload })
    setIsEditing(false)
  }

  return (
    <div className="group relative">
      <span className="absolute -left-[22px] top-7 h-2.5 w-2.5 rounded-full bg-indigo-500 shadow-[0_0_0_4px_rgba(15,23,42,0.9)]" />
      <div className="rounded-lg border border-slate-800 bg-slate-900 p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => onSeek(note.timestamp_in_seconds)}
            className="rounded-full bg-indigo-600/20 px-3 py-1 text-xs font-semibold text-indigo-300 transition hover:bg-indigo-600/30"
          >
            {formatTimestamp(note.timestamp_in_seconds)}
          </button>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>{relativeTime}</span>
            <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
              {isEditing ? (
                <>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-emerald-300 hover:bg-emerald-500/10"
                    onClick={handleSaveEdit}
                    disabled={isUpdating}
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-slate-300 hover:bg-slate-800"
                    onClick={handleCancelEdit}
                    disabled={isUpdating}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-slate-300 hover:bg-slate-800"
                    onClick={handleStartEdit}
                    disabled={isDeleting}
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-rose-300 hover:bg-rose-500/10"
                    onClick={() => deleteNote(note.id)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="mt-3 border-l-2 border-indigo-600 pl-4">
          <h4 className="text-sm font-semibold text-slate-100">
            {note.title}
          </h4>
          {isEditing ? (
            <div className="mt-2 space-y-2">
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                rows={4}
                className="w-full resize-none rounded-md border border-slate-800 bg-slate-950 p-3 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
              />
              {error ? <p className="text-xs text-rose-400">{error}</p> : null}
              {isUpdating ? (
                <p className="text-xs text-slate-400">Saving...</p>
              ) : null}
            </div>
          ) : (
            <div className="mt-2 prose prose-invert prose-sm max-w-none text-slate-200">
              <ReactMarkdown>{note.content}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export const NoteItem = memo(NoteItemComponent)
