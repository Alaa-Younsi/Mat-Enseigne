import { zodResolver } from '@hookform/resolvers/zod'
import { Check, MapPin, Phone, Send } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { InstagramIcon, WhatsAppIcon } from '@/components/ui/BrandIcons'
import { Reveal, SplitReveal } from '@/components/ui/Reveal'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { site } from '@/config/site'
import { services } from '@/data/services'
import { cn } from '@/lib/cn'
import { formatQuoteMessage, whatsappLink } from '@/lib/whatsapp'

const FR_PHONE = /^(?:\+33\s?|0)[1-9](?:[\s.-]?\d{2}){4}$/

const serviceOptions = [...services.map((s) => s.title), 'Autre / plusieurs prestations'] as const

const quoteSchema = z.object({
  name: z.string().trim().min(2, 'Indiquez votre nom (2 caractères minimum).').max(80),
  phone: z.string().trim().regex(FR_PHONE, 'Numéro de téléphone invalide (ex. 06 12 34 56 78).'),
  service: z.string().min(1, 'Choisissez une prestation.'),
  location: z.string().trim().max(80).optional(),
  message: z
    .string()
    .trim()
    .min(10, 'Décrivez votre projet en quelques mots (10 caractères minimum).')
    .max(1200, '1200 caractères maximum.'),
})

type QuoteForm = z.infer<typeof quoteSchema>

const fieldClass =
  'peer w-full rounded-2xl border-0 bg-plum-950/[0.04] px-4 pt-6 pb-2.5 text-plum-900 ring-1 ring-plum-900/12 transition placeholder:text-transparent focus:bg-cream-50 focus:outline-none focus:ring-2 focus:ring-ember-500 aria-[invalid=true]:ring-ember-600'
const labelClass =
  'pointer-events-none absolute top-2 left-4 font-medium text-[0.7rem] text-plum-800/60 uppercase tracking-[0.14em]'

function FieldError({ id, message }: { id: string; message: string | undefined }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.p
          id={id}
          role="alert"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-1.5 pl-1 text-ember-700 text-sm"
        >
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  )
}

