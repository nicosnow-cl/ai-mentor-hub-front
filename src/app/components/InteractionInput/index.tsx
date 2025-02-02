import { AssistantIndicator } from "./AssistantIndicator";
import { MessageTextfield } from "./MessageTextfield";
import { RecorderButton } from "./RecorderButton/index.client";

export function InteractionInput() {
  return (
    <div className=" grid grid-cols-4">
      <div className=" col-span-1">
        <AssistantIndicator />
      </div>

      <div className="bg-green-500 col-span-3">
        <RecorderButton />
        <MessageTextfield />
      </div>
    </div>
  );
}
