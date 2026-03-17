"use client"

import { FileText } from "lucide-react"

import { Button } from "@/components/ui/button"

type NotesEmptyStateProps = {
  onCreate?: () => void
}

export function NotesEmptyState({ onCreate }: NotesEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-800 bg-slate-900/60 px-6 py-10 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-800 bg-slate-950 text-indigo-400">
        <FileText className="h-5 w-5" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-white">No notes yet</h3>
        <p className="mt-1 text-xs text-slate-400">
          Start capturing your learning insights.
        </p>
      </div>
      <Button size="sm" onClick={onCreate} className="w-full sm:w-auto">
        Take your first note
      </Button>
    </div>
  )
}
