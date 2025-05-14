import { Actions } from './Actions'
import { Logo } from './Logo'

export function Navbar() {
  return (
    <div className="glass glass-soft flex h-14 w-full items-center justify-center border-b border-slate-600 bg-slate-800/50 px-4 shadow-lg">
      <Logo />

      <Actions />
    </div>
  )
}
