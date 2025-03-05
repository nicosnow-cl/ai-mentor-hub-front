import { ElevenLabsClient } from "elevenlabs";

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

const client = new ElevenLabsClient({
  apiKey: ELEVENLABS_API_KEY,
});

export const sttElevenLabsSvc = (audioBlob: Blob) => {
  return client.speechToText.convert({
    file: audioBlob,
    model_id: "scribe_v1", // Model to use, for now only "scribe_v1" and "scribe_v1_base" are supported
    tag_audio_events: false, // Tag audio events like laughter, applause, etc.
    // language_code: "eng", // Language of the audio file. If set to null, the model will detect the language automatically.
    // diarize: true, // Whether to annotate who is speaking
  });
};
