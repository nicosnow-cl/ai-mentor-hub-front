"use client";

import { useScroll, useTransform, motion } from "motion/react";
import { useRef } from "react";

export type ScalabelScrollProps = React.ComponentPropsWithoutRef<
  typeof motion.div
> & {
  children: React.ReactNode;
  containerRef?: React.RefObject<HTMLElement | null>;
};

export function ScalableScroll({
  children,
  containerRef,
  style,
  ...restProps
}: ScalabelScrollProps) {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    container: containerRef,
    target: ref,
    offset: ["end end", "start start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0.25]);

  return (
    <motion.div ref={ref} style={{ scale, ...style }} {...restProps}>
      {children}
    </motion.div>
  );
}
