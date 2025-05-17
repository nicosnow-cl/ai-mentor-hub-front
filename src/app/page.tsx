import { Accelerators } from './components/InteractionInput/Accelerators'
import { AuroraHero } from './components/common/AuroraHero'
import { Avatar } from './components/Assitant/Avatar/index.client'
import { Chat } from './components/Chat/index.client'
import { InteractionInput } from './components/InteractionInput'
import { Navbar } from './components/Navbar'
import { StatusIndicator } from './components/Assitant/StatusIndicator/index.client'
import { VoiceSpeech } from './components/VoiceSpeech/index.client'

export default function Home() {
  return (
    <div className="flex h-[100dvh] w-[100dvw] flex-col items-center font-[family-name:var(--font-geist-sans)]">
      <AuroraHero />
      <Navbar />

      <VoiceSpeech />

      <main className="size-full px-2">
        <section className="mx-auto size-full max-w-[1920px]">
          <Chat />
        </section>
      </main>

      <footer className="relative mt-auto grid w-full place-items-center gap-y-2 p-1 md:p-2">
        <div className="absolute bottom-20 left-1/2 -z-10 -translate-x-1/2 translate-y-1/2">
          <Avatar />
        </div>

        <div className="flex w-full max-w-[40rem] flex-col gap-y-1">
          <StatusIndicator />

          <InteractionInput />
        </div>

        <Accelerators />
      </footer>
    </div>
  )
}
