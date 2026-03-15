"use client"

import { LessonItem } from "./LessonItem"
import type { Video } from "../types/player.types"

type LessonListProps = {
  videos: Video[]
  activeVideoId?: string
  onSelect: (videoId: string) => void
}

export function LessonList({ videos, activeVideoId, onSelect }: LessonListProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200">Lessons</h3>
        <span className="text-xs text-slate-500">{videos.length} videos</span>
      </div>
      <div className="mt-4 max-h-[50vh] flex-1 space-y-2 overflow-y-auto pr-2 xl:max-h-[70vh]">
        {videos.map((video) => (
          <LessonItem
            key={video.id}
            video={video}
            isActive={video.id === activeVideoId}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  )
}
