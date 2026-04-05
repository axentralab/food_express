'use client'

import { useMemo, useCallback, useEffect } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import {
  X,
  ShoppingBag,
  Truck,
  Tag,
  ChevronRight,
  Sparkles,
  Receipt,
} from 'lucide-react'
import { useCart } from './cart-context'
import { CartItemComponent } from './cart-item'
import { PremiumButton } from '@/components/ui/premium-button'
import Link from 'next/link'
// Types
interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

interface PricingRow {
  label: string
  value: string
  highlight?: boolean
  note?: string
}

// Constants
const DELIVERY_FEE = 2.99
const TAX_RATE = 0.08
const FREE_DELIVERY_THRESHOLD = 35

// Animation variants
const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0, transition: { duration: 0.24, delay: 0.05 } },
}

const drawerVariants: Variants = {
  hidden: { x: '100%', opacity: 0.6 },
  visible: {
    x: 0, opacity: 1,
    transition: { type: 'spring', stiffness: 320, damping: 34 },
  },
  exit: {
    x: '100%', opacity: 0,
    transition: { duration: 0.28, ease: [0.4, 0, 1, 1] },
  },
}

const listVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.055, delayChildren: 0.1 } },
}

const itemFadeIn: Variants = {
  hidden: { opacity: 0, x: 18 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] } },
}

const footerVariants: Variants = {
  hidden: { y: 40, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.44, ease: [0.22, 1, 0.36, 1], delay: 0.1 } },
}

// Free delivery progress bar
function DeliveryProgress({ subtotal }: { subtotal: number }) {
  const remaining = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal)
  const pct = Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100)
  const isFree = remaining === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.18, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="px-5 py-3.5 rounded-2xl"
      style={{ background: 'rgba(226,27,112,0.05)', border: '1px solid rgba(226,27,112,0.12)' }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <Truck size={12} style={{ color: '#E21B70' }} />
          <span className="text-[11px] font-bold text-zinc-600">
            {isFree
              ? '🎉 Free delivery unlocked!'
              : `Add $${remaining.toFixed(2)} more for free delivery`}
          </span>
        </div>
        <span className="text-[10px] font-black" style={{ color: '#E21B70' }}>
          ${FREE_DELIVERY_THRESHOLD}
        </span>
      </div>
      {/* Track */}
      <div className="h-1.5 w-full rounded-full bg-zinc-100 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, #E21B70, #ff5fa0)' }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </motion.div>
  )
}

// Pricing breakdown row
function PriceRow({ label, value, highlight = false, note }: PricingRow) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        <span className={`text-[13px] font-semibold ${highlight ? 'text-zinc-900 font-black' : 'text-zinc-500'}`}>
          {label}
        </span>
        {note && (
          <span className="text-[9px] font-bold text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded-full">
            {note}
          </span>
        )}
      </div>
      <span
        className={`text-[13px] font-bold tabular-nums ${highlight ? 'text-[22px] font-black' : 'text-zinc-700'}`}
        style={highlight ? { color: '#E21B70' } : undefined}
      >
        {value}
      </span>
    </div>
  )
}

