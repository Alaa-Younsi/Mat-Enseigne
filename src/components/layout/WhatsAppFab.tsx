import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useState } from 'react'
import { useLocation } from 'react-router'
import { WhatsAppIcon } from '@/components/ui/BrandIcons'
import { whatsappLink } from '@/lib/whatsapp'

/** Floating WhatsApp shortcut, revealed once the visitor scrolls past the hero. */
export function WhatsAppFab() {
  const { scrollY } = useScroll()
  const [visible, setVisible] = useState(false)
  // The contact page already puts WhatsApp front and centre.
  const hidden = useLocation().pathname === '/contact'

  useMotionValueEvent(scrollY, 'change', (y) => setVisible(y > window.innerHeight * 0.8))

  return (
    <AnimatePresence>
      {visible && !hidden && (
        <motion.a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Discuter sur WhatsApp"
          className="group fixed right-4 bottom-4 z-40 grid size-14 place-items-center rounded-full bg-ember-500 text-cream-50 shadow-[0_12px_40px_-8px] shadow-ember-600/70 sm:right-6 sm:bottom-6 sm:size-16"
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 45 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 animate-ping rounded-full bg-ember-500/40 [animation-duration:2.4s]"
          />
          <WhatsAppIcon className="relative size-7" />
        </motion.a>
      )}
    </AnimatePresence>
  )
}
