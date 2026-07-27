"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Clock, X, ChevronRight, ShoppingBag, AlarmClock } from "lucide-react"

// Mock flash deal items
const flashDealItems = [
  { id: 1, name: "Premium Wireless Headphones", price: 129.99, originalPrice: 299.99, discount: "56%", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80" },
  { id: 2, name: "Smart Fitness Watch", price: 89.50, originalPrice: 199.00, discount: "55%", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80" },
  { id: 3, name: "Organic Cold-Pressed Juice Box", price: 24.99, originalPrice: 45.00, discount: "44%", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&q=80" },
  { id: 4, name: "Luxury Skincare Set", price: 59.99, originalPrice: 120.00, discount: "50%", image: "https://images.unsplash.com/photo-1615397323281-19b884dbafcd?w=500&q=80" },
]

function AnimatedDigit({ digit }: { digit: string }) {
  return (
    <div className="relative h-[1.3em] w-[0.65em] overflow-hidden inline-flex justify-center items-center align-bottom">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={digit}
          initial={{ y: "-100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.8 }}
          className="absolute"
        >
          {digit}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}

export function FlashDealsPopup() {
  const [timeLeft, setTimeLeft] = useState(3599) // 59 mins 59 secs
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isWidgetDismissed, setIsWidgetDismissed] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) return 3599 // Reset for demo purposes
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  if (!mounted) return null

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`

  return (
    <>
      {/* Floating Widget (Mobile Only) */}
      {!isModalOpen && !isWidgetDismissed && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", damping: 20, stiffness: 300, delay: 1 }}
          className="md:hidden fixed bottom-[120px] left-4 right-4 z-30"
        >
          <div 
            onClick={() => setIsModalOpen(true)}
            className="relative overflow-hidden bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(200,17,92,0.12)] p-4 cursor-pointer flex items-center justify-between border border-black/10 group"
          >
            {/* Decorative background elements */}
            <div className="absolute inset-0 bg-gradient-to-r from-pink-50/50 to-rose-50/50 z-0" />
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#c8115c]/10 rounded-full blur-2xl z-0" />
            <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-[#c8115c]/10 rounded-full blur-2xl z-0" />

            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsWidgetDismissed(true);
              }}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 bg-white/50 hover:bg-white rounded-full p-1.5 transition-all z-20 shadow-sm"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            
            <div className="flex items-center gap-4 relative z-10">
              <motion.div 
                className="text-[40px] leading-none drop-shadow-md relative origin-bottom"
                animate={{ rotate: [0, -12, 12, -12, 12, 0] }}
                transition={{ repeat: Infinity, duration: 0.6, repeatDelay: 2, ease: "easeInOut" }}
              >
                ⏰
                <span className="absolute -top-1 -right-2 text-xl animate-pulse">⭐</span>
                <span className="absolute -bottom-1 -left-1 text-sm">✨</span>
              </motion.div>
              <div className="mt-1">
                <h3 className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#c8115c] to-[#e63946] text-[18px] leading-tight tracking-tight drop-shadow-sm">Save 25%</h3>
                <p className="text-[12px] font-bold text-gray-500 tracking-tight mt-0.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c8115c] animate-pulse"></span>
                  Flash Deals
                </p>
              </div>
            </div>
            
            <div className="relative z-10 flex items-center gap-1 font-sans font-extrabold text-sm leading-none text-white mr-6 mt-1">
              <div className="bg-gradient-to-b from-[#c8115c] to-[#a60f4d] rounded-lg px-2 py-1.5 flex items-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)] border border-[#a60f4d]">
                {formattedTime.split(':')[0].split('').map((char, index) => (
                  <AnimatedDigit key={`m-${index}-${char}`} digit={char} />
                ))}
              </div>
              <span className="text-[#c8115c] font-black text-xl mb-0.5">:</span>
              <div className="bg-gradient-to-b from-[#c8115c] to-[#a60f4d] rounded-lg px-2 py-1.5 flex items-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)] border border-[#a60f4d]">
                {formattedTime.split(':')[1].split('').map((char, index) => (
                  <AnimatedDigit key={`s-${index}-${char}`} digit={char} />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Full Screen Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 bg-gray-50 flex flex-col md:hidden"
          >
            {/* Premium Light Header */}
            <div className="bg-white p-6 pt-safe pb-8 text-gray-900 relative shadow-sm border-b border-gray-100 overflow-hidden">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-[env(safe-area-inset-top,1rem)] right-4 mt-2 p-2.5 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors z-20 border border-gray-200"
              >
                <X className="w-5 h-5 text-gray-900" />
              </button>
              
              <div className="flex items-center gap-4 mb-2 mt-4 relative z-10">
                <motion.div 
                  className="text-[48px] leading-none drop-shadow-md relative origin-bottom"
                  animate={{ rotate: [0, -12, 12, -12, 12, 0] }}
                  transition={{ repeat: Infinity, duration: 0.6, repeatDelay: 2, ease: "easeInOut" }}
                >
                  ⏰
                  <span className="absolute -top-1 -right-2 text-2xl animate-pulse">✨</span>
                  <span className="absolute -bottom-1 -left-1 text-lg">💫</span>
                </motion.div>
                <div>
                  <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#c8115c] to-[#e63946] tracking-tight drop-shadow-sm leading-tight mb-1">Save 25%</h2>
                  <p className="text-gray-500 font-bold text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#c8115c] animate-pulse"></span>
                    Flash Deals • Ends in <span className="font-mono font-bold text-[#c8115c]">{formattedTime}</span>
                  </p>
                </div>
              </div>

              {/* Decorative shapes */}
              <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-[#c8115c]/10 rounded-full blur-3xl" />
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 pb-safe space-y-4 relative z-20">
              {flashDealItems.map((item, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  key={item.id} 
                  className="bg-white rounded-3xl p-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex gap-4"
                >
                  <div className="relative w-[100px] h-[110px] rounded-2xl overflow-hidden bg-gray-50 shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    <div className="absolute top-0 left-0 bg-[#c8115c] text-white text-[10px] font-black px-2.5 py-1 rounded-br-xl shadow-sm">
                      -{item.discount}
                    </div>
                  </div>
                  <div className="flex flex-col justify-between py-1 flex-1 pr-1">
                    <div>
                      <h3 className="font-bold text-gray-900 leading-tight text-sm line-clamp-2">{item.name}</h3>
                      <div className="flex items-end gap-2 mt-2">
                        <span className="text-lg font-black text-gray-900 leading-none">${item.price.toFixed(2)}</span>
                        <span className="text-xs font-medium text-gray-400 line-through leading-none mb-[2px]">${item.originalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                    <button className="bg-[#c8115c] text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-[#a60f4d] transition-colors w-full shadow-sm mt-3 group">
                      <ShoppingBag className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                      Add to Cart
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
