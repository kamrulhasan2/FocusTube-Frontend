"use client"

import Image from "next/image"
import Link from "next/link"
import { PlayCircle, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import type {
  LibraryPlaylistProgressItem,
  PlaylistThumbnailSource,
} from "../types/library.types"

type PlaylistCardProps = {
  playlist: LibraryPlaylistProgressItem
}

const resolveThumbnailSource = (source?: PlaylistThumbnailSource) => {
  if (!source) return ""
  return typeof source === "string" ? source : source.url
}

const resolveThumbnailUrl = (playlist: LibraryPlaylistProgressItem) => {
  return (
    resolveThumbnailSource(playlist.thumbnails?.maxres) ||
    resolveThumbnailSource(playlist.thumbnails?.high) ||
    resolveThumbnailSource(playlist.thumbnails?.medium) ||
    resolveThumbnailSource(playlist.thumbnails?.standard) ||
    resolveThumbnailSource(playlist.thumbnails?.default) ||
    ""
  )
}

export function PlaylistCard({ playlist }: PlaylistCardProps) {
  const thumbnailUrl = resolveThumbnailUrl(playlist)
  const progressValue = Math.min(
    100,
    Math.max(0, playlist.progress_percentage || 0)
  )

  return (
    <Link
      href={`/dashboard/player/${playlist.playlist_id}`}
      className="group block h-full"
      aria-label={`Open ${playlist.title}`}
    >
      <div
        className={cn(
          "flex h-full flex-col gap-4 rounded-xl border border-slate-800 bg-slate-900 p-4 transition-all duration-200 ease-in-out",
          "group-hover:scale-[1.02] group-hover:shadow-lg group-hover:shadow-black/30"
        )}
      >
        <div className="relative overflow-hidden rounded-lg border border-slate-800 bg-slate-950/70">
          <div className="absolute right-3 top-3 z-10 flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-slate-950/80 text-slate-200 hover:bg-slate-900"
                  aria-label="Delete playlist"
                  onClick={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    toast.info("Delete is not available yet.")
                  }}
                >
                  <Trash2 className="h-4 w-4 text-rose-400" />
                </Button>
              </DialogTrigger>
              <DialogContent
                aria-label="Delete playlist confirmation"
                onClick={(event) => event.stopPropagation()}
              >
                <DialogHeader>
                  <DialogTitle>Delete playlist?</DialogTitle>
                  <DialogDescription>
                    This action will be available once the delete API is ready.
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <Button
                    variant="outline"
                    onClick={(event) => {
                      event.preventDefault()
                      event.stopPropagation()
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={(event) => {
                      event.preventDefault()
                      event.stopPropagation()
                      toast.info("Delete is not available yet.")
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="relative w-full pb-[56.25%]">
            {thumbnailUrl ? (
              <Image
                src={thumbnailUrl}
                alt={playlist.title}
                fill
                sizes="(min-width: 1280px) 280px, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                <PlayCircle className="h-10 w-10" />
              </div>
            )}
          </div>

          <div className="absolute left-3 top-3 rounded-full border border-slate-700 bg-slate-950/80 px-3 py-1 text-xs font-medium text-slate-200">
            {playlist.total_videos} Videos
          </div>
        </div>

        <div className="space-y-2">
          <div>
            <h3 className="text-lg font-semibold text-white line-clamp-2">
              {playlist.title}
            </h3>
            <p className="text-sm text-muted-foreground text-slate-400">
              {playlist.channelTitle}
            </p>
          </div>

          <div className="space-y-2">
            <Progress value={progressValue} />
            <p className="text-xs text-muted-foreground text-slate-400">
              {playlist.completed_videos} / {playlist.total_videos} videos completed
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}
