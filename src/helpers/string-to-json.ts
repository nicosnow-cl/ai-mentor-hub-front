export const stringToJSON = (str: string): Record<string, unknown> | null => {
  try {
    let trimmedStr = str.trim()

    // Eliminar delimitadores de bloques de código como ```json o ```
    if (trimmedStr.startsWith('```json')) {
      trimmedStr = trimmedStr.slice(6).trim() // Eliminar ```json
    } else if (trimmedStr.startsWith('```')) {
      trimmedStr = trimmedStr.slice(3).trim() // Eliminar ```
    }

    if (trimmedStr.endsWith('```')) {
      trimmedStr = trimmedStr.slice(0, -3).trim() // Eliminar ``` al final
    }

    // Intentar parsear el JSON
    return JSON.parse(trimmedStr)
  } catch (error) {
    console.error('Error parsing JSON string:', error)

    // Intentar corregir errores comunes en cadenas generadas por LLM
    const fixedStr = attemptToFixJSON(str)

    if (fixedStr) {
      try {
        return JSON.parse(fixedStr)
      } catch (nestedError) {
        console.error('Error parsing fixed JSON string:', nestedError)
      }
    }

    return null
  }
}

// Función para intentar corregir errores comunes en cadenas JSON
const attemptToFixJSON = (str: string): string | null => {
  try {
    let fixedStr = str.trim()

    // Eliminar delimitadores de bloques de código como ```json o ```
    if (fixedStr.startsWith('```json')) {
      fixedStr = fixedStr.slice(6).trim() // Eliminar ```json
    } else if (fixedStr.startsWith('```')) {
      fixedStr = fixedStr.slice(3).trim() // Eliminar ```
    }
    if (fixedStr.endsWith('```')) {
      fixedStr = fixedStr.slice(0, -3).trim() // Eliminar ``` al final
    }

    // Eliminar caracteres no deseados antes o después del JSON
    fixedStr = fixedStr.replace(/^[^{\[]+/, '').replace(/[^}\]]+$/, '')

    // Reemplazar comillas simples por comillas dobles
    fixedStr = fixedStr.replace(/'/g, '"')

    // Escapar caracteres problemáticos
    fixedStr = fixedStr.replace(/\\n/g, '\\n').replace(/\\t/g, '\\t')

    // Validar que la cadena corregida sea válida
    if (/^[{\[]/.test(fixedStr) && /[}\]]$/.test(fixedStr)) {
      return fixedStr
    }
  } catch (error) {
    console.error('Error attempting to fix JSON string:', error)
  }

  return null
}
