"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlayerSkeleton } from "@/features/player/components/PlayerSkeleton"
import { LessonList } from "@/features/player/components/LessonList"
import { VideoPlayer } from "@/features/player/components/VideoPlayer"
import { usePlaylistDetail } from "@/features/player/hooks/use-playlist-detail"
import { useContinueWatching } from "@/features/library/hooks/use-continue-watching"
import { PlaylistService } from "@/features/playlists/services/playlist.service"
import { useVideoMetadata } from "@/features/video/hooks/use-video-metadata"
import { NoteEditor } from "@/features/notes/components/NoteEditor"
import { NoteList } from "@/features/notes/components/NoteList"
import { VideoSummary } from "@/features/video/components/VideoSummary"
import type { PlayerHandle } from "@/features/player/types/player.types"

export default function PlayerPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = useParams<{ playlistId?: string }>()
  const playlistId = params?.playlistId
  const currentVideoId = searchParams.get("v") || undefined
  const playerRef = useRef<PlayerHandle | null>(null)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [localResume, setLocalResume] = useState<{
    videoKey?: string
    time?: number
  } | null>(null)
  const [isEnrollmentReady, setIsEnrollmentReady] = useState(false)
  const enrollmentAttemptedRef = useRef(false)
  const autoSelectRef = useRef(false)

  const { playlist, videos, isLoading, isError, refetch, errorMessage } =
    usePlaylistDetail(playlistId)
  const { continueWatching, isLoading: isContinueLoading } =
    useContinueWatching()

  const getVideoParamId = useCallback(
    (videoId: string, youtubeVideoId?: string) => youtubeVideoId || videoId,
    []
  )

  const activeVideo = useMemo(() => {
    if (videos.length === 0) return undefined
    return (
      videos.find(
        (video) =>
          video.youtubeVideoId === currentVideoId ||
          video.id === currentVideoId
      ) ?? videos[0]
    )
  }, [videos, currentVideoId])

  const activeIndex = useMemo(() => {
    if (!activeVideo) return -1
    return videos.findIndex((video) => video.id === activeVideo.id)
  }, [videos, activeVideo])

  const hasPrevious = activeIndex > 0
  const hasNext = activeIndex >= 0 && activeIndex < videos.length - 1
  const activeVideoKey = useMemo(() => {
    if (!activeVideo) return undefined
    return activeVideo.youtubeVideoId || activeVideo.id
  }, [activeVideo])
  const { video: activeVideoMeta } = useVideoMetadata(activeVideoKey)
  const continueWatchingForPlaylist = useMemo(() => {
    if (!continueWatching || !playlistId) return null
    return continueWatching.playlist_id === playlistId ? continueWatching : null
  }, [continueWatching, playlistId])
  const continueWatchingVideoId = useMemo(
    () => continueWatchingForPlaylist?.video_id,
    [continueWatchingForPlaylist]
  )
  const { video: continueVideo } = useVideoMetadata(continueWatchingVideoId)
  const continueWatchingKey = useMemo(() => {
    if (!continueWatchingForPlaylist) return undefined
    return continueVideo?.youtubeVideoId || continueWatchingForPlaylist.video_id
  }, [continueWatchingForPlaylist, continueVideo])
  const serverResumeSeconds = useMemo(() => {
    if (!activeVideo || !continueWatchingForPlaylist) return undefined
    const matches =
      activeVideo.mongoId === continueWatchingForPlaylist.video_id ||
      activeVideo.id === continueWatchingForPlaylist.video_id ||
      (continueWatchingKey &&
        (activeVideo.youtubeVideoId === continueWatchingKey ||
          activeVideo.id === continueWatchingKey))
    return matches ? continueWatchingForPlaylist.last_watched_second : undefined
  }, [activeVideo, continueWatchingForPlaylist, continueWatchingKey])
  const nextVideoParamId = useMemo(() => {
    if (!hasNext) return undefined
    const nextVideo = videos[activeIndex + 1]
    if (!nextVideo) return undefined
    return getVideoParamId(nextVideo.id, nextVideo.youtubeVideoId)
  }, [hasNext, videos, activeIndex, getVideoParamId])

  const handleSelectVideo = useCallback(
    (videoId: string) => {
      const video = videos.find((item) => item.id === videoId)
      const paramId = video
        ? getVideoParamId(video.id, video.youtubeVideoId)
        : videoId
      router.push(`/dashboard/player/${playlistId}?v=${paramId}`)
    },
    [router, playlistId, videos, getVideoParamId]
  )

  const handlePrevious = useCallback(() => {
    if (!hasPrevious) return
    const previous = videos[activeIndex - 1]
    if (previous) {
      handleSelectVideo(previous.id)
    }
  }, [activeIndex, hasPrevious, videos, handleSelectVideo])

  const handleNext = useCallback(() => {
    if (!hasNext) return
    const next = videos[activeIndex + 1]
    if (next) {
      handleSelectVideo(next.id)
    }
  }, [activeIndex, hasNext, videos, handleSelectVideo])

  const handleCreateRequest = useCallback(() => {
    setIsEditorOpen(true)
  }, [])

  const handleCloseEditor = useCallback((open: boolean) => {
    setIsEditorOpen(open)
  }, [])

  useEffect(() => {
    if (autoSelectRef.current) return
    if (!videos[0]?.id) return
    if (currentVideoId) {
      autoSelectRef.current = true
      return
    }
    if (isContinueLoading) return

    if (continueWatchingForPlaylist) {
      const match = videos.find(
        (video) =>
          video.mongoId === continueWatchingForPlaylist.video_id ||
          video.id === continueWatchingForPlaylist.video_id ||
          (continueWatchingKey &&
            (video.youtubeVideoId === continueWatchingKey ||
              video.id === continueWatchingKey))
      )
      if (match) {
        const paramId = getVideoParamId(match.id, match.youtubeVideoId)
        router.replace(`/dashboard/player/${playlistId}?v=${paramId}`)
        autoSelectRef.current = true
        return
      }
    }
    if (localResume?.videoKey) {
      const match = videos.find(
        (video) =>
          video.youtubeVideoId === localResume.videoKey ||
          video.id === localResume.videoKey
      )
      if (match) {
        const paramId = getVideoParamId(match.id, match.youtubeVideoId)
        router.replace(`/dashboard/player/${playlistId}?v=${paramId}`)
        autoSelectRef.current = true
        return
      }
    }

    const first = videos[0]
    const paramId = getVideoParamId(first.id, first.youtubeVideoId)
    router.replace(`/dashboard/player/${playlistId}?v=${paramId}`)
    autoSelectRef.current = true
  }, [
    currentVideoId,
    videos,
    playlistId,
    router,
    getVideoParamId,
    continueWatchingForPlaylist,
    continueWatchingKey,
    localResume,
    isContinueLoading,
  ])

  useEffect(() => {
    if (!playlistId) {
      setLocalResume(null)
      return
    }
    try {
      const raw = window.localStorage.getItem(
        `focustube-playlist-last-${playlistId}`
      )
      if (!raw) {
        setLocalResume(null)
        return
      }
      const parsed = JSON.parse(raw) as { videoKey?: string; time?: number }
      setLocalResume(parsed)
    } catch {
      setLocalResume(null)
    }
  }, [playlistId])

  useEffect(() => {
    if (!playlistId || enrollmentAttemptedRef.current) return
    enrollmentAttemptedRef.current = true

    const ensureEnrollment = async () => {
      try {
        await PlaylistService.enrollPlaylist(playlistId)
        setIsEnrollmentReady(true)
      } catch (error) {
        const status = (error as { response?: { status?: number } })?.response
          ?.status
        if (status === 409) {
          setIsEnrollmentReady(true)
          return
        }
        setIsEnrollmentReady(false)
      }
    }

    void ensureEnrollment()
  }, [playlistId])

  if (isLoading) {
    return <PlayerSkeleton />
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">
        <h2 className="text-lg font-semibold text-white">
          Unable to load this playlist
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          {errorMessage || "Please check your connection and try again."}
        </p>
        <Button className="mt-4" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    )
  }
  if (!playlist) return null

  return (
    <div className="grid min-w-0 grid-cols-1 gap-6 overflow-x-hidden lg:grid-cols-[3fr_1fr]">
      <div className="min-w-0 space-y-6">
        <div className="flex items-center justify-between px-1">
          <Button
            variant="ghost"
            className="gap-2 text-slate-200"
            onClick={() => router.push("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
        <div className="sticky top-16 z-10 lg:static">
          <VideoPlayer
            video={activeVideo}
            hasPrevious={hasPrevious}
            hasNext={hasNext}
            onPrevious={handlePrevious}
            onNext={handleNext}
            playerRef={playerRef}
            playlistId={playlist.id}
            nextVideoParamId={nextVideoParamId}
            playlistTotalVideos={videos.length}
            serverResumeSeconds={serverResumeSeconds}
            canSyncProgress={isEnrollmentReady && Boolean(activeVideoMeta?._id)}
            serverVideoId={activeVideoMeta?._id}
          />
        </div>

        <Tabs
          defaultValue="notes"
          className="rounded-xl border border-slate-800 bg-slate-900 mt-16 p-4 md:p-6"
        >
          <TabsList className="w-full flex-wrap justify-start gap-2 bg-slate-900">
            <TabsTrigger value="overview" className="flex-1">
              Overview
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex-1">
              Notes
            </TabsTrigger>
            <TabsTrigger value="summary" className="flex-1">
              AI Summary
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="mt-4 space-y-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-500">
                Video
              </p>
              <p className="mt-2 text-sm text-slate-200">
                {activeVideo?.description || "No description available."}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-500">
                Playlist
              </p>
              <p className="mt-2 text-sm text-slate-200">
                {playlist.description || "No playlist overview yet."}
              </p>
            </div>
          </TabsContent>
          <TabsContent value="notes" className="mt-4 space-y-4">
            <NoteEditor
              isOpen={isEditorOpen}
              onOpenChange={handleCloseEditor}
              videoId={activeVideoKey}
              playlistId={playlist.id}
              playerRef={playerRef}
            />
            <div className="max-h-[50vh] overflow-y-auto pr-1 md:max-h-[60vh]">
              <NoteList
                videoId={activeVideoKey}
                playerRef={playerRef}
                onCreate={handleCreateRequest}
              />
            </div>
          </TabsContent>
          <TabsContent value="summary" className="mt-4">
            <VideoSummary
              videoId={activeVideoKey ?? ""}
              initialSummary={activeVideo?.aiSummary}
            />
          </TabsContent>
        </Tabs>
      </div>

      <aside className="min-w-0 rounded-xl border border-slate-800 bg-slate-900 p-4">
        <LessonList
          videos={videos}
          activeVideoId={activeVideo?.id}
          onSelect={handleSelectVideo}
        />
      </aside>
    </div>
  )
}
