export const ttsSvc = (text: string) => {
  return fetch("http://127.0.0.1:8000/tts/run", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ text }),
  });
};
