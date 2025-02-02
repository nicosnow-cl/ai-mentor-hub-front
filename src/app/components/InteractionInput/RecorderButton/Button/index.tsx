import { IconMicrophone } from "@tabler/icons-react";

export type ButtonProps = React.ComponentPropsWithoutRef<"button">;

export function Button({ className, ...props }: Readonly<ButtonProps>) {
  return (
    <button
      {...props}
      className={`bg-slate-400 p-10 rounded-full ${className}`}
    >
      <IconMicrophone className="size-12" />
    </button>
  );
}
