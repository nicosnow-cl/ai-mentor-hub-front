import { createLogger, format, transports, Logger } from 'winston'

import { truncateString } from './truncate-string'

const { combine, timestamp, printf, colorize, align } = format
let logger: Logger

const createWinstonLogger = () => {
  const logger = createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(
      colorize({ all: true }),
      timestamp(),
      align(),
      printf(
        (info) =>
          `${info.timestamp} - ${info.level}: [${info.label || 'system'} | ${info.correlationId || ''}] ${truncateString(info.message as string)}`
      )
    ),
    transports: [new transports.Console()],
  })

  return logger
}

export const getLogger = (): Logger => {
  if (!logger) {
    logger = createWinstonLogger()
  }

  return logger
}
