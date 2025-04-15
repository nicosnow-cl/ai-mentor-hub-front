export const stringTemplateReplace = (
  template: string,
  replacements: Record<string, string>
) => {
  let templateReplaced = template

  for (const [key, value] of Object.entries(replacements)) {
    const regex = new RegExp(`{${key}}`, 'g')

    templateReplaced = templateReplaced.replace(regex, value)
  }

  return templateReplaced
}
