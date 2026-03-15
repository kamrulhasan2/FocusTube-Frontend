"use client"

import { LibraryGrid } from "@/features/library/components/LibraryGrid"
import { useMyLibrary } from "@/features/library/hooks/use-my-library"

export default function LibraryPage() {
  const { playlists, isLoading, isError, refetch } = useMyLibrary()

  return (
    <div className="space-y-6">
      <div className="px-6 pt-6">
        <h1 className="text-2xl font-semibold text-white">My Library</h1>
        <p className="text-sm text-slate-400">
          Your enrolled playlists will appear here.
        </p>
      </div>

      <LibraryGrid
        playlists={playlists}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
      />
    </div>
  )
}
