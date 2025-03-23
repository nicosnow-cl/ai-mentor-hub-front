import { Chat } from "./components/Chat/index.client";
import { InteractionInput } from "./components/InteractionInput";
import { VoiceSpeech } from "./components/VoiceSpeech/index.client";

export default function Home() {
  return (
    <div className="w-screen min-h-screen grid items-center justify-items-center p-2 max-w-[1920px] md:p-8 md:pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="size-full flex flex-col gap-8 md:gap-y-20 md:row-start-2 items-center sm:items-start">
        <Chat />

        <InteractionInput />
      </main>

      <VoiceSpeech />
    </div>
  );
}
