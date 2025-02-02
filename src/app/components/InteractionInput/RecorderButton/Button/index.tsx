import { IconMicrophone } from "@tabler/icons-react";

export type ButtonProps = React.ComponentPropsWithoutRef<"button">;

export function Button({ className, ...props }: Readonly<ButtonProps>) {
  return (
    <button
      {...props}
      className={`bg-zinc-950 p-4 rounded-full shadow-md hover:bg-slate-950 transition-colors duration-500  ${className}`}
    >
      <IconMicrophone className="size-6" />
    </button>
  );
}
