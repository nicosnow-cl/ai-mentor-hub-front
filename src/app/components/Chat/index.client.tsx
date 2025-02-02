"use client";

import { useChatStore } from "@/providers/chat-store-provider";
import { Bubble } from "./Bubble";
import { useEffect, useRef } from "react";

export function Chat() {
  const { messages } = useChatStore((state) => state);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth", // Optional: Add smooth scrolling effect
      });
    }
  }, [messages.length]);

  return (
    <div className="h-[600px] w-[1024px] fade-to-bottom">
      <div
        ref={containerRef}
        className="flex flex-col gap-y-16 h-[600px] overflow-hidden px-6 pt-48"
      >
        {messages.map(({ role, content }, idx) => (
          <Bubble
            key={`bubble-${role}-${idx}`}
            // className={idx < messages.length - 1 ? "scale-95" : "scale-105"}
            role={role}
            message={content}
          />
        ))}
      </div>
    </div>
  );
}
