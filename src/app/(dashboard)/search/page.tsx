import { PlayCircle } from "lucide-react"

import { ImportPlaylistDialog } from "@/features/playlists/components/ImportPlaylistDialog"

export default function SearchPage() {
  const results: Array<unknown> = []
  const hasResults = results.length > 0

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Search</h1>
          <p className="text-sm text-slate-400">
            Find playlists and learning modules to enroll in.
          </p>
        </div>
        <ImportPlaylistDialog triggerLabel="Import Playlist" />
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-sm text-slate-400">
        Paste a YouTube playlist link to create a focused course instantly.
      </div>

      {!hasResults ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-slate-800 bg-slate-950 text-indigo-400">
            <PlayCircle className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-white">
            No Playlists Yet
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Import a YouTube playlist to begin your focused learning journey.
          </p>
          <div className="mt-5 flex justify-center">
            <ImportPlaylistDialog triggerLabel="Import Your First Playlist" />
          </div>
        </div>
      ) : null}
    </div>
  )
}
