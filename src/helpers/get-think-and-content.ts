export const getThinkAndContent = (
  message: string
): {
  think: string
  content: string
} => {
  // Validar que el contenido sea una cadena
  if (!message) {
    return { think: '', content: '' }
  }

  // Inicializar valores predeterminados
  let think = ''
  let content = message

  // Verificar si el mensaje es del asistente y contiene la etiqueta </think>
  if (message.includes('</think>')) {
    const [thinkPart, ...contentParts] = message.split('</think>')

    // Extraer el contenido de <think> y limpiar etiquetas
    think = thinkPart.replace('<think>', '').trim()

    // El resto del contenido después de </think>
    content = contentParts.join('</think>').trim()
  }

  // Limpiar caracteres de escape innecesarios
  think = think.replace(/\\n/g, '\n').replace(/\\t/g, '\t')
  content = content.replace(/\\n/g, '\n').replace(/\\t/g, '\t')

  return {
    think,
    content,
  }
}
