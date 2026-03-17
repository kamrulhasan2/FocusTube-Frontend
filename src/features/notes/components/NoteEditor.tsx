"use client"

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type MutableRefObject,
} from "react"
import MDEditor, { commands } from "@uiw/react-md-editor"
import { Clock, Eye, PenLine, Plus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { noteSchema } from "../schemas/note.schema"
import type { Note } from "../types/note.types"
import type { PlayerHandle } from "@/features/player/types/player.types"

import "@uiw/react-md-editor/markdown-editor.css"

type NoteEditorProps = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  videoId?: string
  playerRef?: MutableRefObject<PlayerHandle | null>
  editingNote?: Note | null
  onSave: (note: Note) => void
  onUpdate: (id: string, content: string) => void
}

const formatTimestamp = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const remaining = Math.floor(seconds % 60)
  return `${String(minutes).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`
}

export function NoteEditor({
  isOpen,
  onOpenChange,
  videoId,
  playerRef,
  editingNote,
  onSave,
  onUpdate,
}: NoteEditorProps) {
  const [content, setContent] = useState("")
  const [timestamp, setTimestamp] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [previewMode, setPreviewMode] = useState<"edit" | "live">("edit")

  const isEditing = Boolean(editingNote)

  const captureTimestamp = useCallback(() => {
    const currentTime = playerRef?.current?.getCurrentTime?.()
    const nextTimestamp =
      typeof currentTime === "number" && Number.isFinite(currentTime)
        ? Math.max(0, Math.floor(currentTime))
        : 0
    setTimestamp(nextTimestamp)
    return nextTimestamp
  }, [playerRef])

  useEffect(() => {
    if (!isOpen) {
      setContent("")
      setError(null)
      setPreviewMode("edit")
      setTimestamp(0)
      return
    }

    playerRef?.current?.pauseVideo?.()

    if (editingNote) {
      setContent(editingNote.content)
      setTimestamp(editingNote.timestamp)
      return
    }

    captureTimestamp()
  }, [isOpen, editingNote, captureTimestamp, playerRef])

  const handleOpen = () => {
    onOpenChange(true)
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  const handleTogglePreview = () => {
    setPreviewMode((mode) => (mode === "edit" ? "live" : "edit"))
  }

  const handleCapture = () => {
    captureTimestamp()
  }

  const handleSave = useCallback(() => {
    setError(null)
    const payload = content.trim()
    const validation = noteSchema.safeParse(payload)
    if (!validation.success) {
      setError(validation.error.issues[0]?.message ?? "Note content is invalid.")
      return
    }

    if (isEditing && editingNote) {
      onUpdate(editingNote.id, payload)
      onOpenChange(false)
      return
    }

    const noteTimestamp = captureTimestamp()
    const now = new Date().toISOString()
    const newNote: Note = {
      id: crypto.randomUUID(),
      videoId: videoId || "unknown",
      content: payload,
      timestamp: noteTimestamp,
      createdAt: now,
    }
    onSave(newNote)
    setContent("")
    onOpenChange(false)
  }, [
    content,
    editingNote,
    isEditing,
    onOpenChange,
    onSave,
    onUpdate,
    videoId,
    captureTimestamp,
  ])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        handleCancel()
        return
      }
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        event.preventDefault()
        handleSave()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleSave, isOpen])

  const toolbarCommands = useMemo(
    () => [commands.bold, commands.italic, commands.code, commands.unorderedList],
    []
  )

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 md:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-800 bg-slate-900">
            <PenLine className="h-4 w-4 text-indigo-400" />
          </span>
          FocusNotes
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-600/15 px-3 py-1 text-xs font-medium text-indigo-300">
            <Clock className="h-3.5 w-3.5" />
            {formatTimestamp(timestamp)}
          </span>
          <Button
            size="sm"
            variant="ghost"
            className="border border-slate-800 text-slate-200 hover:bg-slate-800"
            onClick={handleCapture}
          >
            Capture Time
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="border border-slate-800 text-slate-200 hover:bg-slate-800"
            onClick={handleTogglePreview}
          >
            <Eye className="mr-1 h-4 w-4" />
            {previewMode === "edit" ? "Preview" : "Edit"}
          </Button>
          {!isOpen ? (
            <Button size="sm" className="gap-1" onClick={handleOpen}>
              <Plus className="h-4 w-4" />
              Add Note
            </Button>
          ) : null}
        </div>
      </div>

      {isOpen ? (
        <div className="mt-4 space-y-4">
          <div data-color-mode="dark">
            <MDEditor
              value={content}
              onChange={(value) => setContent(value ?? "")}
              preview={previewMode}
              commands={toolbarCommands}
              className="rounded-lg border border-slate-800 bg-slate-900"
              height={240}
              visibleDragbar={false}
              textareaProps={{
                autoFocus: true,
                rows: 8,
                placeholder: "Capture your learning insight in markdown...",
              }}
            />
          </div>

          {error ? <p className="text-xs text-rose-400">{error}</p> : null}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-slate-400">
              ⌘/Ctrl + Enter to save · Esc to close
            </p>
            <div className="flex flex-wrap justify-end gap-2">
              <Button
                variant="ghost"
                className="text-slate-300 hover:bg-slate-900"
                onClick={handleCancel}
              >
                <X className="mr-1 h-4 w-4" />
                Cancel
              </Button>
              <Button className="gap-1" onClick={handleSave}>
                {isEditing ? "Update Note" : "Save Note"}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-4 flex items-center justify-between rounded-lg border border-dashed border-slate-800 bg-slate-900/60 px-4 py-3 text-xs text-slate-400">
          <span>Capture focused, timestamped insights while you learn.</span>
          <Button size="sm" variant="ghost" onClick={handleOpen}>
            Start Note
          </Button>
        </div>
      )}
    </div>
  )
}
