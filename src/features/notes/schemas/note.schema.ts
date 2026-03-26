import { z } from "zod"

export const noteSchema = z
  .string()
  .min(3, "Notes need at least 3 characters.")
  .max(1000, "Notes can be up to 1000 characters.")

export const noteTitleSchema = z
  .string()
  .min(1, "Title is required.")
  .max(120, "Title can be up to 120 characters.")
