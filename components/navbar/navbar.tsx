'use client'

import React, { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
  type Variants
} from 'framer-motion'
import { ShoppingCart, Menu, X, LogIn, UserCircle, Sparkles, UtensilsCrossed } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUI } from '@/components/providers/ui-provider'
import { useCart } from '@/features/cart/cart-context'



interface NavLink {
  name: string
  href: string
}
const NAV_LINKS: NavLink[] = [
  { name: 'Home', href: '/' },
  { name: 'Restaurants', href: '/restaurants' },
  { name: 'Offers', href: '/offers' },
  { name: 'About Us', href: '/about' },
  { name: 'Need Help?', href: '/contact' },
]

//Magnetic Wrapper
function Magnetic({
  children,
  strength = 0.35,
}: {
  children: React.ReactElement
  strength?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 18 })
  const sy = useSpring(y, { stiffness: 220, damping: 18 })

  const onMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength)
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength)
  }

  const onLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div ref={ref} style={{ x: sx, y: sy }} onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </motion.div>
  )
}

// NavLink Item with floating capsule and active dot

function NavLinkItem({
  link,
  isActive,
  onHover,
  onLeave,
  isHovered,
}: {
  link: NavLink
  isActive: boolean
  onHover: (href: string) => void
  onLeave: () => void
  isHovered: boolean
}) {
  return (
    <Link
      href={link.href}
      onMouseEnter={() => onHover(link.href)}
      onMouseLeave={onLeave}
      className="relative px-4 py-2 rounded-full text-[14px] font-semibold transition-colors duration-200 z-10"
      style={{ color: isActive || isHovered ? '#E21B70' : '#475569' }}
    >
      {/* Floating capsule background */}
      <AnimatePresence>
        {(isActive || isHovered) && (
          <motion.span
            layoutId="navCapsule"
            className="absolute inset-0 rounded-full bg-[#E21B70]/8 border border-[#E21B70]/15"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          />
        )}
      </AnimatePresence>

      {/* Active dot */}
      {isActive && (
        <motion.span
          layoutId="activedot"
          className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#E21B70]"
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        />
      )}

      <span className="relative z-10">{link.name}</span>
    </Link>
  )
}

