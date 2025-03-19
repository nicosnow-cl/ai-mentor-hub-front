"use client";

import { useEffect, useMemo, useRef } from "react";

import { Bubble } from "./Bubble";
import { ScalableScroll } from "./ScalableScroll/index.client";
import { useChatStore } from "@/providers/chat-store-provider";

export function Chat() {
  const { messages } = useChatStore((state) => state);
  const containerRef = useRef<HTMLDivElement>(null);

  const lastTenMessages = useMemo(
    () => messages.slice(Math.max(messages.length - 10, 0)),
    [messages]
  );

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages.length]);

  return (
    <div className="h-[45vh] md:h-[600px] max-w-[1024px] fade-to-bottom">
      <div
        ref={containerRef}
        className="flex flex-col gap-y-16 h-[45vh] pt-20 md:h-[600px] overflow-hidden px-12 md:pt-40 hover:overflow-y-auto"
        style={{ scrollbarGutter: "stable" }}
      >
        {<button disabled={messages.length - 1 <= 10}>Ver más</button>}

        {lastTenMessages.map((message, idx) => (
          <ScalableScroll
            key={`bubble-${message.role}-${idx}`}
            containerRef={containerRef}
            className="animate-fade-in"
          >
            <Bubble message={message} />
          </ScalableScroll>
        ))}
      </div>
    </div>
  );
}
