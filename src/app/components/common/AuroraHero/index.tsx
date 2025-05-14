'use client'

import { cn } from '@/lib/utils'
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  animate,
} from 'motion/react'
import { useEffect } from 'react'

const DEFAULT_COLORS = [
  'rgba(39, 133, 200, 1)',
  'rgba(205, 133, 228, 1)',
  'rgba(199, 174, 227, 1)',
  'rgba(39, 134, 200, 1)',
]

export type AuroraHeroProps = React.ComponentPropsWithoutRef<
  typeof motion.div
> & {
  colors?: string[]
}

export function AuroraHero({
  className,
  style,
  colors = DEFAULT_COLORS,
  ...props
}: Readonly<AuroraHeroProps>) {
  const color = useMotionValue(colors[0])
  const backgroundImage = useMotionTemplate`radial-gradient(150% 125% at 50% 80%, transparent 50%, ${color})`

  useEffect(() => {
    animate(color, colors, {
      ease: 'easeInOut',
      duration: 15,
      repeat: Infinity,
      repeatType: 'mirror',
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colors])

  return (
    <motion.div
      className={cn(
        'fixed inset-0 -z-10 grid min-h-screen w-full place-content-center overflow-hidden opacity-50',
        className
      )}
      style={{ backgroundImage, ...style }}
      {...props}
    ></motion.div>
  )
}
