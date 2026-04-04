'use client'

import React, {
  useState, useMemo, useRef, useCallback, useEffect,
} from 'react'
import {
  motion, AnimatePresence,
  type Variants,
} from 'framer-motion'
import {
  Search, Star, Zap, Bike, SlidersHorizontal, UtensilsCrossed, Sparkles, SlidersVertical, X, CheckCheck,
} from 'lucide-react'
import { restaurants, categories, type Restaurant } from '@/data/mock-data'
import { RestaurantCard } from '@/components/RestaurantCard'
import { RestaurantMenu } from '@/components/Restaurantmenu'

type SortKey = 'default' | 'top_rated' | 'fastest' | 'free_delivery'
type PriceRange = [number, number]

interface FilterState {
  query: string
  activeCategory: string
  sortKey: SortKey
  priceRange: PriceRange
}

const PRICE_MIN = 0
const PRICE_MAX = 50

const SORT_OPTIONS: { key: SortKey; label: string; icon: React.ReactNode }[] = [
  { key: 'default', label: 'Recommended', icon: <Sparkles size={13} /> },
  { key: 'top_rated', label: 'Top Rated', icon: <Star size={13} /> },
  { key: 'fastest', label: 'Fastest Delivery', icon: <Zap size={13} /> },
  { key: 'free_delivery', label: 'Free Delivery', icon: <Bike size={13} /> },
]

const DEFAULT_FILTERS: FilterState = {
  query: '',
  activeCategory: 'All',
  sortKey: 'default',
  priceRange: [PRICE_MIN, PRICE_MAX],
}

const GRID_VARIANTS: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.055 } },
}

const CARD_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, scale: 0.97, transition: { duration: 0.18 } },
}

