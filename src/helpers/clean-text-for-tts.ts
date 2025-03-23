export const cleanTextForTTS = (input: string): string => {
  return input
    .normalize("NFC") // Normalize Unicode (combining characters)
    .replace(/\s+/g, " ") // Replace multiple spaces with a single space
    .replace(/[\u200B-\u200D\uFEFF]/g, "") // Remove zero-width spaces and BOM
    .replace(/[“”]/g, '"') // Normalize curly quotes
    .replace(/[‘’]/g, "'") // Normalize single curly quotes
    .replace(/[—–]/g, "-") // Normalize dashes
    .replace(/[^a-zA-ZÀ-ÖØ-öø-ÿ0-9.,!?;:'"()\-\s]/g, "") // Allow accented letters
    .trim();
};
