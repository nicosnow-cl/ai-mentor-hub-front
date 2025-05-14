import { Accelerators } from './components/InteractionInput/Accelerators'
import { Avatar } from './components/Assitant/Avatar/index.client'
import { Chat } from './components/Chat/index.client'
import { InteractionInput } from './components/InteractionInput'
import { Navbar } from './components/Navbar'
import { StatusIndicator } from './components/Assitant/StatusIndicator/index.client'
import { VoiceSpeech } from './components/VoiceSpeech/index.client'
import { AuroraHero } from './components/common/AuroraHero'

export default function Home() {
  return (
    <div className="flex h-screen flex-col items-center pb-2 font-[family-name:var(--font-geist-sans)]">
      <AuroraHero />
      <Navbar />

      <VoiceSpeech />

      <main className="w-full max-w-[1920px] flex-1 px-2">
        <Chat />
      </main>

      <section className="mt-auto grid w-full place-items-center gap-y-2 px-2">
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 translate-y-1/2">
          <Avatar />
        </div>

        <div className="flex w-full max-w-[40rem] flex-col gap-y-1">
          <StatusIndicator />

          <InteractionInput />
        </div>

        <Accelerators />
      </section>
    </div>
  )
}
