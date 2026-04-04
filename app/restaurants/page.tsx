'use client'

import React, { useState, useMemo, useRef, useCallback } from 'react'
import Link from 'next/link'
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
    type Variants,
} from 'framer-motion'
import {
  Search,
  ArrowLeft,
  Heart,
  Star,
  Clock,
  MapPin,
  Bike,
  SlidersHorizontal,
  ChevronDown,
  X,
  TrendingUp,
  Zap,
  UtensilsCrossed,
  Filter,
  CheckCheck,
  Sparkles,
} from 'lucide-react'
import { restaurants, categories, type Restaurant } from '@/data/mock-data'
import { RestaurantCard } from '@/components/RestaurantCard'

// ─── Types

type SortKey = 'default' | 'top_rated' | 'fastest' | 'free_delivery'

interface SortOption {
  key: SortKey
  label: string
  icon: React.ReactNode
}

//constants
const SORT_OPTIONS: SortOption[] = [
  { key: 'default',      label: 'Recommended',     icon: <Sparkles size={13} /> },
  { key: 'top_rated',    label: 'Top Rated',        icon: <Star size={13} /> },
  { key: 'fastest',      label: 'Fastest Delivery', icon: <Zap size={13} /> },
  { key: 'free_delivery',label: 'Free Delivery',    icon: <Bike size={13} /> },
]

//Animation variants

const gridContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}

const cardVariant : Variants= {
  hidden: { opacity: 0, y: 28, scale: 0.97, filter: 'blur(6px)' },
  visible: {
    opacity: 1, y: 0, scale: 1, filter: 'blur(0px)',
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0, scale: 0.96, y: -10,
    transition: { duration: 0.22, ease: [0.4, 0, 1, 1] },
  },
}

// Tilt Card Hook

function useTilt() {
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [5, -5]), { stiffness: 140, damping: 22 })
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-5, 5]), { stiffness: 140, damping: 22 })

  const onMove = useCallback((e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    mx.set((e.clientX - rect.left) / rect.width - 0.5)
    my.set((e.clientY - rect.top) / rect.height - 0.5)
  }, [mx, my])

  const onLeave = useCallback(() => { mx.set(0); my.set(0) }, [mx, my])

  return { ref, rx, ry, onMove, onLeave }
}


// Cuisine Filter Chip

