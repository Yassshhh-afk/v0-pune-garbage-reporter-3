"use client"

import { useState, useRef, useEffect } from "react"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const testimonials = [
  {
    id: 1,
    quote: "This platform has transformed how we engage with citizens. Reports are organized, trackable, and we've improved our response time by 60%.",
    author: "Ward Officer, Hadapsar",
    role: "Pune Municipal Corporation",
    rating: 5,
  },
  {
    id: 2,
    quote: "Finally, a direct way to report issues! I've used this app 5 times and each time the garbage was cleared within 3 days. Incredible improvement.",
    author: "Priya Sharma",
    role: "Resident, Kothrud",
    rating: 5,
  },
  {
    id: 3,
    quote: "The real-time tracking is a game changer. We can see exactly when ward offices respond and cleanup crews are dispatched. Total transparency.",
    author: "Rahul Deshmukh",
    role: "Community Leader, Wakad",
    rating: 5,
  },
  {
    id: 4,
    quote: "As a civic activist, this tool gives us data-driven insights. We can identify chronic problem areas and work with officials to find permanent solutions.",
    author: "Anjali Patil",
    role: "Environmental Activist",
    rating: 5,
  },
]

export function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [translateX, setTranslateX] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  const handleDragStart = (clientX: number) => {
    setIsDragging(true)
    setStartX(clientX)
  }

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return
    
    const diff = clientX - startX
    setDragOffset(diff)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
    
    // Threshold to trigger slide change (30% of container width)
    const threshold = window.innerWidth * 0.15
    
    if (dragOffset > threshold && currentIndex > 0) {
      // Swiped right - go to previous
      setCurrentIndex(currentIndex - 1)
    } else if (dragOffset < -threshold && currentIndex < testimonials.length - 1) {
      // Swiped left - go to next
      setCurrentIndex(currentIndex + 1)
    }
    
    setDragOffset(0)
    setStartX(0)
  }

  const goToNext = () => {
    if (currentIndex < testimonials.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  useEffect(() => {
    const containerWidth = carouselRef.current?.offsetWidth || 0
    setTranslateX(-currentIndex * containerWidth)
  }, [currentIndex])

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Carousel Container */}
      <div className="relative overflow-hidden touch-pan-y" ref={carouselRef}>
        <div
          className={cn(
            "flex transition-transform duration-300 ease-out",
            isDragging && "transition-none"
          )}
          style={{
            transform: `translateX(${translateX + dragOffset}px)`,
          }}
          onMouseDown={(e) => handleDragStart(e.clientX)}
          onMouseMove={(e) => handleDragMove(e.clientX)}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
          onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
          onTouchEnd={handleDragEnd}
        >
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="w-full flex-shrink-0 px-4 select-none"
              style={{ userSelect: "none" }}
            >
              <div className="text-center">
                {/* Stars */}
                <div className="flex justify-center gap-1 mb-6">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-2xl md:text-4xl font-medium text-white mb-8 leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>

                {/* Author */}
                <div className="text-blue-100">
                  <div className="font-semibold text-white">{testimonial.author}</div>
                  <div>{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-center gap-4 mt-12">
        <button
          onClick={goToPrevious}
          disabled={currentIndex === 0}
          className={cn(
            "w-12 h-12 rounded-full border-2 border-white/30 flex items-center justify-center transition-all",
            currentIndex === 0
              ? "opacity-30 cursor-not-allowed"
              : "hover:bg-white/10 hover:border-white/50 cursor-pointer"
          )}
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        {/* Dots Indicator */}
        <div className="flex items-center gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                index === currentIndex
                  ? "w-8 bg-white"
                  : "w-2 bg-white/30 hover:bg-white/50"
              )}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={goToNext}
          disabled={currentIndex === testimonials.length - 1}
          className={cn(
            "w-12 h-12 rounded-full border-2 border-white/30 flex items-center justify-center transition-all",
            currentIndex === testimonials.length - 1
              ? "opacity-30 cursor-not-allowed"
              : "hover:bg-white/10 hover:border-white/50 cursor-pointer"
          )}
          aria-label="Next testimonial"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  )
}
