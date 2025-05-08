import { Message } from '@/types/chats'
import { MessageRole } from '@/enums/message-role.enum'

export const getThinkAndContent = (
  message: Message
): {
  think: string
  content: string
} => {
  // Validar que el contenido sea una cadena
  if (!message?.content || typeof message.content !== 'string') {
    return { think: '', content: '' }
  }

  const { role, content: rawContent } = message

  // Inicializar valores predeterminados
  let think = ''
  let content = rawContent

  // Verificar si el mensaje es del asistente y contiene la etiqueta </think>
  if (role === MessageRole.Assistant && rawContent.includes('</think>')) {
    const [thinkPart, ...contentParts] = rawContent.split('</think>')

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
