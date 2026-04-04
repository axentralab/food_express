'use client'

import React, { useState, useRef, useCallback } from 'react'
import { motion, useMotionValue, useSpring, useTransform, type Variants } from 'framer-motion'
import { Heart, Star, Clock, MapPin, Bike, UtensilsCrossed, TrendingUp, ChevronDown } from 'lucide-react'
import { type Restaurant } from '@/data/mock-data'

// ─── Animation Variants (Original)
export const cardVariant: Variants = {
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

// ─── Tilt Card Hook (Original)
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

export function RestaurantCard({
  restaurant,
  isFavorite,
  onToggleFavorite,
  onViewMenu,
}: {
  restaurant: Restaurant
  isFavorite: boolean
  onToggleFavorite: (id: string) => void
  onViewMenu: () => void
}) {
  const { ref, rx, ry, onMove, onLeave } = useTilt()
  const [imgErr, setImgErr] = useState(false)
  const popularCount = restaurant.menu.filter(m => m.isPopular).length

  return (
    <motion.div variants={cardVariant} layout>
      <motion.div
        ref={ref}
        style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        whileHover={{ y: -4 }}
        transition={{ y: { type: 'spring', stiffness: 260, damping: 22 } }}
       
        onClick={onViewMenu}
        className="group relative bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_40px_rgba(226,27,112,0.13)] transition-shadow duration-350 cursor-pointer"
      >
        {/* Image */}
        <div className="relative h-48 overflow-hidden bg-slate-100">
          {!imgErr ? (
            <img
              src={restaurant.image}
              alt={restaurant.name}
              onError={() => setImgErr(true)}
              className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <UtensilsCrossed className="text-slate-300" size={36} />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

          {restaurant.badge && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-white text-[11px] font-bold tracking-wide shadow-md ${restaurant.badgeColor ?? 'bg-[#E21B70]'}`}
            >
              {restaurant.badge}
            </motion.div>
          )}

          {!restaurant.isOpen && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center">
              <span className="bg-black/70 text-white text-sm font-bold px-4 py-1.5 rounded-full">Closed</span>
            </div>
          )}

          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={e => { e.stopPropagation(); onToggleFavorite(restaurant.id) }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-110 transition-transform"
          >
            <motion.div animate={{ scale: isFavorite ? [1, 1.35, 1] : 1 }} transition={{ duration: 0.3 }}>
              <Heart size={14} className={isFavorite ? 'fill-[#E21B70] text-[#E21B70]' : 'text-slate-400'} />
            </motion.div>
          </motion.button>

          <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-white/95 backdrop-blur-sm rounded-full px-2.5 py-1 shadow-sm">
            <Star size={11} fill="#FFB100" stroke="none" />
            <span className="text-xs font-bold text-gray-900">{restaurant.rating}</span>
          </div>

          {popularCount > 0 && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
              <TrendingUp size={10} className="text-[#E21B70]" />
              <span className="text-[10px] font-bold text-[#E21B70]">{popularCount} Popular</span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div>
              <h3 className="font-black text-gray-900 text-[15px] leading-tight tracking-tight">{restaurant.name}</h3>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">{restaurant.cuisineType}</p>
            </div>
            {restaurant.deliveryFee === 0 && (
              <span className="shrink-0 text-[10px] font-bold text-green-600 bg-green-50 border border-green-200 rounded-full px-2 py-0.5">Free Delivery</span>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1"><Clock size={11} className="text-[#E21B70]" /> {restaurant.deliveryTime} min</span>
            <span className="w-0.5 h-0.5 bg-slate-300 rounded-full" />
            <span className="flex items-center gap-1"><MapPin size={11} className="text-[#E21B70]" /> {restaurant.distance} km</span>
            <span className="w-0.5 h-0.5 bg-slate-300 rounded-full" />
            <span className="flex items-center gap-1"><Bike size={11} className="text-[#E21B70]" /> {restaurant.deliveryFee === 0 ? <span className="text-green-600 font-bold">Free</span> : `$${restaurant.deliveryFee.toFixed(2)}`}</span>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-50 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Min. <span className="font-semibold text-slate-600">${restaurant.minOrder}</span></span>
            <motion.button whileHover={{ x: 2 }} className="text-[11px] font-bold text-[#E21B70] flex items-center gap-0.5">
              View menu <ChevronDown size={10} className="-rotate-90" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}