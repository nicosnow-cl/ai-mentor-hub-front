'use client'

import { animate, Easing, motion, useMotionValue } from 'motion/react'
import { useEffect } from 'react'
import shuffle from 'lodash/shuffle'

const DEFAULT_SHAPE =
  'M63.8 -63.8C80.5 -47.1 90.2 -23.6 90.2 0C90.2 23.6 80.5 47.1 63.8 63.8C47.1 80.5 23.6 90.2 0 90.2C-23.6 90.2 -47.1 80.5 -63.8 63.8C-80.5 47.1 -90.2 23.6 -90.2 0C-90.2 -23.6 -80.5 -47.1 -63.8 -63.8C-47.1 -80.5 -23.6 -90.2 0 -90.2C23.6 -90.2 47.1 -80.5 63.8 -63.8'

const BLOB_SHAPES = {
  default: [
    DEFAULT_SHAPE,
    'M58 -56.8C74 -42 85 -21 86.3 1.3C87.6 23.6 79.1 47.1 63.1 61.7C47.1 76.3 23.6 81.9 1.1 80.8C-21.4 79.8 -42.9 72.1 -59.1 57.5C-75.2 42.9 -86.1 21.4 -85.6 0.5C-85.2 -20.5 -73.3 -41 -57.2 -55.8C-41 -70.7 -20.5 -79.8 0.2 -80.1C21 -80.3 42 -71.6 58 -56.8',
    DEFAULT_SHAPE,
    'M62.8 -63.1C78.5 -47.1 86.2 -23.6 84.8 -1.5C83.3 20.6 72.6 41.3 56.9 56.1C41.3 70.9 20.6 80 -1 81C-22.6 82 -45.3 74.9 -61.6 60.1C-77.9 45.3 -88 22.6 -88.2 -0.2C-88.4 -23.1 -78.9 -46.2 -62.5 -62.2C-46.2 -78.2 -23.1 -87.1 0.2 -87.3C23.6 -87.6 47.1 -79.1 62.8 -63.1',
    DEFAULT_SHAPE,
    'M62.8 -63.1C78.5 -47.1 86.2 -23.6 84.8 -1.5C83.3 20.6 72.6 41.3 56.9 56.1C41.3 70.9 20.6 80 -1 81C-22.6 82 -45.3 74.9 -61.6 60.1C-77.9 45.3 -88 22.6 -88.2 -0.2C-88.4 -23.1 -78.9 -46.2 -62.5 -62.2C-46.2 -78.2 -23.1 -87.1 0.2 -87.3C23.6 -87.6 47.1 -79.1 62.8 -63.1',
  ],
  beat: [
    'M60.9 -59.8C76.6 -45.3 85.3 -22.6 84.7 -0.6C84.1 21.4 74.2 42.9 58.6 59.2C42.9 75.6 21.4 86.8 -0.9 87.7C-23.3 88.7 -46.7 79.3 -62 63C-77.3 46.7 -84.7 23.3 -84.8 -0.1C-84.9 -23.6 -77.8 -47.1 -62.5 -61.7C-47.1 -76.3 -23.6 -81.9 -0.5 -81.4C22.6 -81 45.3 -74.4 60.9 -59.8',
    DEFAULT_SHAPE,
    'M61.5 -61C78.1 -44.8 89.1 -22.4 88.9 -0.1C88.8 22.2 77.6 44.3 61 58.9C44.3 73.5 22.2 80.5 0.7 79.8C-20.7 79.1 -41.5 70.7 -57.3 56.1C-73.2 41.5 -84.1 20.7 -84 0.1C-83.8 -20.5 -72.7 -41 -56.8 -57.2C-41 -73.3 -20.5 -85.2 0.9 -86.1C22.4 -87.1 44.8 -77.1 61.5 -61',
    DEFAULT_SHAPE,
    'M63.5 -62.1C79.8 -47.1 88.9 -23.6 87.4 -1.5C86 20.6 73.9 41.3 57.6 57.3C41.3 73.3 20.6 84.6 -1.4 86C-23.3 87.3 -46.7 78.7 -61.5 62.7C-76.3 46.7 -82.7 23.3 -81.6 1.1C-80.5 -21.2 -72.1 -42.4 -57.3 -57.4C-42.4 -72.4 -21.2 -81.2 1.2 -82.4C23.6 -83.6 47.1 -77.1 63.5 -62.1',
  ],
  struggle: [
    'M49.5 -53.2C60.3 -38.7 62.7 -19.3 61.5 -1.2C60.3 17 55.6 33.9 44.8 44.4C33.9 54.8 17 58.6 1.1 57.6C-14.8 56.5 -29.7 50.5 -46.4 40.1C-63 29.7 -81.5 14.8 -83.3 -1.8C-85.1 -18.4 -70.1 -36.8 -53.4 -51.3C-36.8 -65.8 -18.4 -76.4 0.5 -76.9C19.3 -77.3 38.7 -67.7 49.5 -53.2',
    'M44.6 -43.1C59.8 -29.5 75.4 -14.7 79.8 4.4C84.2 23.6 77.5 47.1 62.3 58.1C47.1 69.1 23.6 67.6 2.5 65.1C-18.6 62.6 -37.2 59.2 -47.9 48.2C-58.6 37.2 -61.3 18.6 -63.4 -2.1C-65.5 -22.9 -67.1 -45.7 -56.4 -59.4C-45.7 -73.1 -22.9 -77.5 -4.1 -73.5C14.7 -69.4 29.5 -56.8 44.6 -43.1',
    'M57.6 -58.5C68 -47.1 65.2 -23.6 64.8 -0.5C64.3 22.6 66.1 45.3 55.7 56.4C45.3 67.6 22.6 67.3 2.8 64.5C-17 61.6 -33.9 56.3 -47.3 45.1C-60.6 33.9 -70.3 17 -73.4 -3.1C-76.4 -23.1 -72.9 -46.2 -59.5 -57.5C-46.2 -68.9 -23.1 -68.4 0.2 -68.7C23.6 -68.9 47.1 -69.8 57.6 -58.5',
    'M44.3 -39.8C59.1 -29.5 74.1 -14.7 74.1 0.1C74.2 14.8 59.4 29.7 44.5 46.4C29.7 63 14.8 81.5 -2 83.5C-18.9 85.5 -37.7 71 -51.2 54.4C-64.7 37.7 -72.9 18.9 -72.7 0.1C-72.6 -18.6 -64.2 -37.2 -50.7 -47.6C-37.2 -57.9 -18.6 -60 -1.9 -58C14.7 -56.1 29.5 -50.1 44.3 -39.8',
    'M63.3 -59.8C80 -46.7 90 -23.3 85.7 -4.3C81.4 14.7 62.8 29.5 46.1 41.3C29.5 53.1 14.7 62.1 -1.5 63.5C-17.7 65 -35.4 59 -50.7 47.2C-66 35.4 -79 17.7 -78.8 0.2C-78.5 -17.2 -65.1 -34.4 -49.7 -47.6C-34.4 -60.7 -17.2 -69.9 3.1 -72.9C23.3 -76 46.7 -73 63.3 -59.8',
  ],
}

