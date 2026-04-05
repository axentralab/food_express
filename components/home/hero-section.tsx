'use client'

import React, { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence, Variants } from 'framer-motion'
import { Search, MapPin, ChevronDown, Star, Clock, ArrowRight, Sparkles } from 'lucide-react'
import Image from 'next/image'
//Animation Variants
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.3,
    },
  },
}

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 32, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
}

const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
}

//Magnetic Button

function MagneticButton({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}) {
  const ref = useRef<HTMLButtonElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 200, damping: 20 })
  const springY = useSpring(y, { stiffness: 200, damping: 20 })

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    x.set((e.clientX - cx) * 0.35)
    y.set((e.clientY - cy) * 0.35)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.button
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={className}
      whileTap={{ scale: 0.96 }}
    >
      {children}
    </motion.button>
  )
}

//Tilt Food Card

function TiltFoodCard({
  emoji,
  label,
  price,
  rating,
  delay,
  position,
}: {
  emoji: string
  label: string
  price: string
  rating: string
  delay: number
  position: { top?: string; bottom?: string; left?: string; right?: string }
}) {
  const ref = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { stiffness: 150, damping: 20 })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), { stiffness: 150, damping: 20 })

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  const floatY = useMotionValue(0)

  useEffect(() => {
    let frame: number
    let start: number | null = null
    const amplitude = 10
    const period = 3000 + delay * 400

    const animate = (ts: number) => {
      if (!start) start = ts
      const elapsed = ts - start
      floatY.set(Math.sin((elapsed / period) * 2 * Math.PI) * amplitude)
      frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [delay, floatY])

  return (
    <motion.div
      ref={ref}
      style={{ ...position, y: floatY, rotateX, rotateY, transformStyle: 'preserve-3d', position: 'absolute' }}
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.8 + delay * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="cursor-pointer select-none"
    >
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_8px_40px_rgba(226,27,112,0.15)] border border-white/60 p-4 w-44">
        <div className="text-4xl mb-3 leading-none">{emoji}</div>
        <p className="font-semibold text-gray-800 text-sm leading-tight mb-1">{label}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-[#E21B70] font-bold text-sm">{price}</span>
          <span className="flex items-center gap-0.5 text-[#FFB100] text-xs font-semibold">
            <Star size={10} fill="#FFB100" strokeWidth={0} />
            {rating}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

// Background Orbs

function Orb({ className, delay = 0 }: { className: string; delay?: number }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
      animate={{
        scale: [1, 1.18, 1],
        opacity: [0.45, 0.7, 0.45],
        x: [0, 24, 0],
        y: [0, -16, 0],
      }}
      transition={{ duration: 9 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
    />
  )
}

// Search Bar
const SUGGESTIONS = ['Biryani near me', 'Pizza delivery', 'Burger King', 'Sushi rolls', 'Healthy bowls']

function PremiumSearchBar() {
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('Dhaka, BD')
  const [focused, setFocused] = useState(false)
  const [suggestionIdx, setSuggestionIdx] = useState(0)

  useEffect(() => {
    if (focused) return
    const id = setInterval(() => setSuggestionIdx(i => (i + 1) % SUGGESTIONS.length), 2800)
    return () => clearInterval(id)
  }, [focused])

  return (
    <motion.div
      variants={fadeUpVariants}
      className="relative w-full max-w-2xl"
    >
      <motion.div
        animate={focused ? { boxShadow: '0 0 0 3px rgba(226,27,112,0.25), 0 20px 60px rgba(226,27,112,0.12)' } : { boxShadow: '0 8px 40px rgba(0,0,0,0.10)' }}
        transition={{ duration: 0.3 }}
        className="flex items-stretch bg-white/95 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/80"
      >
        {/* Location Picker */}
        <div className="flex items-center gap-2 px-4 border-r border-gray-100 cursor-pointer group shrink-0">
          <MapPin size={16} className="text-[#E21B70] shrink-0" />
          <span className="text-sm font-medium text-gray-700 whitespace-nowrap hidden sm:inline">{location}</span>
          <ChevronDown size={14} className="text-gray-400 group-hover:text-[#E21B70] transition-colors" />
        </div>

        {/* Search Input */}
        <div className="relative flex-1 flex items-center px-4 py-4">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="w-full bg-transparent text-gray-800 text-sm font-medium outline-none placeholder-transparent"
            placeholder=" "
          />
          {!query && (
            <div className="absolute inset-0 flex items-center px-4 pointer-events-none">
              <AnimatePresence mode="wait">
                <motion.span
                  key={suggestionIdx}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm text-gray-400"
                >
                  {SUGGESTIONS[suggestionIdx]}
                </motion.span>
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Search Button */}
        <MagneticButton className="m-2 px-5 rounded-xl bg-linear-to-r from-[#E21B70] to-[#ff4d9e] text-white font-semibold text-sm flex items-center gap-2 shrink-0 shadow-[0_4px_20px_rgba(226,27,112,0.4)] hover:shadow-[0_6px_28px_rgba(226,27,112,0.55)] transition-shadow">
          <Search size={15} />
          <span className="hidden sm:inline">Search</span>
        </MagneticButton>
      </motion.div>

      {/* Quick Tags */}
      <motion.div
        variants={fadeUpVariants}
        className="flex flex-wrap gap-2 mt-3"
      >
        {['🍕 Pizza', '🍔 Burgers', '🍜 Noodles', '🌮 Tacos', '🍱 Sushi'].map((tag) => (
          <button
            key={tag}
            className="px-3 py-1.5 bg-white/80 backdrop-blur-sm text-gray-600 text-xs font-medium rounded-full border border-gray-200/80 hover:border-[#E21B70]/40 hover:text-[#E21B70] hover:bg-[#E21B70]/5 transition-all duration-200 cursor-pointer"
          >
            {tag}
          </button>
        ))}
      </motion.div>
    </motion.div>
  )
}

// Live Order Notification 

function LiveOrderPill() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ delay: 1.6, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="absolute bottom-18 right-0 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-white/60 px-2 py-1 flex items-center gap-3 z-20"
    >
      <div className="w-9 h-9 rounded-xl border border-gray-300 bg-gradient-to-br from-red-100 to-pink-100 flex items-center justify-center shadow-md">
        <span className="text-xl">🛵</span>
      </div>
      <div>
        <p className="text-xs text-gray-400 font-medium">Live order</p>
        <p className="text-sm font-bold text-gray-800 leading-tight">Arriving in 12 min</p>
      </div>
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse ml-1" />
    </motion.div>
  )
}

//Rating Badge

function RatingBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -40, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ delay: 1.4, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="absolute  top-0 right-50 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_8px_40px_rgba(255,177,0,0.18)] border border-white/60 px-4 py-3 hidden lg:flex items-center gap-2 z-20"
    >
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={13} fill="#FFB100" stroke="none" />
        ))}
      </div>
      <div>
        <span className="text-sm font-bold text-gray-800">4.9</span>
        <span className="text-xs text-gray-400 ml-1">/ 5.0</span>
      </div>
    </motion.div>
  )
}

