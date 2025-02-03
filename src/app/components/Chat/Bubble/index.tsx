import ReactMarkdown from "react-markdown";

import { ChatRole } from "@/enums/chat-role.enum";
import { Message } from "@/stores/chat-store";
import { EmitterBadge } from "./EmitterBadge";

export type BubbleProps = {
  className?: string;
  message: Message;
};

export function Bubble({ message, className = "" }: Readonly<BubbleProps>) {
  const { role, content } = message;

  return (
    <div
      className={`flex flex-col gap-y-1 text-slate-50 ${
        role === ChatRole.Assistant ? "text-left" : "text-right"
      } ${className}`}
    >
      <EmitterBadge role={role} />

      {/* {think && (
        <pre className="flex flex-col whitespace-pre-wrap text-xs">
          <span className="font-bold">Think</span>
          {think}
        </pre>
      )} */}

      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
