import ffmpeg from "fluent-ffmpeg";

export const wavFileToPCM = (inputFile: string): Promise<string> => {
  const outputFile = inputFile.replace(".wav", ".pcm");

  return new Promise((resolve, reject) => {
    ffmpeg(inputFile)
      .audioCodec("pcm_s16le") // PCM 16-bit
      .audioFrequency(16000) // 16 kHz
      .audioChannels(1) // Mono
      .format("s16le") // Salida en PCM sin encabezado
      .on("end", () => resolve(outputFile))
      .on("error", reject)
      .save(outputFile);
  });
};
