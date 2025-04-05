import { Button } from './Button'

export function Navbar() {
  return (
    <div className="fixed inset-0 z-10 flex h-14 w-full items-center justify-center border-b border-slate-600 bg-slate-800/50 px-4 shadow-lg">
      <div className="relative size-40">
        <div className="blob layer-1 opacity-50" />
        <div className={`blob layer-2 opacity-50`} />
        <div className={`blob layer-3`} />

        <span className="absolute bottom-16 left-0 right-0 mx-auto text-center text-3xl font-bold">
          AMH
        </span>
      </div>

      <Button />
    </div>
  )
}
