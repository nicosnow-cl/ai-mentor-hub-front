export const base64ToAudioUrl = (base64: string) => {
  // Convertir Base64 a Blob
  const base64String = base64.split(",")[1]; // Eliminar "data:audio/wav;base64," si existe
  const byteCharacters = atob(base64String);
  const byteNumbers = Array.from(byteCharacters, (char) => char.charCodeAt(0));
  const byteArray = new Uint8Array(byteNumbers);

  // Crear el Blob
  const audioBlob = new Blob([byteArray], { type: "audio/wav" });

  return URL.createObjectURL(audioBlob);
};
