import * as AzureSDK from "microsoft-cognitiveservices-speech-sdk";

const REGION = "eastus";

export const getSpeechSynthesizer = (
  apiKey: string,
  voiceName: string,
  region = REGION
) => {
  const speechConfig = AzureSDK.SpeechConfig.fromSubscription(apiKey, region);

  speechConfig.speechSynthesisVoiceName = voiceName;

  const audioConfig = AzureSDK.AudioConfig.fromStreamOutput(
    AzureSDK.AudioOutputStream.createPullStream()
  );

  return new AzureSDK.SpeechSynthesizer(speechConfig, audioConfig);
};
