"use client";

import { chatLmStudioAct } from "@/actions/chat-lm-studio.action";
// import { chatServerAct } from "@/actions/chat-server.action";
import { sttAct } from "@/actions/stt.action";
import { ttsAct } from "@/actions/tts.action";
import { useChatStore } from "@/providers/chat-store-provider";
import { useState } from "react";
import { Button } from "./Button";

export function RecorderButton() {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioUrl, setAudioUrl] = useState("");
  const { messages, appendMessage } = useChatStore((state) => state);

  const startRecording = async () => {
    setIsRecording(true);

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);

    const chunks: BlobPart[] = [];

    recorder.ondataavailable = (event) => {
      chunks.push(event.data);
    };

    recorder.onstop = async () => {
      const blob = new Blob(chunks, { type: "audio/webm" });

      const recognizedText = await sttAct(blob);

      if (recognizedText.text) {
        const newUserMessage = { role: "user", content: recognizedText.text };

        appendMessage(newUserMessage);

        const assistantMessage = await chatLmStudioAct([
          ...messages,
          newUserMessage,
        ]);

        // const assistantMessage = await chatServerAct(
        //   [...messages.slice(Math.max(messages.length - 5, 1)), newUserMessage],
        //   recognizedText.language
        // );

        appendMessage(assistantMessage);

        ttsAct(assistantMessage.content, recognizedText.language).then((data) =>
          handlePlayAudio(data)
        );
      }

      setIsRecording(false);
    };

    recorder.start();

    setMediaRecorder(recorder);
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
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
        onMouseDown={() => startRecording()}
        onMouseUp={() => stopRecording()}
      />
    </div>
  );
}
