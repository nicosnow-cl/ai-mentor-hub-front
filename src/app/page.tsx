import { Chat } from './components/Chat/index.client'
import { InteractionInput } from './components/InteractionInput'
import { Navbar } from './components/Navbar'
import { VoiceSpeech } from './components/VoiceSpeech/index.client'

export default function Home() {
  return (
    <>
      <VoiceSpeech />
      <Navbar />

      <div className="mt-14 grid min-h-[calc(100vh-56px)] w-screen max-w-[1920px] items-center justify-items-center gap-16 p-2 sm:p-20 md:p-8 md:pb-20">
        <main className="flex size-full flex-col items-center gap-8 sm:items-start md:row-start-2 md:gap-y-20">
          <Chat />

          <InteractionInput />
        </main>
      </div>
    </>
  )
}
