export const sttSvc = (formData: FormData) => {
  return fetch("http://127.0.0.1:8000/whisper/stt", {
    method: "POST",
    body: formData,
  });
};
