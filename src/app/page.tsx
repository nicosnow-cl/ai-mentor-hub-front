import { Accelerators } from './components/InteractionInput/Accelerators'
import { Avatar } from './components/Assitant/Avatar/index.client'
import { Chat } from './components/Chat/index.client'
import { InteractionInput } from './components/InteractionInput'
import { Navbar } from './components/Navbar'
import { StatusIndicator } from './components/Assitant/StatusIndicator/index.client'
import { VoiceSpeech } from './components/VoiceSpeech/index.client'

export default function Home() {
  return (
    <>
      <VoiceSpeech />
      <Navbar />

      <div className="mt-14 grid min-h-[calc(100vh-56px)] w-screen max-w-[1920px] items-center justify-items-center gap-16 p-2">
        <main className="flex size-full flex-col items-center gap-8 sm:items-start md:row-start-2 md:gap-y-20">
          <Chat />

          <div className="relative grid w-full place-items-center gap-y-2">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
              <Avatar />
            </div>

            <div className="flex w-full max-w-[40rem] flex-col gap-y-1">
              <StatusIndicator />

              <InteractionInput />
            </div>

            <Accelerators />
          </div>
        </main>
      </div>
    </>
  )
}
