"use client"

import { useQuery } from "@tanstack/react-query"

import { LibraryService } from "../services/library.service"

export const useContinueWatching = () => {
  const query = useQuery({
    queryKey: ["library", "continue-watching"],
    queryFn: () => LibraryService.getContinueWatching(),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  })

  return {
    continueWatching: query.data?.data ?? null,
    isLoading: query.isLoading,
  }
}
