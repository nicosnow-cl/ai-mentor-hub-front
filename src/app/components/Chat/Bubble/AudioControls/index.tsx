"use client";

import {
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";

import { useTtsStore } from "@/providers/tts-store-provider";
import { CircularProgress } from "@/app/components/common/CircularProgress";

export type AudioControlsProps = {
  messageId: string;
};

export function AudioControls({ messageId }: AudioControlsProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(1);
  const { audioRef, playerStatus, currentMessageId, setCurrentMessageId } =
    useTtsStore((state) => state);

  const canPlay = playerStatus !== "playing";

  const renderIcon = () => {
    if (messageId !== currentMessageId) {
      return <IconPlayerPlayFilled className="size-5" />;
    }

    return canPlay ? (
      <IconPlayerPlayFilled className="size-5" />
    ) : (
      <IconPlayerPauseFilled className="size-5" />
    );
  };

  const handleClick = () => {
    if (messageId !== currentMessageId || canPlay) {
      handlePlay();

      return;
    }

    handlePause();
  };

  const handlePlay = () => {
    setCurrentMessageId(messageId);

    audioRef?.play();
  };

  const handlePause = () => {
    audioRef?.pause();
  };

  useEffect(() => {
    if (messageId !== currentMessageId) {
      setCurrentTime(0);

      return;
    }

    if (audioRef) {
      audioRef.onloadedmetadata = () => {
        setDuration(audioRef.duration);
      };

      audioRef.ontimeupdate = (evt) => {
        const target = evt.target as HTMLAudioElement;

        setCurrentTime(target.currentTime);
      };
    }
  }, [messageId, currentMessageId, audioRef]);

  const progress = (currentTime / duration) * 100;

  return (
    <div className="relative flex items-center">
      <CircularProgress
        progress={progress}
        containerProps={{
          className:
            "-z-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
        }}
      />

      <button className="cursor-pointer" onClick={handleClick}>
        {renderIcon()}
      </button>
    </div>
  );
}
