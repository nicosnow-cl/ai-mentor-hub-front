export const splitBuffer = (buffer: Buffer, chunkSize = 8000) => {
  // Máximo 8 KB

  const chunks = [];

  for (let i = 0; i < buffer.length; i += chunkSize) {
    chunks.push(buffer.slice(i, i + chunkSize));
  }
  return chunks;
};
