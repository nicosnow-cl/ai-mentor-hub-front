import { z } from 'zod'

export const settingsSchema = z.object({
  mentorName: z.string().min(3).max(50),
  topic: z.string().min(3).max(100),
  language: z.enum(['english', 'spanish']),
  instructions: z.string().min(10).max(500).optional(),
  userName: z.string().max(50).optional(),
  subTopic: z.string().max(100).optional(),
})
