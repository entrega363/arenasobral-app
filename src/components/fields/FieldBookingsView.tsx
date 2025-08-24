'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Calendar, Clock, User, Phone, Mail, CheckCircle, AlertCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Field, Booking } from '@/types'

interface FieldBookingsViewProps {
  field: Field
  onBack: () => void
}

export function FieldBookingsView({ field, onBack }: FieldBookingsViewProps) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'pending' | 'cancelled'>('all')

  useEffect(() => {
    loadFieldBookings()
  }, [field.id])

  const loadFieldBookings = async () => {
    try {
      setLoading(true)
      
      // Get all bookings and filter by field
      const allBookings = JSON.parse(localStorage.getItem('arenasobral_bookings') || '[]')
      const fieldBookings = allBookings.filter((booking: Booking) => booking.fieldId === field.id)
      
      // Sort by date (newest first)
      const sortedBookings = fieldBookings.sort((a: Booking, b: Booking) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      
      setBookings(sortedBookings)
    } catch (error) {
      console.error('Error loading field bookings:', error)
    } finally {
      setLoading(false)
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

  const totalRevenue = bookings
    .filter(b => b.status === 'CONFIRMED')
    .reduce((sum, booking) => sum + booking.timeSlot.price, 0)

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="text-white">
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h2 className="text-white text-lg font-bold">Carregando...</h2>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="text-white">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <div>
          <h2 className="text-white text-lg font-bold">{field.name}</h2>
          <p className="text-slate-300 text-sm">Reservas da areninha</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-white p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{bookings.length}</div>
            <div className="text-sm text-slate-600">Total de Reservas</div>
          </div>
        </Card>
        <Card className="bg-white p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">R$ {totalRevenue}</div>
            <div className="text-sm text-slate-600">Receita Total</div>
          </div>
        </Card>
      </div>

      {/* Filter Tabs */}
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

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <Card className="bg-white p-8 text-center">
          <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-slate-800 mb-2">
            {filter === 'all' ? 'Nenhuma reserva encontrada' : `Nenhuma reserva ${getStatusText(filter)}`}
          </h3>
          <p className="text-slate-600">
            {filter === 'all' 
              ? 'Esta areninha ainda não recebeu reservas'
              : `Não há reservas ${getStatusText(filter).toLowerCase()} para esta areninha`
            }
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => {
            const StatusIcon = getStatusIcon(booking.status)
            const statusColor = getStatusColor(booking.status)

            return (
              <Card key={booking.id} className="bg-white p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-slate-500" />
                      <h3 className="font-bold text-slate-800">{booking.playerName}</h3>
                    </div>
                    <div className="space-y-1 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{booking.playerWhatsapp}</span>
                      </div>
                      {booking.playerEmail && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span>{booking.playerEmail}</span>
                        </div>
                      )}
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`https://wa.me/${booking.playerWhatsapp.replace(/\D/g, '')}`, '_blank')}
                      className="flex items-center gap-1"
                    >
                      <Phone className="w-4 h-4" />
                      Contato
                    </Button>
                  </div>
                </div>

                {booking.notes && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-slate-500 mb-1">Observações</p>
                    <p className="text-sm text-slate-700 bg-gray-50 p-2 rounded">{booking.notes}</p>
                  </div>
                )}

                <div className="mt-2 text-xs text-slate-500">
                  Reserva feita em: {new Date(booking.createdAt).toLocaleDateString('pt-BR')} às {new Date(booking.createdAt).toLocaleTimeString('pt-BR')}
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}