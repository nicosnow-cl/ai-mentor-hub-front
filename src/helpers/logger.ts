import { createLogger, format, transports, Logger } from 'winston'

const { combine, timestamp, printf, colorize } = format

let logger: Logger

const logFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`
})

const createWinstonLogger = () => {
  const logger = createLogger({
    format: combine(colorize(), timestamp(), logFormat),
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

export const parseMessage = (message: string): string => {
  return message
    .substring(0, 300) // Eliminar comillas al principio y al final
    .replace(/\\n/g, '\n') // Reemplazar \n por saltos de línea reales
    .replace(/\\t/g, '\t') // Reemplazar \t por tabulaciones reales
}
