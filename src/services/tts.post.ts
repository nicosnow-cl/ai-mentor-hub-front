<<<<<<< HEAD
export const ttsSvc = (text: string, language?: string) => {
=======
export const ttsSvc = (text: string) => {
>>>>>>> 29417e0 (feat: :sparkles: Initial commit)
  return fetch("http://127.0.0.1:8000/tts/run", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
<<<<<<< HEAD
    body: JSON.stringify({ text, language }),
=======
    body: JSON.stringify({ text }),
>>>>>>> 29417e0 (feat: :sparkles: Initial commit)
  });
};
