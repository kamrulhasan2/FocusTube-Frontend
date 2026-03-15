import { z } from "zod"

export const importPlaylistSchema = z.object({
  url: z
    .string()
    .url("Please enter a valid URL.")
    .min(6, "Please enter a valid YouTube playlist link."),
})

export type ImportPlaylistSchema = z.infer<typeof importPlaylistSchema>
