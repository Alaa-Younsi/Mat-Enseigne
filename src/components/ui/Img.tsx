import { type ComponentPropsWithoutRef, useState } from 'react'
import { cn } from '@/lib/cn'
import { imageSrc, imageSrcSet } from '@/lib/image'

interface ImgProps extends Omit<ComponentPropsWithoutRef<'img'>, 'src' | 'srcSet' | 'alt'> {
  /** Base name of an image in /public/images (without width suffix). */
  name: string
  alt: string
  /** Responsive `sizes` hint. Defaults to full viewport width. */
  sizes?: string
  /** Load eagerly with high priority (above-the-fold images). */
  priority?: boolean
}

/** Responsive, lazy-loaded WebP image that fades in once decoded. */
export function Img({
  name,
  alt,
  sizes = '100vw',
  priority = false,
  className,
  ...rest
}: ImgProps) {
  const [loaded, setLoaded] = useState(false)

  return (
    <img
      src={imageSrc(name)}
      srcSet={imageSrcSet(name)}
      sizes={sizes}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      onLoad={() => setLoaded(true)}
      className={cn(
        'transition-[opacity,filter] duration-700 ease-out-expo',
        // `filter-none` (not blur-0) once loaded, so big images don't stay on a filter layer.
        loaded ? 'opacity-100 filter-none' : 'opacity-0 blur-md',
        className,
      )}
      {...rest}
    />
  )
}
