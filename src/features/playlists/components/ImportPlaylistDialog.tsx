"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { importPlaylistSchema, type ImportPlaylistSchema } from "../schemas/import.schema"
import { useEnrollPlaylistMutation, useImportPlaylistMutation } from "../hooks/use-playlist-mutations"
import type { ImportPlaylistResponse } from "../types/import.types"

type ImportPlaylistDialogProps = {
  triggerLabel?: string
}

export function ImportPlaylistDialog({ triggerLabel = "Import Playlist" }: ImportPlaylistDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<"input" | "preview">("input")
  const [playlist, setPlaylist] = useState<ImportPlaylistResponse | null>(null)

  const importMutation = useImportPlaylistMutation()
  const enrollMutation = useEnrollPlaylistMutation()

  const form = useForm<ImportPlaylistSchema>({
    resolver: zodResolver(importPlaylistSchema),
    defaultValues: { url: "" },
  })

  const previewThumbnail = useMemo(() => {
    if (!playlist?.playlist?.thumbnails) return ""
    const resolve = (value?: { url: string } | string) => {
      if (!value) return ""
      return typeof value === "string" ? value : value.url
    }
    return (
      resolve(playlist.playlist.thumbnails.high) ||
      resolve(playlist.playlist.thumbnails.maxres) ||
      resolve(playlist.playlist.thumbnails.medium) ||
      resolve(playlist.playlist.thumbnails.default) ||
      ""
    )
  }, [playlist])

  const resolvedPlaylistId = useMemo(() => {
    if (!playlist?.playlist) return ""
    return playlist.playlist._id
  }, [playlist])

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)
    if (!nextOpen) {
      setStep("input")
      setPlaylist(null)
      form.reset()
      importMutation.reset()
      enrollMutation.reset()
    }
  }

  const handleImport = form.handleSubmit(async (values) => {
    try {
      const data = await importMutation.mutateAsync(values.url)
      setPlaylist(data)
      setStep("preview")
    } catch {
      // errors are handled in the mutation
    }
  })

  const handleEnroll = async () => {
    if (!playlist || !resolvedPlaylistId) {
      toast.error("Unable to enroll. Please re-import the playlist.")
      return
    }
    try {
      await enrollMutation.mutateAsync(resolvedPlaylistId)
      toast.success("Playlist enrolled successfully.")
      setTimeout(() => {
        router.push(`/dashboard/player/${resolvedPlaylistId}`)
        setOpen(false)
      }, 1500)
    } catch {
      // errors are handled in the mutation
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>{triggerLabel}</Button>
      </DialogTrigger>
      <DialogContent aria-label="Import YouTube playlist">
        <DialogHeader>
          <DialogTitle>Import YouTube Playlist</DialogTitle>
          <DialogDescription>
            Paste a YouTube playlist link to create a focused course.
          </DialogDescription>
        </DialogHeader>

        {step === "input" ? (
          <form onSubmit={handleImport} className="mt-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white" htmlFor="playlist-url">
                Playlist URL
              </label>
              <Input
                id="playlist-url"
                placeholder="https://www.youtube.com/playlist?list=..."
                aria-label="YouTube playlist URL"
                {...form.register("url")}
              />
              {form.formState.errors.url ? (
                <p className="text-xs text-rose-400">
                  {form.formState.errors.url.message}
                </p>
              ) : null}
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={importMutation.isPending}
            >
              {importMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Searching playlist...
                </>
              ) : (
                "Search Playlist"
              )}
            </Button>
          </form>
        ) : (
          <div className="mt-6 space-y-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
              <div className="relative w-full overflow-hidden rounded-lg border border-slate-800 bg-slate-950/70">
                <div className="relative w-full pb-[56.25%]">
                  {previewThumbnail ? (
                    <Image
                      src={previewThumbnail}
                      alt={playlist?.title || "Playlist thumbnail"}
                      fill
                      sizes="(min-width: 1024px) 420px, 90vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                      <Loader2 className="h-6 w-6" />
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <h3 className="text-lg font-semibold text-white">
                  {playlist?.playlist?.title}
                </h3>
                <p className="text-sm text-muted-foreground text-slate-400">
                  {playlist?.playlist?.channelTitle}
                </p>
                {playlist?.playlist?.description ? (
                  <p className="text-sm text-muted-foreground text-slate-400 line-clamp-3">
                    {playlist.playlist.description}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                className="flex-1"
                onClick={handleEnroll}
                disabled={enrollMutation.isPending}
              >
                {enrollMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Enrolling...
                  </>
                ) : (
                  "Enroll Now"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setStep("input")
                  setPlaylist(null)
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
