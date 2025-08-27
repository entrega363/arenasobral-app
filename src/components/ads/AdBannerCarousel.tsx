'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AdBannerProps {
  isAdmin?: boolean
  onUpload?: () => void
}

// Função para embaralhar array (algoritmo Fisher-Yates)
const shuffleArray = (array: any[]) => {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

export function AdBannerCarousel({ isAdmin = false, onUpload }: AdBannerProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [shuffledAds, setShuffledAds] = useState<any[]>([])
  
  const ads = [
    { id: 1, class: 'ad-placeholder-1', text: 'Propaganda 1' },
    { id: 2, class: 'ad-placeholder-2', text: 'Propaganda 2' },
    { id: 3, class: 'ad-placeholder-3', text: 'Propaganda 3' },
    { id: 4, class: 'ad-placeholder-4', text: 'Propaganda 4' },
    { id: 5, class: 'ad-placeholder-5', text: 'Propaganda 5' }
  ]

  // Embaralhar as propagandas quando o componente montar
  useEffect(() => {
    setShuffledAds(shuffleArray(ads))
  }, [])

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    if (shuffledAds.length === 0) return
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % shuffledAds.length)
    }, 5000)
    
    return () => clearInterval(interval)
  }, [shuffledAds.length])

  const goToPrevious = () => {
    if (shuffledAds.length === 0) return
    setCurrentSlide((prev) => (prev - 1 + shuffledAds.length) % shuffledAds.length)
  }

  const goToNext = () => {
    if (shuffledAds.length === 0) return
    setCurrentSlide((prev) => (prev + 1) % shuffledAds.length)
  }

  const handleUploadClick = () => {
    if (onUpload) {
      onUpload()
    }
  }

  if (shuffledAds.length === 0) {
    return (
      <div className="relative w-full h-48 rounded-lg overflow-hidden mb-4 bg-gray-200 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-gray-500">Carregando propagandas...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-48 rounded-lg overflow-hidden mb-4">
      {/* Carousel container */}
      <div className="relative w-full h-full">
        {shuffledAds.map((ad, index) => (
          <div 
            key={ad.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className={`w-full h-full ${ad.class} ad-placeholder`}>
              <span className="text-2xl font-bold text-white drop-shadow-lg">
                {ad.text}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <Button
        variant="ghost"
        size="icon"
        onClick={goToPrevious}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/30 text-white hover:bg-black/50"
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={goToNext}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/30 text-white hover:bg-black/50"
      >
        <ChevronRight className="w-5 h-5" />
      </Button>

      {/* Slide indicators */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
        {shuffledAds.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Admin upload button */}
      {isAdmin && (
        <Button
          variant="default"
          size="sm"
          onClick={handleUploadClick}
          className="absolute top-2 right-2 bg-blue-500 text-white hover:bg-blue-600 text-xs"
        >
          Upload
        </Button>
      )}
    </div>
  )
}