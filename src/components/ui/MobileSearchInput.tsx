'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, X, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useResponsive } from '@/hooks/useResponsive'

interface MobileSearchInputProps {
  value: string
  onChange: (value: string) => void
  onFilterClick?: () => void
  placeholder?: string
  showFilterButton?: boolean
  autoFocus?: boolean
}

export function MobileSearchInput({
  value,
  onChange,
  onFilterClick,
  placeholder = 'Buscar areninhas...',
  showFilterButton = true,
  autoFocus = false
}: MobileSearchInputProps) {
  const { isMobile } = useResponsive()
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  const handleClear = () => {
    onChange('')
    inputRef.current?.focus()
  }

  return (
    <div className={`flex gap-2 ${isMobile ? 'px-4 py-3' : 'px-4 py-4'}`}>
      {/* Search Input */}
      <div className={`flex-1 relative ${
        isFocused ? 'ring-2 ring-blue-500' : ''
      } rounded-lg bg-white transition-all`}>
        <div className="flex items-center">
          <Search className="w-5 h-5 text-gray-400 ml-3" />
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className={`w-full border-0 outline-none bg-transparent text-gray-900 placeholder-gray-500 ${
              isMobile ? 'px-3 py-3 text-base' : 'px-3 py-3 text-sm'
            }`}
          />
          {value && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClear}
              className="mr-2 h-8 w-8 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Filter Button */}
      {showFilterButton && (
        <Button
          variant="outline"
          size="icon"
          onClick={onFilterClick}
          className={`bg-white border-gray-200 hover:bg-gray-50 ${
            isMobile ? 'h-12 w-12' : 'h-11 w-11'
          }`}
        >
          <Filter className="w-5 h-5 text-gray-600" />
        </Button>
      )}
    </div>
  )
}