//Cart Button 
function CartButton({ onClick, count }: { onClick: () => void; count: number }) {
  return (
    <Magnetic>
      <motion.button
        onClick={onClick}
        whileTap={{ scale: 0.92 }}
        className="relative p-2.5 rounded-xl hover:bg-slate-100/80 transition-colors duration-200 group"
        aria-label="Open cart"
      >
        <ShoppingCart className="w-5 h-5 text-slate-600 group-hover:text-[#E21B70] transition-colors" />
        <AnimatePresence>
          {count > 0 && (
            <motion.span
              key="badge"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-gradient-to-r from-[#E21B70] to-[#ff4d9e] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 border-2 border-white shadow-sm"
            >
              {count > 9 ? '9+' : count}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </Magnetic>
  )
}

// mobile drawer component
function MobileDrawer({
  isOpen,
  onClose,
  pathname,
  isLoggedIn,
}: {
  isOpen: boolean
  onClose: () => void
  pathname: string
  isLoggedIn: boolean
}) {
  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
          />

          {/* Drawer Panel */}
          <motion.aside
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 30 }}
            className="fixed inset-y-0 right-0 z-50 w-[300px] bg-white/90 backdrop-blur-2xl shadow-[−20px_0_60px_rgba(0,0,0,0.08)] border-l border-white/60 lg:hidden flex flex-col"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100/80">
              <span className="text-lg font-black bg-gradient-to-r from-[#E21B70] to-[#FFB100] bg-clip-text text-transparent italic">
                FoodExpress
              </span>
              <motion.button
                whileTap={{ scale: 0.9, rotate: 90 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </motion.button>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
              {NAV_LINKS.map((link, i) => {
                const active = pathname === link.href
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i, type: 'spring', stiffness: 280, damping: 28 }}
                  >
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-semibold transition-all duration-200',
                        active
                          ? 'bg-[#E21B70]/8 text-[#E21B70] border border-[#E21B70]/15'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      )}
                    >
                      {active && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E21B70] shrink-0" />
                      )}
                      {link.name}
                    </Link>
                  </motion.div>
                )
              })}
            </nav>

            {/* Auth Footer */}
            <div className="px-4 pb-8 pt-4 border-t border-slate-100/80 space-y-3">
              {isLoggedIn ? (
                <Link
                  href="/profile"
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 font-semibold transition-colors"
                >
                  <UserCircle className="w-5 h-5" /> My Profile
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 font-semibold transition-colors"
                  >
                    <LogIn className="w-5 h-5" /> Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={onClose}
                    className="block w-full text-center py-3.5 rounded-xl bg-gradient-to-r from-[#E21B70] to-[#ff4d9e] text-white font-bold text-sm shadow-[0_6px_24px_rgba(226,27,112,0.35)] hover:shadow-[0_8px_32px_rgba(226,27,112,0.5)] transition-shadow"
                  >
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}



export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)
  const [isLoggedIn] = useState(false) // Replace with your auth context

  const pathname = usePathname()
  const { openCart } = useUI()
  const { totalItems } = useCart()

  // Scroll-driven border opacity
  const { scrollY } = useScroll()
  const borderOpacity = useTransform(scrollY, [0, 60], [0, 1])
  const bgOpacity = useTransform(scrollY, [0, 80], [0.7, 0.92])

  // Stagger nav links on mount
  const navContainerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
  }
  const navItemVariants: Variants = {
    hidden: { opacity: 0, y: -10, filter: 'blur(4px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  }

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-50 w-full"
      >
        {/* Glass panel */}
        <motion.div
          style={{ '--bg-opacity': bgOpacity } as React.CSSProperties}
          className="w-full bg-white/[--bg-opacity] backdrop-blur-xl"
        >
          {/* Scroll-reactive bottom border */}
          <motion.div
            style={{ opacity: borderOpacity }}
            className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 sm:h-[72px]">

      {/* link and logo */}
              <div className="flex items-center gap-6">
              {/*  */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link href="/" className="flex items-center gap-1 group">
                
                    <motion.div
                      whileHover={{ rotate: [-5, 5, -5, 0], scale: 1.1 }}
                      transition={{ duration: 0.4 }}
                      className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#E21B70] to-[#FFB100] flex items-center justify-center shadow-[0_4px_16px_rgba(226,27,112,0.3)] border border-white/50"
                    >
                      <UtensilsCrossed className="w-5 h-5 text-white stroke-[2.5]" />
                    </motion.div>
                    <span className="text-2xl font-extrabold bg-gradient-to-r from-[#E21B70] via-[#ff4d9e] to-[#f09c00] bg-clip-text text-transparent italic tracking-tight leading-none ">
                      FoodExpress
                    </span>
                  </Link>
                </motion.div>

                {/* Desktop Nav Links */}
                <motion.div
                  variants={navContainerVariants}
                  initial="hidden"
                  animate="visible"
                  className="hidden lg:flex items-center gap-1"
                >
                  {NAV_LINKS.map((link) => (
                    <motion.div key={link.href} variants={navItemVariants}>
                      <NavLinkItem
                        link={link}
                        isActive={pathname === link.href}
                        isHovered={hoveredLink === link.href}
                        onHover={(href) => setHoveredLink(href)}
                        onLeave={() => setHoveredLink(null)}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </div>


              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-2"
              >
                {/* Cart */}
                <CartButton onClick={openCart} count={totalItems} />

                {/* Divider */}
                <div className="hidden sm:block h-6 w-px bg-slate-200 mx-1" />

                {/* Auth link Desktop */}
                <div className="hidden sm:flex items-center gap-2">
                  {isLoggedIn ? (
                    <Magnetic>
                      <Link
                        href="/profile"
                        className="flex items-center gap-2 p-2 rounded-xl hover:bg-slate-100 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E21B70]/20 to-[#FFB100]/20 flex items-center justify-center">
                          <UserCircle className="w-5 h-5 text-[#E21B70]" />
                        </div>
                      </Link>
                    </Magnetic>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="text-sm font-semibold text-slate-500 hover:text-[#E21B70] px-3 py-2 rounded-lg hover:bg-[#E21B70]/5 transition-all duration-200"
                      >
                        Login
                      </Link>
                      <Magnetic>
                        <Link
                          href="/register"
                          className="relative overflow-hidden text-sm font-bold text-white px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E21B70] to-[#ff4d9e] shadow-[0_4px_16px_rgba(226,27,112,0.38)] hover:shadow-[0_6px_24px_rgba(226,27,112,0.55)] transition-shadow duration-300 group flex items-center gap-1.5"
                        >
                          {/* Shimmer */}
                          <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out" />
                          <span className="relative">Sign Up</span>
                        </Link>
                      </Magnetic>
                    </>
                  )}
                </div>

                {/* Mobile Hamburger */}
                <Magnetic strength={0.25}>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="lg:hidden p-2.5 rounded-xl hover:bg-slate-100 transition-colors"
                    aria-label="Open menu"
                  >
                    <motion.div
                      animate={isMobileMenuOpen ? { rotate: 90 } : { rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    >
                      <Menu className="w-5 h-5 text-slate-700" />
                    </motion.div>
                  </motion.button>
                </Magnetic>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.nav>

      {/* Mobile Drawer (portal-like, rendered outside sticky nav) */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        pathname={pathname}
        isLoggedIn={isLoggedIn}
      />
    </>
  )
}