"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Copy, RefreshCw, Sparkles } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import Link from "next/link"

import {
  useGenerateSummary,
  resolveSummaryErrorMessage,
  resolveSummaryErrorStatus,
} from "../hooks/use-generate-summary"

type VideoSummaryProps = {
  videoId: string
  initialSummary?: string
}

const MAX_PREVIEW_HEIGHT = "max-h-64"

export function VideoSummary({ videoId, initialSummary }: VideoSummaryProps) {
  const [summary, setSummary] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [lastCacheHit, setLastCacheHit] = useState<boolean | null>(null)
  const {
    mutate: generateSummary,
    isPending,
    isError,
    error,
    reset,
  } = useGenerateSummary(videoId)

  useEffect(() => {
    const nextSummary = initialSummary?.trim() || null
    setSummary(nextSummary)
    setIsExpanded(false)
    setLastCacheHit(null)
    reset()
  }, [videoId, initialSummary, reset])

  const handleGenerate = () => {
    if (!videoId || isPending) return
    generateSummary(undefined, {
      onSuccess: (data) => {
        setSummary(data.summary)
        setLastCacheHit(data.cacheHit)
      },
    })
  }

  const handleCopy = async () => {
    if (!summary) return
    try {
      await navigator.clipboard.writeText(summary)
      toast.success("Summary copied")
    } catch {
      toast.error("Unable to copy summary")
    }
  }

  const hasSummary = Boolean(summary)
  const showError = isError && !isPending
  const errorMessage = useMemo(() => resolveSummaryErrorMessage(error), [error])
  const errorStatus = useMemo(() => resolveSummaryErrorStatus(error), [error])
  const isForbidden = errorStatus === 403

  return (
    <div className="rounded-lg border border-white/10 bg-indigo-500/5 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-slate-950/60">
            <Sparkles className="h-4 w-4 text-indigo-300" />
          </span>
          AI Summary
        </div>
        {hasSummary ? (
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
            {lastCacheHit !== null ? (
              <span className="rounded-full bg-slate-900 px-3 py-1">
                {lastCacheHit ? "Cached" : "Fresh"}
              </span>
            ) : null}
            <Button
              size="sm"
              variant="ghost"
              className="gap-2 border border-white/10 text-slate-200 hover:bg-white/5"
              onClick={handleGenerate}
              disabled={isPending || !videoId}
            >
              <RefreshCw className="h-4 w-4" />
              Regenerate
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="gap-2 border border-white/10 text-slate-200 hover:bg-white/5"
              onClick={handleCopy}
              disabled={!summary}
            >
              <Copy className="h-4 w-4" />
              Copy
            </Button>
          </div>
        ) : null}
      </div>

      {!hasSummary ? (
        <div className="mt-6 rounded-lg border border-dashed border-white/10 bg-slate-950/40 p-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/10">
            <Sparkles className="h-5 w-5 text-indigo-300" />
          </div>
          <p className="mt-4 text-sm font-medium text-slate-200">
            No summary generated yet
          </p>
          <p className="mt-2 text-xs text-slate-400">
            Trigger FocusTube AI to condense the transcript into key takeaways.
          </p>
          <Button
            className="mt-4"
            onClick={handleGenerate}
            disabled={isPending || !videoId}
          >
            {isPending ? "Generating..." : "Summarize with AI"}
          </Button>
          {isPending ? (
            <p className="mt-3 text-xs text-slate-400">
              AI is analyzing the transcript
              <span className="inline-flex w-6 justify-start">
                <span className="animate-pulse">...</span>
              </span>
            </p>
          ) : null}
          {showError ? (
            <div className="mt-4 space-y-3 text-xs text-rose-300">
              <p>{errorMessage}</p>
              {isForbidden ? (
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="border-indigo-500/40 text-indigo-200 hover:bg-indigo-500/10"
                >
                  <Link href="/search">Enroll in this playlist</Link>
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : (
        <motion.div
          className="mt-4 space-y-4"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          {showError ? (
            <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-200">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span>{errorMessage}</span>
                <div className="flex flex-wrap items-center gap-2">
                  {isForbidden ? (
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="border-indigo-500/40 text-indigo-100 hover:bg-indigo-500/10"
                    >
                      <Link href="/search">Enroll in this playlist</Link>
                    </Button>
                  ) : null}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="border border-rose-500/40 text-rose-100 hover:bg-rose-500/20"
                    onClick={handleGenerate}
                    disabled={isPending}
                  >
                    Retry
                  </Button>
                </div>
              </div>
            </div>
          ) : null}

          {isPending ? (
            <div className="rounded-lg border border-white/10 bg-slate-950/50 p-4 text-xs text-slate-300">
              AI is analyzing the transcript...
            </div>
          ) : null}

          <div className="space-y-3">
            <div
              className={[
                "prose prose-invert prose-sm max-w-none text-slate-100",
                isExpanded ? "" : `${MAX_PREVIEW_HEIGHT} overflow-hidden`,
              ].join(" ")}
            >
              <ReactMarkdown>{summary ?? ""}</ReactMarkdown>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
              <button
                type="button"
                className="text-indigo-300 hover:text-indigo-200"
                onClick={() => setIsExpanded((prev) => !prev)}
              >
                {isExpanded ? "Collapse summary" : "Expand summary"}
              </button>
              <span className="text-slate-500">
                Generated on demand for this lesson.
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
