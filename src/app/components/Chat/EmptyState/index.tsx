import {
  IconBulbFilled,
  IconInnerShadowBottomFilled,
} from '@tabler/icons-react'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { TopicInput } from './TopicInput'

export function EmptyState() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center gap-y-4 text-center">
      <IconInnerShadowBottomFilled className="h-16 w-16 text-muted" />

      <p className="text-xl font-bold">Empieza una conversación</p>

      <p className="text-sm">
        <b>Escribe o habla</b> para empezar a chatear con tu mentor digital.
        Puedes hacer preguntas, pedir consejos o simplemente charlar sobre
        cualquier tema que te interese.
      </p>

      <TopicInput />

      <Alert className="mt-4 text-left opacity-75">
        <IconBulbFilled className="h-5 w-5" />

        <AlertDescription>
          Puedes reiniciar la conversación usando el botón que aparece en la
          parte superior de la pantalla
        </AlertDescription>
      </Alert>
    </div>
  )
}
