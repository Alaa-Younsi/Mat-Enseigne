/** Every photo ships in two widths (800 / 1600) as optimised WebP in /public/images. */
export const IMAGE_WIDTHS = [800, 1600] as const

export function imageSrc(name: string, width: (typeof IMAGE_WIDTHS)[number] = 1600) {
  return `/images/${name}-${width}.webp`
}

export function imageSrcSet(name: string) {
  return IMAGE_WIDTHS.map((w) => `${imageSrc(name, w)} ${w}w`).join(', ')
}
