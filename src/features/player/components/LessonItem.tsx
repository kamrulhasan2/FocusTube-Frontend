"use client"

import { memo, useEffect, useMemo, useRef } from "react"
import Image from "next/image"
import { CheckCircle } from "lucide-react"

import { cn } from "@/lib/utils"

import type { Video } from "../types/player.types"

type LessonItemProps = {
  video: Video
  isActive: boolean
  onSelect: (videoId: string) => void
}

const resolveThumbnailUrl = (video: Video) => {
  const source =
    video.thumbnails?.medium ||
    video.thumbnails?.high ||
    video.thumbnails?.default

  if (!source) return null
  if (typeof source === "string") return source
  if (typeof source === "object" && "url" in source) return source.url
  return null
}

const formatDuration = (duration?: string) => {
  if (!duration) return "—"
  if (!duration.startsWith("PT")) return duration

  const hours = /(\d+)H/.exec(duration)?.[1]
  const minutes = /(\d+)M/.exec(duration)?.[1]
  const seconds = /(\d+)S/.exec(duration)?.[1]

  const h = hours ? Number(hours) : 0
  const m = minutes ? Number(minutes) : 0
  const s = seconds ? Number(seconds) : 0

  const totalSeconds = h * 3600 + m * 60 + s
  if (!totalSeconds) return "—"

  const hh = Math.floor(totalSeconds / 3600)
  const mm = Math.floor((totalSeconds % 3600) / 60)
  const ss = totalSeconds % 60
  const padded = `${mm}:${ss.toString().padStart(2, "0")}`
  return hh > 0 ? `${hh}:${padded.padStart(5, "0")}` : padded
}

export const LessonItem = memo(function LessonItem({
  video,
  isActive,
  onSelect,
}: LessonItemProps) {
  const ref = useRef<HTMLButtonElement | null>(null)
  const thumbnailUrl = useMemo(() => resolveThumbnailUrl(video), [video])
  const duration = useMemo(() => formatDuration(video.duration), [video.duration])

  useEffect(() => {
    if (isActive) {
      ref.current?.scrollIntoView({ block: "nearest", behavior: "smooth" })
    }
  }, [isActive])

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => onSelect(video.id)}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg border border-transparent p-3 text-left transition",
        "hover:border-slate-700 hover:bg-slate-900/70",
        isActive && "border-indigo-600 bg-indigo-600/10"
      )}
    >
      <div className="relative h-12 w-20 flex-shrink-0 overflow-hidden rounded-md bg-slate-800">
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={video.title}
            fill
            sizes="80px"
            className="object-cover"
          />
        ) : null}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-100">
          {video.title}
        </p>
        <p className="mt-1 text-xs text-slate-400">{duration}</p>
      </div>
      {video.is_completed ? (
        <CheckCircle className="h-4 w-4 text-emerald-400" />
      ) : null}
    </button>
  )
})
