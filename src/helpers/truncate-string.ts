export const truncateString = (str: string, maxLength = 200): string => {
  const parsedString = str.trim().replace(/\\n/g, '\n').replace(/\\t/g, '\t')

  if (parsedString.length <= maxLength) {
    return parsedString
  }

  return parsedString.substring(0, maxLength) + '...'
}
