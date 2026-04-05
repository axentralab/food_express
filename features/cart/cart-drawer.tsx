'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useCart } from './cart-context'
import { CartItemComponent } from './cart-item'
import { PremiumButton } from '@/components/ui/premium-button'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } =
    useCart()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-screen w-full max-w-xl bg-card border-l border-card-border shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-card-border sticky top-0 bg-card">
              <h2 className="text-2xl font-bold text-foreground">Your Cart</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="p-2 hover:bg-background-subtle rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-foreground" />
              </motion.button>
            </div>

            {/* Items List */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex-1 overflow-y-auto p-6"
            >
              {items.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="h-full flex items-center justify-center text-center"
                >
                  <div>
                    <div className="text-5xl mb-4">🛒</div>
                    <p className="text-foreground-muted font-semibold">
                      Your cart is empty
                    </p>
                    <p className="text-sm text-foreground-muted mt-2">
                      Add some delicious food to get started!
                    </p>
                  </div>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                      <CartItemComponent
                        key={item.id}
                        item={item}
                        onQuantityChange={(quantity) =>
                          updateQuantity(item.id, quantity)
                        }
                        onRemove={() => removeItem(item.id)}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>

            {/* Footer */}
            {items.length > 0 && (
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="border-t border-card-border p-6 space-y-4 bg-card sticky bottom-0"
              >
                {/* Subtotal */}
                <div className="flex justify-between text-foreground-muted">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="font-semibold">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>

                {/* Delivery Fee */}
                <div className="flex justify-between text-foreground-muted">
                  <span>Delivery Fee</span>
                  <span className="font-semibold">$2.99</span>
                </div>

                {/* Tax */}
                <div className="flex justify-between text-foreground-muted pb-4 border-b border-card-border">
                  <span>Tax</span>
                  <span className="font-semibold">
                    ${(totalPrice * 0.08).toFixed(2)}
                  </span>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center">
                  <span className="font-bold text-foreground">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    ${(totalPrice + 2.99 + totalPrice * 0.08).toFixed(2)}
                  </span>
                </div>

                {/* Checkout Button */}
                <PremiumButton
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={onClose}
                  className="mt-6"
                >
                  Proceed to Checkout
                </PremiumButton>

                <button
                  onClick={onClose}
                  className="w-full py-3 text-foreground font-semibold border-2 border-card-border rounded-full hover:bg-background-subtle transition-colors"
                >
                  Continue Shopping
                </button>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
