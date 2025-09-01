'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Calendar, Clock, MapPin, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBar } from '@/components/layout/StatusBar'
import { supabaseBookingService } from '@/lib/supabase/bookingService'
import { Booking } from '@/types'
import { useAuth } from '@/contexts/AuthContext'

export function SupabaseBookingsScreen() {
  const { user } = useAuth()
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadBookings()
    }
  }, [user])

  const loadBookings = async () => {
    try {
      setLoading(true)
      if (!user) return

      // Get bookings by user ID from Supabase
      const userBookings = await supabaseBookingService.getBookingsByUserId(user.id)
      setBookings(userBookings)
    } catch (error) {
      console.error('Error loading bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'PENDING':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />
      case 'CANCELLED':
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />
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

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (!user) {
    return (
      <div className="bg-slate-800 min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-bold mb-4">Acesso Restrito</h2>
          <p className="mb-4">Você precisa estar logado para visualizar suas reservas.</p>
          <Button onClick={() => router.push('/login')}>Fazer Login</Button>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="bg-slate-800 min-h-screen">
        <StatusBar />
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

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
      
      <div className="px-4 py-6">
        {bookings.length === 0 ? (
          <Card className="bg-white p-8 text-center">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-slate-800 mb-2">Nenhuma reserva encontrada</h3>
            <p className="text-slate-600 mb-4">Você ainda não fez nenhuma reserva.</p>
            <Button onClick={() => router.push('/search/fields')} className="bg-blue-500 hover:bg-blue-600">
              Buscar Areninhas
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Card key={booking.id} className="bg-white">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      {booking.field?.name || 'Arena Desconhecida'}
                    </CardTitle>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusClass(booking.status)}`}>
                      {getStatusText(booking.status)}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(booking.date).toLocaleDateString('pt-BR')}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-slate-600">
                      <Clock className="w-4 h-4" />
                      <span>{booking.timeSlot?.startTime} - {booking.timeSlot?.endTime}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-slate-600">
                      <User className="w-4 h-4" />
                      <span>{booking.user?.name || booking.user?.email || 'Usuário'}</span>
                    </div>
                    
                    <div className="pt-2 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Valor:</span>
                        <span className="font-bold text-green-600">R$ {booking.timeSlot?.price.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      {booking.status === 'PENDING' && (
                        <>
                          <Button 
                            size="sm" 
                            className="flex-1 bg-green-500 hover:bg-green-600"
                            onClick={() => console.log('Confirmar reserva', booking.id)}
                          >
                            Confirmar
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => console.log('Cancelar reserva', booking.id)}
                          >
                            Cancelar
                          </Button>
                        </>
                      )}
                      {booking.status === 'CONFIRMED' && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => console.log('Cancelar reserva', booking.id)}
                        >
                          Cancelar Reserva
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}