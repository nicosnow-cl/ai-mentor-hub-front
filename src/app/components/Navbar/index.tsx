import { Button } from "./Button";

export function Navbar() {
  return (
    <div className="fixed inset-0 bg-slate-800/50 border-slate-600 border-b w-full h-14 flex items-center justify-center px-4 shadow-lg z-10">
      <div className="relative size-40">
        <div className="blob layer-1 opacity-50" />
        <div className={`blob layer-2 opacity-50`} />
        <div className={`blob layer-3`} />

        <span className="absolute bottom-16 text-center mx-auto left-0 right-0 text-3xl font-bold">
          AMH
        </span>
      </div>

      <Button />
    </div>
  );
}
