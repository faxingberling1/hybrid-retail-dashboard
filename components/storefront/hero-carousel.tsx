"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronRight, ChevronLeft } from "lucide-react"

export interface Banner {
  id: string | number
  title?: string
  subtitle?: string
  link?: string
  image_url?: string
  bgClass?: string
  buttonText?: string
}

const defaultSlides: Banner[] = [
  {
    id: 1,
    title: "FREE DELIVERY",
    subtitle: "ON ORDERS ABOVE Rs. 500",
    bgClass: "from-emerald-500 to-teal-500",
    buttonText: "Shop Now",
    link: "/storefront/products"
  },
  {
    id: 2,
    title: "SUMMER MEGA SALE",
    subtitle: "UP TO 50% OFF ON BEVERAGES",
    bgClass: "from-rose-500 to-orange-500",
    buttonText: "View Deals",
    link: "/storefront/products?category=beverages"
  },
  {
    id: 3,
    title: "NEW ARRIVALS",
    subtitle: "TRY OUR LATEST READY MEALS",
    bgClass: "from-indigo-500 to-purple-500",
    buttonText: "Explore",
    link: "/storefront/products?category=ready-meals"
  }
]

export function HeroCarousel({ banners }: { banners?: Banner[] }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  const slides = banners && banners.length > 0 ? banners : defaultSlides

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)

  return (
    <div className="relative rounded-2xl overflow-hidden h-[160px] md:h-[240px] shadow-sm mb-8 group">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 flex items-center px-6 md:px-12 ${
            slide.bgClass ? "bg-gradient-to-r " + slide.bgClass : 'bg-slate-900'
          } ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {slide.image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={slide.image_url} 
              alt={slide.title || "Banner"} 
              className="absolute inset-0 w-full h-full object-cover opacity-60" 
            />
          )}
          <div className="relative z-10 text-white max-w-xl">
            {slide.title && <h1 className="text-3xl md:text-5xl font-black mb-2 leading-tight tracking-tight drop-shadow-sm translate-y-0 opacity-100 transition-all duration-700 delay-100">{slide.title}</h1>}
            {slide.subtitle && <p className="text-white/90 font-bold text-sm md:text-lg mb-4 drop-shadow-sm">{slide.subtitle}</p>}
            {(slide.buttonText || slide.link) && (
              <Link 
                href={slide.link || "#"} 
                className="inline-block px-6 py-2 bg-white text-slate-900 rounded-full font-black text-xs md:text-sm shadow-md hover:scale-105 transition-transform"
              >
                {slide.buttonText || "Shop Now"}
              </Link>
            )}
          </div>
          {/* Decorative circles - only show if no image to avoid clutter */}
          {!slide.image_url && (
            <>
              <div className="absolute right-0 top-0 w-48 h-48 md:w-64 md:h-64 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
              <div className="absolute left-1/2 bottom-0 w-32 h-32 bg-black/10 rounded-full blur-2xl translate-y-1/2"></div>
            </>
          )}
        </div>
      ))}

      {/* Controls */}
      <button 
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center text-white z-20 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/50"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center text-white z-20 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/50"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`w-2 h-2 rounded-full transition-all ${idx === currentSlide ? "bg-white w-6" : "bg-white/50"}`}
          />
        ))}
      </div>
    </div>
  )
}
