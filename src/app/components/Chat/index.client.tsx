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
    <div className="flex-1 w-full fade-to-bottom z-10">
      <div
        ref={containerRef}
        className="flex flex-col mt-20 gap-y-8 px-6 overflow-y-auto md:gap-y-16 md:px-12 md:pt-40"
        style={{ maxHeight: "70vh", scrollbarGutter: "stable" }}
      >
        <button disabled={messages.length - 1 <= 10}>Ver más</button>

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
