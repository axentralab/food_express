'use client'

import React, { useState, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, Variants } from 'framer-motion'
import { Star, Clock, MapPin, ChevronLeft, ChevronRight, Bike, TrendingUp, UtensilsCrossed } from 'lucide-react'
import { categories, restaurants, type Restaurant, type Category } from '@/data/mock-data'
// Import the new Menu component
import { RestaurantMenu } from './Restaurantmenu'
import Link from 'next/link'

// Constants
const ALL = 'All'

const GRID_VARIANTS: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
  exit: {},
}

const CARD_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.96, filter: 'blur(4px)' },
  visible: {
    opacity: 1, y: 0, scale: 1, filter: 'blur(0px)',
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0, y: -12, scale: 0.95, filter: 'blur(4px)',
    transition: { duration: 0.25, ease: [0.4, 0, 1, 1] },
  },
}

// 3D Tilt Card Wrapper
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), { stiffness: 150, damping: 22 })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), { stiffness: 150, damping: 22 })
  const glareX = useTransform(mouseX, [-0.5, 0.5], ['0%', '100%'])
  const glareY = useTransform(mouseY, [-0.5, 0.5], ['0%', '100%'])

  const onMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const onLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <motion.div
      ref={ref}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 800 }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
    >
      <motion.div
        style={{
          background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.18) 0%, transparent 70%)`,
          position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none', zIndex: 10,
        }}
      />
      {children}
    </motion.div>
  )
}

// Restaurant Card
function RestaurantCard({ restaurant, onViewMenu }: { restaurant: Restaurant; onViewMenu: (r: Restaurant) => void }) {
  const [imgError, setImgError] = useState(false)

  return (
    <motion.div
      onClick={() => onViewMenu(restaurant)}  
    variants={CARD_VARIANTS} layout>
      <TiltCard
     
      className="relative group cursor-pointer rounded-2xl overflow-hidden bg-white border border-slate-100/80 shadow-[0_4px_24px_rgba(0,0,0,0.07)] hover:shadow-[0_16px_48px_rgba(226,27,112,0.14)] transition-shadow duration-400">
        <div className="relative h-44 overflow-hidden">
          {!imgError ? (
            <img
              src={restaurant.image}
              alt={restaurant.name}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
              <UtensilsCrossed className="w-10 h-10 text-slate-300" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          {restaurant.badge && (
            <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-white text-[11px] font-bold tracking-wide shadow-md ${restaurant.badgeColor ?? 'bg-[#E21B70]'}`}>
              {restaurant.badge}
            </div>
          )}
          {!restaurant.isOpen && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center">
              <span className="bg-black/70 text-white text-sm font-bold px-4 py-1.5 rounded-full">Closed</span>
            </div>
          )}
          <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-white/95 backdrop-blur-sm rounded-full px-2.5 py-1 shadow-sm">
            <Star size={11} fill="#FFB100" stroke="none" />
            <span className="text-xs font-bold text-gray-800">{restaurant.rating}</span>
          </div>
        </div>

        <div className="px-4 pt-3.5 pb-4">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div>
              <h3 className="font-bold text-gray-900 text-[15px] leading-tight">{restaurant.name}</h3>
              <p className="text-xs text-gray-400 mt-0.5 font-medium">{restaurant.cuisineType}</p>
            </div>
            {restaurant.menu.some(m => m.isPopular) && (
              <div className="flex items-center gap-1 shrink-0 bg-[#FFB100]/10 border border-[#FFB100]/25 rounded-full px-2 py-0.5">
                <TrendingUp size={10} className="text-[#FFB100]" />
                <span className="text-[10px] font-bold text-[#FFB100]">Popular</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400 font-medium">
            <span className="flex items-center gap-1">
              <Clock size={12} className="text-[#E21B70]" />
              {restaurant.deliveryTime} min
            </span>
            <span className="w-0.5 h-0.5 rounded-full bg-gray-300" />
            <span className="flex items-center gap-1">
              <MapPin size={12} className="text-[#E21B70]" />
              {restaurant.distance} km
            </span>
            <span className="w-0.5 h-0.5 rounded-full bg-gray-300" />
            <span className="flex items-center gap-1">
              <Bike size={12} className="text-[#E21B70]" />
              {restaurant.deliveryFee === 0 ? (
                <span className="text-green-500 font-bold">Free</span>
              ) : (
                `$${restaurant.deliveryFee.toFixed(2)}`
              )}
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-gray-400">Min. order <span className="font-semibold text-gray-600">${restaurant.minOrder}</span></span>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onViewMenu(restaurant)}
              className="text-[11px] font-bold text-[#E21B70] hover:underline"
            >
              View Menu →
            </motion.button>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  )
}

