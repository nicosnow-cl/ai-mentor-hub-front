import { Accelerators } from './Accelerators'
import { AssistantIndicator } from './AssistantIndicator/index.client'
import { InteractionStatusIndicator } from './InteractionStatusIndicator/index.client'
import { MessageTextfield } from './MessageTextfield'
import { RecorderButton } from './RecorderButton/index.client'
import { RecordingTimeBar } from './RecordingTimeBar/index.client'

export function InteractionInput() {
  return (
    <div className="relative mx-auto grid w-full max-w-[40rem] grid-cols-4 place-items-center md:w-3/5">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
        <AssistantIndicator />
      </div>

      <div className="relative col-span-4 w-full">
        <InteractionStatusIndicator />

        <div className="glass h-fit w-full rounded-2xl border border-slate-600 bg-slate-800/50 p-2 shadow-lg">
          <div className="flex gap-x-4">
            <MessageTextfield />

            <RecorderButton />
          </div>
        </div>

        <RecordingTimeBar />
      </div>

      <Accelerators />
    </div>
  )
}
