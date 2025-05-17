import { IconMicrophone } from '@tabler/icons-react'

export type ButtonProps = React.ComponentPropsWithoutRef<'button'> & {
  isActive?: boolean
}

export function Button({
  className,
  isActive,
  disabled,
  ...props
}: Readonly<ButtonProps>) {
  return (
    <div
      className={`group relative ${disabled ? 'opacity-50' : 'opacity-100'}`}
    >
      {isActive && (
        <span className="absolute inset-0 -z-10 size-full animate-ping rounded-full bg-blue-950" />
      )}

      <button
        type="button"
        {...props}
        className={`z-10 rounded-full bg-zinc-950 p-4 shadow-md transition-colors duration-300 group-hover:bg-slate-950 ${className}`}
        disabled={disabled}
      >
        <IconMicrophone className="size-6 transition-colors duration-300 group-hover:text-blue-200" />
      </button>
    </div>
  )
}
