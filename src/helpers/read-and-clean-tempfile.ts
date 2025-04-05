import fs from 'fs/promises'

export const readAndCleanTempFile = async (
  filePath: string
): Promise<Buffer> => {
  const buffer = await fs.readFile(filePath)

  await fs.unlink(filePath) // Eliminar el archivo temporal

  return buffer
}
