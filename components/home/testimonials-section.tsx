'use client'

import React, { useRef } from 'react'
import { motion, useMotionValue, useSpring, useInView } from 'framer-motion'
import Marquee from 'react-fast-marquee'
import { Star, Quote } from 'lucide-react'

//Data

interface Testimonial {
  id: number
  name: string
  role: string
  avatar: string
  text: string
  rating: number
  tag: string
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: 'Isabelle Fontaine',
    role: 'Food Critic · Le Monde',
    avatar: '👩‍🍳',
    text: 'An unparalleled delivery experience. The food arrived at perfect temperature with plating that rivalled a Michelin-starred table.',
    rating: 5,
    tag: 'Gourmet',
  },
  {
    id: 2,
    name: 'Marcus Chen',
    role: 'CEO · Luminary Ventures',
    avatar: '👨‍💼',
    text: 'I order three times a week. FoodExpress is the only platform where speed never compromises quality. Genuinely impressed.',
    rating: 5,
    tag: 'Executive',
  },
  {
    id: 3,
    name: 'Priya Sharma',
    role: 'Chef · Studio Akara',
    avatar: '👩',
    text: 'As a chef, I`m ruthless about food quality. This platform sources from restaurants I actually respect. Remarkable curation.',
    rating: 5,
    tag: 'Chef',
  },
  {
    id: 4,
    name: 'James Whitmore',
    role: 'Editor · Bon Appétit',
    avatar: '🧑‍💻',
    text: 'The interface is as refined as the restaurants it lists. Every interaction feels considered — a rarity in food-tech.',
    rating: 5,
    tag: 'Editorial',
  },
  {
    id: 5,
    name: 'Leila Al-Rashid',
    role: 'Architect · Studio Ciel',
    avatar: '👩‍🎨',
    text: 'Design-forward and functionally elegant. FoodExpress understands that the experience matters as much as the meal itself.',
    rating: 5,
    tag: 'Creative',
  },
  {
    id: 6,
    name: 'Théo Mercier',
    role: 'Sommelier · Château Bleu',
    avatar: '🧑‍🍳',
    text: 'Paired my wine order with dinner delivery seamlessly. The 22-minute promise? They beat it every single time.',
    rating: 5,
    tag: 'Hospitality',
  },
  {
    id: 7,
    name: 'Anika Patel',
    role: 'VC Partner · Kinetic Capital',
    avatar: '👩‍💼',
    text: 'I`ve invested in food-tech for a decade. FoodExpress has the retention metrics and NPS that make competitors weep.',
    rating: 5,
    tag: 'Investor',
  },
  {
    id: 8,
    name: 'Rafael Montoya',
    role: 'Pastry Chef · Atelier Sucré',
    avatar: '🧑‍🎨',
    text: 'My desserts travel 8 kilometres and arrive as pristine as they left my kitchen. The packaging protocol is exceptional.',
    rating: 5,
    tag: 'Artisan',
  },
]


const ROW_A = TESTIMONIALS.slice(0, 4)
const ROW_B = TESTIMONIALS.slice(4, 8)

//Magnetic Tilt Card
function TestimonialCard({ t }: { t: Testimonial }) {
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rx = useSpring(mx, { stiffness: 160, damping: 20 })
  const ry = useSpring(my, { stiffness: 160, damping: 20 })
  const glowX = useMotionValue(50)
  const glowY = useMotionValue(50)

  const onMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const nx = (e.clientX - rect.left) / rect.width - 0.5
    const ny = (e.clientY - rect.top) / rect.height - 0.5
    mx.set(ny * 10)
    my.set(-nx * 10)
    glowX.set(((e.clientX - rect.left) / rect.width) * 100)
    glowY.set(((e.clientY - rect.top) / rect.height) * 100)
  }

  const onLeave = () => {
    mx.set(0)
    my.set(0)
    glowX.set(50)
    glowY.set(50)
  }

  return (
    <motion.div
      ref={ref}
      style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      whileHover={{ scale: 1.03 }}
      transition={{ scale: { type: 'spring', stiffness: 220, damping: 20 } }}
      className="relative group mx-2 w-100  shrink-0 cursor-default"
    >
      {/* Pink glow on hover */}
      <motion.div
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(226,27,112,0.22) 0%, transparent 70%)',
          opacity: 0,
        }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="absolute -inset-3 rounded-3xl pointer-events-none blur-xl"
      />

      {/* Card */}
      <div className="relative  bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl p-2    shadow-[0_4px_24px_rgba(0,0,0,0.07)] hover:shadow-[0_8px_40px_rgba(226,27,112,0.14)] transition-shadow duration-300 overflow-hidden">

       
        <motion.div
          style={{
            background: `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(255,255,255,0.55) 0%, transparent 65%)`,
          }}
          className="absolute inset-0 pointer-events-none rounded-2xl"
        />

      
        <div className="flex items-start justify-between mb-3 relative">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#E21B70]/15 to-[#FFB100]/15 border border-white/80 flex items-center justify-center text-2xl shadow-sm">
              {t.avatar}
            </div>
            <div>
              <p className="font-black text-gray-900 text-sm leading-tight">{t.name}</p>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">{t.role}</p>
            </div>
          </div>

          {/* Tag pill */}
          <span className="text-[8px] font-bold text-[#E21B70] bg-[#E21B70]/8 border border-[#E21B70]/20 rounded-full px-1  shrink-0">
            {t.tag}
          </span>
        </div>

     

        {/* Quote icon */}
        <Quote size={18} className="text-[#E21B70]/30 " />

        {/* Text */}
        <p className="text-[13px] text-slate-600 leading-relaxed font-medium">{t.text}</p>

        {/* Bottom border accent */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#E21B70]/0 via-[#E21B70]/40 to-[#E21B70]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </motion.div>
  )
}