function FilterChip({
  label,
  icon,
  active,
  count,
  onClick,
}: {
  label: string
  icon?: string
  active: boolean
  count: number
  onClick: () => void
}) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      className={`relative shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-semibold transition-all duration-200 ${
        active
          ? 'text-white shadow-[0_4px_16px_rgba(226,27,112,0.38)]'
          : 'bg-white text-slate-600 border border-slate-200 hover:border-[#E21B70]/30 hover:text-[#E21B70] shadow-sm'
      }`}
    >
      {active && (
        <motion.span
          layoutId="filterCapsule"
          className="absolute inset-0 rounded-full bg-gradient-to-r from-[#E21B70] to-[#ff4d9e]"
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        />
      )}
      {icon && <span className="relative z-10 text-sm leading-none">{icon}</span>}
      <span className="relative z-10">{label}</span>
      <span className={`relative z-10 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
        {count}
      </span>
    </motion.button>
  )
}

//Sort Dropdown 

function SortDropdown({ active, onChange }: { active: SortKey; onChange: (k: SortKey) => void }) {
  const [open, setOpen] = useState(false)
  const current = SORT_OPTIONS.find(s => s.key === active)!

  return (
    <div className="relative">
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => setOpen(p => !p)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-[13px] font-semibold text-slate-700 shadow-sm hover:border-[#E21B70]/30 hover:text-[#E21B70] transition-colors"
      >
        <SlidersHorizontal size={14} />
        {current.label}
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={13} />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-20"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.96 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 top-full mt-2 z-30 w-52 bg-white/95 backdrop-blur-xl border border-slate-100 rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.12)] overflow-hidden py-1.5"
            >
              {SORT_OPTIONS.map(opt => (
                <button
                  key={opt.key}
                  onClick={() => { onChange(opt.key); setOpen(false) }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-semibold transition-colors text-left ${
                    active === opt.key
                      ? 'text-[#E21B70] bg-[#E21B70]/5'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span className={active === opt.key ? 'text-[#E21B70]' : 'text-slate-400'}>
                    {opt.icon}
                  </span>
                  {opt.label}
                  {active === opt.key && <CheckCheck size={13} className="ml-auto text-[#E21B70]" />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

//Empty State 

function EmptyState({ query, onReset }: { query: string; onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="col-span-full flex flex-col items-center justify-center py-24 text-center px-6"
    >
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#E21B70]/10 to-[#FFB100]/10 border border-[#E21B70]/15 flex items-center justify-center">
          <UtensilsCrossed size={36} className="text-[#E21B70]/50" />
        </div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="absolute -inset-3 rounded-[36px] border border-dashed border-[#E21B70]/20"
        />
      </div>

      <h3 className="text-xl font-black text-gray-900 tracking-tight mb-2">
        No restaurants found
      </h3>
      <p className="text-sm text-slate-400 font-medium max-w-xs leading-relaxed mb-6">
        {query
          ? <>No results for <span className="font-bold text-[#E21B70]">"{query}"</span>. Try a different search or filter.</>
          : 'No restaurants match your current filters.'}
      </p>
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        onClick={onReset}
        className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#E21B70] to-[#ff4d9e] text-white text-sm font-bold shadow-[0_6px_24px_rgba(226,27,112,0.38)]"
      >
        <X size={14} />
        Clear all filters
      </motion.button>
    </motion.div>
  )
}

// Sticky Header

function StickyHeader({
  query,
  onQueryChange,
  resultCount,
}: {
  query: string
  onQueryChange: (v: string) => void
  resultCount: number
}) {
  const { scrollY } = useScroll()
  const shadow = useTransform(scrollY, [0, 60], ['0 0 0 rgba(0,0,0,0)', '0 4px 24px rgba(0,0,0,0.07)'])

  return (
    <motion.header
      style={{ boxShadow: shadow }}
      className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 h-16 sm:h-18 py-3">
          {/* Back */}
          <Link href="/">
            <motion.div
              whileHover={{ x: -2 }}
              whileTap={{ scale: 0.94 }}
              className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-[#E21B70] transition-colors shrink-0"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Home</span>
            </motion.div>
          </Link>

          {/* Brand */}
          <Link href="/" className="shrink-0">
            <span className="text-lg font-black italic bg-gradient-to-r from-[#E21B70] to-[#FFB100] bg-clip-text text-transparent tracking-tight">
              FoodExpress
            </span>
          </Link>

          {/* Search bar */}
          <div className="flex-1 relative group max-w-xl ml-auto">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#E21B70] transition-colors pointer-events-none"
            />
            <input
              type="search"
              value={query}
              onChange={e => onQueryChange(e.target.value)}
              placeholder="Search restaurants, cuisines, dishes…"
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-[#E21B70]/20 focus:border-[#E21B70]/50 focus:bg-white transition-all duration-200"
            />
            <AnimatePresence>
              {query && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => onQueryChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={13} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Result pill */}
          <AnimatePresence mode="wait">
            <motion.div
              key={resultCount}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="hidden sm:flex shrink-0 items-center gap-1.5 px-3 py-1.5 bg-[#E21B70]/8 border border-[#E21B70]/20 rounded-full"
            >
              <span className="text-[#E21B70] font-black text-sm">{resultCount}</span>
              <span className="text-[11px] font-semibold text-[#E21B70]/70">places</span>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  )
}

//Page
export default function RestaurantsPage() {
  const [query, setQuery]           = useState('')
  const [activeCategory, setActive] = useState('All')
  const [sortKey, setSort]          = useState<SortKey>('default')
  const [favorites, setFavorites]   = useState<Set<string>>(new Set())

  const filterScrollRef = useRef<HTMLDivElement>(null)

  const toggleFavorite = useCallback((id: string) => {
    setFavorites(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }, [])

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: restaurants.length }
    categories.forEach(c => {
      counts[c.name] = restaurants.filter(r => r.cuisineType === c.name).length
    })
    return counts
  }, [])

  // Filtered + sorted results
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()

    let result = restaurants.filter(r => {
      // Category filter
      if (activeCategory !== 'All' && r.cuisineType !== activeCategory) return false

      // Sort-level filter: free delivery
      if (sortKey === 'free_delivery' && r.deliveryFee !== 0) return false

      // Search: name, cuisineType, menu items
      if (q) {
        const nameMatch    = r.name.toLowerCase().includes(q)
        const cuisineMatch = r.cuisineType.toLowerCase().includes(q)
        const menuMatch    = r.menu.some(
          m =>
            m.name.toLowerCase().includes(q) ||
            m.description.toLowerCase().includes(q) ||
            m.category.toLowerCase().includes(q)
        )
        return nameMatch || cuisineMatch || menuMatch
      }

      return true
    })

    // Sort
    if (sortKey === 'top_rated') {
      result = [...result].sort((a, b) => b.rating - a.rating)
    } else if (sortKey === 'fastest') {
      result = [...result].sort((a, b) => a.deliveryTime - b.deliveryTime)
    }

    return result
  }, [query, activeCategory, sortKey])

  const resetAll = () => {
    setQuery('')
    setActive('All')
    setSort('default')
  }

  // Active filter count for badge
  const activeFilters = [
    query !== '',
    activeCategory !== 'All',
    sortKey !== 'default',
  ].filter(Boolean).length

  return (
    <div className="min-h-screen" style={{ background: '#FAF9F6' }}>
      {/* Sticky Header */}
      <StickyHeader query={query} onQueryChange={setQuery} resultCount={filtered.length} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">

        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="pt-8 pb-6"
        >
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight">
                Explore{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg, #E21B70 0%, #ff4d9e 50%, #FFB100 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Restaurants
                </span>
              </h1>
              <p className="text-slate-400 text-sm font-medium mt-1.5">
                {restaurants.length} restaurants available near you
              </p>
            </div>

            {/* Active filter badge */}
            <AnimatePresence>
              {activeFilters > 0 && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetAll}
                  className="flex items-center gap-2 px-4 py-2 bg-[#E21B70]/8 border border-[#E21B70]/25 rounded-2xl text-[13px] font-bold text-[#E21B70]"
                >
                  <Filter size={13} />
                  {activeFilters} active
                  <X size={11} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/*Cuisine Filter Chips */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative mb-6"
        >
          {/* Edge fades */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-[#FAF9F6] to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-[#FAF9F6] to-transparent z-10" />

          <div
            ref={filterScrollRef}
            className="flex items-center gap-2.5 overflow-x-auto pb-2"
            style={{ scrollbarWidth: 'none' }}
          >
            {/* All chip */}
            <FilterChip
              label="All"
              icon="🍽️"
              active={activeCategory === 'All'}
              count={categoryCounts['All']}
              onClick={() => setActive('All')}
            />

            {/* Category chips */}
            {categories.map(cat => (
              <FilterChip
                key={cat.id}
                label={cat.name}
                icon={cat.icon}
                active={activeCategory === cat.name}
                count={categoryCounts[cat.name] ?? 0}
                onClick={() => setActive(cat.name)}
              />
            ))}
          </div>
        </motion.div>

        {/* Results bar + Sort */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex items-center justify-between mb-6 gap-4"
        >
          <div>
            <AnimatePresence mode="wait">
              <motion.p
                key={`${activeCategory}-${query}-${sortKey}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3 }}
                className="text-sm font-semibold text-slate-500"
              >
                <span className="font-black text-gray-900">{filtered.length}</span>{' '}
                {filtered.length === 1 ? 'restaurant' : 'restaurants'} found
                {activeCategory !== 'All' && (
                  <> in <span className="text-[#E21B70] font-bold">{activeCategory}</span></>
                )}
                {query && (
                  <> for "<span className="text-[#E21B70] font-bold">{query}</span>"</>
                )}
              </motion.p>
            </AnimatePresence>
          </div>

          <SortDropdown active={sortKey} onChange={setSort} />
        </motion.div>

        {/*Restaurant Grid*/}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeCategory}-${query}-${sortKey}`}
            variants={gridContainer}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.length === 0 ? (
              <EmptyState query={query} onReset={resetAll} />
            ) : (
              filtered.map(r => (
                <RestaurantCard
                  key={r.id}
                  restaurant={r}
                  isFavorite={favorites.has(r.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))
            )}
          </motion.div>
        </AnimatePresence>

        {/* Footer spacer text */}
        {filtered.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center text-xs text-slate-300 font-medium mt-14"
          >
            Showing all {filtered.length} results · More coming soon
          </motion.p>
        )}
      </div>
    </div>
  )
}