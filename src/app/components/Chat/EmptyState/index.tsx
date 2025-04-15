import { Alert, AlertDescription } from '@/components/ui/alert'
import { IconInfoHexagon, IconMessageChatbotFilled } from '@tabler/icons-react'

export function EmptyState() {
  return (
    <div className="mx-auto flex flex-col items-center justify-center gap-y-4 text-center md:w-2/3">
      <IconMessageChatbotFilled className="h-16 w-16 text-muted" />

      <p className="text-xl font-bold">Empezar una conversación</p>

      <p className="text-sm">
        Escribe o habla para empezar a chatear con tu mentor digital. Puedes
        hacer preguntas, pedir consejos o simplemente charlar sobre cualquier
        tema que te interese.
      </p>

      <Alert className="mt-4 text-left opacity-50">
        <IconInfoHexagon className="h-4 w-4" />

        <AlertDescription>
          Si necesitas reiniciar la conversación, puedes hacerlo usando el botón
          que aparece en la parte superior de la pantalla.
        </AlertDescription>
      </Alert>
    </div>
  )
}
