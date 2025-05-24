export const stringTemplateReplace = (
  template: string,
  replacements: Record<string, string | number | undefined>
) => {
  let templateReplaced = template

  for (const [key, value] of Object.entries(replacements)) {
    if (value === undefined) {
      continue
    }

    const regex = new RegExp(`{${key}}`, 'g')

    templateReplaced = templateReplaced.replace(regex, String(value))
  }

  return templateReplaced
}
