import { Plus } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useId, useState } from 'react'
import { WhatsAppIcon } from '@/components/ui/BrandIcons'
import { ButtonLink } from '@/components/ui/Button'
import { Reveal, SplitReveal } from '@/components/ui/Reveal'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { Stripes } from '@/components/ui/Shapes'
import { type Faq as FaqItem, faqs } from '@/data/content'
import { cn } from '@/lib/cn'
import { whatsappLink } from '@/lib/whatsapp'

function FaqRow({ item, open, onToggle }: { item: FaqItem; open: boolean; onToggle: () => void }) {
  const id = useId()
  return (
    <li className="border-plum-800/15 border-b">
      <h3>
        <button
          type="button"
          id={`${id}-trigger`}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          onClick={onToggle}
          className="group flex w-full items-center justify-between gap-6 py-6 text-left sm:py-7"
        >
          <span className="font-display font-semibold text-lg tracking-tight transition-colors group-hover:text-ember-600 sm:text-xl">
            {item.question}
          </span>
          <span
            className={cn(
              'grid size-10 shrink-0 place-items-center rounded-full ring-1 transition-all duration-500 ease-out-expo',
              open ? 'rotate-45 bg-ember-500 text-cream-50 ring-ember-500' : 'ring-plum-800/25',
            )}
          >
            <Plus className="size-4" />
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`${id}-panel`}
            role="region"
            aria-labelledby={`${id}-trigger`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="max-w-2xl pb-7 text-plum-800/75 leading-relaxed">{item.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  )
}

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="grain relative overflow-hidden bg-cream-100 py-24 text-plum-800 sm:py-32"
    >
      <Stripes
        bars={5}
        className="absolute top-0 right-[6%] h-24 w-20 text-plum-700 sm:h-32 sm:w-28"
      />
      <div className="container-px relative z-10 grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionLabel index="05" className="text-plum-700">
            Questions fréquentes
          </SectionLabel>
          <h2
            id="faq-title"
            className="mt-6 font-display font-bold text-[clamp(2.4rem,5vw,4.4rem)] leading-[0.98] tracking-[-0.04em]"
          >
            <SplitReveal text="Vous vous" className="block" />
            <SplitReveal
              text="demandez…"
              offset={2}
              className="block"
              wordClassName="font-serif font-normal italic text-ember-500"
            />
          </h2>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-sm text-plum-800/70 leading-relaxed">
              Une question qui n’est pas ici ? Écrivez-nous directement, on vous répond rapidement.
            </p>
            <div className="mt-8">
              <ButtonLink
                href={whatsappLink()}
                variant="dark"
                icon={<WhatsAppIcon className="size-[1.1rem]" />}
              >
                Poser ma question
              </ButtonLink>
            </div>
          </Reveal>
        </div>

        <Reveal className="lg:col-span-7" delay={0.1}>
          <ul className="border-plum-800/15 border-t">
            {faqs.map((item, i) => (
              <FaqRow
                key={item.question}
                item={item}
                open={open === i}
                onToggle={() => setOpen(open === i ? null : i)}
              />
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
