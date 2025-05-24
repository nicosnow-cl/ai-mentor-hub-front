import { z } from 'zod'

export const topicSchema = z.object({
  topic: z.string().min(3).max(100),
  subTopic: z.string().max(100).optional(),
})

export const settingsSchema = z
  .object({
    mentorName: z.string().min(3).max(50),
    language: z.enum(['english', 'spanish']),
    instructions: z.string().min(10).max(500).optional(),
    userName: z.string().max(50).optional(),
  })
  .merge(topicSchema)

export type TopicSchema = z.infer<typeof topicSchema>

export type SettingsSchema = z.infer<typeof settingsSchema>
