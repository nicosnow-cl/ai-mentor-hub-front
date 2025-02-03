"use client";

import { useEffect, useMemo, useRef } from "react";

import { useChatStore } from "@/providers/chat-store-provider";
import { Bubble } from "./Bubble";

const MESSAGE_SCALES = ["scale-90", "scale-100", "scale-105", "scale-110"];

const getBubbleScale = (index: number, arrayLength: number) => {
  const lastIndex = arrayLength - 1;

  if (index === lastIndex) {
    return MESSAGE_SCALES[3];
  } else if (index === lastIndex - 1) {
    return MESSAGE_SCALES[2];
  } else if (index === lastIndex - 2) {
    return MESSAGE_SCALES[1];
  }

  return MESSAGE_SCALES[0];
};

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
        {messages.length - 1 > 10 && <button>Ver más</button>}

        {lastTenMessages.map((message, idx) => (
          <div
            key={`bubble-${message.role}-${idx}`}
            className="animate-fade-in"
          >
            <Bubble
              className={`${getBubbleScale(
                idx,
                lastTenMessages.length
              )} transition-transform sca`}
              message={message}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
