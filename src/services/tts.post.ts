export const ttsSvc = (
  text: string,
  language?: string,
  provider = 'coqui-tts'
) => {
  return fetch('http://127.0.0.1:8000/tts', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      text,
      language,
      provider,
    }),
  })
}
