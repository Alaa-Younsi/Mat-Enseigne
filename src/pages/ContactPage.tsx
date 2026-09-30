import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, ArrowRight, Check, Clock, MapPin, Send, Sparkles } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useRef, useState } from 'react'
import { type FieldPath, type UseFormRegisterReturn, useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router'
import { z } from 'zod'
import { InstagramIcon, WhatsAppIcon } from '@/components/ui/BrandIcons'
import { ButtonLink } from '@/components/ui/Button'
import { Img } from '@/components/ui/Img'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { HalfDisc, Stripes } from '@/components/ui/Shapes'
import { SpamGuard } from '@/components/ui/SpamGuard'
import { SubmitFeedback } from '@/components/ui/SubmitFeedback'
import { site } from '@/config/site'
import { services } from '@/data/services'
import { useContactSubmit } from '@/hooks/useContactSubmit'
import { usePageMeta } from '@/hooks/usePageMeta'
import { cn } from '@/lib/cn'

const EASE = [0.16, 1, 0.3, 1] as const
const FR_PHONE = /^(?:\+33\s?|0)[1-9](?:[\s.-]?\d{2}){4}$/
const OTHER = 'autre'

const serviceChoices = [
  ...services.map((s) => ({ id: s.id, title: s.title, image: s.image as string | null })),
  { id: OTHER, title: 'Autre / plusieurs', image: null },
]
const timings = [
  'Urgent (moins de 2 semaines)',
  'Dans le mois',
  'Dans 1 à 3 mois',
  'Je me renseigne',
] as const
const logoOptions = ['J’ai déjà un logo', 'Logo à créer ou adapter'] as const
const contactOptions = ['WhatsApp', 'Appel téléphonique', 'E-mail'] as const

const schema = z.object({
  service: z.string().min(1, 'Choisissez une prestation.'),
  location: z.string().trim().min(2, 'Indiquez la ville.').max(80),
  dimensions: z.string().trim().max(120).optional(),
  timing: z.string().min(1, 'Choisissez un délai.'),
  logo: z.string().min(1, 'Précisez pour le logo.'),
  message: z
    .string()
    .trim()
    .min(10, '10 caractères minimum.')
    .max(1200, '1200 caractères maximum.'),
  name: z.string().trim().min(2, 'Indiquez votre nom.').max(80),
  phone: z.string().trim().regex(FR_PHONE, 'Numéro invalide (06 12 34 56 78).'),
  email: z.union([z.literal(''), z.email('Adresse e-mail invalide.')]).optional(),
  contactPreference: z.string().min(1),
})

type Quote = z.infer<typeof schema>

const STEPS: readonly { title: string; label: string; fields: readonly FieldPath<Quote>[] }[] = [
  { label: 'Projet', title: 'Quel est votre projet ?', fields: ['service'] },
  {
    label: 'Détails',
    title: 'Parlez-nous-en',
    fields: ['location', 'dimensions', 'timing', 'logo', 'message'],
  },
  {
    label: 'Coordonnées',
    title: 'Comment vous joindre ?',
    fields: ['name', 'phone', 'email', 'contactPreference'],
  },
]

/* ---------------------------------------------------------------- */

const fieldClass =
  'peer w-full rounded-2xl border-0 bg-plum-950/[0.04] px-4 pt-6 pb-2.5 text-plum-900 ring-1 ring-plum-900/12 transition placeholder:text-transparent focus:bg-cream-50 focus:outline-none focus:ring-2 focus:ring-ember-500 aria-[invalid=true]:ring-ember-600'
const labelClass =
  'pointer-events-none absolute top-2 left-4 font-medium text-[0.7rem] text-plum-800/60 uppercase tracking-[0.14em]'

/**
 * Errors live in a zero-height slot so showing / clearing them never shifts the layout
 * (a shift between mousedown and mouseup would swallow the visitor's next click).
 */
function ErrorText({ id, message }: { id: string; message: string | undefined }) {
  return (
    <div className="relative h-0">
      {message && (
        <p
          id={id}
          role="alert"
          className="absolute top-1 left-1 truncate text-[0.8rem] text-ember-700 leading-5"
        >
          {message}
        </p>
      )}
    </div>
  )
}

function ChipGroup({
  legend,
  options,
  registration,
  error,
  errorId,
}: {
  legend: string
  options: readonly string[]
  registration: UseFormRegisterReturn
  error: string | undefined
  errorId: string
}) {
  return (
    <fieldset className="m-0 min-w-0 border-0 p-0">
      <legend className="mb-3 font-medium text-[0.7rem] text-plum-800/60 uppercase tracking-[0.14em]">
        {legend}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label key={option} className="cursor-pointer">
            <input type="radio" value={option} className="peer sr-only" {...registration} />
            <span className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-plum-900 text-sm ring-1 ring-plum-900/20 transition-all hover:ring-plum-900/50 peer-checked:bg-plum-800 peer-checked:text-cream-50 peer-checked:ring-plum-800 peer-focus-visible:outline-2 peer-focus-visible:outline-ember-500 peer-focus-visible:outline-offset-2">
              {option}
            </span>
          </label>
        ))}
      </div>
      <ErrorText id={errorId} message={error} />
    </fieldset>
  )
}