// Main Section 

export function TestimonialsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      ref={ref}
      className="relative py-24 sm:py-32 overflow-hidden bg-[#fafafa]"
      style={{ perspective: '1200px' }}
    >
  {/* Background subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(#E21B70 1px, transparent 1px), linear-gradient(90deg, #E21B70 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />

      {/* Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#E21B70]/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#FFB100]/8 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="text-center px-4 mb-16"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#E21B70]/8 rounded-full border border-[#E21B70]/20 mb-5">
          <Star size={12} fill="#E21B70" stroke="none" />
          <span className="text-xs font-bold text-[#E21B70] uppercase tracking-widest">Wall of Fame</span>
        </div>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight mb-4">
          They Said It,{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #E21B70 0%, #ff4d9e 50%, #FFB100 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Not Us.
          </span>
        </h2>
        <p className="text-slate-500 text-base sm:text-lg max-w-xl mx-auto font-medium">
          Critics, chefs, and executives on what makes FoodExpress the gold standard.
        </p>
      </motion.div>
{/*  */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
        style={{ transform: 'rotate(-2deg)', transformOrigin: 'center' }}
      >
        {/* Left Right gradient  */}
        <div
          className="absolute inset-y-0 left-0 w-40 z-10 pointer-events-none"
          style={{
            background: 'linear-gradient(to right, #fafafa 0%, transparent 100%)',
          }}
        />
        <div
          className="absolute inset-y-0 right-0 w-40 z-10 pointer-events-none"
          style={{
            background: 'linear-gradient(to left, #fafafa 0%, transparent 100%)',
          }}
        />

        {/* Row A — left */}
        <div className="mb-4">
          <Marquee speed={38} gradient={false} pauseOnHover>
            {ROW_A.map((t) => (
              <TestimonialCard key={t.id} t={t} />
            ))}
            {ROW_A.map((t) => (
              <TestimonialCard key={`${t.id}-dup`} t={t} />
            ))}
          </Marquee>
        </div>

        {/* Row B — right */}
        <div>
          <Marquee speed={28} gradient={false} direction="right" pauseOnHover>
            {ROW_B.map((t) => (
              <TestimonialCard key={t.id} t={t} />
            ))}
            {ROW_B.map((t) => (
              <TestimonialCard key={`${t.id}-dup`} t={t} />
            ))}
          </Marquee>
        </div>
      </motion.div>

      {/* Bottom aggregate rating */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex justify-center mt-14"
      >
        <div className="inline-flex items-center gap-4 bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl px-6 py-3.5 shadow-[0_4px_24px_rgba(0,0,0,0.07)]">
          <div className="flex -space-x-1.5">
            {['👩‍🍳','👨‍💼','🧑‍💻','👩‍🎨','🧑'].map((a, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-sm"
              >
                {a}
              </div>
            ))}
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <div className="flex items-center gap-1.5">
            <div className="flex">
              {[1,2,3,4,5].map(i => <Star key={i} size={13} fill="#FFB100" stroke="none" />)}
            </div>
            <span className="font-black text-gray-900 text-sm">4.9</span>
            <span className="text-slate-400 text-sm font-medium">from 24,000+ reviews</span>
          </div>
        </div>
      </motion.div>
    </section>
  )
}