const DRAWER_VARIANTS: Variants = {
  hidden: { y: '100%', opacity: 0.7 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 400, damping: 40 } },
  exit: { y: '100%', opacity: 0, transition: { duration: 0.26, ease: [0.4, 0, 1, 1] } },
}

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ')
}
//SliderThumb
function SliderThumb({
  pct,
  value,
  isActive,
  onPointerDown,
}: {
  pct: number
  value: number
  isActive: boolean
  onPointerDown: (e: React.PointerEvent) => void
}) {
  return (
    <div
      className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${pct}%` }}
    >
      {/* Floating tooltip */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.88 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.88 }}
            transition={{ duration: 0.14 }}
            className="absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md text-[10px] font-black text-white whitespace-nowrap pointer-events-none"
            style={{
              background: '#E21B70',
              boxShadow: '0 2px 8px rgba(226,27,112,0.45)',
            }}
          >
            ${value}
            {/* Arrow */}
            <span
              className="absolute top-full left-1/2 -translate-x-1/2"
              style={{
                width: 0, height: 0,
                borderLeft: '4px solid transparent',
                borderRight: '4px solid transparent',
                borderTop: '4px solid #E21B70',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Thumb handle */}
      <motion.div
        onPointerDown={onPointerDown}
        whileHover={{ scale: 1.18 }}
        whileTap={{ scale: 0.92 }}
        animate={{ scale: isActive ? 1.15 : 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        style={{ touchAction: 'none' }}
        className="w-[18px] h-[18px] rounded-full bg-white border-[2.5px] border-[#E21B70] cursor-grab active:cursor-grabbing"

      />
    </div>
  )
}

//DualRangeSlider
function DualRangeSlider({
  value,
  onChange,
}: {
  value: PriceRange
  onChange: (v: PriceRange) => void
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const dragging = useRef<'min' | 'max' | null>(null)
  const [active, setActive] = useState<'min' | 'max' | null>(null)

  const toPercent = (v: number) => ((v - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100
  const fromPercent = (p: number) =>
    Math.round(Math.max(PRICE_MIN, Math.min(PRICE_MAX, (p / 100) * (PRICE_MAX - PRICE_MIN) + PRICE_MIN)))

  const getPercent = (e: PointerEvent) => {
    const rect = trackRef.current!.getBoundingClientRect()
    return Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
  }

  const startDrag = (thumb: 'min' | 'max') => (e: React.PointerEvent) => {
    e.preventDefault()
    dragging.current = thumb
    setActive(thumb)

    const onMove = (ev: PointerEvent) => {
      const raw = fromPercent(getPercent(ev))
      onChange(
        thumb === 'min'
          ? [Math.min(raw, value[1] - 2), value[1]]
          : [value[0], Math.max(raw, value[0] + 2)]
      )
    }
    const onUp = () => {
      dragging.current = null
      setActive(null)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  const leftPct = toPercent(value[0])
  const rightPct = toPercent(value[1])

  return (
    <div className="select-none">
      {/* Track */}
      <div ref={trackRef} className="relative h-[5px] rounded-full bg-zinc-100 mx-2 my-8">
        {/* Gradient fill between thumbs */}
        <div
          className="absolute h-full rounded-full"
          style={{
            left: `${leftPct}%`,
            width: `${rightPct - leftPct}%`,
            background: 'linear-gradient(90deg, #E21B70 0%, #ff6aab 100%)',
          }}
        />
        <SliderThumb pct={leftPct} value={value[0]} isActive={active === 'min'} onPointerDown={startDrag('min')} />
        <SliderThumb pct={rightPct} value={value[1]} isActive={active === 'max'} onPointerDown={startDrag('max')} />
      </div>

      {/* Static range labels */}
      <div className="flex items-center justify-between px-1">
        <span className="text-[11px] font-semibold text-zinc-400">${value[0]}</span>
        <span className="text-[10px] text-zinc-300">–</span>
        <span className="text-[11px] font-semibold text-zinc-400">${value[1]}</span>
      </div>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.13em] mb-3">
      {children}
    </p>
  )
}
function Divider() {
  return <div className="h-px bg-zinc-100" />
}


//FilterPanel — used in both desktop sidebar and mobile drawer
interface FilterPanelProps {
  filters: FilterState
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>
  categoryCounts: Record<string, number>
  onClose?: () => void
}
function FilterPanel({ filters, setFilters, categoryCounts, onClose }: FilterPanelProps) {
  const patch = useCallback(
    (partial: Partial<FilterState>) => setFilters(prev => ({ ...prev, ...partial })),
    [setFilters]
  )

  const hasActiveFilters =
    filters.activeCategory !== 'All' ||
    filters.sortKey !== 'default' ||
    filters.priceRange[0] !== PRICE_MIN ||
    filters.priceRange[1] !== PRICE_MAX

  const resetFilters = () =>
    setFilters(prev => ({ ...DEFAULT_FILTERS, query: prev.query }))

  const allCategories = [
    { name: 'All', icon: '🍽️' },
    ...categories.map(c => ({ name: c.name, icon: (c as any).icon ?? '🍴' })),
  ]

  return (
    <div className="flex flex-col gap-7">

      {/* Panel header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersVertical size={15} className="text-[#E21B70]" />
          <span className="text-[13px] font-black text-zinc-900 tracking-tight">Filters</span>
        </div>
        <div className="flex items-center gap-2">
          <AnimatePresence>
            {hasActiveFilters && (
              <motion.button
                initial={{ opacity: 0, scale: 0.82 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.82 }}
                whileTap={{ scale: 0.94 }}
                onClick={resetFilters}
                className="flex items-center gap-1 text-[11px] font-bold text-[#E21B70] px-2.5 py-1 rounded-full"
                style={{
                  background: 'rgba(226,27,112,0.08)',
                  border: '1px solid rgba(226,27,112,0.18)',
                }}
              >
                <X size={9} /> Reset
              </motion.button>
            )}
          </AnimatePresence>
          {onClose && (
            <button
              onClick={onClose}
              aria-label="Close filters"
              className="w-7 h-7 flex items-center justify-center rounded-full bg-zinc-100 hover:bg-zinc-200 transition-colors"
            >
              <X size={13} className="text-zinc-500" />
            </button>
          )}
        </div>
      </div>

      {/* ── Sort By ── */}
      <div>
        <SectionLabel>Sort By</SectionLabel>
        <div className="flex flex-col gap-0.5">
          {SORT_OPTIONS.map(opt => {
            const isActive = filters.sortKey === opt.key
            return (
              <motion.button
                key={opt.key}
                whileTap={{ scale: 0.975 }}
                onClick={() => patch({ sortKey: opt.key })}
                className={cn(
                  'relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-semibold transition-colors text-left',
                  isActive ? 'text-[#E21B70]' : 'text-zinc-600 hover:bg-zinc-50'
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="sort-pill"
                    className="absolute inset-0 rounded-xl"
                    style={{
                      background: 'rgba(226,27,112,0.08)',
                      border: '1px solid rgba(226,27,112,0.18)',
                    }}
                    transition={{ type: 'spring', stiffness: 340, damping: 32 }}
                  />
                )}
                <span className={cn('relative z-10 shrink-0', isActive ? 'text-[#E21B70]' : 'text-zinc-400')}>
                  {opt.icon}
                </span>
                <span className="relative z-10 flex-1">{opt.label}</span>
                {isActive && <CheckCheck size={12} className="relative z-10 text-[#E21B70]" />}
              </motion.button>
            )
          })}
        </div>
      </div>

      <Divider />

      {/* ── Cuisine ── */}
      <div>
        <SectionLabel>Cuisine</SectionLabel>
        <div className="flex flex-col gap-0.5 max-h-52 overflow-y-auto pr-1" style={{ scrollbarWidth: 'none' }}>
          {allCategories.map(cat => {
            const isActive = filters.activeCategory === cat.name
            const count = categoryCounts[cat.name] ?? 0
            return (
              <motion.button
                key={cat.name}
                whileTap={{ scale: 0.975 }}
                onClick={() => patch({ activeCategory: cat.name })}
                className={cn(
                  'relative flex items-center gap-3 px-3.5 py-2 rounded-xl text-[13px] font-semibold transition-colors text-left',
                  isActive ? 'text-[#E21B70]' : 'text-zinc-600 hover:bg-zinc-50'
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="category-pill"
                    className="absolute inset-0 rounded-xl"
                    style={{
                      background: 'rgba(226,27,112,0.08)',
                      border: '1px solid rgba(226,27,112,0.18)',
                    }}
                    transition={{ type: 'spring', stiffness: 340, damping: 32 }}
                  />
                )}
                <span className="relative z-10 text-base leading-none">{cat.icon}</span>
                <span className="relative z-10 flex-1">{cat.name}</span>
                <span
                  className={cn(
                    'relative z-10 text-[10px] font-black px-1.5 py-0.5 rounded-full',
                    isActive
                      ? 'text-[#E21B70] bg-[#E21B70]/[0.12]'
                      : 'text-zinc-400 bg-zinc-100'
                  )}
                >
                  {count}
                </span>
              </motion.button>
            )
          })}
        </div>
      </div>

      <Divider />

      <div>
        <div className="flex items-center justify-between mb-1">
          <SectionLabel>Min Order ($)</SectionLabel>
          <span className="text-[11px] font-bold" style={{ color: '#E21B70' }}>
            ${filters.priceRange[0]} – ${filters.priceRange[1]}
          </span>
        </div>
        <DualRangeSlider
          value={filters.priceRange}
          onChange={r => patch({ priceRange: r })}
        />
      </div>
    </div>
  )
}

//top bar component with search and filter button
interface TopBarProps {
  query: string
  onQueryChange: (v: string) => void
  resultCount: number
  activeFilterCount: number
  onFilterOpen: () => void
}
//Fixed top bar with search input, result count, and mobile filter button
function TopBar({ query, onQueryChange, resultCount, activeFilterCount, onFilterOpen }: TopBarProps) {
  return (
    <header
      className="fixed top-16 left-0 right-0 z-50 border-b"
      style={{
        background: 'rgba(250,250,248,0.82)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderColor: '#EBEBEB',
      }}
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 h-[60px] flex items-center gap-3">

        {/* Search */}
        <div className="flex-1 relative group">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#E21B70] transition-colors pointer-events-none"
          />
          <input
            type="search"
            value={query}
            onChange={e => onQueryChange(e.target.value)}
            placeholder="Search restaurants or cuisines…"
            className="w-full pl-10 pr-9 py-2.5 rounded-2xl text-[13px] font-medium text-zinc-800 placeholder-zinc-400 outline-none transition-all duration-200 focus:bg-white"
            style={{
              background: '#F4F4F2',
              border: '1px solid #E8E8E8',
            }}
            onFocus={e => {
              e.currentTarget.style.border = '1px solid rgba(226,27,112,0.4)'
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(226,27,112,0.08)'
            }}
            onBlur={e => {
              e.currentTarget.style.border = '1px solid #E8E8E8'
              e.currentTarget.style.boxShadow = 'none'
            }}
          />
          <AnimatePresence>
            {query && (
              <motion.button
                initial={{ opacity: 0, scale: 0.75 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.75 }}
                onClick={() => onQueryChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center rounded-full bg-zinc-300/70 hover:bg-zinc-300 text-zinc-500 transition-colors"
              >
                <X size={9} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Result count */}
        <AnimatePresence mode="wait">
          <motion.div
            key={resultCount}
            initial={{ opacity: 0, scale: 0.82 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.82 }}
            transition={{ duration: 0.18 }}
            className="hidden sm:flex shrink-0 items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{
              background: 'rgba(226,27,112,0.07)',
              border: '1px solid rgba(226,27,112,0.18)',
            }}
          >
            <span className="font-black text-[13px]" style={{ color: '#E21B70' }}>{resultCount}</span>
            <span className="text-[11px] font-semibold" style={{ color: 'rgba(226,27,112,0.6)' }}>places</span>
          </motion.div>
        </AnimatePresence>

        {/* Mobile filter button */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={onFilterOpen}
          className="lg:hidden relative flex items-center gap-2 px-3.5 py-2.5 bg-white rounded-2xl text-[13px] font-semibold text-zinc-700"
          style={{
            border: '1px solid #E8E8E8',
            boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
          }}
        >
          <SlidersHorizontal size={14} className="text-zinc-500" />
          <span className="hidden sm:inline">Filters</span>
          <AnimatePresence>
            {activeFilterCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1.5 -right-1.5 w-[18px] h-[18px] rounded-full text-white text-[9px] font-black flex items-center justify-center"
                style={{ background: '#E21B70' }}
              >
                {activeFilterCount}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </header>
  )
}
//mobile drawer component for filters
interface MobileDrawerProps {
  open: boolean
  onClose: () => void
  filters: FilterState
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>
  categoryCounts: Record<string, number>
}
function MobileDrawer({ open, onClose, filters, setFilters, categoryCounts }: MobileDrawerProps) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/35"
            style={{ backdropFilter: 'blur(4px)' }}
          />
          <motion.div
            variants={DRAWER_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed bottom-0 left-0 right-0 z-[70] bg-white rounded-t-[28px] flex flex-col max-h-[88dvh]"
            style={{ boxShadow: '0 -8px 40px rgba(0,0,0,0.14)' }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-9 h-1 rounded-full bg-zinc-200" />
            </div>

            {/* Scrollable filter content */}
            <div className="flex-1 overflow-y-auto px-6 py-3" style={{ scrollbarWidth: 'none' }}>
              <FilterPanel
                filters={filters}
                setFilters={setFilters}
                categoryCounts={categoryCounts}
                onClose={onClose}
              />
            </div>

            {/* Apply CTA */}
            <div className="shrink-0 px-6 pt-3 pb-7 border-t border-zinc-100">
              <motion.button
                whileTap={{ scale: 0.975 }}
                onClick={onClose}
                className="w-full py-3.5 rounded-2xl text-white text-[14px] font-black tracking-wide"
                style={{
                  background: 'linear-gradient(135deg, #E21B70 0%, #ff5fa0 100%)',
                  boxShadow: '0 6px 20px rgba(226,27,112,0.38)',
                }}
              >
                Show Results
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
//
function EmptyState({ query, onReset }: { query: string; onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="col-span-full flex flex-col items-center justify-center py-24 text-center"
    >
      <div className="relative mb-6">
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center"
          style={{
            background: 'rgba(226,27,112,0.07)',
            border: '1px solid rgba(226,27,112,0.14)',
          }}
        >
          <UtensilsCrossed size={32} style={{ color: 'rgba(226,27,112,0.38)' }} />
        </div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          className="absolute -inset-3 rounded-[36px] border border-dashed"
          style={{ borderColor: 'rgba(226,27,112,0.18)' }}
        />
      </div>
      <p className="text-[18px] font-black text-zinc-900 tracking-tight mb-1.5">No places found</p>
      <p className="text-[13px] text-zinc-400 font-medium max-w-xs leading-relaxed mb-6">
        {query ? (
          <>No results for <span className="font-bold text-[#E21B70]">"{query}"</span>. Try adjusting your filters.</>
        ) : (
          'No restaurants match your current filters.'
        )}
      </p>
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        onClick={onReset}
        className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-white text-[13px] font-bold"
        style={{
          background: 'linear-gradient(135deg, #E21B70, #ff5fa0)',
          boxShadow: '0 5px 18px rgba(226,27,112,0.36)',
        }}
      >
        <X size={13} /> Clear all filters
      </motion.button>
    </motion.div>
  )
}
//grid component to display restaurants
interface RestaurantGridProps {
  filtered: Restaurant[]
  favorites: Set<string>
  toggleFavorite: (id: string) => void
  query: string
  onReset: () => void
  onViewMenu: (r: Restaurant) => void
}
function RestaurantGrid({ filtered, favorites, toggleFavorite, query, onReset, onViewMenu }: RestaurantGridProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={filtered.length === 0 ? 'empty' : 'results'}
        variants={GRID_VARIANTS}
        initial="hidden"
        animate="visible"
        exit={{ opacity: 0, transition: { duration: 0.15 } }}
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
      >
        {filtered.length === 0 ? (
          <EmptyState query={query} onReset={onReset} />
        ) : (
          filtered.map(r => (
            <motion.div key={r.id} variants={CARD_VARIANTS} layout="position">
              <RestaurantCard
                restaurant={r}
                isFavorite={favorites.has(r.id)}
                onToggleFavorite={toggleFavorite}
                onViewMenu={() => onViewMenu(r)}

              />
            </motion.div>
          ))
        )}
      </motion.div>
    </AnimatePresence>
  )
}
//main page component
export default function RestaurantsPage() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const [drawerOpen, setDrawer] = useState(false)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)


  const toggleFavorite = useCallback((id: string) =>
    setFavorites(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    }),
    [])

  // Category counts for sidebar badges
  const categoryCounts = useMemo<Record<string, number>>(() => {
    const counts: Record<string, number> = { All: restaurants.length }
    restaurants.forEach(r => {
      counts[r.cuisineType] = (counts[r.cuisineType] ?? 0) + 1
    })
    return counts
  }, [])

  // Filtered + sorted list
  const filtered = useMemo<Restaurant[]>(() => {
    const q = filters.query.toLowerCase().trim()
    const [minP, maxP] = filters.priceRange

    let list = restaurants.filter(r => {
      if (filters.activeCategory !== 'All' && r.cuisineType !== filters.activeCategory) return false
      if (filters.sortKey === 'free_delivery' && r.deliveryFee !== 0) return false
      if (r.minOrder < minP || r.minOrder > maxP) return false
      if (q) return r.name.toLowerCase().includes(q) || r.cuisineType.toLowerCase().includes(q)
      return true
    })

    if (filters.sortKey === 'top_rated') list = [...list].sort((a, b) => b.rating - a.rating)
    if (filters.sortKey === 'fastest') list = [...list].sort((a, b) => a.deliveryTime - b.deliveryTime)

    return list
  }, [filters])

  const resetAll = useCallback(
    () => setFilters(prev => ({ ...DEFAULT_FILTERS, query: prev.query })),
    []
  )

  const activeFilterCount = useMemo(() =>
    [
      filters.activeCategory !== 'All',
      filters.sortKey !== 'default',
      filters.priceRange[0] !== PRICE_MIN || filters.priceRange[1] !== PRICE_MAX,
    ].filter(Boolean).length,
    [filters])

  return (
    <div className="min-h-screen" style={{ background: '#FAFAF8' }}>

      {/* Fixed top bar */}
      <TopBar
        query={filters.query}
        onQueryChange={v => setFilters(p => ({ ...p, query: v }))}
        resultCount={filtered.length}
        activeFilterCount={activeFilterCount}
        onFilterOpen={() => setDrawer(true)}
      />

      {/* Page body */}
      <div className="pt-[76px] max-w-screen-xl mx-auto px-4 sm:px-6 py-8 flex gap-8">

        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-[268px] shrink-0">
          <div className="sticky top-[84px]">
            <motion.div
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white rounded-[22px] p-5"
              style={{
                border: '1px solid #EBEBEB',
                boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
              }}
            >
              <FilterPanel
                filters={filters}
                setFilters={setFilters}
                categoryCounts={categoryCounts}
              />
            </motion.div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">

          {/* Page heading */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mb-7 flex items-end justify-between gap-4 flex-wrap"
          >
            <div>
              <h1 className="text-[28px] sm:text-[32px] font-black text-zinc-900 tracking-tight leading-none">
                Explore{' '}
                <span
                  style={{
                    background: 'linear-gradient(120deg, #E21B70 20%, #ff6aab 80%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Restaurants
                </span>
              </h1>
              <p className="text-[13px] text-zinc-400 font-medium mt-1.5">
                {restaurants.length} restaurants available near you
              </p>
            </div>

            {/* Live count + active filter badge */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <AnimatePresence mode="wait">
                <motion.p
                  key={`${filters.activeCategory}-${filters.sortKey}-${filtered.length}`}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.22 }}
                  className="text-[13px] font-semibold text-zinc-500"
                >
                  <span className="font-black text-zinc-900">{filtered.length}</span>{' '}
                  {filtered.length === 1 ? 'place' : 'places'} found
                </motion.p>
              </AnimatePresence>

              <AnimatePresence>
                {activeFilterCount > 0 && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.82 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.82 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={resetAll}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold"
                    style={{
                      color: '#E21B70',
                      background: 'rgba(226,27,112,0.08)',
                      border: '1px solid rgba(226,27,112,0.2)',
                    }}
                  >
                    <X size={9} />
                    {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Card grid */}
          <RestaurantGrid
            filtered={filtered}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            query={filters.query}
            onReset={resetAll}
            onViewMenu={r => setSelectedRestaurant(r)}
          />

          {/* Footer copy */}
          {filtered.length > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-center text-[11px] text-zinc-300 font-medium mt-14"
            >
              Showing all {filtered.length} results · More restaurants coming soon
            </motion.p>
          )}
        </main>
      </div>





      {/* Restaurant menu modal */}
      <AnimatePresence>
        {selectedRestaurant && (
          <RestaurantMenu
            restaurant={selectedRestaurant}
            onClose={() => setSelectedRestaurant(null)}
          />
        )}
      </AnimatePresence>


      {/* Mobile bottom drawer */}
      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawer(false)}
        filters={filters}
        setFilters={setFilters}
        categoryCounts={categoryCounts}
      />


    </div>
  )
}