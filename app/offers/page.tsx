'use client'

import React, { useState,
  useMemo,
  useCallback,
  useEffect,
} from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  motion,
  AnimatePresence,
  LayoutGroup,
  type Variants,
} from 'framer-motion'
import {
  Ticket,
  Copy,
  Check,
  Clock,
  Sparkles,
  ArrowRight,
  Store,
  BadgePercent,
  DollarSign,
  Globe,
  AlignJustify,
  Flame,
  X,
  ChevronRight,
} from 'lucide-react'
import { offers, type Offer } from '@/data/mock-data'

// Types
type FilterKey = 'all' | 'percentage' | 'fixed' | 'restaurant' | 'global'

interface FilterTab {
  key: FilterKey
  label: string
  icon: React.ReactNode
}

interface ToastData {
  id: string
  code: string
}

// Helpers
function getDaysUntilExpiry(dateStr: string): number {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86_400_000)
}

function isExpiringSoon(dateStr: string): boolean {
  const d = getDaysUntilExpiry(dateStr)
  return d > 0 && d <= 30
}

function formatDiscountBadge(offer: Offer): string {
  if (offer.discountType === 'percentage') return `${offer.discountValue}% OFF`
  return `$${offer.discountValue} OFF`
}

// Constants
const FILTER_TABS: FilterTab[] = [
  { key: 'all',        label: 'All Deals',   icon: <AlignJustify size={12} /> },
  { key: 'percentage', label: '% Off',       icon: <BadgePercent size={12} /> },
  { key: 'fixed',      label: 'Flat Deal',   icon: <DollarSign size={12} /> },
  { key: 'restaurant', label: 'Restaurant',  icon: <Store size={12} /> },
  { key: 'global',     label: 'Global',      icon: <Globe size={12} /> },
]

// Animation presets
const staggerGrid: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}

const cardEnter: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  show:   { opacity: 1, y: 0,  scale: 1, transition: { duration: 0.46, ease: [0.22, 1, 0.36, 1] } },
  exit:   { opacity: 0, scale: 0.95, y: -8, transition: { duration: 0.22 } },
}

//Toast Notification
function Toast({ data, onDismiss }: { data: ToastData; onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 2800)
    return () => clearTimeout(t)
  }, [onDismiss])

  return (
    <motion.div
      initial={{ opacity: 0, y: 32, scale: 0.92, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0,  scale: 1,    filter: 'blur(0px)' }}
      exit={{   opacity: 0, y: 16,  scale: 0.95, transition: { duration: 0.22 } }}
      className="fixed bottom-6 left-1/2 z-[200] -translate-x-1/2 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.22)]"
      style={{ background: '#18181b', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <motion.div
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 340, damping: 22, delay: 0.1 }}
        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
        style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}
      >
        <Check size={14} strokeWidth={2.5} className="text-white" />
      </motion.div>

      <div>
        <p className="text-white text-[13px] font-bold leading-none">Code copied!</p>
        <p className="text-zinc-400 text-[11px] font-mono mt-0.5">{data.code}</p>
      </div>

      {['#E21B70', '#FFB100', '#22c55e', '#ff5fa0'].map((color, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 5, height: 5, background: color,
            left: `${20 + i * 18}%`, top: '30%',
          }}
          initial={{ opacity: 0, y: 0, scale: 0.5 }}
          animate={{ opacity: [0, 1, 0], y: -28, scale: [0.5, 1.4, 0.6], rotate: 360 }}
          transition={{ duration: 0.9, delay: 0.08 + i * 0.06, ease: 'easeOut' }}
        />
      ))}

      <button onClick={onDismiss} className="ml-1 text-zinc-500 hover:text-zinc-300 transition-colors">
        <X size={13} />
      </button>
    </motion.div>
  )
}

//OfferStats 
interface OfferStatsProps {
  total: number
  maxDiscount: number
  restaurantCount: number
}
function OfferStats({ total, maxDiscount, restaurantCount }: OfferStatsProps) {
  const stats = [
    { value: String(total),         label: 'Active Offers' },
    { value: `${maxDiscount}%`,     label: 'Max Discount' },
    { value: String(restaurantCount), label: 'Restaurants' },
  ]

  return (
    <div className="flex items-center justify-center gap-8 mt-10">
      {stats.map((s, i) => (
        <React.Fragment key={s.label}>
          {i > 0 && (
            <div className="w-px h-8 opacity-20" style={{ background: 'rgba(255,255,255,0.4)' }} />
          )}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 + i * 0.08, duration: 0.46, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
          >
            <p className="text-[28px] font-black text-white leading-none tracking-tight">{s.value}</p>
            <p className="text-[11px] font-semibold text-white/50 mt-0.5 uppercase tracking-widest">{s.label}</p>
          </motion.div>
        </React.Fragment>
      ))}
    </div>
  )
}

