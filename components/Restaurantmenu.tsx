'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, Star, Clock, MapPin, Bike, Plus, Minus,
  ShoppingBag, UtensilsCrossed, ChevronDown, Flame, BadgeCheck
} from 'lucide-react'
import { MenuItem, Restaurant } from '@/data/mock-data'
import { useCart } from '@/features/cart/cart-context'
import { useUI } from './providers/ui-provider'

//  Types 
interface RestaurantMenuProps {
  restaurant: Restaurant
  onClose: () => void
}

//  Helper Functions 
const groupByCategory = (menu: MenuItem[]) => {
  return menu.reduce<Record<string, MenuItem[]>>((acc, item) => {
    const key = item.category.charAt(0).toUpperCase() + item.category.slice(1)
    acc[key] = acc[key] || []
    acc[key].push(item)
    return acc
  }, {})
}

//  Sub-Components 

const QtyControl = ({ qty, onAdd, onRemove }: { qty: number; onAdd: () => void; onRemove: () => void }) => (
  <div className="flex items-center gap-2 bg-[#E21B70]/10 border border-[#E21B70]/20 rounded-xl px-1 py-1">
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onRemove}
      className="w-7 h-7 flex items-center justify-center rounded-lg bg-white shadow-sm text-[#E21B70] hover:bg-[#E21B70] hover:text-white transition-colors"
    >
      <Minus size={14} />
    </motion.button>
    <span className="w-5 text-center text-sm font-bold text-[#E21B70]">{qty}</span>
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onAdd}
      className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#E21B70] text-white shadow-sm hover:bg-[#c4175f] transition-colors"
    >
      <Plus size={14} />
    </motion.button>
  </div>
)

const MenuItemCard = ({ item, currentQty, onAdd, onRemove }: { 
  item: MenuItem; 
  currentQty: number; 
  onAdd: (item: MenuItem) => void; 
  onRemove: (id: string) => void 
}) => {
  const [imgErr, setImgErr] = useState(false)

  return (
    <motion.div layout className="group flex items-start gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors">
      <div className="relative shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-slate-100">
        {!imgErr ? (
          <img src={item.image} alt={item.name} onError={() => setImgErr(true)} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300"><UtensilsCrossed size={20} /></div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <div className="pr-2">
            <h4 className="font-bold text-gray-900 text-sm truncate">{item.name}</h4>
            <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{item.description}</p>
          </div>
          <div className="text-right">
            <span className="font-bold text-gray-900 text-sm">${item.price.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
             {item.rating && <span className="flex items-center gap-0.5 text-xs text-amber-500 font-medium"><Star size={10} fill="currentColor" />{item.rating}</span>}
             {item.isPopular && <span className="text-[10px] bg-rose-50 text-rose-500 px-1.5 py-0.5 rounded-md font-bold uppercase italic">Popular</span>}
          </div>
          
          <div className="h-9">
            <AnimatePresence mode="wait">
              {currentQty === 0 ? (
                <motion.button
                  key="add-btn"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onClick={() => onAdd(item)}
                  className="px-4 py-1.5 rounded-xl bg-[#E21B70] text-white text-xs font-bold shadow-md"
                >
                  Add
                </motion.button>
              ) : (
                <motion.div key="qty-ctrl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <QtyControl qty={currentQty} onAdd={() => onAdd(item)} onRemove={() => onRemove(item.id)} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const HeroHeader = ({ restaurant, onClose }: { restaurant: Restaurant; onClose: () => void }) => (
  <div className="relative h-60 shrink-0">
    <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
    
    <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-black/20 backdrop-blur-md text-white border border-white/10">
      <X size={20} />
    </button>

    <div className="absolute bottom-4 left-4 right-4 text-white">
      <h2 className="text-2xl font-black">{restaurant.name}</h2>
      <div className="flex items-center gap-3 text-xs mt-2 font-medium opacity-90">
        <span className="flex items-center gap-1"><Clock size={12}/> {restaurant.deliveryTime}m</span>
        <span className="flex items-center gap-1"><MapPin size={12}/> {restaurant.distance}km</span>
        <span className="flex items-center gap-1 text-green-400"><Bike size={12}/> {restaurant.deliveryFee === 0 ? 'Free' : `$${restaurant.deliveryFee}`}</span>
      </div>
    </div>
  </div>
)

//Main Component 
export function RestaurantMenu({ restaurant, onClose }: RestaurantMenuProps) {
  const { addItem, updateQuantity, items: globalItems } = useCart()
  const grouped = useMemo(() => groupByCategory(restaurant.menu), [restaurant.menu])
const { openCart } = useUI()


  const handleAdd = (item: MenuItem) => addItem(item, restaurant.id, restaurant.name)
  const handleRemove = (id: string) => {
    const existing = globalItems.find(i => i.id === id)
    if (existing) updateQuantity(id, existing.quantity - 1)
  }

  const totalQty = globalItems.reduce((acc, curr) => acc + curr.quantity, 0)
  const totalPrice = globalItems.reduce((acc, curr) => acc + (curr.quantity * curr.price), 0)

  const handleViewCart = () => {
    onClose();  // মেনু মডাল বন্ধ then openCart call
    openCart();  
  }


  return (
    <>
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px]" 
      />

      {/* Side Panel Modal */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed z-50 inset-x-0 bottom-0 sm:inset-y-0 sm:right-0 sm:left-auto sm:w-[500px] bg-white flex flex-col sm:rounded-l-3xl rounded-t-3xl overflow-hidden h-[90vh] sm:h-full shadow-2xl"
      >
        <HeroHeader restaurant={restaurant} onClose={onClose} />

        <div className="flex-1 overflow-y-auto p-4 pb-28">
          {restaurant.minOrder > 0 && (
            <div className="mb-6 flex items-center gap-2 bg-blue-50 text-blue-700 p-3 rounded-xl text-xs font-bold border border-blue-100">
              <BadgeCheck size={16} /> Minimum order is ${restaurant.minOrder}
            </div>
          )}

          {Object.entries(grouped).map(([category, items]) => (
            <section key={category} className="mb-8">
              <h3 className="text-lg font-black text-gray-900 mb-4 px-2">{category}</h3>
              <div className="space-y-2 border border-slate-50 rounded-2xl p-1">
                {items.map(item => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    currentQty={globalItems.find(i => i.id === item.id)?.quantity || 0}
                    onAdd={handleAdd}
                    onRemove={handleRemove}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Floating Cart Summary */}
        <AnimatePresence>
          {totalQty > 0 && (
            <motion.div 
              initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
              className="absolute bottom-6 left-4 right-4"
            >
              <button
                onClick={handleViewCart}
              className="w-full bg-[#E21B70] text-white flex items-center justify-between p-4 rounded-2xl shadow-xl shadow-rose-200 active:scale-[0.98] transition-transform">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg relative">
                    <ShoppingBag size={20} />
                    <span className="absolute -top-1 -right-1 bg-white text-[#E21B70] text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#E21B70]">
                      {totalQty}
                    </span>
                  </div>
                  <span className="font-bold">View Cart</span>
                </div>
                <span className="text-lg font-black">${totalPrice.toFixed(2)}</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  )
}