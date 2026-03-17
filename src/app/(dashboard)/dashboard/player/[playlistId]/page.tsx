"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlayerSkeleton } from "@/features/player/components/PlayerSkeleton"
import { LessonList } from "@/features/player/components/LessonList"
import { VideoPlayer } from "@/features/player/components/VideoPlayer"
import { usePlaylistDetail } from "@/features/player/hooks/use-playlist-detail"
import { NoteEditor } from "@/features/notes/components/NoteEditor"
import { NoteList } from "@/features/notes/components/NoteList"
import type { PlayerHandle } from "@/features/player/types/player.types"

export default function PlayerPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = useParams<{ playlistId?: string }>()
  const playlistId = params?.playlistId
  const currentVideoId = searchParams.get("v") || undefined
  const playerRef = useRef<PlayerHandle | null>(null)
  const [isEditorOpen, setIsEditorOpen] = useState(false)

  const { playlist, videos, isLoading, isError, refetch, errorMessage } =
    usePlaylistDetail(playlistId)

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
    if (!currentVideoId && videos[0]?.id) {
      const first = videos[0]
      const paramId = getVideoParamId(first.id, first.youtubeVideoId)
      router.replace(`/dashboard/player/${playlistId}?v=${paramId}`)
    }
  }, [currentVideoId, videos, playlistId, router, getVideoParamId])

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
        <div className="sticky top-16 z-10 lg:static">
          <VideoPlayer
            video={activeVideo}
            hasPrevious={hasPrevious}
            hasNext={hasNext}
            onPrevious={handlePrevious}
            onNext={handleNext}
            playerRef={playerRef}
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
          <TabsContent value="summary" className="mt-4 text-sm text-slate-400">
            AI summary will arrive in Phase 10.
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
