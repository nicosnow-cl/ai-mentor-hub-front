import { IconTransformPoint, IconUser } from '@tabler/icons-react'

import { MessageRole } from '@/enums/message-role.enum'

export type EmitterBadgeProps = {
  role: string
}

const CLASSES = {
  assistant: 'flex-row text-purple-100 bg-purple-900/30',
  user: 'flex-row-reverse ml-auto text-blue-100 bg-blue-900/50',
}

export function EmitterBadge({ role }: Readonly<EmitterBadgeProps>) {
  const Icon = role === MessageRole.Assistant ? IconTransformPoint : IconUser

  return (
    <span
      className={`flex w-fit items-center gap-x-1 rounded-full px-3 py-1 ${
        role === MessageRole.Assistant ? CLASSES.assistant : CLASSES.user
      }`}
    >
      <Icon className="size-4" />

      <span className="text-xs capitalize">
        {role === MessageRole.Assistant ? 'mentor' : 'usuario'}
      </span>
    </span>
  )
}
