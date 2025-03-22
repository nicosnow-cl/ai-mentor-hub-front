import { tmpdir } from "os";
import fs from "fs/promises";
import path from "path";

export const blobToTempFile = async (
  blob: Blob,
  extension = ".wav"
): Promise<string> => {
  const tempFilePath = path.join(tmpdir(), `audio-${Date.now()}${extension}`);
  const buffer = Buffer.from(await blob.arrayBuffer());

  await fs.writeFile(tempFilePath, buffer);

  return tempFilePath;
};
