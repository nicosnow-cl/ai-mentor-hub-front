export type CircularProgressProps = {
  containerProps?: React.ComponentPropsWithoutRef<"div">;
  progress?: number;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
};

export function CircularProgress({
  containerProps,
  progress = 0,
  size = "md",
}: CircularProgressProps) {
  const { className: containerClassName, ...restContainerProps } =
    containerProps ?? {};

  const strokeDashoffset = 100 - progress;

  const getSize = () => {
    switch (size) {
      case "xs":
        return "size-5";
      case "sm":
        return "size-7";
      case "lg":
        return "size-10";
      case "xl":
        return "size-12";
      default:
        return "size-9";
    }
  };

  return (
    <div
      {...restContainerProps}
      className={`${getSize()} ${containerClassName}`}
    >
      <svg
        className="size-full -rotate-90"
        viewBox="0 0 36 36"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="18"
          cy="18"
          r="16"
          fill="none"
          className="stroke-current text-neutral-700"
          strokeWidth="2"
        />

        <circle
          cx="18"
          cy="18"
          r="16"
          fill="none"
          className="stroke-current"
          strokeWidth="2"
          strokeDasharray="100"
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.05s linear" }}
        />
      </svg>
    </div>
  );
}
