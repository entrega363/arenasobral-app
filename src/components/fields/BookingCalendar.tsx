'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Field, TimeSlot } from '@/types'
import { FieldService } from '@/lib/fieldService'
import { useResponsive } from '@/hooks/useResponsive'
import { useSwipeGesture } from '@/hooks/useSwipeGesture'

interface BookingCalendarProps {
  field: Field
  onTimeSlotSelect: (date: Date, timeSlot: TimeSlot) => void
  selectedDate?: Date
  selectedTimeSlot?: TimeSlot
}

export function BookingCalendar({ 
  field, 
  onTimeSlotSelect, 
  selectedDate, 
  selectedTimeSlot 
}: BookingCalendarProps) {
  const { isMobile, isTablet } = useResponsive()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date>(selectedDate || new Date())
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(false)

  // Swipe gesture for month navigation
  const calendarRef = useSwipeGesture<HTMLDivElement>({
    onSwipeLeft: () => navigateMonth(1),
    onSwipeRight: () => navigateMonth(-1),
    threshold: 50
  })

  useEffect(() => {
    loadAvailableTimeSlots(selectedCalendarDate)
  }, [selectedCalendarDate, field.id])

  const loadAvailableTimeSlots = async (date: Date) => {
    try {
      setLoading(true)
      const slots = FieldService.getAvailableTimeSlots(field.id, date)
      setAvailableTimeSlots(slots)
    } catch (error) {
      console.error('Error loading time slots:', error)
      setAvailableTimeSlots([])
    } finally {
      setLoading(false)
    }
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }

  const isDateDisabled = (date: Date | null) => {
    if (!date) return true
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  const isDateSelected = (date: Date | null) => {
    if (!date || !selectedCalendarDate) return false
    return date.toDateString() === selectedCalendarDate.toDateString()
  }

  const handleDateSelect = (date: Date | null) => {
    if (!date || isDateDisabled(date)) return
    setSelectedCalendarDate(date)
  }

  const handleTimeSlotSelect = (timeSlot: TimeSlot) => {
    onTimeSlotSelect(selectedCalendarDate, timeSlot)
  }

  const formatTime = (time: string) => {
    return time.substring(0, 5) // Remove seconds if present
  }

  const formatPrice = (price: number) => {
    return `R$ ${price}`
  }

  const navigateMonth = (direction: number | 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (typeof direction === 'number') {
      newDate.setMonth(currentDate.getMonth() + direction)
    } else if (direction === 'prev') {
      newDate.setMonth(currentDate.getMonth() - 1)
    } else {
      newDate.setMonth(currentDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]

  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  const days = getDaysInMonth(currentDate)

  return (
    <div className="space-y-4">
      {/* Calendar */}
      <Card className="bg-white rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Selecionar Data
          </h3>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('prev')}
              className="p-2"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium min-w-[120px] text-center">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('next')}
              className="p-2"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day) => (
            <div key={day} className="text-center text-xs font-medium text-slate-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div 
          ref={calendarRef}
          className="grid grid-cols-7 gap-1 select-none"
        >
          {days.map((date, index) => (
            <button
              key={index}
              onClick={() => handleDateSelect(date)}
              disabled={isDateDisabled(date)}
              className={`
                aspect-square flex items-center justify-center rounded-lg transition
                ${isMobile ? 'text-sm min-h-[40px]' : 'text-sm min-h-[44px]'}
                ${!date ? 'invisible' : ''}
                ${isDateDisabled(date) 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'hover:bg-blue-50 cursor-pointer active:bg-blue-100'
                }
                ${isDateSelected(date) 
                  ? 'bg-blue-500 text-white font-bold' 
                  : 'text-slate-700'
                }
              `}
            >
              {date?.getDate()}
            </button>
          ))}
        </div>
      </Card>

      {/* Time Slots */}
      <Card className="bg-white rounded-xl p-4">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Horários Disponíveis
          <span className="text-sm font-normal text-slate-500">
            ({selectedCalendarDate.toLocaleDateString('pt-BR')})
          </span>
        </h3>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : availableTimeSlots.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="font-medium mb-1">Nenhum horário disponível</p>
            <p className="text-sm">Tente selecionar outra data</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2">
            {availableTimeSlots.map((timeSlot) => (
              <button
                key={timeSlot.id}
                onClick={() => handleTimeSlotSelect(timeSlot)}
                className={`
                  flex items-center justify-between p-3 border rounded-lg transition
                  ${selectedTimeSlot?.id === timeSlot.id
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div className="text-left">
                    <div className="font-medium">
                      {formatTime(timeSlot.startTime)} - {formatTime(timeSlot.endTime)}
                    </div>
                    <div className="text-sm text-slate-500">
                      1 hora de jogo
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">
                    {formatPrice(timeSlot.price)}
                  </div>
                  <div className="text-xs text-slate-500">
                    por hora
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </Card>

      {/* Selected Summary */}
      {selectedTimeSlot && (
        <Card className="bg-blue-50 border-blue-200 rounded-xl p-4">
          <h4 className="font-bold text-blue-800 mb-2">Horário Selecionado</h4>
          <div className="space-y-1 text-sm text-blue-700">
            <p><strong>Data:</strong> {selectedCalendarDate.toLocaleDateString('pt-BR')}</p>
            <p><strong>Horário:</strong> {formatTime(selectedTimeSlot.startTime)} - {formatTime(selectedTimeSlot.endTime)}</p>
            <p><strong>Valor:</strong> {formatPrice(selectedTimeSlot.price)}</p>
          </div>
        </Card>
      )}
    </div>
  )
}