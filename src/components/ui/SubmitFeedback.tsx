import { AlertCircle } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { type SubmitError, submitErrorMessages } from '@/hooks/useContactSubmit'

/** Inline message when a submission is held back by the spam guards. */
export function SubmitFeedback({ error }: { error: SubmitError | null }) {
  return (
    <AnimatePresence>
      {error && (
        <motion.p
          role="alert"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="flex items-start gap-2 rounded-2xl bg-ember-500/10 p-4 text-plum-900 text-sm ring-1 ring-ember-500/30"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-ember-600" />
          {submitErrorMessages[error]}
        </motion.p>
      )}
    </AnimatePresence>
  )
}