/* ---------------------------------------------------------------- */

function QuoteWizard() {
  const [params] = useSearchParams()
  const preset = serviceChoices.find((s) => s.id === params.get('service'))
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [sent, setSent] = useState<Quote | null>(null)
  const focusHeading = useRef(false)

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    reset,
    formState: { errors },
  } = useForm<Quote>({
    resolver: zodResolver(schema),
    defaultValues: {
      service: preset?.title ?? '',
      location: '',
      dimensions: '',
      timing: '',
      logo: '',
      message: '',
      name: '',
      phone: '',
      email: '',
      contactPreference: 'WhatsApp',
    },
    mode: 'onTouched',
  })

  const goTo = (next: number) => {
    focusHeading.current = true
    setDirection(next > step ? 1 : -1)
    setStep(next)
  }

  /** Focus the new step's heading once it mounts (after the exit animation), for keyboard / SR users. */
  const headingRef = (element: HTMLHeadingElement | null) => {
    if (element && focusHeading.current) {
      focusHeading.current = false
      element.focus({ preventScroll: true })
    }
  }

  const next = async () => {
    const current = STEPS[step]
    if (current && (await trigger([...current.fields], { shouldFocus: true }))) goTo(step + 1)
  }

  const contact = useContactSubmit()

  const onSubmit = (data: Quote) => {
    if (contact.submit(data)) setSent(data)
  }

  const selectedService = watch('service')
  const current = STEPS[step]

  if (sent) {
    return (
      <motion.div
        role="status"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex min-h-[34rem] flex-col items-center justify-center text-center"
      >
        <span className="grid size-20 place-items-center rounded-full bg-ember-500 text-cream-50 shadow-[0_20px_50px_-15px] shadow-ember-600">
          <Check className="size-9" />
        </span>
        <h2 className="mt-8 font-display font-bold text-4xl tracking-tight">
          Merci {sent.name.split(' ')[0]} !
        </h2>
        <p className="mt-3 max-w-md text-plum-800/70 leading-relaxed">
          Votre demande a bien été validée, mais ce site est une vitrine : aucun message n’a été
          envoyé et aucune donnée n’a été conservée.
        </p>
        <dl className="mt-8 grid w-full max-w-md gap-2 rounded-2xl bg-plum-950/[0.04] p-5 text-left text-sm ring-1 ring-plum-900/10">
          {[
            ['Prestation', sent.service],
            ['Lieu', sent.location],
            ['Délai', sent.timing],
          ].map(([term, value]) => (
            <div key={term} className="flex justify-between gap-4">
              <dt className="text-plum-800/60">{term}</dt>
              <dd className="text-right font-medium">{value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              reset()
              contact.reset()
              setSent(null)
              goTo(0)
            }}
            className="rounded-full px-6 py-3 font-medium text-plum-800 ring-1 ring-plum-800/25 transition-colors hover:ring-plum-800/60"
          >
            Nouvelle demande
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} aria-label="Assistant de devis">
      {/* Progress */}
      <ol className="grid grid-cols-3 gap-2" aria-label="Étapes">
        {STEPS.map((s, i) => {
          const done = i < step
          const active = i === step
          return (
            <li key={s.label}>
              <button
                type="button"
                disabled={!done}
                onClick={() => goTo(i)}
                aria-current={active ? 'step' : undefined}
                className="group w-full text-left disabled:cursor-default"
              >
                <span className="block h-1 overflow-hidden rounded-full bg-plum-900/10">
                  <motion.span
                    className="block h-full rounded-full bg-ember-500"
                    initial={false}
                    animate={{ width: done || active ? '100%' : '0%' }}
                    transition={{ duration: 0.6, ease: EASE }}
                  />
                </span>
                <span
                  className={cn(
                    'mt-2 flex min-w-0 items-center gap-1.5 font-medium text-[0.62rem] uppercase tracking-[0.08em] sm:text-xs sm:tracking-[0.14em]',
                    active ? 'text-plum-900' : 'text-plum-800/45',
                    done && 'group-hover:text-ember-600',
                  )}
                >
                  {done ? (
                    <Check className="size-3.5" />
                  ) : (
                    <span className="tabular-nums">0{i + 1}</span>
                  )}
                  <span className="truncate">{s.label}</span>
                </span>
              </button>
            </li>
          )
        })}
      </ol>

      <div className="relative mt-8 min-h-[30rem]">
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={{
              enter: (d: number) => ({ opacity: 0, x: d * 40 }),
              center: { opacity: 1, x: 0 },
              exit: (d: number) => ({ opacity: 0, x: d * -40 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: EASE }}
          >
            <h2
              ref={headingRef}
              tabIndex={-1}
              className="font-display font-bold text-3xl tracking-[-0.03em] outline-none sm:text-4xl"
            >
              {current?.title}
            </h2>

            {step === 0 && (
              <fieldset className="m-0 mt-6 min-w-0 border-0 p-0">
                <legend className="sr-only">Prestation</legend>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {serviceChoices.map((choice) => {
                    const checked = selectedService === choice.title
                    return (
                      <label key={choice.id} className="group relative cursor-pointer">
                        <input
                          type="radio"
                          value={choice.title}
                          className="peer sr-only"
                          {...register('service')}
                        />
                        <span
                          className={cn(
                            'relative block aspect-[4/5] overflow-hidden rounded-2xl ring-2 transition-all duration-300 peer-focus-visible:outline-2 peer-focus-visible:outline-ember-500 peer-focus-visible:outline-offset-2',
                            checked ? 'ring-ember-500' : 'ring-transparent',
                          )}
                        >
                          {choice.image ? (
                            <Img
                              name={choice.image}
                              alt=""
                              sizes="(min-width: 640px) 14vw, 45vw"
                              className={cn(
                                'size-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-110',
                                checked && 'scale-110',
                              )}
                            />
                          ) : (
                            <span className="grid size-full place-items-center bg-plum-800 text-ember-400">
                              <Sparkles className="size-10" />
                            </span>
                          )}
                          <span
                            className={cn(
                              'absolute inset-0 transition-colors duration-300',
                              checked
                                ? 'bg-gradient-to-t from-ember-700/90 via-ember-600/25 to-transparent'
                                : 'bg-gradient-to-t from-plum-950/85 via-plum-950/10 to-transparent',
                            )}
                          />
                          <span className="absolute inset-x-0 bottom-0 p-3 font-display font-semibold text-cream-50 text-sm leading-tight sm:p-4 sm:text-base">
                            {choice.title}
                          </span>
                          <span
                            className={cn(
                              'absolute top-3 right-3 grid size-7 place-items-center rounded-full bg-cream-50 text-ember-600 transition-all duration-300',
                              checked ? 'scale-100 opacity-100' : 'scale-50 opacity-0',
                            )}
                          >
                            <Check className="size-4" />
                          </span>
                        </span>
                      </label>
                    )
                  })}
                </div>
                <ErrorText id="service-error" message={errors.service?.message} />
              </fieldset>
            )}

            {step === 1 && (
              <div className="mt-6 grid gap-7">
                <div className="grid gap-x-4 gap-y-7 sm:grid-cols-2">
                  <div>
                    <div className="relative">
                      <input
                        id="location"
                        placeholder="Lieu"
                        autoComplete="address-level2"
                        aria-invalid={errors.location ? true : undefined}
                        aria-describedby={errors.location ? 'location-error' : undefined}
                        className={fieldClass}
                        {...register('location')}
                      />
                      <label htmlFor="location" className={labelClass}>
                        Ville / arrondissement *
                      </label>
                    </div>
                    <ErrorText id="location-error" message={errors.location?.message} />
                  </div>
                  <div className="relative">
                    <input
                      id="dimensions"
                      placeholder="Dimensions"
                      className={fieldClass}
                      {...register('dimensions')}
                    />
                    <label htmlFor="dimensions" className={labelClass}>
                      Dimensions approx. (ex. 5 m × 60 cm)
                    </label>
                  </div>
                </div>

                <ChipGroup
                  legend="Délai souhaité *"
                  options={timings}
                  registration={register('timing')}
                  error={errors.timing?.message}
                  errorId="timing-error"
                />
                <ChipGroup
                  legend="Logo *"
                  options={logoOptions}
                  registration={register('logo')}
                  error={errors.logo?.message}
                  errorId="logo-error"
                />

                <div>
                  <div className="relative">
                    <textarea
                      id="message"
                      rows={4}
                      placeholder="Votre projet"
                      aria-invalid={errors.message ? true : undefined}
                      aria-describedby={errors.message ? 'message-error' : undefined}
                      className={cn(fieldClass, 'resize-none pt-7')}
                      {...register('message')}
                    />
                    <label htmlFor="message" className={labelClass}>
                      Décrivez votre projet *
                    </label>
                  </div>
                  <ErrorText id="message-error" message={errors.message?.message} />
                  <p className="mt-2 pl-1 text-plum-800/55 text-xs">
                    Astuce : envoyez ensuite une photo de votre façade sur WhatsApp pour un devis
                    plus précis.
                  </p>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="mt-6 grid gap-7">
                <div className="grid gap-x-4 gap-y-7 sm:grid-cols-2">
                  <div>
                    <div className="relative">
                      <input
                        id="name"
                        placeholder="Nom"
                        autoComplete="name"
                        aria-invalid={errors.name ? true : undefined}
                        aria-describedby={errors.name ? 'name-error' : undefined}
                        className={fieldClass}
                        {...register('name')}
                      />
                      <label htmlFor="name" className={labelClass}>
                        Nom *
                      </label>
                    </div>
                    <ErrorText id="name-error" message={errors.name?.message} />
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
                    <ErrorText id="phone-error" message={errors.phone?.message} />
                  </div>
                </div>
                <div>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="E-mail"
                      aria-invalid={errors.email ? true : undefined}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                      className={fieldClass}
                      {...register('email')}
                    />
                    <label htmlFor="email" className={labelClass}>
                      E-mail (facultatif)
                    </label>
                  </div>
                  <ErrorText id="email-error" message={errors.email?.message} />
                </div>
                <ChipGroup
                  legend="Je préfère être recontacté par"
                  options={contactOptions}
                  registration={register('contactPreference')}
                  error={errors.contactPreference?.message}
                  errorId="contact-error"
                />
                <SpamGuard honeypot={contact.honeypot} />
                <SubmitFeedback error={contact.error} />
                <p className="text-plum-800/55 text-xs leading-relaxed">
                  Formulaire de démonstration : aucune donnée n’est envoyée ni conservée.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between gap-4 border-plum-900/10 border-t pt-6">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => goTo(step - 1)}
            className="inline-flex items-center gap-2 rounded-full px-4 py-3 font-medium text-plum-800 transition-colors hover:bg-plum-900/5"
          >
            <ArrowLeft className="size-4" />
            Retour
          </button>
        ) : (
          <span className="text-plum-800/50 text-sm">Étape 1 sur 3 · 1 minute</span>
        )}

        {/* Distinct keys: React must not morph "Continuer" into the submit button mid-click. */}
        {step < STEPS.length - 1 ? (
          <button
            key="next"
            type="button"
            onClick={next}
            className="group inline-flex items-center gap-3 rounded-full bg-plum-800 py-2 pr-2 pl-6 font-display font-semibold text-cream-50 transition-colors hover:bg-plum-700"
          >
            Continuer
            <span className="grid size-10 place-items-center rounded-full bg-ember-500 transition-transform duration-500 ease-out-expo group-hover:translate-x-1">
              <ArrowRight className="size-4" />
            </span>
          </button>
        ) : (
          <button
            key="submit"
            type="submit"
            className="group inline-flex items-center gap-3 rounded-full bg-ember-500 py-2 pr-2 pl-6 font-display font-semibold text-cream-50 shadow-[0_10px_40px_-12px] shadow-ember-500/70 transition-colors hover:bg-ember-600"
          >
            <span className="sm:hidden">Envoyer</span>
            <span className="hidden sm:inline">Envoyer ma demande</span>
            <span className="grid size-10 place-items-center rounded-full bg-cream-50 text-ember-600 transition-transform duration-500 ease-out-expo group-hover:rotate-[-20deg]">
              <Send className="size-4" />
            </span>
          </button>
        )}
      </div>
    </form>
  )
}

/* ---------------------------------------------------------------- */

const afterSteps = [
  {
    icon: Clock,
    title: 'Réponse rapide',
    text: 'Nous revenons vers vous sur WhatsApp ou par téléphone.',
  },
  {
    icon: MapPin,
    title: 'Relevé & maquette',
    text: 'Visite ou photos, puis simulation sur votre façade.',
  },
  { icon: Check, title: 'Devis gratuit', text: 'Un devis clair et détaillé, sans engagement.' },
] as const

export default function ContactPage() {
  usePageMeta({
    title: 'Contact & devis gratuit — Mat Enseigne',
    description:
      'Demandez votre devis gratuit en une minute : enseigne, adhésifs vitrine, film dépoli ou marquage véhicule à Paris et en Île-de-France.',
    path: '/contact',
  })

  return (
    <section className="grain relative isolate overflow-clip bg-plum-950 pt-32 pb-24 text-cream-100 sm:pt-40 sm:pb-32">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-20 -left-40 size-[40rem] rounded-full bg-ember-600/25 blur-[150px]" />
        <div className="absolute -right-40 bottom-0 size-[36rem] rounded-full bg-plum-500/35 blur-[130px]" />
      </div>
      <Stripes
        bars={5}
        className="absolute top-0 right-[5%] hidden h-40 w-28 text-plum-700 lg:block"
      />

      <div className="container-px relative z-10 grid gap-14 lg:grid-cols-12 lg:gap-12">
        {/* Intro column */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <SectionLabel index="✦" className="text-cream-100/70">
              Contact
            </SectionLabel>
            <h1 className="mt-6 font-display font-extrabold text-[clamp(3rem,9vw,6.4rem)] text-cream-50 leading-[0.92] tracking-[-0.05em]">
              <motion.span
                className="block"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
              >
                Allumons
              </motion.span>
              <motion.span
                className="block font-normal font-serif text-ember-400 italic tracking-[-0.02em]"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0.3, 1, 0.6, 1] }}
                transition={{ duration: 1.1, delay: 0.6, times: [0, 0.15, 0.3, 0.5, 0.7, 1] }}
              >
                <span className="text-glow">votre façade.</span>
              </motion.span>
            </h1>
            <motion.p
              className="mt-7 max-w-md text-cream-100/70 text-lg leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}
            >
              Trois questions, une minute, et votre demande est prête. Un formulaire de
              démonstration : rien n’est envoyé.
            </motion.p>

            <motion.div
              className="mt-8 flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.65 }}
            >
              <ButtonLink icon={<WhatsAppIcon className="size-[1.1rem]" />}>
                WhatsApp direct
              </ButtonLink>
            </motion.div>

            <motion.ol
              className="mt-12 space-y-5 border-cream-100/10 border-t pt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.8 }}
              aria-label="Après votre demande"
            >
              {afterSteps.map((item, i) => (
                <li key={item.title} className="flex gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-cream-100/5 text-ember-400 ring-1 ring-cream-100/10">
                    <item.icon className="size-5" />
                  </span>
                  <span>
                    <span className="block font-display font-semibold text-cream-50">
                      <span className="mr-2 text-ember-400 text-xs tabular-nums">0{i + 1}</span>
                      {item.title}
                    </span>
                    <span className="text-cream-100/60 text-sm">{item.text}</span>
                  </span>
                </li>
              ))}
            </motion.ol>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-cream-100/60 text-sm">
              <span className="inline-flex items-center gap-2">
                <MapPin className="size-4 text-ember-400" />
                {site.area}
              </span>
              <a
                href={site.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 transition-colors hover:text-cream-50"
              >
                <InstagramIcon className="size-4 text-ember-400" />@{site.instagram.handle}
              </a>
            </div>
          </div>
        </div>

        {/* Wizard */}
        <motion.div
          className="lg:col-span-7"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.35 }}
        >
          <div className="relative overflow-clip rounded-[2rem] bg-cream-100 p-6 text-plum-900 shadow-[0_40px_120px_-40px_rgba(217,99,43,0.5)] sm:p-10">
            <HalfDisc className="pointer-events-none absolute -right-8 -bottom-px w-40 text-ember-500/10" />
            <QuoteWizard />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
