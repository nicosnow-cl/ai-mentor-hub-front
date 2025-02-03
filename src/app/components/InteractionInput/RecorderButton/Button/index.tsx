import { IconMicrophone } from "@tabler/icons-react";

export type ButtonProps = React.ComponentPropsWithoutRef<"button"> & {
  isActive?: boolean;
};

export function Button({
  className,
  isActive,
  disabled,
  ...props
}: Readonly<ButtonProps>) {
  return (
    <div
      className={`relative group ${disabled ? "opacity-50" : "opacity-100"}`}
    >
      {isActive && (
        <span className="bg-blue-950 absolute size-full rounded-full inset-0 -z-10 animate-ping" />
      )}

      <button
        {...props}
        className={`z-10 bg-zinc-950 p-4 rounded-full shadow-md group-hover:bg-slate-950 transition-colors duration-300 ${className}`}
        disabled={disabled}
      >
        <IconMicrophone className="size-6 group-hover:text-blue-200 transition-colors duration-300" />
      </button>
    </div>
  );
}
