"use client";

// import { chatLmStudioAct } from "@/actions/chat-lm-studio.action";
// import { chatServerAct } from "@/actions/chat-server.action";
import { sttAct } from "@/actions/stt.action";
import { ttsAct } from "@/actions/tts.action";
import { useChatStore } from "@/providers/chat-store-provider";
import { useState } from "react";
import { Button } from "./Button";
import { useInteractionStore } from "@/providers/interaction-store-provider";
import { InteractionStatus } from "@/enums/interaction-status.enum";
import { chatOpenRouterAct } from "@/actions/chat-openrouter.action";

export function RecorderButton() {
  const { status, updateStatus } = useInteractionStore((store) => store);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioUrl, setAudioUrl] = useState("");
  const { messages, appendMessage } = useChatStore((state) => state);

  const startRecording = async () => {
    updateStatus(InteractionStatus.Recording);

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
        const recognizedText = await sttAct(blob);

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

          // updateStatus(InteractionStatus.TTS);
          // const audioBase64 = await ttsAct(
          //   assistantMessage.content,
          //   recognizedText.language
          // );

          // handlePlayAudio(audioBase64);

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

  const handlePlayAudio = (base64: string) => {
    // Convertir Base64 a Blob
    const base64String = base64.split(",")[1]; // Eliminar "data:audio/wav;base64," si existe
    const byteCharacters = atob(base64String);
    const byteNumbers = Array.from(byteCharacters, (char) =>
      char.charCodeAt(0)
    );
    const byteArray = new Uint8Array(byteNumbers);

    // Crear el Blob
    const audioBlob = new Blob([byteArray], { type: "audio/wav" });
    const audioUrl = URL.createObjectURL(audioBlob);

    setAudioUrl("");

    setTimeout(() => {
      setAudioUrl(audioUrl);
    }, 50);
  };

  return (
    <div className="flex flex-col items-center gap-y-6">
      {audioUrl && (
        <audio autoPlay>
          <source key={Math.random()} src={audioUrl} type="audio/wav" />
          Tu navegador no soporta reproducción de audio.
        </audio>
      )}

      <Button
        onPointerDown={() => startRecording()}
        onPointerUp={() => stopRecording()}
        // onMouseDown={() => startRecording()}
        // onMouseUp={() => stopRecording()}
        isActive={status === InteractionStatus.Recording}
      />
    </div>
  );
}