// Empty State
function EmptyState({ category }: { category: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="col-span-full flex flex-col items-center justify-center py-24 px-6 text-center"
    >
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#E21B70]/10 to-[#FFB100]/10 border border-[#E21B70]/15 flex items-center justify-center">
          <span className="text-5xl">
            {categories.find((c: Category) => c.name === category)?.icon ?? '🍽️'}
          </span>
        </div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          className="absolute -inset-3 rounded-full border border-dashed border-[#E21B70]/20"
        />
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-2">No restaurants found</h3>
      <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
        We don't have any <span className="font-semibold text-[#E21B70]">{category}</span> restaurants in your area right now. Check back soon!
      </p>
    </motion.div>
  )
}

// Category Slider
function CategorySlider({ active, onChange }: { active: string; onChange: (name: string) => void }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' })
  }
  const allCategories: (Category | { id: string; name: string; icon: string; slug: string })[] = [
    { id: 'all', name: ALL, icon: '🍽️', slug: 'all' },
    ...categories,
  ]
  return (
    <div className="relative">
      <div className="pointer-events-none absolute left-10 top-0 bottom-0 w-8 bg-gradient-to-r from-[#fafafa] to-transparent z-10" />
      <div className="pointer-events-none absolute right-10 top-0 bottom-0 w-8 bg-gradient-to-l from-[#fafafa] to-transparent z-10" />
      {['left', 'right'].map(dir => (
        <button
          key={dir}
          onClick={() => scroll(dir as 'left' | 'right')}
          className={`absolute top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white shadow-[0_2px_12px_rgba(0,0,0,0.1)] border border-slate-100 flex items-center justify-center hover:shadow-md transition-shadow ${dir === 'left' ? 'left-0' : 'right-0'}`}
        >
          {dir === 'left' ? <ChevronLeft size={14} className="text-slate-500" /> : <ChevronRight size={14} className="text-slate-500" />}
        </button>
      ))}
      <div
        ref={scrollRef}
        className="flex items-center gap-3 overflow-x-auto px-10 pb-1 scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {allCategories.map((cat) => {
          const isActive = active === cat.name
          return (
            <motion.button
              key={cat.id}
              onClick={() => onChange(cat.name)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`relative shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-colors duration-200 ${
                isActive ? 'text-white shadow-[0_4px_16px_rgba(226,27,112,0.38)]' : 'bg-white/80 backdrop-blur-sm text-slate-600 border border-slate-200/80 hover:border-[#E21B70]/30 hover:text-[#E21B70] shadow-sm'
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="active-pill"
                  className="absolute inset-0 rounded-full bg-linear-to-r  from-[#E21B70] via-[#ff4d9e] to-[#f09c00]"
                  transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                />
              )}
              <span className="relative z-10 text-base leading-none">{cat.icon}</span>
              <span className="relative z-10">{cat.name}</span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

// Section Header
function SectionHeader({ active, count }: { active: string; count: number }) {
  return (
    <div className="flex items-end justify-between mb-6">
      <div>
        <motion.h2
          key={active}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight"
        >
          {active === ALL ? 'All Restaurants' : `${active} Restaurants`}
        </motion.h2>
        <motion.p
          key={`${active}-count`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="text-sm text-gray-400 mt-1 font-medium"
        >
          {count} {count === 1 ? 'place' : 'places'} available near you
        </motion.p>
      </div>
      <Link href="/restaurants">
      <button className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-[#E21B70] hover:underline transition-colors">
        View All <ChevronRight size={14} />
      </button>
      </Link>
    </div>
  )
}

// Restaurant Grid
function RestaurantGrid({ filtered, active, onRestaurantSelect }: { filtered: Restaurant[]; active: string; onRestaurantSelect: (r: Restaurant) => void }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={active}
        variants={GRID_VARIANTS}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filtered.length === 0 ? (
          <EmptyState category={active} />
        ) : (
          filtered.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} onViewMenu={onRestaurantSelect} />
          ))
        )}
      </motion.div>
    </AnimatePresence>
  )
}

// Main Component
export function FeaturedRestaurants() {
  const [activeCategory, setActiveCategory] = useState<string>(ALL)

  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)

const filtered = activeCategory === ALL 
  ? restaurants.slice(0, 9)                
  : restaurants.filter((r: Restaurant) => r.cuisineType === activeCategory).slice(0, 9)          

  return (
    <section className="bg-[#fafafa] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-10">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mb-2"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Browse by</span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>
            <CategorySlider active={activeCategory} onChange={setActiveCategory} />
          </motion.div>
        </div>

        <div>
          <SectionHeader active={activeCategory} count={filtered.length} />
          <RestaurantGrid 
            filtered={filtered} 
            active={activeCategory} 
            onRestaurantSelect={setSelectedRestaurant} 
          />
        </div>
      </div>

      {/* Modern Restaurant Menu Overlay */}
      <AnimatePresence>
        {selectedRestaurant && (
          <RestaurantMenu 
            restaurant={selectedRestaurant} 
            onClose={() => setSelectedRestaurant(null)} 
          />
        )}
      </AnimatePresence>
    </section>
  )
}