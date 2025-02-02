"use client";

import { InteractionStatus } from "@/enums/interaction-status.enum";
import { useInteractionStore } from "@/providers/interaction-store-provider";
import { IconTransformPoint } from "@tabler/icons-react";

const VALID_STATUS = [
  InteractionStatus.STT,
  InteractionStatus.TTS,
  InteractionStatus.Thinking,
];

export function InputMessage() {
  const { status } = useInteractionStore((store) => store);

  if (!VALID_STATUS.includes(status)) {
    return null;
  }

  return (
    <span className="flex gap-x-2 items-center pl-3 absolute -top-7">
      <IconTransformPoint className="size-5" />
      <i>Pensando...</i>
    </span>
  );
}
