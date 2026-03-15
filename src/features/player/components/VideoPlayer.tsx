"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import YouTube from "react-youtube"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"

import type { Video } from "../types/player.types"

type VideoPlayerProps = {
  video?: Video
  hasPrevious: boolean
  hasNext: boolean
  onPrevious: () => void
  onNext: () => void
}

export function VideoPlayer({
  video,
  hasPrevious,
  hasNext,
  onPrevious,
  onNext,
}: VideoPlayerProps) {
  const [playerError, setPlayerError] = useState<string | null>(null)
  const playerRef = useRef<{ getCurrentTime: () => number } | null>(null)
  const progressTimerRef = useRef<number | null>(null)
  const playableId = useMemo(() => {
    if (!video) return ""
    if (video.youtubeVideoId) return video.youtubeVideoId
    if (/^[a-f\\d]{24}$/i.test(video.id)) return ""
    return video.id
  }, [video])

  const origin =
    typeof window !== "undefined" ? window.location.origin : undefined

  useEffect(() => {
    return () => {
      if (progressTimerRef.current) {
        window.clearInterval(progressTimerRef.current)
      }
    }
  }, [])

  if (!video) {
    return (
      <div className="flex min-h-80 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/60 text-sm text-slate-400">
        Select a lesson to start watching.
      </div>
    )
  }

  if (!playableId) {
    return (
      <div className="flex min-h-80 flex-col items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 text-center text-sm text-slate-400">
        <p>This lesson is missing a YouTube video id.</p>
        <p className="text-xs text-slate-500">
          Please re-sync the playlist or choose another lesson.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900">
      <div className="relative aspect-video overflow-hidden rounded-t-xl bg-black">
        <YouTube
          videoId={playableId}
          className="absolute inset-0"
          iframeClassName="h-full w-full"
          opts={{
            width: "100%",
            height: "100%",
            playerVars: {
              autoplay: 1,
              controls: 1,
              rel: 0,
              modestbranding: 1,
              playsinline: 1,
              origin,
            },
          }}
          onReady={(event) => {
            setPlayerError(null)
            playerRef.current = event.target
          }}
          onError={(event) => {
            const message =
              typeof event.data === "number"
                ? `Playback error (${event.data}). This video may be restricted.`
                : "Playback failed. This video may be restricted."
            setPlayerError(message)
          }}
          onStateChange={(event) => {
            const state = event.data
            if (state === 1) {
              if (progressTimerRef.current) {
                window.clearInterval(progressTimerRef.current)
              }
              progressTimerRef.current = window.setInterval(() => {
                const current = playerRef.current?.getCurrentTime()
                if (typeof current === "number") {
                  console.log(current)
                }
              }, 1000)
            } else {
              if (progressTimerRef.current) {
                window.clearInterval(progressTimerRef.current)
                progressTimerRef.current = null
              }
            }
            if (state === 0) {
              console.log("Video Completed")
            }
          }}
        />
        {playerError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 p-6 text-center text-sm text-slate-200">
            <div className="space-y-2">
              <p className="font-medium">Unable to play this video.</p>
              <p className="text-xs text-slate-300">{playerError}</p>
              <p className="text-xs text-slate-400">
                Try another lesson or open the video on YouTube.
              </p>
            </div>
          </div>
        ) : null}
      </div>
      <div className="divide-y divide-slate-800 border-t border-slate-800">
        <div className="flex items-center justify-between px-4 py-2 text-xs text-slate-400">
          <span className="truncate">If playback fails, open the source.</span>
          <a
            href={`https://www.youtube.com/watch?v=${playableId}`}
            target="_blank"
            rel="noreferrer"
            className="text-indigo-400 hover:text-indigo-300"
          >
            Open on YouTube
          </a>
        </div>
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <Button
            variant="ghost"
            className="gap-2 text-slate-200"
            onClick={onPrevious}
            disabled={!hasPrevious}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <div className="flex-1 truncate text-center text-sm font-medium text-slate-200">
            {video.title}
          </div>
          <Button
            variant="ghost"
            className="gap-2 text-slate-200"
            onClick={onNext}
            disabled={!hasNext}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
