"use client"

import { useQuery } from "@tanstack/react-query"

import { LibraryService } from "../services/library.service"
import type { LibraryPlaylistProgressItem } from "../types/library.types"

export const useMyLibrary = () => {
  const query = useQuery({
    queryKey: ["my-library"],
    queryFn: () => LibraryService.getMyLibrary(),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  })

  const playlists: LibraryPlaylistProgressItem[] = query.data?.data ?? []

  return {
    playlists,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  }
}
