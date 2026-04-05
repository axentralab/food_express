'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence , Variants } from 'framer-motion'
import { X, Copy, Check, ArrowRight, Sparkles, Clock } from 'lucide-react'
import Link from 'next/link'
import { offers } from '@/data/mock-data'



interface OfferModalProps {

  delay?: number
  storageKey?: string
}



const FEATURED_OFFER = offers[0] // Welcome Gift — 50% OFF


const backdropVariants : Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1 },
  exit:    { opacity: 0, transition: { duration: 0.28 } },
}

const modalVariants : Variants = {
  hidden:  { opacity: 0, scale: 0.93, y: 28, filter: 'blur(6px)' },
  visible: {
    opacity: 1, scale: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0, scale: 0.94, y: 16,
    transition: { duration: 0.24, ease: [0.4, 0, 1, 1] },
  },
}

const itemVariants : Variants = {
  hidden:  { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.12 + i * 0.07 },
  }),
}

// 

function Particle({ style }: { style: React.CSSProperties }) {
  return (
    <motion.span
      className="absolute rounded-full pointer-events-none"
      style={style}
      animate={{
        y: [0, -60, -100],
        x: [0, (Math.random() - 0.5) * 60],
        opacity: [0, 1, 0],
        scale: [0.4, 1.2, 0.6],
        rotate: [0, 360],
      }}
      transition={{ duration: 1.4 + Math.random(), ease: 'easeOut', delay: Math.random() * 0.4 }}
    />
  )
}

// 

function PromoCodeRow({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).catch(() => {})
    setCopied(true)
    const t = setTimeout(() => setCopied(false), 2200)
    return () => clearTimeout(t)
  }, [code])

  return (
    <div
      className="flex items-center justify-between gap-2 rounded-2xl p-1.5"
      style={{
        background: 'rgba(226,27,112,0.05)',
        border: '1.5px dashed rgba(226,27,112,0.28)',
      }}
    >
      <span className="pl-3 font-mono font-black text-[15px] tracking-[0.2em] uppercase text-zinc-800 select-all">
        {code}
      </span>
      <motion.button
        whileTap={{ scale: 0.93 }}
        onClick={handleCopy}
        className="relative flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[12px] font-black text-white overflow-hidden"
        style={{
          background: copied
            ? 'linear-gradient(135deg, #22c55e, #16a34a)'
            : 'linear-gradient(135deg, #E21B70, #ff5fa0)',
          boxShadow: copied
            ? '0 4px 16px rgba(34,197,94,0.38)'
            : '0 4px 16px rgba(226,27,112,0.38)',
          transition: 'background 0.3s ease, box-shadow 0.3s ease',
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={copied ? 'check' : 'copy'}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="flex items-center gap-1.5"
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? 'Copied!' : 'Copy'}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </div>
  )
}

// main component

