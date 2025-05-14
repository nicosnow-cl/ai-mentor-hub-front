import Image from 'next/image'

export function GalaxyHero() {
  return (
    <div className="fade-to-top fixed inset-0 -z-10 h-[50rem] w-screen opacity-25 brightness-105 contrast-125">
      <Image
        src="/imgs/galaxy-bg.jpg"
        alt="Galaxy background"
        style={{ objectFit: 'cover', objectPosition: 'center' }}
        fill
        priority
      />
    </div>
  )
}
