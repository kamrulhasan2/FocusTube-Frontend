"use client"

import Link from "next/link"
import { PlayCircle } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"

import type { LibraryPlaylistProgressItem } from "../types/library.types"
import { PlaylistCard } from "./PlaylistCard"
import { PlaylistCardSkeleton } from "./PlaylistCardSkeleton"

type LibraryGridProps = {
  playlists: LibraryPlaylistProgressItem[]
  isLoading: boolean
  isError: boolean
  onRetry: () => void
}

export function LibraryGrid({
  playlists,
  isLoading,
  isError,
  onRetry,
}: LibraryGridProps) {
  const gridVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.06, delayChildren: 0.05 },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 12, scale: 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 220, damping: 22 },
    },
  }

  if (isLoading) {
    return (
      <div className="container p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <PlaylistCardSkeleton key={index} />
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="container p-6">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">
          <h2 className="text-lg font-semibold text-white">
            Something went wrong
          </h2>
          <p className="mt-2 text-sm text-muted-foreground text-slate-400">
            We could not load your library. Please try again.
          </p>
          <Button onClick={onRetry} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  if (playlists.length === 0) {
    return (
      <div className="container flex min-h-[50vh] items-center justify-center p-6">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-slate-800 bg-slate-900 text-indigo-400">
            <PlayCircle className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-white">
            Your Library is Empty
          </h2>
          <p className="mt-2 text-sm text-muted-foreground text-slate-400">
            Enroll in a playlist to begin focused learning.
          </p>
          <Button asChild className="mt-5">
            <Link href="/dashboard/search">Explore Playlists</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container p-6">
      <motion.div
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        variants={gridVariants}
        initial="hidden"
        animate="show"
      >
        {playlists.map((playlist) => (
          <motion.div key={playlist.enrollment_id} variants={cardVariants}>
            <PlaylistCard playlist={playlist} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
