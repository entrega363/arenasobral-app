'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, Calendar, Clock, MapPin, User, Phone, Mail, CreditCard, Home, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { StatusBar } from '@/components/layout/StatusBar'
import { FieldService } from '@/lib/fieldService'
import { Field, Booking } from '@/types'

export function BookingConfirmationScreen() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [field, setField] = useState<Field | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadBookingDetails()
    simulateEmailConfirmation()
  }, [])

  const loadBookingDetails = async () => {
    try {
      setLoading(true)
      setError(null)

      // Get booking data from URL params or localStorage
      const bookingId = searchParams.get('bookingId')
      const bookingData = localStorage.getItem('lastBooking')
      
      if (bookingData) {
        const parsedBooking = JSON.parse(bookingData)
        setBooking(parsedBooking)
        
        // Load field details
        const fieldData = FieldService.getFieldById(parsedBooking.fieldId)
        setField(fieldData)
      } else {
        setError('Reserva não encontrada')
      }
    } catch (err) {
      setError('Erro ao carregar detalhes da reserva')
      console.error('Error loading booking details:', err)
    } finally {
      setLoading(false)
    }
  }

  const simulateEmailConfirmation = () => {
    // Simulate email sending
    console.log('📧 Email de confirmação enviado!')
    console.log('=================================')
    console.log('Para: jogador@exemplo.com')
    console.log('Assunto: Confirmação de Reserva - ArenaSobral')
    console.log('=================================')
    console.log('Olá!')
    console.log('')
    console.log('Sua reserva foi confirmada com sucesso!')
    console.log('')
    console.log('Detalhes da reserva:')
    console.log('- Arena: [Nome da Arena]')
    console.log('- Data: [Data da reserva]')
    console.log('- Horário: [Horário da reserva]')
    console.log('- Valor: R$ [Valor]')
    console.log('')
    console.log('Obrigado por escolher o ArenaSobral!')
    console.log('=================================')
  }

  const generateBookingReference = (bookingId: string) => {
    return `AS${bookingId.toUpperCase().substring(0, 8)}`
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

  const handleViewBookings = () => {
    router.push('/bookings')
  }

  const handleBackToHome = () => {
    router.push('/')
  }

  const handleShareBooking = () => {
    if (!booking || !field) return

    const message = `🏟️ Reserva Confirmada - ArenaSobral\n\n` +
      `📍 ${field.name}\n` +
      `📅 ${new Date(booking.date).toLocaleDateString('pt-BR')}\n` +
      `⏰ ${formatTime(booking.timeSlot.startTime)} - ${formatTime(booking.timeSlot.endTime)}\n` +
      `💰 R$ ${booking.timeSlot.price}\n` +
      `🎫 Ref: ${generateBookingReference(booking.id)}\n\n` +
      `Nos vemos na quadra! ⚽`

    if (navigator.share) {
      navigator.share({
        title: 'Reserva Confirmada - ArenaSobral',
        text: message
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(message).then(() => {
        alert('Detalhes da reserva copiados para a área de transferência!')
      })
    }
  }

  if (loading) {
    return (
      <div className="bg-slate-800 min-h-screen">
        <StatusBar />
        <div className="flex items-center justify-center py-20">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Carregando confirmação...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !booking || !field) {
    return (
      <div className="bg-slate-800 min-h-screen">
        <StatusBar />
        <div className="px-4 py-8">
          <Card className="bg-red-50 border-red-200 p-6 text-center">
            <p className="text-red-600 mb-4">{error || 'Reserva não encontrada'}</p>
            <Button onClick={handleBackToHome} className="bg-red-500 hover:bg-red-600">
              Voltar ao Início
            </Button>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-800 min-h-screen">
      <StatusBar />
      
      <div className="px-4 py-8 space-y-6">
        {/* Success Header */}
        <div className="text-center text-white">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Reserva Confirmada!</h1>
          <p className="text-slate-300">Sua reserva foi realizada com sucesso</p>
        </div>

        {/* Booking Reference */}
        <Card className="bg-green-50 border-green-200 rounded-xl p-4 text-center">
          <div className="text-green-800">
            <FileText className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm font-medium mb-1">Número da Reserva</p>
            <p className="text-2xl font-bold">{generateBookingReference(booking.id)}</p>
            <p className="text-xs mt-1">Guarde este número para consultas</p>
          </div>
        </Card>

        {/* Booking Details */}
        <Card className="bg-white rounded-xl p-4">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Detalhes da Reserva</h2>
          
          <div className="space-y-4">
            {/* Field Info */}
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-slate-800">{field.name}</p>
                <p className="text-sm text-slate-600">{field.address}</p>
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-slate-600">Data</p>
                  <p className="font-medium text-slate-800">
                    {new Date(booking.date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-slate-600">Horário</p>
                  <p className="font-medium text-slate-800">
                    {formatTime(booking.timeSlot.startTime)} - {formatTime(booking.timeSlot.endTime)}
                  </p>
                </div>
              </div>
            </div>

            {/* Player Info */}
            <div className="border-t pt-4">
              <h3 className="font-medium text-slate-800 mb-3">Dados do Jogador</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-700">{booking.playerName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-700">{booking.playerWhatsapp}</span>
                </div>
                {booking.playerEmail && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-700">{booking.playerEmail}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Info */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-slate-600">Forma de Pagamento</p>
                    <p className="font-medium text-slate-800">{formatPaymentMethod(booking.paymentMethod)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-600">Total</p>
                  <p className="text-2xl font-bold text-green-600">R$ {booking.timeSlot.price}</p>
                </div>
              </div>
            </div>

            {/* Notes */}
            {booking.notes && (
              <div className="border-t pt-4">
                <p className="text-sm text-slate-600 mb-1">Observações</p>
                <p className="text-slate-700 bg-gray-50 p-3 rounded-lg">{booking.notes}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Contact Info */}
        <Card className="bg-blue-50 border-blue-200 rounded-xl p-4">
          <h3 className="font-bold text-blue-800 mb-2">Contato da Arena</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-blue-700">
              <Phone className="w-4 h-4" />
              <span>{field.contactInfo.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-blue-700">
              <Phone className="w-4 h-4" />
              <span>{field.contactInfo.whatsapp}</span>
            </div>
            {field.contactInfo.email && (
              <div className="flex items-center gap-2 text-blue-700">
                <Mail className="w-4 h-4" />
                <span>{field.contactInfo.email}</span>
              </div>
            )}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleShareBooking}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3"
          >
            Compartilhar Reserva
          </Button>
          
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleViewBookings}
              variant="outline"
              className="bg-white"
            >
              Minhas Reservas
            </Button>
            <Button
              onClick={handleBackToHome}
              variant="outline"
              className="bg-white"
            >
              <Home className="w-4 h-4 mr-2" />
              Início
            </Button>
          </div>
        </div>

        {/* Email Confirmation Notice */}
        <Card className="bg-yellow-50 border-yellow-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-800 mb-1">Confirmação por Email</p>
              <p className="text-sm text-yellow-700">
                Um email de confirmação foi enviado com todos os detalhes da sua reserva.
                Verifique sua caixa de entrada e spam.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}