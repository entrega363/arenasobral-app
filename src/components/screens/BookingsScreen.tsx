'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Calendar, Clock, MapPin, Phone, X, CheckCircle, AlertCircle, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { StatusBar } from '@/components/layout/StatusBar'
import { LoadingSpinner, BookingCardSkeleton } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { FieldService } from '@/lib/fieldService'
import { Booking } from '@/types'

export function BookingsScreen() {
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'pending' | 'cancelled'>('all')
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null)

  useEffect(() => {
    loadUserBookings()
  }, [])

  const loadUserBookings = async () => {
    try {
      setLoading(true)
      setError(null)

      // Check if user is logged in
      const currentUser = localStorage.getItem('currentUser')
      if (!currentUser) {
        router.push('/login')
        return
      }

      const user = JSON.parse(currentUser)
      const userBookings = FieldService.getUserBookings(user.email)
      
      // Sort bookings by date (newest first)
      const sortedBookings = userBookings.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      
      setBookings(sortedBookings)
    } catch (err) {
      setError('Erro ao carregar suas reservas')
      console.error('Error loading user bookings:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelBooking = async (bookingId: string) => {
    try {
      setCancellingBookingId(bookingId)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const success = FieldService.cancelBooking(bookingId)
      
      if (success) {
        // Update local state
        setBookings(prev => 
          prev.map(booking => 
            booking.id === bookingId 
              ? { ...booking, status: 'CANCELLED' as const }
              : booking
          )
        )
        alert('Reserva cancelada com sucesso!')
      } else {
        alert('Erro ao cancelar reserva. Tente novamente.')
      }
    } catch (error) {
      console.error('Error cancelling booking:', error)
      alert('Erro ao cancelar reserva. Tente novamente.')
    } finally {
      setCancellingBookingId(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'CANCELLED':
        return 'text-red-600 bg-red-50 border-red-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return CheckCircle
      case 'PENDING':
        return Clock
      case 'CANCELLED':
        return X
      default:
        return AlertCircle
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'Confirmada'
      case 'PENDING':
        return 'Pendente'
      case 'CANCELLED':
        return 'Cancelada'
      default:
        return status
    }
  }

  const canCancelBooking = (booking: Booking) => {
    if (booking.status !== 'CONFIRMED') return false
    
    const bookingDate = new Date(booking.date)
    const now = new Date()
    
    // Can cancel if booking is in the future
    return bookingDate > now
  }

  const formatTime = (time: string) => {
    return time.substring(0, 5)
  }

  const formatPaymentMethod = (method: string) => {
    const methods = {
      'PIX': 'PIX',
      'CARD': 'Cartão',
      'CASH': 'Dinheiro'
    }
    return methods[method as keyof typeof methods] || method
  }

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true
    return booking.status.toLowerCase() === filter
  })

  const filterOptions = [
    { value: 'all', label: 'Todas', count: bookings.length },
    { value: 'confirmed', label: 'Confirmadas', count: bookings.filter(b => b.status === 'CONFIRMED').length },
    { value: 'pending', label: 'Pendentes', count: bookings.filter(b => b.status === 'PENDING').length },
    { value: 'cancelled', label: 'Canceladas', count: bookings.filter(b => b.status === 'CANCELLED').length }
  ]

  if (loading) {
    return (
      <div className="bg-slate-800 min-h-screen">
        <StatusBar />
        <div className="flex items-center gap-4 px-4 py-4 text-white">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => router.back()}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold">Minhas Reservas</h1>
        </div>
        <div className="px-4 pb-8">
          <div className="mb-6">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex-shrink-0 w-24 h-8 bg-white/10 rounded-full animate-pulse"></div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <BookingCardSkeleton key={i} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <LoadingSpinner size="lg" text="Carregando suas reservas..." variant="white" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-slate-800 min-h-screen">
        <StatusBar />
        <div className="flex items-center gap-4 px-4 py-4 text-white">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => router.back()}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold">Minhas Reservas</h1>
        </div>
        <div className="px-4 py-8">
          <ErrorMessage
            title="Erro ao carregar reservas"
            message={error}
            onRetry={loadUserBookings}
            variant="error"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-800 min-h-screen">
      <StatusBar />
      
      {/* Header */}
      <div className="flex items-center gap-4 px-4 py-4 text-white">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => router.back()}
          className="text-white hover:bg-white/10"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-xl font-bold">Minhas Reservas</h1>
      </div>

      <div className="px-4 pb-8">
        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value as any)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition ${
                  filter === option.value
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-slate-700 hover:bg-gray-50'
                }`}
              >
                {option.label} ({option.count})
              </button>
            ))}
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <Card className="bg-white p-8 text-center">
            <div className="text-gray-500 mb-4">
              <Search className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <h3 className="text-lg font-medium mb-2">
                {filter === 'all' ? 'Nenhuma reserva encontrada' : `Nenhuma reserva ${getStatusText(filter)}`}
              </h3>
              <p className="text-sm">
                {filter === 'all' 
                  ? 'Você ainda não fez nenhuma reserva'
                  : `Você não tem reservas ${getStatusText(filter).toLowerCase()}`
                }
              </p>
            </div>
            {filter === 'all' && (
              <Button 
                onClick={() => router.push('/search/fields')}
                className="bg-blue-500 hover:bg-blue-600"
              >
                Buscar Areninhas
              </Button>
            )}
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const StatusIcon = getStatusIcon(booking.status)
              const statusColor = getStatusColor(booking.status)
              const canCancel = canCancelBooking(booking)
              const isCancelling = cancellingBookingId === booking.id

              return (
                <Card key={booking.id} className="bg-white rounded-xl p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-800 text-lg mb-1">
                        {booking.field.name}
                      </h3>
                      <div className="flex items-center gap-2 text-slate-600 mb-2">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{booking.field.location}</span>
                      </div>
                    </div>
                    <div className={`flex items-center gap-1 px-3 py-1 rounded-full border text-sm font-medium ${statusColor}`}>
                      <StatusIcon className="w-4 h-4" />
                      <span>{getStatusText(booking.status)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="text-xs text-slate-500">Data</p>
                        <p className="font-medium text-slate-800">
                          {new Date(booking.date).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="text-xs text-slate-500">Horário</p>
                        <p className="font-medium text-slate-800">
                          {formatTime(booking.timeSlot.startTime)} - {formatTime(booking.timeSlot.endTime)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-xs text-slate-500">Valor</p>
                        <p className="font-bold text-green-600">R$ {booking.timeSlot.price}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Pagamento</p>
                        <p className="text-sm text-slate-700">{formatPaymentMethod(booking.paymentMethod)}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {/* Contact Button */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`https://wa.me/${booking.field.contactInfo.whatsapp.replace(/\D/g, '')}`, '_blank')}
                        className="flex items-center gap-1"
                      >
                        <Phone className="w-4 h-4" />
                        Contato
                      </Button>

                      {/* Cancel Button */}
                      {canCancel && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelBooking(booking.id)}
                          disabled={isCancelling}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          {isCancelling ? (
                            <div className="flex items-center gap-1">
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600"></div>
                              Cancelando...
                            </div>
                          ) : (
                            <>
                              <X className="w-4 h-4" />
                              Cancelar
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Additional Info */}
                  {booking.notes && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs text-slate-500 mb-1">Observações</p>
                      <p className="text-sm text-slate-700 bg-gray-50 p-2 rounded">{booking.notes}</p>
                    </div>
                  )}
                </Card>
              )
            })}
          </div>
        )}

        {/* Quick Actions */}
        {bookings.length > 0 && (
          <div className="mt-8 pt-6 border-t border-slate-600">
            <div className="flex gap-3">
              <Button
                onClick={() => router.push('/search/fields')}
                className="flex-1 bg-blue-500 hover:bg-blue-600"
              >
                Nova Reserva
              </Button>
              <Button
                onClick={() => router.push('/')}
                variant="outline"
                className="flex-1 bg-white"
              >
                Início
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}