//HeroSection 
interface HeroSectionProps {
  offerStats: OfferStatsProps
}

function HeroSection({ offerStats }: HeroSectionProps) {
  return (
    <section className="relative h-[540px] sm:h-[580px] overflow-hidden">
      {/* Static background - No Parallax */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=80"
          alt="Food background"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* Deep glassmorphism overlay */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            'linear-gradient(160deg, rgba(226,27,112,0.85) 0%, rgba(24,24,27,0.7) 55%, rgba(0,0,0,0.9) 100%)',
        }}
      />
      
      {/* Grain texture */}
      <div
        className="absolute inset-0 z-10 opacity-[0.055] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
        }}
      />

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full px-4 text-center pt-8">
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.18em] mb-6"
          style={{
            background: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.22)',
            color: 'rgba(255,255,255,0.92)',
          }}
        >
          <Sparkles size={11} fill="white" /> Rewards & Vouchers
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="text-[42px] sm:text-[60px] md:text-[72px] font-black text-white leading-[1.0] tracking-tight mb-4 max-w-3xl"
        >
          Save Big on{' '}
          <span
            className="relative inline-block bg-gradient-to-r from-[#E21B70]   to-[#FFB100] bg-clip-text text-transparent"
            style={{
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Every Bite
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.18, duration: 0.5 }}
          className="text-white/60 font-medium text-[15px] sm:text-[17px] max-w-md leading-relaxed"
        >
          Exclusive vouchers from top restaurants. Copy, paste, enjoy.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <OfferStats {...offerStats} />
        </motion.div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-28 z-20 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #F8F9FA, transparent)' }}
      />
    </section>
  )
}


interface FilterBarProps {
  active: FilterKey
  onChange: (k: FilterKey) => void
  counts: Record<FilterKey, number>
}
// FilterBar (Updated: Glassmorphism Card Style)
function FilterBar({ active, onChange, counts }: FilterBarProps) {
  return (
    <div className="flex items-center gap-2 p-1.5 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/50 shadow-sm overflow-x-auto [scrollbar-width:none]">
      <LayoutGroup id="filter-pills">
        {FILTER_TABS.map(tab => {
          const isActive = tab.key === active
          return (
            <motion.button
              key={tab.key}
              whileTap={{ scale: 0.93 }}
              onClick={() => onChange(tab.key)}
              className="relative shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-[12px] font-bold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#E21B70]/40"
              style={{
                color: isActive ? '#fff' : '#333',
              }}
            >
              {isActive && (
                <motion.span
                  layoutId="filterPill"
                  className="absolute inset-0 rounded-full"
                  style={{ background: 'linear-gradient(135deg, #E21B70, #ff5fa0)' }}
                  transition={{ type: 'spring', stiffness: 360, damping: 32 }}
                />
              )}
              <span className="relative  z-10 flex items-center gap-1.5">
                {tab.icon}
                {tab.label}
                <span
                  className="text-[9px] font-black px-1.5 py-0.5 rounded-full"
                  style={{
                    background: isActive ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.07)',
                    color: isActive ? '#fff' : '#a1a1aa',
                  }}
                >
                  {counts[tab.key]}
                </span>
              </span>
            </motion.button>
          )
        })}
      </LayoutGroup>
    </div>
  )
}

// EmptyState
function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.46, ease: [0.22, 1, 0.36, 1] }}
      className="col-span-full flex flex-col items-center justify-center py-24 text-center"
    >
      <div className="relative mb-7">
        <div
          className="w-24 h-24 rounded-3xl flex items-center justify-center"
          style={{ background: 'rgba(226,27,112,0.07)', border: '1px solid rgba(226,27,112,0.14)' }}
        >
          <Ticket size={38} style={{ color: 'rgba(226,27,112,0.35)' }} />
        </div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
          className="absolute -inset-4 rounded-[40px] border border-dashed pointer-events-none"
          style={{ borderColor: 'rgba(226,27,112,0.16)' }}
        />
      </div>

      <p className="text-[20px] font-black text-zinc-900 tracking-tight mb-2">No offers here</p>
      <p className="text-[13px] text-zinc-400 font-medium max-w-[240px] leading-relaxed mb-6">
        Try a different filter to discover more deals.
      </p>
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={onReset}
        className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-white text-[13px] font-bold"
        style={{
          background: 'linear-gradient(135deg, #E21B70, #ff5fa0)',
          boxShadow: '0 5px 20px rgba(226,27,112,0.36)',
        }}
      >
        <X size={13} /> Clear filter
      </motion.button>
    </motion.div>
  )
}