// 
export function HeroSection() {
  return (
    <section className="relative flex items-center overflow-hidden bg-[#fafafa]">
      {/*   */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Soft grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(#E21B70 1px, transparent 1px), linear-gradient(90deg, #E21B70 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
        <Orb className="w-[600px] h-[600px] bg-[#E21B70]/20 top-[-100px] left-[-100px]" delay={0} />
        <Orb className="w-[500px] h-[500px] bg-[#FFB100]/15 bottom-[-80px] right-[-80px]" delay={3} />
        <Orb className="w-[350px] h-[350px] bg-[#E21B70]/10 top-[40%] left-[40%]" delay={6} />
      </div>

      {/* main content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full py-6 md:py-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* left side - content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-start"
        >
          {/* Pill Badge */}
          <motion.div variants={fadeUpVariants}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#E21B70]/8 rounded-full border border-[#E21B70]/20 mb-7">
              <Sparkles size={13} className="text-[#E21B70]" />
              <span className="text-xs font-semibold text-[#E21B70] tracking-wide uppercase">
                Premium Food Delivery · Now in Dhaka
              </span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={containerVariants}
            className="text-5xl md:text-6xl lg:text-8xl font-black text-gray-900 leading-[1.05] tracking-tight mb-6"
          >
            {['Order', 'What You', 'Crave.'].map((line, i) => (
              <motion.span
                key={i}
                variants={fadeUpVariants}
                className="block"
              >
                {i === 1 ? (
                  <>
                    What{' '}
                    <span
                      className="relative inline-block"
                      style={{
                        background: 'linear-gradient(135deg, #E21B70 0%, #ff4d9e 50%, #FFB100 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      You
                    </span>
                  </>
                ) : (
                  line
                )}
              </motion.span>
            ))}
          </motion.h1>

          {/* Sub-copy */}
          <motion.p
            variants={fadeUpVariants}
            className="text-base sm:text-lg text-gray-500 leading-relaxed mb-10 max-w-md"
          >
            500+ restaurants, 20-minute delivery, and a taste of the extraordinary — right at your door.
          </motion.p>

          {/* Search Bar */}
          <PremiumSearchBar />

          {/* Social Proof */}
          <motion.div variants={fadeUpVariants} className="flex items-center gap-5 mt-8">
            {/* Avatars */}
            <div className="flex -space-x-2.5">
              {['🧑‍🍳', '👩‍💼', '👨‍💻', '👩‍🎨'].map((a, i) => (
                <div
                  key={i}
                  className="w-9 h-9 rounded-full border-2 border-white bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-sm shadow-sm"
                >
                  {a}
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1 mb-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={11} fill="#FFB100" stroke="none" />
                ))}
              </div>
              <p className="text-xs text-gray-400">
                <span className="font-semibold text-gray-700">24,000+</span> happy customers
              </p>
            </div>

            <div className="h-8 w-px bg-gray-200" />

            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Clock size={13} className="text-[#E21B70]" />
              Avg. <span className="font-semibold text-gray-700">22 min</span> delivery
            </div>
          </motion.div>
        </motion.div>

        {/* right side visual elements */}
        <div className="relative h-[540px] ">

          {/* Central Hero Plate */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {/* Glow Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute w-70 h-70 rounded-full border-2 border-dashed border-[#E21B70]/25"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute w-56 h-56 rounded-full border border-dashed border-[#FFB100]/25"
            />

            {/* Main Plate */}
            <div className="relative w-64 h-64 rounded-full bg-linear-to-br from-[#fff5f9] to-[#fff8ee] shadow-[0_20px_80px_rgba(226,27,112,0.2)] border border-white/80 flex items-center justify-center overflow-hidden">
              <motion.div
                initial={{ scale: 1.1 }}
                animate={{ scale: 1.05 }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className="w-[95%] h-[95%] rounded-full relative"
              >
                <Image
                  src="/hero-image.jpg" 
                  alt="Premium Burger"
                  fill
                  sizes="(max-width: 768px) 250px, 256px"
                  className="object-cover rounded-full drop-shadow-[0_20px_40px_rgba(0,0,0,0.2)]"
                  priority  
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..."
                  quality={85}
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Food Cards */}
          <TiltFoodCard
            emoji="🍕"
            label="Margherita Pizza"
            price="$12.99"
            rating="4.8"
            delay={0}
            position={{ top: '30px', left: '-20px' }}
          />
          <TiltFoodCard
            emoji="🍜"
            label="Ramen Bowl"
            price="$10.50"
            rating="4.9"
            delay={1}
            position={{ bottom: '60px', left: '-30px' }}
          />
          <TiltFoodCard
            emoji="🌮"
            label="Street Tacos"
            price="$8.99"
            rating="4.7"
            delay={2}
            position={{ top: '20px', right: '-10px' }}
          />

          {/* Floating Badges */}
          <LiveOrderPill />
          
            <RatingBadge />
      

          {/* CTA overlaid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.5 }}
            className="absolute bottom-0 left-1/2 -translate-x-1/2"
          >
            <MagneticButton className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#E21B70] to-[#ff4d9e] text-white font-bold text-sm shadow-[0_8px_30px_rgba(226,27,112,0.45)] hover:shadow-[0_12px_40px_rgba(226,27,112,0.6)] transition-shadow">
              Order Now
              <ArrowRight size={15} />
            </MagneticButton>
          </motion.div>
        </div>
      </div>

      {/* Mobile CTA
      <div className="lg:hidden absolute bottom-8 left-0 right-0 flex justify-center px-6">
        <MagneticButton className="w-full max-w-sm flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-[#E21B70] to-[#ff4d9e] text-white font-bold shadow-[0_8px_30px_rgba(226,27,112,0.4)]">
          Explore Restaurants <ArrowRight size={16} />
        </MagneticButton>
      </div> */}
    </section>
  )
}