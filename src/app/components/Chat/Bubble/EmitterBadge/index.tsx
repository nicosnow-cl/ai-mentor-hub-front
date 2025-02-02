import { IconTransformPoint, IconUser } from "@tabler/icons-react";

import { ChatRole } from "@/enums/chat-role.enum";

export type EmitterBadgeProps = {
  role: string;
};

const CLASSES = {
  assistant: "flex-row text-purple-100 bg-purple-900/30",
  user: "flex-row-reverse ml-auto text-blue-100 bg-blue-900/50",
};

export function EmitterBadge({ role }: Readonly<EmitterBadgeProps>) {
  const Icon = role === ChatRole.Assistant ? IconTransformPoint : IconUser;

  return (
    <span
      className={`w-fit flex items-center gap-x-1 px-3 py-1 rounded-full ${
        role === ChatRole.Assistant ? CLASSES.assistant : CLASSES.user
      }`}
    >
      <Icon className="size-4" />

      <span className="text-xs capitalize">
        {role === ChatRole.Assistant ? "mentor" : "usuario"}
      </span>
    </span>
  );
}
