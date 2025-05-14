import { MessageTextfield } from './MessageTextfield'
import { RecorderButton } from './RecorderButton/index.client'
import { RecordingTimeBar } from './RecordingTimeBar/index.client'

export function InteractionInput() {
  return (
    <div className="relative col-span-4 w-full">
      <div className="glass h-fit w-full rounded-2xl border border-slate-600 bg-slate-800/50 p-2 shadow-lg">
        <div className="flex gap-x-4">
          <MessageTextfield />

          <RecorderButton />
        </div>
      </div>

      <RecordingTimeBar />
    </div>
  )
}
