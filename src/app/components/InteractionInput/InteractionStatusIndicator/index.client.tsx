"use client";

import { InteractionStatus } from "@/enums/interaction-status.enum";
import { useInteractionStore } from "@/providers/interaction-store-provider";
import { IconTransformPoint } from "@tabler/icons-react";

const getLabel = (status: InteractionStatus) => {
  switch (status) {
    case InteractionStatus.Error:
      return "Houston, tenemos un problema.";
    case InteractionStatus.Recording:
    case InteractionStatus.STT:
      return "Escuchando...";
    case InteractionStatus.Thinking:
      return "Pensando...";
    case InteractionStatus.TTS:
      return "Transcribiendo...";
    default:
      return "";
  }
};

export function InteractionStatusIndicator() {
  const { status } = useInteractionStore((store) => store);

  const label = getLabel(status);

  if (!label) {
    return null;
  }

  return (
    <span
      className={`flex gap-x-2 items-center pl-3 absolute -top-8 ${
        status === InteractionStatus.Error ? "text-red-300" : ""
      }`}
    >
      <IconTransformPoint className="size-5" />
      <i>{label}</i>
    </span>
  );
}
