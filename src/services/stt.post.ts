export const sttSvc = (formData: FormData) => {
  formData.append('provider', 'faster-whisper')

  return fetch('http://127.0.0.1:8000/stt', {
    method: 'POST',
    body: formData,
  })
}
