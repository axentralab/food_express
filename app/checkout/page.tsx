'use client'

import React, { useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {ArrowLeft,User,Phone,MapPin,Banknote,CreditCard,ChevronRight,ShoppingBag,Star,Clock,Loader2,Check,Package,Sparkles,Tag,Bike,Receipt,AlertCircle,Home,
} from 'lucide-react'
import { useCart } from '@/features/cart/cart-context'



const DELIVERY_FEE = 2.99
const TAX_RATE     = 0.08
const FREE_DELIVERY_THRESHOLD = 35


// Payment methods types
type PaymentMethod = 'cod' | 'bkash' | 'nagad' | 'card'

interface ShippingForm {
  fullName: string
  phone: string
  address: string
  city: string
  note: string
}

interface FormErrors {
  fullName?: string
  phone?: string
  address?: string
  city?: string
}

interface PaymentOption {
  id: PaymentMethod
  label: string
  description: string
  icon: React.ReactNode
  badge?: string
  gradient?: string
}

// Payment Options Data 

const PAYMENT_OPTIONS: PaymentOption[] = [
  {
    id: 'cod',
    label: 'Cash on Delivery',
    description: 'Pay when your order arrives',
    badge: 'Most Popular',
    icon: <Banknote size={20} className="text-emerald-600" />,
    gradient: 'from-emerald-50 to-green-50',
  },
  {
    id: 'bkash',
    label: 'bKash',
    description: 'Pay via bKash mobile banking',
    icon: (
      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-black bg-[#E2136E]">
        b
      </div>
    ),
    gradient: 'from-pink-50 to-rose-50',
  },
  {
    id: 'nagad',
    label: 'Nagad',
    description: 'Pay via Nagad mobile banking',
    icon: (
      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-black bg-[#F05829]">
        N
      </div>
    ),
    gradient: 'from-orange-50 to-amber-50',
  },
  {
    id: 'card',
    label: 'Credit / Debit Card',
    description: 'Visa, Mastercard, Amex accepted',
    icon: <CreditCard size={20} className="text-blue-600" />,
    gradient: 'from-blue-50 to-indigo-50',
  },
]

// Validation 

function validate(form: ShippingForm): FormErrors {
  const errors: FormErrors = {}
  if (!form.fullName.trim() || form.fullName.trim().length < 2)
    errors.fullName = 'Full name is required (min 2 chars)'
  if (!form.phone.trim() || !/^\+?[0-9\s\-().]{7,}$/.test(form.phone))
    errors.phone = 'Enter a valid phone number'
  if (!form.address.trim() || form.address.trim().length < 8)
    errors.address = 'Please enter your full delivery address'
  if (!form.city.trim())
    errors.city = 'City is required'
  return errors
}

// Input Field 

function Field({
  label,
  icon,
  error,
  required,
  children,
}: {
  label: string
  icon: React.ReactNode
  error?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[13px] font-semibold text-slate-600">
        {label}
        {required && <span className="text-[#E21B70] ml-0.5">*</span>}
      </label>
      <div className="relative group">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#E21B70] transition-colors pointer-events-none">
          {icon}
        </div>
        {children}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-1.5 text-[12px] text-red-500 font-medium"
          >
            <AlertCircle size={11} /> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

const inputCls = (hasError?: boolean) =>
  `w-full pl-10 pr-4 py-3.5 rounded-2xl text-[14px] font-medium text-slate-800 placeholder-slate-300
   bg-white border transition-all duration-200 outline-none
   focus:ring-2 focus:ring-[#E21B70]/20 focus:border-[#E21B70]/50 focus:bg-white/90
   ${hasError ? 'border-red-300 ring-2 ring-red-100' : 'border-slate-200 hover:border-slate-300'}`

// Payment Card 

function PaymentCard({
  option,
  selected,
  onSelect,
}: {
  option: PaymentOption
  selected: boolean
  onSelect: () => void
}) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      whileTap={{ scale: 0.98 }}
      className={`relative w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 bg-gradient-to-br ${option.gradient ?? 'from-white to-white'}
        ${selected
          ? 'border-[#E21B70] shadow-[0_4px_20px_rgba(226,27,112,0.18)]'
          : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'}`}
    >
      <div className="flex items-center gap-3">
        {/* Radio indicator */}
        <div className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200
          ${selected ? 'border-[#E21B70] bg-[#E21B70]' : 'border-slate-300 bg-white'}`}>
          <AnimatePresence>
            {selected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="w-2 h-2 rounded-full bg-white"
              />
            )}
          </AnimatePresence>
        </div>

        {/* Icon */}
        <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-white shadow-sm border transition-all duration-200
          ${selected ? 'border-[#E21B70]/20 shadow-[0_2px_8px_rgba(226,27,112,0.12)]' : 'border-slate-100'}`}>
          {option.icon}
        </div>

        {/* Labels */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[14px] font-bold transition-colors ${selected ? 'text-gray-900' : 'text-slate-700'}`}>
              {option.label}
            </span>
            {option.badge && (
              <span className="text-[10px] font-bold text-[#E21B70] bg-[#E21B70]/10 border border-[#E21B70]/20 rounded-full px-2 py-0.5">
                {option.badge}
              </span>
            )}
          </div>
          <p className="text-[12px] text-slate-400 font-medium mt-0.5">{option.description}</p>
        </div>

        {/* Selected arrow */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight size={16} className="text-[#E21B70] shrink-0" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Card fields when card is selected */}
      <AnimatePresence>
        {selected && option.id === 'card' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-slate-200/60 space-y-3">
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                className="w-full px-4 py-3 rounded-xl text-sm font-medium border border-slate-200 focus:border-[#E21B70]/50 focus:ring-2 focus:ring-[#E21B70]/15 outline-none bg-white placeholder-slate-300 transition-all"
                onClick={e => e.stopPropagation()}
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="MM / YY"
                  maxLength={7}
                  className="px-4 py-3 rounded-xl text-sm font-medium border border-slate-200 focus:border-[#E21B70]/50 focus:ring-2 focus:ring-[#E21B70]/15 outline-none bg-white placeholder-slate-300 transition-all"
                  onClick={e => e.stopPropagation()}
                />
                <input
                  type="text"
                  placeholder="CVC"
                  maxLength={4}
                  className="px-4 py-3 rounded-xl text-sm font-medium border border-slate-200 focus:border-[#E21B70]/50 focus:ring-2 focus:ring-[#E21B70]/15 outline-none bg-white placeholder-slate-300 transition-all"
                  onClick={e => e.stopPropagation()}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

// Order Item Row 

function OrderItem({ item }: { item: { id: string; name: string; price: number; quantity: number; image?: string } }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-slate-50 last:border-0">
      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-lg shrink-0 overflow-hidden">
        {item.image ? (
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        ) : '🍽️'}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-gray-900 truncate">{item.name}</p>
        <p className="text-[11px] text-slate-400 font-medium">×{item.quantity}</p>
      </div>
      <p className="text-[14px] font-bold text-gray-900 shrink-0">
        ${(item.price * item.quantity).toFixed(2)}
      </p>
    </div>
  )
}

// Success Overlay

function SuccessOverlay({ orderId, onGoHome }: { orderId: string; onGoHome: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)' }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 26, delay: 0.1 }}
        className="bg-white rounded-3xl p-8 sm:p-10 max-w-sm w-full text-center shadow-[0_32px_80px_rgba(0,0,0,0.22)]"
      >
        {/* Animated checkmark */}
        <div className="relative mx-auto mb-6 w-20 h-20">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-[0_8px_32px_rgba(34,197,94,0.45)]"
          >
            <motion.div
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
            >
              <Check size={36} className="text-white" strokeWidth={3} />
            </motion.div>
          </motion.div>
          {/* Ripple */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0.7 }}
            animate={{ scale: 1.6, opacity: 0 }}
            transition={{ duration: 1, delay: 0.4, repeat: 2 }}
            className="absolute inset-0 rounded-full bg-green-400"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-2">
            Order Placed! 🎉
          </h2>
          <p className="text-slate-500 text-sm font-medium mb-3">
            Your food is being prepared with love.
          </p>

          {/* Order ID pill */}
          <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 mb-6">
            <Package size={14} className="text-[#E21B70]" />
            <span className="text-sm font-black text-gray-900 tracking-tight">{orderId}</span>
          </div>

          {/* ETA */}
          <div className="flex items-center justify-center gap-4 mb-7">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Clock size={12} className="text-[#E21B70]" /> Estimated 22-30 min
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Star size={12} fill="#FFB100" stroke="none" /> Tracking active
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onGoHome}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-[#E21B70] to-[#ff4d9e] text-white font-black text-sm shadow-[0_8px_24px_rgba(226,27,112,0.4)]"
          >
            <Home size={15} />
            Back to Home
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

// Empty State 

function EmptyCartState() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#FAF9F6' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="text-center"
      >
        <div className="relative mx-auto mb-6 w-24 h-24">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#E21B70]/10 to-[#FFB100]/10 border border-[#E21B70]/15 flex items-center justify-center"
          >
            <ShoppingBag size={40} className="text-[#E21B70]/50" />
          </motion.div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-3 rounded-[38px] border border-dashed border-[#E21B70]/20"
          />
        </div>

        <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-2">
          Your cart is lonely 🥺
        </h2>
        <p className="text-slate-400 text-sm font-medium mb-7 max-w-[240px] mx-auto leading-relaxed">
          Add some delicious items before checking out!
        </p>
        <Link href="/restaurants">
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-gradient-to-r from-[#E21B70] to-[#ff4d9e] text-white font-black text-sm shadow-[0_8px_24px_rgba(226,27,112,0.38)]"
          >
            <Sparkles size={15} />
            Browse Restaurants
          </motion.div>
        </Link>
      </motion.div>
    </div>
  )
}
  
//main component

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalPrice, totalItems, clearCart } = useCart()
  const [payment, setPayment]  = useState<PaymentMethod>('cod')
  const [loading, setLoading]  = useState(false)
  const [success, setSuccess]  = useState(false)
  const [orderId]              = useState(`#ORD-${Math.floor(1000 + Math.random() * 9000)}`)
  const [errors, setErrors]    = useState<FormErrors>({})
  const [promoOpen, setPromo]  = useState(false)

  const [form, setForm] = useState<ShippingForm>({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    note: '',
  })

  const update = useCallback((field: keyof ShippingForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }, [errors])

  const deliveryFee  = totalPrice >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE
  const tax          = totalPrice * TAX_RATE
  const grandTotal   = totalPrice + deliveryFee + tax

  const handlePlaceOrder = useCallback(async () => {
    const errs = validate(form)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      // Scroll to first error
      document.querySelector('[data-error]')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setLoading(true)
    await new Promise(r => setTimeout(r, 2000))
    setLoading(false)
    setSuccess(true)
  }, [form])

  const handleGoHome = useCallback(() => {
    clearCart?.()
    router.push('/')
  }, [clearCart, router])

  if (items.length === 0 && !success) return <EmptyCartState />

  return (
    <div className="min-h-screen" style={{ background: '#FAF9F6' }}>

      {/*  Top bar  */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/">
            <motion.div
              whileHover={{ x: -2 }}
              className="flex items-center gap-1 text-md font-semibold text-slate-500 hover:text-[#E21B70] transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back</span>
            </motion.div>
          </Link>

          <div className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-500">
            <Receipt size={14} className="text-[#E21B70]" />
            Checkout
          </div>
        </div>
      </header>

      {/* Steps indicator */}
      <div className="border-b border-slate-100 bg-white/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-[12px] font-semibold text-slate-400">
          <span className="flex items-center gap-1 text-[#E21B70]">
            <span className="w-5 h-5 rounded-full bg-[#E21B70] text-white flex items-center justify-center text-[10px] font-black">1</span>
            Delivery
          </span>
          <ChevronRight size={12} />
          <span className="flex items-center gap-1 text-[#E21B70]">
            <span className="w-5 h-5 rounded-full bg-[#E21B70] text-white flex items-center justify-center text-[10px] font-black">2</span>
            Payment
          </span>
          <ChevronRight size={12} />
          <span className="flex items-center gap-1 text-slate-300">
            <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center text-[10px] font-black">3</span>
            Confirm
          </span>
        </div>
      </div>

      {/*  Main layout  */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 items-start">

          {/*  LEFT: Forms  */}
          <div className="space-y-6">

            {/* Delivery info card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_2px_16px_rgba(0,0,0,0.05)]"
            >
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-8 h-8 rounded-xl bg-[#E21B70]/10 border border-[#E21B70]/20 flex items-center justify-center">
                  <MapPin size={14} className="text-[#E21B70]" />
                </div>
                <h2 className="text-[16px] font-black text-gray-900 tracking-tight">Delivery Details</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full name */}
                <div data-error={errors.fullName ? 'true' : undefined}>
                  <Field label="Full Name" icon={<User size={15} />} error={errors.fullName} required>
                    <input
                      type="text"
                      placeholder="Jane Smith"
                      value={form.fullName}
                      onChange={e => update('fullName', e.target.value)}
                      className={inputCls(!!errors.fullName)}
                    />
                  </Field>
                </div>

                {/* Phone */}
                <div data-error={errors.phone ? 'true' : undefined}>
                  <Field label="Phone Number" icon={<Phone size={15} />} error={errors.phone} required>
                    <input
                      type="tel"
                      placeholder="+880 17XX XXX XXX"
                      value={form.phone}
                      onChange={e => update('phone', e.target.value)}
                      className={inputCls(!!errors.phone)}
                    />
                  </Field>
                </div>

                {/* Address */}
                <div className="sm:col-span-2" data-error={errors.address ? 'true' : undefined}>
                  <Field label="Delivery Address" icon={<MapPin size={15} />} error={errors.address} required>
                    <input
                      type="text"
                      placeholder="House 12, Road 4, Banani, Dhaka"
                      value={form.address}
                      onChange={e => update('address', e.target.value)}
                      className={inputCls(!!errors.address)}
                    />
                  </Field>
                </div>

                {/* City */}
                <div data-error={errors.city ? 'true' : undefined}>
                  <Field label="City" icon={<MapPin size={15} />} error={errors.city} required>
                    <input
                      type="text"
                      placeholder="Dhaka"
                      value={form.city}
                      onChange={e => update('city', e.target.value)}
                      className={inputCls(!!errors.city)}
                    />
                  </Field>
                </div>

                {/* Note */}
                <Field label="Order Note" icon={<Tag size={15} />}>
                  <input
                    type="text"
                    placeholder="Gate code, floor, or special instructions…"
                    value={form.note}
                    onChange={e => update('note', e.target.value)}
                    className={inputCls()}
                  />
                </Field>
              </div>
            </motion.div>

            {/* Payment method card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_2px_16px_rgba(0,0,0,0.05)]"
            >
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-8 h-8 rounded-xl bg-[#E21B70]/10 border border-[#E21B70]/20 flex items-center justify-center">
                  <CreditCard size={14} className="text-[#E21B70]" />
                </div>
                <h2 className="text-[16px] font-black text-gray-900 tracking-tight">Payment Method</h2>
              </div>

              <div className="space-y-3">
                {PAYMENT_OPTIONS.map(opt => (
                  <PaymentCard
                    key={opt.id}
                    option={opt}
                    selected={payment === opt.id}
                    onSelect={() => setPayment(opt.id)}
                  />
                ))}
              </div>

              {/* Security badge */}
              <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                  <Check size={9} className="text-white" strokeWidth={3} />
                </div>
                Your payment info is secured with 256-bit SSL encryption
              </div>
            </motion.div>
          </div>

          {/* right card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:sticky lg:top-22"
          >
            <div className="bg-white border border-slate-100 rounded-3xl shadow-[0_2px_16px_rgba(0,0,0,0.05)] overflow-hidden">

              {/* Summary header */}
              <div className="px-6 pt-6 pb-4 border-b border-slate-50">
                <div className="flex items-center gap-2.5 mb-1">
                  <div className="w-8 h-8 rounded-xl bg-[#E21B70]/10 border border-[#E21B70]/20 flex items-center justify-center">
                    <ShoppingBag size={14} className="text-[#E21B70]" />
                  </div>
                  <h2 className="text-[16px] font-black text-gray-900 tracking-tight">Order Summary</h2>
                </div>
                <p className="text-[12px] text-slate-400 font-medium ml-10.5">{totalItems} item{totalItems !== 1 ? 's' : ''}</p>
              </div>

              {/* Items */}
              <div className="px-6 py-2 max-h-52 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
                {items.map(item => (
                  <OrderItem key={item.id} item={item} />
                ))}
              </div>

              {/* Promo */}
              <div className="px-6 py-3 border-t border-slate-50">
                <button
                  onClick={() => setPromo(p => !p)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-[13px] font-semibold text-slate-500 hover:border-[#E21B70]/30 hover:text-[#E21B70] transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <Tag size={13} className="group-hover:text-[#E21B70] transition-colors" />
                    Apply promo code
                  </div>
                  <motion.div animate={{ rotate: promoOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronRight size={13} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {promoOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="flex gap-2 mt-2">
                        <input
                          type="text"
                          placeholder="Enter code"
                          className="flex-1 px-4 py-2.5 rounded-xl text-sm border border-slate-200 focus:border-[#E21B70]/50 focus:ring-2 focus:ring-[#E21B70]/15 outline-none transition-all"
                        />
                        <button className="px-4 py-2.5 rounded-xl bg-[#E21B70] text-white text-sm font-bold hover:bg-[#c4175f] transition-colors">
                          Apply
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Pricing */}
              <div className="px-6 py-4 border-t border-slate-50 space-y-3">
                {[
                  { label: 'Subtotal', value: `$${totalPrice.toFixed(2)}` },
                  {
                    label: 'Delivery',
                    value: deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`,
                    green: deliveryFee === 0,
                  },
                  { label: 'Tax (8%)', value: `$${tax.toFixed(2)}` },
                ].map(row => (
                  <div key={row.label} className="flex items-center justify-between text-[13px] font-medium">
                    <span className="text-slate-500">{row.label}</span>
                    <span className={row.green ? 'font-bold text-green-600' : 'font-semibold text-gray-800'}>
                      {row.value}
                    </span>
                  </div>
                ))}

                <div className="h-px bg-slate-100" />

                <div className="flex items-center justify-between">
                  <span className="text-[15px] font-black text-gray-900">Total</span>
                  <span className="text-[22px] font-black" style={{ color: '#E21B70' }}>
                    ${grandTotal.toFixed(2)}
                  </span>
                </div>

                {/* Free delivery nudge */}
                {totalPrice < FREE_DELIVERY_THRESHOLD && (
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium pt-1">
                    <Bike size={11} className="text-[#E21B70]" />
                    Add ${(FREE_DELIVERY_THRESHOLD - totalPrice).toFixed(2)} more for free delivery
                  </div>
                )}
              </div>

              {/* ETA strip */}
              <div className="mx-6 mb-4 flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-2.5">
                <Clock size={13} className="text-[#E21B70] shrink-0" />
                <div>
                  <p className="text-[11px] font-bold text-gray-700">Estimated Arrival</p>
                  <p className="text-[10px] text-slate-400 font-medium">22–35 minutes after order</p>
                </div>
              </div>

              {/* CTA */}
              <div className="px-6 pb-6">
                <motion.button
                  whileHover={!loading ? { scale: 1.02 } : {}}
                  whileTap={!loading ? { scale: 0.98 } : {}}
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="relative w-full flex items-center justify-between px-6 py-4 rounded-2xl text-white text-[14px] font-black overflow-hidden shadow-[0_8px_28px_rgba(226,27,112,0.42)] hover:shadow-[0_10px_36px_rgba(226,27,112,0.55)] transition-shadow disabled:opacity-80 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(135deg, #E21B70 0%, #ff4d9e 100%)' }}
                >
                  {/* Shimmer */}
                  {!loading && (
                    <span className="absolute inset-0 -translate-x-full hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 pointer-events-none" />
                  )}

                  <AnimatePresence mode="wait">
                    {loading ? (
                      <motion.span
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2 mx-auto"
                      >
                        <Loader2 size={16} className="animate-spin" />
                        Processing…
                      </motion.span>
                    ) : (
                      <motion.span
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-between w-full"
                      >
                        <div className="flex items-center gap-2">
                          <Receipt size={15} className="opacity-80" />
                          Place Order
                        </div>
                        <div className="flex items-center gap-1 text-[13px] opacity-85">
                          ${grandTotal.toFixed(2)}
                          <ChevronRight size={14} />
                        </div>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>

                <p className="text-center text-[11px] text-slate-300 font-medium mt-3">
                  By placing your order you agree to our Terms of Service
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/*  Success Overlay  */}
      <AnimatePresence>
        {success && <SuccessOverlay orderId={orderId} onGoHome={handleGoHome} />}
      </AnimatePresence>
    </div>
  )
}