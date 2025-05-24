export const stringTemplateReplace = (
  template: string,
  replacements: Record<string, string | number | undefined>
) => {
  let templateReplaced = template

  for (const [key, value] of Object.entries(replacements)) {
    const regex = new RegExp(`{${key}}`, 'g')

    templateReplaced = templateReplaced.replace(regex, String(value ?? '____'))
  }

  return templateReplaced
}
