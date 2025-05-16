import { v4 as uuidv4 } from 'uuid'

export const getCorrelationId = (headers: Headers) => {
  let correlationId = headers.get('x-correlation-id')

  if (!correlationId) {
    correlationId = uuidv4()
  }

  return correlationId
}