//OfferCard 
interface OfferCardProps {
  offer: Offer
  onCopy: (offer: Offer) => void
  copiedId: string | null
}

function OfferCard({ offer, onCopy, copiedId }: OfferCardProps) {
  const router    = useRouter()
  const isCopied  = copiedId === offer.id
  const expiring  = isExpiringSoon(offer.expiryDate)
  const daysLeft  = getDaysUntilExpiry(offer.expiryDate)

  const handleAction = useCallback(() => {
    onCopy(offer)
    setTimeout(() => {
      router.push(offer.restaurantId ? `/restaurant/${offer.restaurantId}` : '/restaurants')
    }, 1300)
  }, [offer, onCopy, router])

  return (
    <motion.article
      variants={cardEnter}
      layout
      whileHover={{ y: -5 }}
      className="group relative flex flex-col sm:flex-row bg-white rounded-[24px] overflow-hidden border border-[#EBEBEB] shadow-[0_2px_16px_rgba(0,0,0,0.05)]"
    >
      <div className="relative sm:w-[44%] h-48 sm:h-auto overflow-hidden shrink-0">
        <Image
          src={offer.image}
          alt={offer.title}
          fill
          sizes="(max-width: 640px) 100vw, 44vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.07]"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(160deg, rgba(0,0,0,0.04), rgba(0,0,0,0.50) 100%)' }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-3">
          <p className="text-white/70 text-[9px] font-black uppercase tracking-[0.18em] mb-0.5">You save</p>
          <p className="text-white font-black text-[30px] sm:text-[34px] leading-none tracking-tight drop-shadow-md">
            {formatDiscountBadge(offer)}
          </p>
        </div>
        <div
          className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-black/20 backdrop-blur-md border border-white/20 text-white"
        >
          {offer.tag}
        </div>
      </div>

      <div className="relative hidden sm:flex w-[2px] shrink-0 flex-col items-center justify-center">
        <div className="absolute -top-3 w-6 h-6 rounded-full z-10 bg-[#F8F9FA] border border-[#EBEBEB] border-t-transparent" />
        <div className="flex-1 w-0 border-l-[1.5px] border-dashed border-[#E5E7EB]" />
        <div className="absolute -bottom-3 w-6 h-6 rounded-full z-10 bg-[#F8F9FA] border border-[#EBEBEB] border-b-transparent" />
      </div>

      <div className="flex-1 flex flex-col justify-between p-5 sm:p-6 min-w-0">
        <div>
          {offer.restaurantName && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold mb-2 bg-[#E21B70]/5 text-[#E21B70] border border-[#E21B70]/10">
              <Store size={10} /> {offer.restaurantName}
            </div>
          )}
          <h3 className="font-black text-zinc-900 text-[17px] leading-tight tracking-tight mb-1.5 group-hover:text-[#E21B70] transition-colors duration-200">
            {offer.title}
          </h3>
          <p className="text-[12.5px] text-zinc-500 font-medium line-clamp-2 leading-relaxed">
            {offer.description}
          </p>
        </div>

        <div className="mt-4">
          <div className="flex items-center gap-1.5 mb-3">
            <Clock size={10} className={expiring ? 'text-red-400' : 'text-zinc-400'} />
            <span className={`text-[10px] font-semibold ${expiring ? 'text-red-400' : 'text-zinc-400'}`}>
              {expiring ? `⚡ Expiring in ${daysLeft} days` : `Valid until ${offer.expiryDate}`}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <div
              className="flex-1 flex items-center gap-2 px-3.5 py-2.5 rounded-xl min-w-0 cursor-pointer bg-[#E21B70]/5 border-[1.5px] border-dashed border-[#E21B70]/20"
              onClick={() => onCopy(offer)}
            >
              <Ticket size={12} className="text-[#E21B70] shrink-0" />
              <span className="font-mono font-black text-[13px] tracking-[0.15em] text-zinc-800 uppercase truncate">
                {offer.code}
              </span>
            </div>

            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={() => onCopy(offer)}
              className="w-10 h-10 flex items-center justify-center rounded-xl shrink-0 text-white"
              style={{
                background: isCopied ? 'linear-gradient(135deg, #22c55e, #16a34a)' : '#18181b',
              }}
            >
              <AnimatePresence mode="wait">
                {isCopied ? <Check size={15} key="c" /> : <Copy size={15} key="p" />}
              </AnimatePresence>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={handleAction}
              className="w-10 h-10 flex items-center justify-center rounded-xl shrink-0 bg-gradient-to-br from-[#E21B70] to-[#ff5fa0] text-white shadow-lg shadow-[#E21B70]/20"
            >
              <ChevronRight size={16} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

// HowItWorks
function HowItWorks() {
  const steps = [
    { num: '01', icon: <Copy size={18} />,         title: 'Copy the code',    desc: 'Tap the copy button on any voucher card.' },
    { num: '02', icon: <Ticket size={18} />,        title: 'Add to cart',      desc: 'Browse and pick your favourite items.' },
    { num: '03', icon: <Check size={18} />,          title: 'Paste at checkout', desc: 'Enter the code to watch the price drop.' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-14 rounded-[24px] p-8 sm:p-10 bg-white border border-[#EBEBEB] shadow-sm"
    >
      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.14em] mb-8 text-center">
        How to redeem
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-7">
        {steps.map(s => (
          <div key={s.num} className="flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#E21B70]/5 border border-[#E21B70]/10 text-[#E21B70]">
              {s.icon}
            </div>
            <div>
              <p className="text-[9px] font-black text-zinc-300 mb-0.5 uppercase tracking-wider">Step {s.num}</p>
              <p className="text-[13px] font-black text-zinc-900 mb-1">{s.title}</p>
              <p className="text-[12px] text-zinc-500 font-medium leading-relaxed">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

// Page 
export default function OffersPage() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all')
  const [copiedId, setCopiedId]         = useState<string | null>(null)
  const [toast, setToast]               = useState<ToastData | null>(null)

  const filtered = useMemo<Offer[]>(() => {
    switch (activeFilter) {
      case 'percentage': return offers.filter(o => o.discountType === 'percentage')
      case 'fixed':      return offers.filter(o => o.discountType === 'fixed')
      case 'restaurant': return offers.filter(o => !!o.restaurantId)
      case 'global':     return offers.filter(o => !o.restaurantId)
      default:           return offers
    }
  }, [activeFilter])

  const counts = useMemo<Record<FilterKey, number>>(() => ({
    all:        offers.length,
    percentage: offers.filter(o => o.discountType === 'percentage').length,
    fixed:      offers.filter(o => o.discountType === 'fixed').length,
    restaurant: offers.filter(o => !!o.restaurantId).length,
    global:     offers.filter(o => !o.restaurantId).length,
  }), [])

  const offerStats = useMemo<OfferStatsProps>(() => ({
    total:           offers.length,
    maxDiscount:     Math.max(...offers.filter(o => o.discountType === 'percentage').map(o => o.discountValue)),
    restaurantCount: new Set(offers.filter(o => o.restaurantId).map(o => o.restaurantId)).size,
  }), [])

  const handleCopy = useCallback((offer: Offer) => {
    navigator.clipboard.writeText(offer.code).catch(() => {})
    setCopiedId(offer.id)
    setToast({ id: offer.id, code: offer.code })
    setTimeout(() => setCopiedId(null), 2500)
  }, [])

  const dismissToast = useCallback(() => setToast(null), [])

  return (
    <div className="min-h-screen pb-20 bg-[#F8F9FA]">
      <HeroSection offerStats={offerStats} />

      <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-30">

    {/* Filter Bar  wit */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
          <FilterBar active={activeFilter} onChange={setActiveFilter} counts={counts} />
          <AnimatePresence mode="wait">
            <motion.p
              key={activeFilter}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="text-md font-extrabold text-slate-700 tracking-wide"
            >
              <span className="font-black text-xl text-pink-700/70">{filtered.length}</span>{' '}
              {filtered.length === 1 ? 'voucher' : 'vouchers'} found
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Updated: mode="popLayout" for smooth transitions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <EmptyState key="empty" onReset={() => setActiveFilter('all')} />
            ) : (
              filtered.map(offer => (
                <OfferCard
                  key={offer.id}
                  offer={offer}
                  onCopy={handleCopy}
                  copiedId={copiedId}
                />
              ))
            )}
          </AnimatePresence>
        </div>

        <HowItWorks />
        <p className="text-center text-[11px] text-zinc-300 font-medium mt-10">
          Offers subject to availability · Terms & conditions apply
        </p>
      </div>

      <AnimatePresence>
        {toast && <Toast key={toast.id} data={toast} onDismiss={dismissToast} />}
      </AnimatePresence>
    </div>
  )
}