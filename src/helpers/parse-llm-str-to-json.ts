export const parseLLMStrToJSON = <T>(raw: string = ''): T | null => {
  try {
    const cleaned = raw
      .trim()
      .replace(/^```(json)?\s*/i, '') // elimina bloque markdown inicial
      .replace(/\s*```$/, '') // elimina bloque markdown final

    try {
      return JSON.parse(cleaned)
    } catch {
      //Intentamos unsteppear (por si viene doble escapado)
      const unescaped = cleaned
        .replace(/\\n/g, '\n')
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\')

      return JSON.parse(unescaped)
    }
  } catch (error) {
    console.error('No se pudo parsear el JSON generado por el LLM:', error)

    return null
  }
}