// Empty cart
function EmptyCart() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center justify-center h-full text-center px-8 gap-4"
    >
      {/* Animated bag */}
      <div className="relative">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="w-24 h-24 rounded-3xl flex items-center justify-center"
          style={{ background: 'rgba(226,27,112,0.07)', border: '1px solid rgba(226,27,112,0.14)' }}
        >
          <ShoppingBag size={40} style={{ color: 'rgba(226,27,112,0.4)' }} />
        </motion.div>
        {/* Rotating dashed ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
          className="absolute -inset-3 rounded-[38px] border border-dashed pointer-events-none"
          style={{ borderColor: 'rgba(226,27,112,0.16)' }}
        />
      </div>

      <div>
        <p className="text-[18px] font-black text-zinc-900 tracking-tight mb-1">
          Your cart is empty
        </p>
        <p className="text-[13px] text-zinc-400 font-medium leading-relaxed max-w-[200px]">
          Add something delicious to get started!
        </p>
      </div>

      {/* Suggestion chips */}
      <div className="flex flex-wrap justify-center gap-2 mt-1">
        {['🍔 Burgers', '🍕 Pizza', '🍣 Sushi'].map(label => (
          <span
            key={label}
            className="text-[11px] font-bold px-3 py-1.5 rounded-full bg-zinc-50 text-zinc-500"
            style={{ border: '1px solid #EBEBEB' }}
          >
            {label}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

// Cart header
function DrawerHeader({
  totalItems,
  onClose,
}: {
  totalItems: number
  onClose: () => void
}) {
  return (
    <div
      className="flex items-center justify-between px-6 py-5 shrink-0"
      style={{ borderBottom: '1px solid #F1F5F9' }}
    >
      <div className="flex items-center gap-3">
        {/* Icon */}
        <div
          className="w-9 h-9 rounded-2xl flex items-center justify-center"
          style={{ background: 'rgba(226,27,112,0.08)', border: '1px solid rgba(226,27,112,0.16)' }}
        >
          <ShoppingBag size={16} style={{ color: '#E21B70' }} />
        </div>

        <div>
          <h2 className="text-[16px] font-black text-zinc-900 leading-tight tracking-tight">
            Your Order
          </h2>
          <AnimatePresence mode="wait">
            <motion.p
              key={totalItems}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="text-[11px] font-semibold text-zinc-400"
            >
              {totalItems === 0
                ? 'No items yet'
                : `${totalItems} item${totalItems > 1 ? 's' : ''} added`}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.08, rotate: 5 }}
        whileTap={{ scale: 0.92 }}
        onClick={onClose}
        aria-label="Close cart"
        className="w-9 h-9 flex items-center justify-center rounded-2xl bg-zinc-100 hover:bg-zinc-200 text-zinc-500 transition-colors"
      >
        <X size={15} />
      </motion.button>
    </div>
  )
}

// Order summary footer
function OrderSummary({
  totalPrice,
  totalItems,
  onCheckout,
  onContinue,
}: {
  totalPrice: number
  totalItems: number
  onCheckout: () => void
  onContinue: () => void
}) {
  const deliveryFee = totalPrice >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE
  const tax = totalPrice * TAX_RATE
  const grandTotal = totalPrice + deliveryFee + tax

  const rows: PricingRow[] = [
    {
      label: 'Subtotal',
      value: `$${totalPrice.toFixed(2)}`,
      note: `${totalItems} item${totalItems > 1 ? 's' : ''}`,
    },
    {
      label: 'Delivery',
      value: deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`,
      note: deliveryFee === 0 ? '🎉' : undefined,
    },
    {
      label: 'Tax (8%)',
      value: `$${tax.toFixed(2)}`,
    },
  ]

  return (
    <motion.div
      variants={footerVariants}
      initial="hidden"
      animate="visible"
      className="shrink-0 flex flex-col gap-4 px-6 pt-5 pb-6"
      style={{ borderTop: '1px solid #F1F5F9', background: '#fff' }}
    >
      {/* Free delivery progress */}
      <DeliveryProgress subtotal={totalPrice} />

      {/* Promo code row */}
      <button
        className="flex items-center justify-between px-4 py-3 rounded-2xl transition-colors group"
        style={{ background: '#FAFAF8', border: '1px solid #EBEBEB' }}
      >
        <div className="flex items-center gap-2.5">
          <Tag size={13} className="text-zinc-400 group-hover:text-[#E21B70] transition-colors" />
          <span className="text-[12px] font-semibold text-zinc-500 group-hover:text-zinc-700 transition-colors">
            Apply promo code
          </span>
        </div>
        <ChevronRight size={13} className="text-zinc-300 group-hover:text-zinc-400 transition-colors" />
      </button>

      {/* Pricing breakdown */}
      <div className="flex flex-col gap-2.5">
        {rows.map(row => (
          <PriceRow key={row.label} {...row} />
        ))}
      </div>

      {/* Divider */}
      <div className="h-px bg-zinc-100" />

      {/* Grand total */}
      <PriceRow
        label="Total"
        value={`$${grandTotal.toFixed(2)}`}
        highlight
      />

      {/* Checkout CTA */}
      <Link href="/checkout" className="w-full">
        <motion.button
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.975 }}
          onClick={onCheckout}
          className="w-full flex items-center justify-between px-6 py-4 rounded-2xl text-white text-[14px] font-black tracking-wide mt-1"
          style={{
            background: 'linear-gradient(135deg, #E21B70 0%, #ff5fa0 100%)',
            boxShadow: '0 8px 24px rgba(226,27,112,0.38)',
          }}
        >
          <div className="flex items-center gap-2">
            <Receipt size={15} className="opacity-80" />
            Proceed to Checkout
          </div>
          <div className="flex items-center gap-1 text-[13px] font-bold opacity-85">
            ${grandTotal.toFixed(2)}
            <ChevronRight size={14} />
          </div>
        </motion.button>
      </Link>
      {/* Secondary action */}
      <button
        onClick={onContinue}
        className="w-full py-3 text-[13px] font-bold text-zinc-500 hover:text-zinc-800 transition-colors"
      >
        Continue Shopping
      </button>
    </motion.div>
  )
}

// Main component
export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart()

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Stable handlers
  const handleQuantityChange = useCallback(
    (id: string, quantity: number) => updateQuantity(id, quantity),
    [updateQuantity]
  )
  const handleRemove = useCallback(
    (id: string) => removeItem(id),
    [removeItem]
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.42)', backdropFilter: 'blur(4px)' }}
          />

          {/* Drawer panel */}
          <motion.div
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed right-0 top-0 h-screen w-full max-w-xl z-50 flex flex-col bg-white"
            style={{ boxShadow: '-8px 0 48px rgba(0,0,0,0.14)' }}
            role="dialog"
            aria-label="Shopping cart"
            aria-modal="true"
          >
            {/* Header */}
            <DrawerHeader totalItems={totalItems} onClose={onClose} />

            {/* Item list */}
            <div className="flex-1 overflow-y-auto [scrollbar-width:none]">
              {items.length === 0 ? (
                <EmptyCart />
              ) : (
                <motion.div
                  variants={listVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-col gap-3 p-5"
                >
                  <AnimatePresence mode="popLayout">
                    {items.map(item => (
                      <motion.div
                        key={item.id}
                        variants={itemFadeIn}
                        layout
                        exit={{
                          opacity: 0, x: 40, scale: 0.95,
                          transition: { duration: 0.22, ease: [0.4, 0, 1, 1] },
                        }}
                      >
                        <CartItemComponent
                          item={item}
                          onQuantityChange={qty => handleQuantityChange(item.id, qty)}
                          onRemove={() => handleRemove(item.id)}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Subtle item count note */}
                  {items.length > 0 && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-center text-md text-slate-500 font-medium pt-2"
                    >
                      {items.length} item{items.length > 1 ? 's' : ''} in your order .
                    </motion.p>
                  )}
                </motion.div>
              )}
            </div>

            {/* Order summary footer */}
            {items.length > 0 && (
              <OrderSummary
                totalPrice={totalPrice}
                totalItems={totalItems}
                onCheckout={onClose}
                onContinue={onClose}
              />
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}