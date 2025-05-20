import { cn } from '@/lib/utils'

export type ButtonProps = React.ComponentPropsWithoutRef<'button'> & {
  isActive?: boolean
}

export function Button({
  children,
  className,
  isActive,
  disabled,
  ...props
}: Readonly<ButtonProps>) {
  return (
    <div
      className={cn('group relative', disabled ? 'opacity-50' : 'opacity-100')}
    >
      <button
        type="button"
        {...props}
        className={cn(
          'z-10 rounded-full bg-zinc-950 p-4 shadow-md transition-colors duration-300',
          !disabled && 'group-hover:bg-slate-950',
          className
        )}
        disabled={disabled}
      >
        {isActive && (
          <span className="absolute inset-0 -z-10 size-full animate-ping rounded-full bg-blue-950" />
        )}

        {children}
      </button>
    </div>
  )
}
