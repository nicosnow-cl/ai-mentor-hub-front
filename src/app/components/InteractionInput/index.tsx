import { AssistantIndicator } from "./AssistantIndicator/index.client";
import { InputMessage } from "./InputMessage/index.client";
import { MessageTextfield } from "./MessageTextfield";
import { RecorderButton } from "./RecorderButton/index.client";

export function InteractionInput() {
  return (
    <div className=" grid grid-cols-4 place-items-center">
      <div className=" col-span-1">
        <AssistantIndicator />
      </div>

      <div className="relative w-full col-span-3 flex flex-col gap-y-1">
        <InputMessage />

        <div className="w-full h-fit bg-slate-800/50 border-slate-600 border rounded-2xl p-2 shadow-lg">
          <div className="flex gap-x-4">
            <MessageTextfield />

            <RecorderButton />
          </div>
        </div>
      </div>
    </div>
  );
}
