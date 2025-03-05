import { ElevenLabsClient } from "elevenlabs";

import { streamToBuffer } from "@/helpers/stream-to-buffer";

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

const client = new ElevenLabsClient({
  apiKey: ELEVENLABS_API_KEY,
});

export const ttsElevenLabsSvc = async (text: string) => {
  try {
    const audioStream = await client.textToSpeech.convert(
      "21m00Tcm4TlvDq8ikWAM",
      {
        text,
        model_id: "eleven_multilingual_v2",
        output_format: "mp3_44100_128",
      }
    );

    return streamToBuffer(audioStream);
  } catch (err) {
    console.log(err);

    throw new Error("Cant do anything");
  }
};
