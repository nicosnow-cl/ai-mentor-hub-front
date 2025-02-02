import { IconTransformPoint } from "@tabler/icons-react";

export function InputMessage() {
  return (
    <span className="flex gap-x-2 items-center pl-3 absolute -top-7">
      <IconTransformPoint className="size-5" />
      <i>Pensando...</i>
    </span>
  );
}
