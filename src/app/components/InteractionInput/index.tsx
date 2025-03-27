import { AssistantIndicator } from "./AssistantIndicator/index.client";
import { InteractionStatusIndicator } from "./InteractionStatusIndicator/index.client";
import { MessageTextfield } from "./MessageTextfield";
import { RecorderButton } from "./RecorderButton/index.client";
import { RecordingTimeBar } from "./RecordingTimeBar/index.client";

export function InteractionInput() {
  return (
    <div className="w-full mx-auto relative grid grid-cols-4 place-items-center max-w-[40rem] md:w-3/5">
      <div className="absolute">
        <AssistantIndicator />
      </div>

      <div className="relative w-full col-span-4">
        <InteractionStatusIndicator />

        <div className="w-full h-fit bg-slate-800/50 border-slate-600 border rounded-2xl p-2 shadow-lg glass">
          <div className="flex gap-x-4">
            <MessageTextfield />

            <RecorderButton />
          </div>
        </div>

        <RecordingTimeBar />
      </div>
    </div>
  );
}
