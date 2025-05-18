'use client'

import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
} from 'motion/react'

import { cn } from '@/lib/utils'
import { useEffect } from 'react'

export type BackgroundProps = React.ComponentPropsWithoutRef<
  typeof motion.div
> & {
  backgroundColor: string
  gradientColors: string[]
}

export function Background({
  backgroundColor,
  children,
  className,
  gradientColors,
  ...props
}: Readonly<BackgroundProps>) {
  const gradient = useMotionValue(gradientColors[0])
  const backgroundImage = useMotionTemplate`radial-gradient(circle, ${gradient})`

  useEffect(() => {
    animate(gradient, gradientColors, {
      ease: 'easeInOut',
      duration: 15,
      repeat: Infinity,
      repeatType: 'mirror',
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gradientColors])

  return (
    <motion.div
      {...props}
      className={cn('size-full scale-150 blur-[5rem]', className)}
      initial={{ scale: 1, rotate: 0 }}
      animate={{
        scale: 1.5,
        rotate: 360,
      }}
      transition={{
        duration: 10,
        ease: 'linear',
        repeat: Infinity,
        repeatType: 'mirror',
      }}
      style={{
        ...props.style,
        backgroundColor,
        backgroundImage,
      }}
    >
      {children}
    </motion.div>
  )
}