export function OfferModal({ delay = 2000, storageKey = 'offer-shown' }: OfferModalProps) {
  const [isOpen, setIsOpen]       = useState(false)
  const [particles, setParticles] = useState(false)


  useEffect(() => {
    if (sessionStorage.getItem(storageKey)) return
    const t = setTimeout(() => {
      setIsOpen(true)
      setTimeout(() => setParticles(true), 200)
    }, delay)
    return () => clearTimeout(t)
  }, [delay, storageKey])

  const handleClose = useCallback(() => {
    setIsOpen(false)
    setParticles(false)
    sessionStorage.setItem(storageKey, 'true')
  }, [storageKey])

  const PARTICLE_STYLES: React.CSSProperties[] = Array.from({ length: 18 }, (_, i) => ({
    width:  `${6 + Math.random() * 6}px`,
    height: `${6 + Math.random() * 6}px`,
    background: i % 3 === 0 ? '#E21B70' : i % 3 === 1 ? '#FFB100' : '#ff5fa0',
    left: `${10 + Math.random() * 80}%`,
    bottom: '20%',
    borderRadius: i % 2 === 0 ? '50%' : '2px',
    opacity: 0,
  }))

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">

          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={handleClose}
            className="absolute inset-0"
            style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)' }}
          />

          {/* Modal Card */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-[420px] bg-white rounded-[2rem] overflow-hidden"
            style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.22), 0 0 0 1px rgba(0,0,0,0.05)' }}
          >
            {/* Confetti burst */}
            {particles && PARTICLE_STYLES.map((s, i) => <Particle key={i} style={s} />)}

            {/* ── Hero image strip ── */}
            <div className="relative h-[180px] overflow-hidden">
              <img
                src={FEATURED_OFFER.image}
                alt={FEATURED_OFFER.title}
                className="w-full h-full object-cover"
              />
              {/* Gradient overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(226,27,112,0.75) 100%)',
                }}
              />

              {/* Discount badge — overlaid on image */}
              <motion.div
                custom={0}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest"
                style={{
                  background: 'rgba(255,255,255,0.18)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.35)',
                  color: '#fff',
                }}
              >
                <Sparkles size={10} fill="white" /> {FEATURED_OFFER.tag}
              </motion.div>

              {/* Close button */}
              <button
                onClick={handleClose}
                aria-label="Close offer"
                className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-black/25 backdrop-blur-sm border border-white/20 text-white hover:bg-black/40 transition-colors"
              >
                <X size={14} />
              </button>

              {/* Headline on image */}
              <div className="absolute bottom-4 left-5 right-5">
                <motion.p
                  custom={1}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-[11px] font-black text-white/75 uppercase tracking-[0.15em] mb-0.5"
                >
                  Limited Time
                </motion.p>
                <motion.h2
                  custom={2}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-[26px] font-black text-white leading-[1.1] tracking-tight"
                >
                  {FEATURED_OFFER.discountValue}% OFF
                  <span className="text-white/70"> Your First Order</span>
                </motion.h2>
              </div>
            </div>

            <div className="px-6 pt-5 pb-2">

              {/* Description */}
              <motion.p
                custom={3}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="text-[13px] text-zinc-500 font-medium leading-relaxed mb-5"
              >
                {FEATURED_OFFER.description}{' '}
                <span className="text-zinc-400 text-[11px]">
                  Min. order ${FEATURED_OFFER.minOrderAmount}
                  {FEATURED_OFFER.maxDiscount != null && ` · Up to $${FEATURED_OFFER.maxDiscount} off`}
                </span>
              </motion.p>

              {/* Promo code */}
              <motion.div custom={4} variants={itemVariants} initial="hidden" animate="visible">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.12em] mb-2">
                  Promo Code
                </p>
                <PromoCodeRow code={FEATURED_OFFER.code} />
              </motion.div>

              {/* Expiry row */}
              <motion.div
                custom={5}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="flex items-center gap-1.5 mt-3 mb-4"
              >
                <Clock size={11} className="text-zinc-400" />
                <span className="text-[11px] text-zinc-400 font-semibold">
                  Valid until{' '}
                  {new Date(FEATURED_OFFER.expiryDate).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric',
                  })}
                </span>
              </motion.div>

              {/* View all offers link */}
              <motion.div custom={6} variants={itemVariants} initial="hidden" animate="visible">
                <Link
                  href="/offers"
                  onClick={handleClose}
                  className="group flex items-center justify-center gap-1.5 text-[12px] font-bold text-zinc-400 hover:text-[#E21B70] transition-colors mb-5"
                >
                  View all active offers
                  <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </motion.div>
            </div>

            <div
              className="flex items-center justify-center gap-2 py-3"
              style={{
                background: 'linear-gradient(135deg, #E21B70 0%, #ff5fa0 100%)',
              }}
            >
              <Sparkles size={11} fill="white" className="text-white/80" />
              <p className="text-[10px] font-black text-white/90 uppercase tracking-[0.18em]">
                Auto-applied at checkout
              </p>
              <Sparkles size={11} fill="white" className="text-white/80" />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}