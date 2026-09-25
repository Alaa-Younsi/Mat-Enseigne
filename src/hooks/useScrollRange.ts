import { type MotionValue, transform, useTransform } from 'motion/react'

/**
 * Map a scroll-progress motion value from `input` to `output` (clamped).
 *
 * Equivalent to `useTransform(value, input, output)`, but uses the function
 * form on purpose: Motion hands range-based transforms of `useScroll` values to
 * native ScrollTimeline/ViewTimeline animations, and those map sub-ranges
 * incorrectly for sticky, taller-than-viewport targets (values run backwards
 * past the middle of the range). The function form keeps the mapping in JS,
 * which stays exact and still runs once per frame.
 */
export function useScrollRange<T>(
  value: MotionValue<number>,
  input: readonly number[],
  output: readonly T[],
): MotionValue<T> {
  const mapper = transform([...input], [...output])
  return useTransform(value, (latest: number) => mapper(latest))
}
