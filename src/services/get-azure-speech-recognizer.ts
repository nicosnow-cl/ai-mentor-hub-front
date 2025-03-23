import * as AzureSDK from "microsoft-cognitiveservices-speech-sdk";

const REGION = "eastus";

export const getSpeechRecognizer = (
  apiKey: string,
  pushStream: AzureSDK.PushAudioInputStream,
  region = REGION
) => {
  const speechConfig = AzureSDK.SpeechConfig.fromSubscription(apiKey, region);
  speechConfig.speechRecognitionLanguage = "en-US";

  const audioConfig = AzureSDK.AudioConfig.fromStreamInput(pushStream);

  return new AzureSDK.SpeechRecognizer(speechConfig, audioConfig);
};
