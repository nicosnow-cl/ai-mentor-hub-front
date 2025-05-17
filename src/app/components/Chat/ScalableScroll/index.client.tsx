'use client'

import { useScroll, useTransform, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

export type ScalabelScrollProps = React.ComponentPropsWithoutRef<
  typeof motion.div
> & {
  children: React.ReactNode
  containerRef?: React.RefObject<HTMLElement | null>
}

export function ScalableScroll({
  children,
  containerRef,
  style,
  ...restProps
}: ScalabelScrollProps) {
  const [scales, setScales] = useState([1, 0.5, 0.25])
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll(
    containerRef?.current
      ? {
          container: containerRef,
          target: ref,
          offset: ['end end', 'start start'],
        }
      : undefined
  )

  const scale = useTransform(scrollYProgress || 0, [0, 0.5, 1], scales)

  useEffect(() => {
    const updateScales = () => {
      const width = window.innerWidth

      if (width < 640) {
        // Mobile
        setScales([1, 0.9, 0.8])
      } else if (width < 1024) {
        // Tablet
        setScales([1, 0.85, 0.75])
      } else {
        // Desktop
        setScales([1, 0.8, 0.7])
      }
    }

    updateScales()
  }, [])

  return (
    <motion.div ref={ref} style={{ ...style, scale }} {...restProps}>
      {children}
    </motion.div>
  )
}
