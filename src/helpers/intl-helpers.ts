const DEFAULT_TIME_OPTIONS: Intl.DateTimeFormatOptions = {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
}

const DEFAULT_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}

export const getTime = (
  date: string | Date | number,
  options = DEFAULT_TIME_OPTIONS
): string => {
  if (typeof date === 'string') {
    date = new Date(date)
  } else if (typeof date === 'number') {
    date = new Date(date)
  }

  return new Intl.DateTimeFormat('en-US', options).format(date)
}

export const getDate = (
  date: string | Date | number,
  options: Intl.DateTimeFormatOptions = DEFAULT_DATE_OPTIONS
): string => {
  if (typeof date === 'string') {
    date = new Date(date)
  } else if (typeof date === 'number') {
    date = new Date(date)
  }

  return new Intl.DateTimeFormat('en-US', options).format(date)
}
