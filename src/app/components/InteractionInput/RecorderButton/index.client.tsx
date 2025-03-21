"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { Button } from "./Button";
import { InteractionStatus } from "@/enums/interaction-status.enum";
import { llmAct } from "@/actions/llm.action";
import { sttAct } from "@/actions/stt.action";
import { ttsAct } from "@/actions/tts.action";
import { useChatStore } from "@/providers/chat-store-provider";
import { useInteractionStore } from "@/providers/interaction-store-provider";
import { useTtsStore } from "@/providers/tts-store-provider";

const MENTOR_WORKING_STATUS = [
  InteractionStatus.STT,
  InteractionStatus.Thinking,
  InteractionStatus.TTS,
];

export function RecorderButton() {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const { setCurrentMessageId, generateAudioUrl } = useTtsStore(
    (store) => store
  );
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
        const recognizedText = await sttAct(blob);

        if (recognizedText.text) {
          const newUserMessage = {
            id: uuidv4(),
            role: "user",
            content: recognizedText.text,
          };

          appendMessage(newUserMessage);

          updateStatus(InteractionStatus.Thinking);
          const assistantMessage = await llmAct([...messages, newUserMessage]);

          appendMessage(assistantMessage);

          updateStatus(InteractionStatus.TTS);
          const audioBase64 = await ttsAct(
            assistantMessage.content,
            recognizedText.language
          );

          generateAudioUrl(assistantMessage.id, audioBase64);
          setCurrentMessageId(assistantMessage.id);

          updateStatus(InteractionStatus.Idle);
        } else {
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