const ANIMATION_DURATIONS = {
  default: {
    ease: 'easeInOut',
    duration: 20,
  },
  beat: {
    ease: 'easeInOut',
    duration: 0.8,
  },
  struggle: {
    ease: 'anticipate',
    duration: 5,
  },
}

export type BlobAnimation = keyof typeof BLOB_SHAPES

export type BlobProps = {
  animation?: BlobAnimation
}

const handleAnimation = (
  animation: BlobAnimation,
  currentShape?: string
): {
  shapes: string[]
  animationConfig: { ease: string; duration: number }
} => {
  const { ease, duration } = ANIMATION_DURATIONS[animation]

  switch (animation) {
    case 'struggle': {
      const shapes = [currentShape, ...shuffle(BLOB_SHAPES[animation])]

      return {
        shapes: shapes as string[],
        animationConfig: {
          ease,
          duration,
        },
      }
    }

    default: {
      const shapes = [currentShape, ...BLOB_SHAPES[animation]]

      return {
        shapes: shapes as string[],
        animationConfig: {
          ease,
          duration,
        },
      }
    }
  }
}

export function Blob({ animation = 'default' }: Readonly<BlobProps>) {
  const shape = useMotionValue(DEFAULT_SHAPE)

  useEffect(() => {
    if (!animation) return

    const { shapes, animationConfig } = handleAnimation(animation, shape.get())

    animate(shape, shapes, {
      ease: animationConfig.ease as Easing,
      duration: animationConfig.duration,
      repeat: Infinity,
      repeatType: 'mirror',
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animation])

  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow
            dx="0"
            dy="4"
            stdDeviation="8"
            floodColor="rgb(244 114 182)"
            floodOpacity="0.5"
          />
        </filter>
      </defs>

      <motion.path
        filter="url(#shadow)"
        className="fill-slate-950 stroke-white/30"
        transform="translate(100 100)"
        d={shape}
      />
    </svg>
  )
}
