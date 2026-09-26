import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  type AnimationPlaybackControls,
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
} from 'motion/react'
import {
  type KeyboardEvent,
  type PointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { cn } from '@/lib/cn'
import { Img } from './Img'

interface Side {
  /** Image base name (see `Img`). */
  name: string
  alt: string
}

interface BeforeAfterProps {
  before: Side
  after: Side
  /** Intrinsic size of the pair, used to reserve the exact aspect ratio. */
  width: number
  height: number
  /** Starting handle position, 0–100 (% from the left). */
  initial?: number
  sizes?: string
  priority?: boolean
  /** Play a short left/right nudge the first time the slider scrolls into view. */
  hint?: boolean
  className?: string
}

const EASE = [0.65, 0, 0.35, 1] as const
const clamp = (value: number) => Math.min(100, Math.max(0, value))

/**
 * Before / after comparison. The "après" photo sits on top and is revealed
 * to the right of the handle; drag anywhere on the image (mouse or touch),
 * or use the arrow keys on the handle.
 */
export function BeforeAfter({
  before,
  after,
  width,
  height,
  initial = 50,
  sizes = '100vw',
  priority = false,
  hint = true,
  className,
}: BeforeAfterProps) {
  const ref = useRef<HTMLDivElement>(null)
  const sliderRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const position = useMotionValue(initial)
  const [dragging, setDragging] = useState(false)
  const interacted = useRef(false)
  /** The one-time hint; cancelled the instant the visitor takes over (even during its start delay). */
  const hintRef = useRef<AnimationPlaybackControls | null>(null)
  /** Container geometry, measured once per drag instead of on every pointer event. */
  const rect = useRef<{ left: number; width: number } | null>(null)

  // Everything below is driven by transforms / opacity only — compositor work,
  // no React renders, no layout and no repaint of the large photos while dragging.
  const revealX = useTransform(position, (p) => `${p}%`)
  const counterX = useTransform(position, (p) => `${-p}%`)
  const beforeLabelOpacity = useTransform(position, [8, 22], [0, 1])
  const afterLabelOpacity = useTransform(position, [78, 92], [1, 0])

  // Keep the ARIA value in sync without re-rendering on every frame.
  useMotionValueEvent(position, 'change', (latest) => {
    const node = sliderRef.current
    if (!node) return
    const value = Math.round(latest)
    if (node.getAttribute('aria-valuenow') === String(value)) return
    node.setAttribute('aria-valuenow', String(value))
    node.setAttribute('aria-valuetext', `${100 - value} % du résultat visible`)
  })

  // One-time hint so visitors understand the image is interactive.
  useEffect(() => {
    if (!hint || !inView || reduce || interacted.current) return
    const controls = animate(position, [initial, initial - 22, initial + 18, initial], {
      duration: 2.2,
      ease: EASE,
      delay: 0.3,
    })
    hintRef.current = controls
    return () => controls.stop()
  }, [hint, inView, reduce, initial, position])

  /** Stop every running or pending tween so nothing fights the visitor's input. */
  const takeOver = () => {
    interacted.current = true
    hintRef.current?.stop()
    hintRef.current = null
    position.stop()
  }

  const moveTo = useCallback(
    (clientX: number) => {
      const box = rect.current
      if (!box || box.width === 0) return
      position.set(clamp(((clientX - box.left) / box.width) * 100))
    },
    [position],
  )

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    const bounds = event.currentTarget.getBoundingClientRect()
    rect.current = { left: bounds.left, width: bounds.width }
    takeOver()
    event.currentTarget.setPointerCapture(event.pointerId)
    setDragging(true)
    moveTo(event.clientX)
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!rect.current) return
    moveTo(event.clientX)
  }

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    rect.current = null
    setDragging(false)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? 10 : 4
    const keys: Record<string, number> = {
      ArrowLeft: position.get() - step,
      ArrowDown: position.get() - step,
      ArrowRight: position.get() + step,
      ArrowUp: position.get() + step,
      Home: 0,
      End: 100,
    }
    const next = keys[event.key]
    if (next === undefined) return
    event.preventDefault()
    takeOver()
    animate(position, clamp(next), { duration: reduce ? 0 : 0.25, ease: 'easeOut' })
  }

  return (
    <div
      ref={ref}
      className={cn(
        'group/ba relative isolate w-full touch-pan-y select-none overflow-hidden bg-plum-800',
        dragging ? 'cursor-grabbing' : 'cursor-ew-resize',
        className,
      )}
      style={{ aspectRatio: `${width} / ${height}` }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      {/* Avant (base layer) */}
      <Img
        name={before.name}
        alt={before.alt}
        sizes={sizes}
        priority={priority}
        draggable={false}
        className="absolute inset-0 size-full object-cover"
      />

      {/* Après: a window slid right by p%, with the photo slid back by -p% so it stays put */}
      <motion.div
        className="absolute inset-0 overflow-hidden will-change-transform"
        style={{ x: revealX }}
      >
        <motion.div className="absolute inset-0 will-change-transform" style={{ x: counterX }}>
          <Img
            name={after.name}
            alt={after.alt}
            sizes={sizes}
            priority={priority}
            draggable={false}
            className="absolute inset-0 size-full object-cover"
          />
        </motion.div>
      </motion.div>

      {/* Labels */}
      <motion.span
        aria-hidden="true"
        style={{ opacity: beforeLabelOpacity }}
        className="pointer-events-none absolute top-4 left-4 rounded-full bg-plum-950/70 px-3.5 py-1.5 font-semibold text-[0.7rem] text-cream-100 uppercase tracking-[0.2em] backdrop-blur-md sm:top-5 sm:left-5"
      >
        Avant
      </motion.span>
      <motion.span
        aria-hidden="true"
        style={{ opacity: afterLabelOpacity }}
        className="pointer-events-none absolute top-4 right-4 rounded-full bg-ember-500 px-3.5 py-1.5 font-semibold text-[0.7rem] text-cream-50 uppercase tracking-[0.2em] shadow-lg shadow-ember-700/30 sm:top-5 sm:right-5"
      >
        Après
      </motion.span>

      {/* Handle */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-10 will-change-transform"
        style={{ x: revealX }}
      >
        <span className="absolute inset-y-0 left-0 -ml-px w-0.5 bg-cream-50 shadow-[0_0_18px_rgba(234,132,80,0.9)]" />
        <div
          ref={sliderRef}
          role="slider"
          tabIndex={0}
          aria-label="Comparer avant et après : faites glisser pour révéler le résultat"
          aria-orientation="horizontal"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={initial}
          aria-valuetext={`${100 - initial} % du résultat visible`}
          onKeyDown={onKeyDown}
          className={cn(
            'pointer-events-auto absolute top-1/2 left-0 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full',
            'bg-ember-500 text-cream-50 shadow-[0_10px_30px_-6px_rgba(20,6,25,0.7)] ring-4 ring-cream-50/90',
            'transition-transform duration-300 ease-out-expo focus-visible:outline-offset-8 group-hover/ba:scale-105',
            dragging && 'scale-110 group-hover/ba:scale-110',
          )}
        >
          <span className="flex items-center" aria-hidden="true">
            <ChevronLeft className="-mr-1 size-5" />
            <ChevronRight className="-ml-1 size-5" />
          </span>
        </div>
      </motion.div>
    </div>
  )
}
