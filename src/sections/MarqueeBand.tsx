import { Marquee } from '@/components/ui/Marquee'
import { Spark } from '@/components/ui/Shapes'
import { marqueeItems } from '@/data/content'

/** Two crossing "tape" bands listing every trade — a nod to site signage tape. */
export function MarqueeBand() {
  return (
    <section
      aria-label="Nos savoir-faire"
      className="relative z-10 overflow-hidden bg-[linear-gradient(to_bottom,var(--color-plum-950)_50%,var(--color-cream-100)_50%)] py-10 sm:py-14"
    >
      <div className="relative z-10 -rotate-2 scale-105 bg-ember-500 py-4 text-plum-900 shadow-[0_18px_40px_-18px_rgba(20,6,25,0.7)] sm:py-5">
        <Marquee duration={38}>
          {marqueeItems.map((item) => (
            <span
              key={item}
              className="flex items-center gap-6 px-3 font-display font-bold text-2xl uppercase tracking-tight sm:gap-8 sm:px-4 sm:text-4xl"
            >
              {item}
              <Spark className="size-5 text-plum-800 sm:size-7" />
            </span>
          ))}
        </Marquee>
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-1/2 z-0 -translate-y-1/2 rotate-3 scale-110 bg-plum-800 py-3 text-cream-200"
      >
        <Marquee duration={46} reverse>
          {marqueeItems.map((item) => (
            <span
              key={item}
              className="flex items-center gap-6 px-3 font-serif text-xl italic sm:gap-8 sm:text-3xl"
            >
              {item}
              <span className="size-2 rounded-full bg-ember-500" />
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  )
}
