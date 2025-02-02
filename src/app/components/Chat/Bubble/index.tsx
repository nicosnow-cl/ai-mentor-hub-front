import { IconTransformPoint, IconUser } from "@tabler/icons-react";

import { ChatRole } from "@/enums/chat-role.enum";
import { getThinkAndContent } from "@/helpers/get-think-and-content";

export type BubbleProps = {
  className?: string;
  role: string;
  message: string;
};

export function Bubble({
  role,
  message,
  className = "",
}: Readonly<BubbleProps>) {
  const { content } = getThinkAndContent({ role, content: message });

  return (
    <div
      className={`text-slate-50 ${
        role === ChatRole.Assistant ? "text-left" : "text-right"
      } ${className}`}
    >
      <div
        className={`flex items-center gap-x-1 text-slate-300 ${
          role === ChatRole.Assistant ? "flex-row" : "flex-row-reverse"
        }`}
      >
        {role === ChatRole.Assistant ? (
          <IconTransformPoint className="size-4" />
        ) : (
          <IconUser className="size-4" />
        )}
        <span className="text-xs uppercase">{role}</span>
      </div>

      {/* {think && (
        <pre className="flex flex-col whitespace-pre-wrap text-xs">
          <span className="font-bold">Think</span>
          {think}
        </pre>
      )} */}

      <pre className="text-lg">{content}</pre>
    </div>
  );
}
