'use client'

import React, { useState, useRef, useMemo } from 'react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { categories, restaurants, type Restaurant, type Category } from '@/data/mock-data'
import Link from 'next/link'

import { RestaurantCard } from '@/components/RestaurantCard' 
import { RestaurantMenu } from '@/components/Restaurantmenu'

// Constants
const ALL = 'All'

const GRID_VARIANTS: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { staggerChildren: 0.08 } 
  },
  exit: { opacity: 0, transition: { duration: 0.2 } }
}

// Empty State
function EmptyState({ category }: { category: string }) {
  const icon = categories.find((c: Category) => c.name === category)?.icon ?? '🍽️'
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="col-span-full flex flex-col items-center justify-center py-24 text-center"
    >
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-3xl bg-[#E21B70]/5 border border-[#E21B70]/10 flex items-center justify-center text-5xl">
          {icon}
        </div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="absolute -inset-3 rounded-full border border-dashed border-[#E21B70]/20"
        />
      </div>
      <h3 className="text-xl font-bold text-slate-800">No restaurants found</h3>
      <p className="text-sm text-slate-400 mt-2 max-w-xs">
        Currently, there are no <span className="font-bold text-[#E21B70]">{category}</span> spots available.
      </p>
    </motion.div>
  )
}

//  Category Slider
function CategorySlider({ active, onChange }: { active: string; onChange: (name: string) => void }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  
  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -240 : 240, behavior: 'smooth' })
  }

  const allCategories = useMemo(() => [
    { id: 'all', name: ALL, icon: '🍽️' },
    ...categories,
  ], [])

  return (
    <div className="relative group">
      {['left', 'right'].map(dir => (
        <button
          key={dir}
          onClick={() => scroll(dir as 'left' | 'right')}
          className={`absolute top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center hover:bg-slate-50 transition-opacity hidden md:flex ${dir === 'left' ? '-left-4' : '-right-4'}`}
        >
          {dir === 'left' ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      ))}

      <div
        ref={scrollRef}
        className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide scroll-smooth px-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {allCategories.map((cat) => {
          const isActive = active === cat.name
          return (
            <motion.button
              key={cat.id}
              onClick={() => onChange(cat.name)}
              whileTap={{ scale: 0.96 }}
              className={`relative shrink-0 flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                isActive ? 'text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-[#E21B70]/30'
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="active-pill"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-[#E21B70] to-[#f09c00]"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">{cat.icon}</span>
              <span className="relative z-10">{cat.name}</span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

// Main Component
export function FeaturedRestaurants() {
  const [activeCategory, setActiveCategory] = useState<string>(ALL)
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
 
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }
  
  // Filtering Logic
  const filtered = useMemo(() => {
    const list = activeCategory === ALL 
      ? restaurants 
      : restaurants.filter((r) => r.cuisineType === activeCategory)
    return list.slice(0, 9)
  }, [activeCategory])

  return (
    <section className="bg-[#fafafa] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Section: Category Filter */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Filter By Cuisine</span>
            <div className="flex-1 h-px bg-slate-200/60" />
          </div>
          <CategorySlider active={activeCategory} onChange={setActiveCategory} />
        </div>

        {/* Middle Section: Header */}
        <div className="flex items-end justify-between">
          <div>
            <motion.h2 
              key={activeCategory}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl font-black text-slate-900"
            >
              {activeCategory === ALL ? 'All Restaurants' : `${activeCategory} Specials`}
            </motion.h2>
            <p className="text-slate-400 text-sm font-medium mt-1">
              Found {filtered.length} {filtered.length === 1 ? 'place' : 'places'} nearby
            </p>
          </div>
          <Link href="/restaurants">
            <button className="text-sm font-bold text-[#E21B70] hover:underline flex items-center gap-1">
              View All <ChevronRight size={14} />
            </button>
          </Link>
        </div>

        {/* Bottom Section: Restaurant Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            variants={GRID_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filtered.length > 0 ? (
              filtered.map((r) => (
                <RestaurantCard 
                  key={r.id} 
                  restaurant={r} 
                  isFavorite={favorites.has(r.id)}
                  onToggleFavorite={() => toggleFavorite(r.id)}
                  onViewMenu={() => setSelectedRestaurant(r)} 
                />
              ))
            ) : (
              <EmptyState category={activeCategory} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Restaurant Menu Modal */}
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