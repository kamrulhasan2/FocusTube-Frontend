import { Suspense } from "react"
import { PlayerSkeleton } from "@/features/player/components/PlayerSkeleton"
import PlayerClient from "./PlayerClient"

export default function PlayerPage() {
  return (
    <Suspense fallback={<PlayerSkeleton />}>
      <PlayerClient />
    </Suspense>
  )
}