function QuoteFormCard() {
  const [sent, setSent] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<QuoteForm>({
    resolver: zodResolver(quoteSchema),
    defaultValues: { name: '', phone: '', service: '', location: '', message: '' },
    mode: 'onTouched',
  })

  const onSubmit = (data: QuoteForm) => {
    window.open(whatsappLink(formatQuoteMessage(data)), '_blank', 'noopener,noreferrer')
    setSent(true)
    reset()
  }

  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-cream-100 p-6 text-plum-900 shadow-[0_40px_120px_-40px_rgba(217,99,43,0.45)] sm:p-10">
      <AnimatePresence mode="wait" initial={false}>
        {sent ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex min-h-[28rem] flex-col items-center justify-center text-center"
            role="status"
          >
            <span className="grid size-16 place-items-center rounded-full bg-ember-500 text-cream-50">
              <Check className="size-7" />
            </span>
            <h3 className="mt-6 font-display font-bold text-3xl tracking-tight">
              Presque terminé !
            </h3>
            <p className="mt-3 max-w-sm text-plum-800/70">
              WhatsApp s’est ouvert avec votre demande pré-remplie. Il ne vous reste qu’à appuyer
              sur « Envoyer ».
            </p>
            <button
              type="button"
              onClick={() => setSent(false)}
              className="mt-8 font-medium text-ember-600 underline underline-offset-4 hover:text-ember-700"
            >
              Faire une nouvelle demande
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid gap-4 sm:grid-cols-2"
            aria-label="Demande de devis"
          >
            <div className="sm:col-span-2">
              <h3 className="font-display font-bold text-2xl tracking-tight sm:text-3xl">
                Demande de devis
              </h3>
              <p className="mt-1 text-plum-800/65 text-sm">
                Gratuit et sans engagement — réponse rapide.
              </p>
            </div>

            <div>
              <div className="relative">
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Nom"
                  aria-invalid={errors.name ? true : undefined}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  className={fieldClass}
                  {...register('name')}
                />
                <label htmlFor="name" className={labelClass}>
                  Nom *
                </label>
              </div>
              <FieldError id="name-error" message={errors.name?.message} />
            </div>

            <div>
              <div className="relative">
                <input
                  id="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="Téléphone"
                  aria-invalid={errors.phone ? true : undefined}
                  aria-describedby={errors.phone ? 'phone-error' : undefined}
                  className={fieldClass}
                  {...register('phone')}
                />
                <label htmlFor="phone" className={labelClass}>
                  Téléphone *
                </label>
              </div>
              <FieldError id="phone-error" message={errors.phone?.message} />
            </div>

            <div>
              <div className="relative">
                <select
                  id="service"
                  aria-invalid={errors.service ? true : undefined}
                  aria-describedby={errors.service ? 'service-error' : undefined}
                  className={cn(fieldClass, 'appearance-none pr-10')}
                  {...register('service')}
                >
                  <option value="" disabled>
                    Sélectionner…
                  </option>
                  {serviceOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <label htmlFor="service" className={labelClass}>
                  Prestation *
                </label>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-plum-800/50"
                >
                  ▾
                </span>
              </div>
              <FieldError id="service-error" message={errors.service?.message} />
            </div>

            <div>
              <div className="relative">
                <input
                  id="location"
                  type="text"
                  autoComplete="address-level2"
                  placeholder="Ville"
                  className={fieldClass}
                  {...register('location')}
                />
                <label htmlFor="location" className={labelClass}>
                  Ville / arrondissement
                </label>
              </div>
            </div>

            <div className="sm:col-span-2">
              <div className="relative">
                <textarea
                  id="message"
                  rows={5}
                  placeholder="Votre projet"
                  aria-invalid={errors.message ? true : undefined}
                  aria-describedby={errors.message ? 'message-error' : undefined}
                  className={cn(fieldClass, 'resize-none pt-7')}
                  {...register('message')}
                />
                <label htmlFor="message" className={labelClass}>
                  Votre projet *
                </label>
              </div>
              <FieldError id="message-error" message={errors.message?.message} />
            </div>

            <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-plum-800/55 text-xs leading-relaxed sm:max-w-xs">
                Votre demande est envoyée via WhatsApp. Aucune donnée n’est stockée sur ce site.
              </p>
              <button
                type="submit"
                disabled={isSubmitting}
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-ember-500 py-2 pr-2 pl-6 font-display font-semibold text-cream-50 shadow-[0_10px_40px_-12px] shadow-ember-500/70 transition-colors hover:bg-ember-600 disabled:opacity-60"
              >
                Envoyer ma demande
                <span className="grid size-10 place-items-center rounded-full bg-cream-50 text-ember-600 transition-transform duration-500 ease-out-expo group-hover:rotate-[-20deg]">
                  <Send className="size-4" />
                </span>
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}

const channels = [
  {
    label: 'WhatsApp',
    value: site.phone.display,
    href: whatsappLink(),
    icon: WhatsAppIcon,
    external: true,
  },
  {
    label: 'Téléphone',
    value: site.phone.display,
    href: `tel:${site.phone.e164}`,
    icon: Phone,
    external: false,
  },
  {
    label: 'Instagram',
    value: `@${site.instagram.handle}`,
    href: site.instagram.url,
    icon: InstagramIcon,
    external: true,
  },
] as const

export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="grain relative overflow-hidden bg-plum-900 py-24 text-cream-100 sm:py-32"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/3 -left-40 size-[36rem] rounded-full bg-ember-600/25 blur-[140px]" />
        <div className="absolute -right-32 bottom-0 size-[30rem] rounded-full bg-plum-500/40 blur-[120px]" />
      </div>

      <div className="container-px relative z-10 grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <SectionLabel index="06" className="text-cream-100/70">
            Contact
          </SectionLabel>
          <h2
            id="contact-title"
            className="mt-6 font-display font-bold text-[clamp(2.6rem,6vw,5.4rem)] text-cream-50 leading-[0.96] tracking-[-0.04em]"
          >
            <SplitReveal text="Parlons de" className="block" />
            <SplitReveal
              text="votre façade."
              offset={2}
              className="block"
              wordClassName="font-serif font-normal italic text-ember-400"
            />
          </h2>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-md text-cream-100/65 text-lg leading-relaxed">
              Envoyez une photo de votre devanture, de votre vitrine ou de votre véhicule : nous
              vous proposons une solution et un devis clair.
            </p>
          </Reveal>

          <ul className="mt-10 space-y-3">
            {channels.map((channel, i) => (
              <Reveal as="li" key={channel.label} delay={0.15 + i * 0.07}>
                <a
                  href={channel.href}
                  {...(channel.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="group flex items-center gap-4 rounded-2xl bg-cream-100/[0.04] p-4 ring-1 ring-cream-100/10 transition-colors hover:bg-cream-100/[0.08] hover:ring-ember-500/50"
                >
                  <span className="grid size-12 place-items-center rounded-xl bg-ember-500 text-cream-50 transition-transform duration-500 group-hover:rotate-[-8deg]">
                    <channel.icon className="size-5" />
                  </span>
                  <span>
                    <span className="block text-[0.7rem] text-cream-100/50 uppercase tracking-[0.2em]">
                      {channel.label}
                    </span>
                    <span className="block font-display font-semibold text-cream-50 text-lg">
                      {channel.value}
                    </span>
                  </span>
                </a>
              </Reveal>
            ))}
            <Reveal as="li" delay={0.36}>
              <div className="flex items-center gap-4 p-4">
                <span className="grid size-12 place-items-center rounded-xl ring-1 ring-cream-100/20">
                  <MapPin className="size-5" />
                </span>
                <span>
                  <span className="block text-[0.7rem] text-cream-100/50 uppercase tracking-[0.2em]">
                    Zone d’intervention
                  </span>
                  <span className="block font-display font-semibold text-cream-50 text-lg">
                    {site.area}
                  </span>
                </span>
              </div>
            </Reveal>
          </ul>
        </div>

        <Reveal className="lg:col-span-7" delay={0.1}>
          <QuoteFormCard />
        </Reveal>
      </div>
    </section>
  )
}
