"use client"

import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react"
import { useRouter } from "next/navigation"
import YouTube from "react-youtube"
import { ChevronLeft, ChevronRight } from "lucide-react"
import confetti from "canvas-confetti"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

import { useUpdateProgress } from "../hooks/use-progress-mutations"
import type { PlayerHandle, Video } from "../types/player.types"

type VideoPlayerProps = {
  video?: Video
  hasPrevious: boolean
  hasNext: boolean
  onPrevious: () => void
  onNext: () => void
  playerRef?: MutableRefObject<PlayerHandle | null>
  playlistId?: string
  nextVideoParamId?: string
  playlistTotalVideos?: number
  serverResumeSeconds?: number
  canSyncProgress?: boolean
  serverVideoId?: string
}

export function VideoPlayer({
  video,
  hasPrevious,
  hasNext,
  onPrevious,
  onNext,
  playerRef,
  playlistId,
  nextVideoParamId,
  playlistTotalVideos,
  serverResumeSeconds,
  canSyncProgress = true,
  serverVideoId,
}: VideoPlayerProps) {
  const router = useRouter()
  const [playerError, setPlayerError] = useState<string | null>(null)
  const internalPlayerRef = useRef<PlayerHandle | null>(null)
  const activePlayerRef = playerRef ?? internalPlayerRef
  const progressTimerRef = useRef<number | null>(null)
  const autoAdvanceTimerRef = useRef<number | null>(null)
  const lastSentAtRef = useRef(0)
  const lastSentSecondRef = useRef(0)
  const lastLocalSaveAtRef = useRef(0)
  const lastLocalSavedSecondRef = useRef(0)
  const lastKnownSecondRef = useRef(0)
  const resumeAppliedRef = useRef(false)
  const completionSentRef = useRef(false)
  const { mutate: updateProgress } = useUpdateProgress()
  const playableId = useMemo(() => {
    if (!video) return ""
    if (video.youtubeVideoId) return video.youtubeVideoId
    if (/^[a-f\\d]{24}$/i.test(video.id)) return ""
    return video.id
  }, [video])
  const videoKey = useMemo(() => {
    if (!video) return ""
    return video.youtubeVideoId || video.id
  }, [video])
  const videoAltKey = useMemo(() => {
    if (!video) return ""
    if (video.youtubeVideoId && video.id && video.youtubeVideoId !== video.id) {
      return video.id
    }
    return ""
  }, [video])
  const progressVideoId = useMemo(() => {
    if (serverVideoId) return serverVideoId
    if (!video) return ""
    return video.youtubeVideoId || video.mongoId || video.id
  }, [serverVideoId, video])

  useEffect(() => {
    return () => {
      if (progressTimerRef.current) {
        window.clearInterval(progressTimerRef.current)
      }
      if (autoAdvanceTimerRef.current) {
        window.clearTimeout(autoAdvanceTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    lastSentAtRef.current = 0
    lastSentSecondRef.current = 0
    lastLocalSaveAtRef.current = 0
    lastLocalSavedSecondRef.current = 0
    resumeAppliedRef.current = false
    completionSentRef.current = false
    if (autoAdvanceTimerRef.current) {
      window.clearTimeout(autoAdvanceTimerRef.current)
      autoAdvanceTimerRef.current = null
    }
  }, [video?.id])

  useEffect(() => {
    return () => {
      const current = lastKnownSecondRef.current
      if (typeof current === "number" && current > 0) {
        persistLocalProgress(current, true)
        touchPlaylistProgress()
        sendProgressUpdate(current, true)
      }
    }
  }, [videoKey])

  const getStorageKey = (id: string) => `focustube-progress-${id}`

  const readLocalProgress = (id: string) => {
    if (typeof window === "undefined") return null
    try {
      const raw = window.localStorage.getItem(getStorageKey(id))
      if (!raw) return null
      const parsed = JSON.parse(raw) as { time?: number; updatedAt?: number }
      if (!parsed || typeof parsed.time !== "number") return null
      return parsed
    } catch {
      return null
    }
  }

  const writeLocalProgress = (id: string, time: number) => {
    if (typeof window === "undefined") return
    try {
      window.localStorage.setItem(
        getStorageKey(id),
        JSON.stringify({ time, updatedAt: Date.now() })
      )
    } catch {
      // Ignore localStorage write failures.
    }
  }

  const readAnyLocalProgress = () => {
    if (videoKey) {
      const primary = readLocalProgress(videoKey)
      if (primary?.time) return primary
    }
    if (videoAltKey) {
      const secondary = readLocalProgress(videoAltKey)
      if (secondary?.time) return secondary
    }
    return null
  }

  const getPlaylistProgressKey = (id: string) =>
    `focustube-playlist-progress-${id}`
  const getPlaylistCompletedKey = (id: string) =>
    `focustube-playlist-completed-${id}`
  const getPlaylistLastKey = (id: string) =>
    `focustube-playlist-last-${id}`

  const readPlaylistCompleted = (id: string) => {
    if (typeof window === "undefined") return []
    try {
      const raw = window.localStorage.getItem(getPlaylistCompletedKey(id))
      if (!raw) return []
      const parsed = JSON.parse(raw) as string[]
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }

  const writePlaylistProgress = (
    id: string,
    totalVideos?: number,
    completedCount?: number,
    hasActivity = false,
    progressOverride?: number
  ) => {
    if (typeof window === "undefined") return
    try {
      const progressPercentage =
        typeof progressOverride === "number"
          ? Math.round(progressOverride)
          : typeof totalVideos === "number" && totalVideos > 0
            ? Math.round(((completedCount ?? 0) / totalVideos) * 100)
            : 0
      window.localStorage.setItem(
        getPlaylistProgressKey(id),
        JSON.stringify({
          totalVideos,
          completedVideos: completedCount ?? 0,
          progressPercentage,
          hasActivity,
          updatedAt: Date.now(),
        })
      )
    } catch {
      // Ignore localStorage write failures.
    }
  }

  const touchPlaylistProgress = () => {
    if (!playlistId) return
    const completed = readPlaylistCompleted(playlistId)
    writePlaylistProgress(
      playlistId,
      playlistTotalVideos,
      completed.length,
      true
    )
  }

  const writePlaylistLast = (currentSeconds: number) => {
    if (!playlistId || !videoKey) return
    try {
      window.localStorage.setItem(
        getPlaylistLastKey(playlistId),
        JSON.stringify({
          videoKey,
          time: Math.max(0, Math.floor(currentSeconds)),
          updatedAt: Date.now(),
        })
      )
    } catch {
      // Ignore localStorage write failures.
    }
  }

  const markVideoCompleted = () => {
    if (!playlistId || !videoKey) return
    const completed = readPlaylistCompleted(playlistId)
    if (!completed.includes(videoKey)) {
      const next = [...completed, videoKey]
      try {
        window.localStorage.setItem(
          getPlaylistCompletedKey(playlistId),
          JSON.stringify(next)
        )
      } catch {
        // Ignore localStorage write failures.
      }
      writePlaylistProgress(
        playlistId,
        playlistTotalVideos,
        next.length,
        true
      )
    }
  }

  const parseDurationToSeconds = (duration?: string) => {
    if (!duration) return 0
    if (!duration.startsWith("PT")) return 0
    const hours = /(\d+)H/.exec(duration)?.[1]
    const minutes = /(\d+)M/.exec(duration)?.[1]
    const seconds = /(\d+)S/.exec(duration)?.[1]
    const h = hours ? Number(hours) : 0
    const m = minutes ? Number(minutes) : 0
    const s = seconds ? Number(seconds) : 0
    return h * 3600 + m * 60 + s
  }

  const persistLocalProgress = (currentSeconds: number, force = false) => {
    if (!videoKey) return
    const now = Date.now()
    const rounded = Math.max(0, Math.floor(currentSeconds))
    const delta = Math.abs(rounded - lastLocalSavedSecondRef.current)
    const shouldWrite =
      force || (now - lastLocalSaveAtRef.current >= 10_000 && delta >= 3)
    if (!shouldWrite) return
    writeLocalProgress(videoKey, rounded)
    if (videoAltKey) {
      writeLocalProgress(videoAltKey, rounded)
    }
    writePlaylistLast(rounded)
    lastLocalSaveAtRef.current = now
    lastLocalSavedSecondRef.current = rounded
  }

  const sendProgressUpdate = (currentSeconds: number, force = false) => {
    if (!video || !playlistId) return
    if (!canSyncProgress) return
    const now = Date.now()
    const rounded = Math.max(0, Math.floor(currentSeconds))
    const delta = Math.abs(rounded - lastSentSecondRef.current)
    const throttleOk = now - lastSentAtRef.current >= 15_000
    const shouldSend = force || (throttleOk && delta >= 5)
    if (!shouldSend) return
    updateProgress({
      playlistId,
      videoId: progressVideoId,
      watchedSecond: rounded,
    })
    lastSentAtRef.current = now
    lastSentSecondRef.current = rounded
  }

  const handleProgressTick = (currentSeconds: number) => {
    lastKnownSecondRef.current = currentSeconds
    persistLocalProgress(currentSeconds)
    if (playlistId && playlistTotalVideos && playlistTotalVideos > 0) {
      const completed = readPlaylistCompleted(playlistId)
      const isCompleted = completed.includes(videoKey)
      const durationFromPlayer =
        activePlayerRef.current?.getDuration?.() ?? 0
      const durationFromMeta = parseDurationToSeconds(video?.duration)
      const duration = durationFromPlayer || durationFromMeta
      const fraction =
        duration > 0 ? Math.min(currentSeconds / duration, 1) : 0
      const baseCompleted = Math.max(
        0,
        completed.length - (isCompleted ? 1 : 0)
      )
      const effectiveCompleted = baseCompleted + (isCompleted ? 1 : fraction)
      const optimisticPercentage =
        (effectiveCompleted / playlistTotalVideos) * 100
      writePlaylistProgress(
        playlistId,
        playlistTotalVideos,
        completed.length,
        true,
        optimisticPercentage
      )
    } else {
      touchPlaylistProgress()
    }
    sendProgressUpdate(currentSeconds)

    const duration = activePlayerRef.current?.getDuration?.()
    if (
      duration &&
      duration > 0 &&
      !completionSentRef.current &&
      currentSeconds / duration >= 0.9
    ) {
      completionSentRef.current = true
      markVideoCompleted()
      sendProgressUpdate(currentSeconds, true)
    }
  }

  const handleResume = () => {
    if (!videoKey || resumeAppliedRef.current) return
    const localProgress = readAnyLocalProgress()?.time
    const resumeSeconds =
      typeof serverResumeSeconds === "number" && serverResumeSeconds > 0
        ? serverResumeSeconds
        : localProgress
    if (!resumeSeconds || resumeSeconds < 3) return
    const duration = activePlayerRef.current?.getDuration?.()
    const safeSeconds =
      typeof duration === "number" && duration > 0
        ? Math.min(resumeSeconds, Math.max(duration - 3, 0))
        : resumeSeconds
    activePlayerRef.current?.seekTo?.(safeSeconds, true)
    resumeAppliedRef.current = true
  }

  const handleCompletionCelebration = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
    })
  }

  useEffect(() => {
    const handleVisibilitySync = () => {
      if (document.visibilityState !== "hidden") return
      const current =
        activePlayerRef.current?.getCurrentTime?.() ?? lastKnownSecondRef.current
      if (typeof current === "number" && current > 0) {
        persistLocalProgress(current, true)
        touchPlaylistProgress()
        sendProgressUpdate(current, true)
      }
    }

    const handlePageHide = () => {
      const current =
        activePlayerRef.current?.getCurrentTime?.() ?? lastKnownSecondRef.current
      if (typeof current === "number" && current > 0) {
        persistLocalProgress(current, true)
        touchPlaylistProgress()
        sendProgressUpdate(current, true)
      }
    }

    document.addEventListener("visibilitychange", handleVisibilitySync)
    window.addEventListener("pagehide", handlePageHide)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilitySync)
      window.removeEventListener("pagehide", handlePageHide)
    }
  }, [playlistId, playlistTotalVideos, videoKey])

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
          key={playableId}
          videoId={playableId}
          className="absolute inset-0"
          iframeClassName="h-full w-full"
          opts={{
            width: "100%",
            height: "100%",
            playerVars: {
              autoplay: 0,
              controls: 1,
              rel: 0,
              modestbranding: 1,
              playsinline: 1,
            },
          }}
          onReady={(event) => {
            setPlayerError(null)
            activePlayerRef.current = event.target
            handleResume()
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
                const current = activePlayerRef.current?.getCurrentTime?.()
                if (typeof current === "number") {
                  handleProgressTick(current)
                }
              }, 1000)
              return
            } else {
              if (progressTimerRef.current) {
                window.clearInterval(progressTimerRef.current)
                progressTimerRef.current = null
              }
            }
            if (state === 2) {
              const current = activePlayerRef.current?.getCurrentTime?.()
              if (typeof current === "number") {
                lastKnownSecondRef.current = current
                persistLocalProgress(current, true)
                touchPlaylistProgress()
              }
            }
            if (state === 0) {
              const current = activePlayerRef.current?.getCurrentTime?.()
              if (typeof current === "number") {
                lastKnownSecondRef.current = current
                persistLocalProgress(current, true)
                touchPlaylistProgress()
                markVideoCompleted()
                sendProgressUpdate(current, true)
              }
              if (hasNext && playlistId && nextVideoParamId) {
                toast.info("Playing next lesson in 3 seconds...")
                autoAdvanceTimerRef.current = window.setTimeout(() => {
                  router.replace(
                    `/dashboard/player/${playlistId}?v=${nextVideoParamId}`
                  )
                }, 3000)
              } else {
                handleCompletionCelebration()
              }
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
