"use client";

// import { chatLmStudioAct } from "@/actions/chat-lm-studio.action";
// import { chatServerAct } from "@/actions/chat-server.action";
// import { sttAct } from "@/actions/stt.action";
import { ttsAct } from "@/actions/tts.action";
import { useChatStore } from "@/providers/chat-store-provider";
import { useState } from "react";
import { Button } from "./Button";
import { useInteractionStore } from "@/providers/interaction-store-provider";
import { InteractionStatus } from "@/enums/interaction-status.enum";
import { chatOpenRouterAct } from "@/actions/chat-openrouter.action";
import { useTtsStore } from "@/providers/tts-store-provider";
import { sttElevenLabsAct } from "@/actions/stt-elevenlabs.action";

const MENTOR_WORKING_STATUS = [
  InteractionStatus.STT,
  InteractionStatus.Thinking,
  InteractionStatus.TTS,
];

export function RecorderButton() {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const { generateAudioUrl } = useTtsStore((store) => store);
  const { messages, appendMessage } = useChatStore((state) => state);
  const { status, updateStatus } = useInteractionStore((store) => store);

  const startRecording = async () => {
    updateStatus(InteractionStatus.Recording);

    const audioElements = document.querySelectorAll("audio");
    audioElements.forEach((audiElem) => audiElem.pause());

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);

    const chunks: BlobPart[] = [];

    recorder.ondataavailable = (event) => {
      chunks.push(event.data);
    };

    recorder.onstop = async () => {
      try {
        const blob = new Blob(chunks, { type: "audio/webm" });

        updateStatus(InteractionStatus.STT);
        // const recognizedText = await sttAct(blob);
        const recognizedText = await sttElevenLabsAct(blob);

        if (recognizedText.text) {
          const newUserMessage = { role: "user", content: recognizedText.text };

          appendMessage(newUserMessage);

          updateStatus(InteractionStatus.Thinking);
          const assistantMessage = await chatOpenRouterAct([
            ...messages,
            newUserMessage,
          ]);
          // const assistantMessage = await chatLmStudioAct([
          //   ...messages,
          //   newUserMessage,
          // ]);

          // const assistantMessage = await chatServerAct(
          //   [...messages.slice(Math.max(messages.length - 5, 1)), newUserMessage],
          //   recognizedText.language
          // );

          appendMessage(assistantMessage);

          updateStatus(InteractionStatus.TTS);
          const audioBase64 = await ttsAct(
            assistantMessage.content,
            recognizedText.language
          );

          generateAudioUrl(audioBase64);

          updateStatus(InteractionStatus.Idle);
        }
      } catch (err: unknown) {
        console.error({ err });

        updateStatus(InteractionStatus.Error);
      }
    };

    recorder.start();

    setMediaRecorder(recorder);
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
    }
  };

  return (
    <Button
      onMouseDown={() => {
        if (!MENTOR_WORKING_STATUS.includes(status)) {
          startRecording();
        }
      }}
      onMouseUp={() => stopRecording()}
      isActive={status === InteractionStatus.Recording}
      disabled={MENTOR_WORKING_STATUS.includes(status)}
    />
  );
}
