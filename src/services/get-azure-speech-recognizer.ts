import * as AzureSDK from "microsoft-cognitiveservices-speech-sdk";

const REGION = "eastus";

export const getSpeechRecognizer = (
  apiKey: string,
  pushStream: AzureSDK.PushAudioInputStream,
  region = REGION
) => {
  const speechConfig = AzureSDK.SpeechConfig.fromSubscription(apiKey, region);
  const audioConfig = AzureSDK.AudioConfig.fromStreamInput(pushStream);

  const autoDetectLangConfig =
    AzureSDK.AutoDetectSourceLanguageConfig.fromLanguages(["en-US", "es-ES"]);

  return AzureSDK.SpeechRecognizer.FromConfig(
    speechConfig,
    autoDetectLangConfig,
    audioConfig
  );
};
