"use client"

import { useQueryClient } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import { LibraryGrid } from "@/features/library/components/LibraryGrid"
import { useMyLibrary } from "@/features/library/hooks/use-my-library"

export default function DashboardPage() {
  const queryClient = useQueryClient()
  const { playlists, isLoading, isError, refetch } = useMyLibrary()

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["my-library"] })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 pt-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">My Library</h1>
          <p className="text-sm text-muted-foreground text-slate-400">
            Continue where you left off and track your progress.
          </p>
        </div>
        <Button variant="outline" onClick={handleRefresh}>
          Refresh
        </Button>
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
