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

import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { useCreateNote } from "../hooks/use-note-mutations"
import { noteSchema, noteTitleSchema } from "../schemas/note.schema"
import type { PlayerHandle } from "@/features/player/types/player.types"

import "@uiw/react-md-editor/markdown-editor.css"

type NoteEditorProps = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  videoId?: string
  playlistId?: string
  playerRef?: MutableRefObject<PlayerHandle | null>
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
  playlistId,
  playerRef,
}: NoteEditorProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [timestamp, setTimestamp] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [titleError, setTitleError] = useState<string | null>(null)
  const [previewMode, setPreviewMode] = useState<"edit" | "live">("edit")
  const { mutate: createNote, isPending: isCreating } = useCreateNote(videoId)

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
      setTitle("")
      setContent("")
      setError(null)
      setTitleError(null)
      setPreviewMode("edit")
      setTimestamp(0)
      return
    }

    playerRef?.current?.pauseVideo?.()

    captureTimestamp()
  }, [isOpen, captureTimestamp, playerRef])

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
    setTitleError(null)
    if (!videoId || !playlistId) {
      toast.error("Select a playlist video before saving a note.")
      return
    }
    const titlePayload = title.trim()
    const titleValidation = noteTitleSchema.safeParse(titlePayload)
    if (!titleValidation.success) {
      setTitleError(
        titleValidation.error.issues[0]?.message ?? "Title is required."
      )
      return
    }
    const payload = content.trim()
    const validation = noteSchema.safeParse(payload)
    if (!validation.success) {
      setError(validation.error.issues[0]?.message ?? "Note content is invalid.")
      return
    }
    const noteTimestamp = captureTimestamp()
    createNote({
      title: titlePayload,
      content: payload,
      timestamp_in_seconds: noteTimestamp,
      video_id: videoId,
      playlist_id: playlistId,
    })
    setTitle("")
    setContent("")
    onOpenChange(false)
  }, [
    content,
    createNote,
    onOpenChange,
    playlistId,
    title,
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
    () => [
      commands.bold,
      commands.italic,
      commands.code,
      commands.unorderedListCommand,
    ],
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
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Note Title
              </label>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="mt-2 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
                placeholder="Key takeaway or concept"
              />
              {titleError ? (
                <p className="mt-1 text-xs text-rose-400">{titleError}</p>
              ) : null}
            </div>
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
              <Button
                className="gap-1"
                onClick={handleSave}
                disabled={isCreating || !videoId || !playlistId}
              >
                {isCreating ? "Saving..." : "Save Note"}
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
