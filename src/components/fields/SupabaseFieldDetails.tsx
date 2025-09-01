'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  MapPin, 
  Star, 
  Clock, 
  Users, 
  Phone, 
  MessageCircle, 
  Calendar,
  ChevronLeft,
  Check,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { supabaseFieldService } from '@/lib/supabase/fieldService'
import { supabaseBookingService } from '@/lib/supabase/bookingService'
import { supabaseReviewService } from '@/lib/supabase/reviewService'
import { SupabaseField, SupabaseReview, SupabaseBooking, Field } from '@/types'
import { formatCurrency, formatSupabaseDate, formatSupabaseTime } from '@/lib/supabase/format'
import { useAuth } from '@/contexts/AuthContext'

interface FieldDetailsProps {
  fieldId: string
}

export function SupabaseFieldDetails({ fieldId }: FieldDetailsProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [field, setField] = useState<SupabaseField | null>(null)
  const [reviews, setReviews] = useState<SupabaseReview[]>([])
  const [bookings, setBookings] = useState<SupabaseBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)

  useEffect(() => {
    loadFieldData()
  }, [fieldId])

  const loadFieldData = async () => {
    try {
      setLoading(true)
      
      // Carregar dados do campo
      const fieldData = await supabaseFieldService.getFieldById(fieldId)
      if (fieldData) {
        // Converter Field para SupabaseField
        const supabaseField: SupabaseField = {
          id: fieldData.id,
          name: fieldData.name,
          location: fieldData.location,
          address: fieldData.address || fieldData.location,
          description: fieldData.description || '',
          field_type: fieldData.fieldType === 'FUTSAL' ? 'GRASS' : 
                     fieldData.fieldType === 'BEACH' ? 'GRASS' : 
                     fieldData.fieldType === 'INDOOR' ? 'CONCRETE' : 'SOCIETY',
          price_per_hour: fieldData.pricePerHour || 0,
          rating: fieldData.rating || 0,
          owner_id: fieldData.ownerId,
          created_at: new Date().toISOString(),
          ...(fieldData.photos && { photos: fieldData.photos }),
          ...(fieldData.amenities && { amenities: fieldData.amenities }),
          ...(fieldData.rules && { rules: fieldData.rules }),
          ...(fieldData.contactInfo && { contact_info: fieldData.contactInfo })
        }
        setField(supabaseField)
      }
      
      // Carregar avaliações
      const reviewData = await supabaseReviewService.getReviewsByFieldId(fieldId)
      setReviews(reviewData)
      
      // Carregar reservas para a data selecionada
      const bookingData = await supabaseBookingService.getBookingsByFieldId(fieldId)
      // Converter Booking[] para SupabaseBooking[]
      const supabaseBookings: SupabaseBooking[] = bookingData.map(booking => ({
        id: booking.id,
        field_id: booking.fieldId,
        user_id: booking.teamId || '', // Ajustar conforme necessário
        time_slot_id: booking.timeSlotId,
        date: booking.date.toISOString().split('T')[0],
        status: booking.status,
        payment_status: 'PENDING', // Valor padrão
        total_amount: 0, // Valor padrão
        created_at: booking.createdAt.toISOString()
      }))
      setBookings(supabaseBookings)
    } catch (error) {
      console.error('Error loading field data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReserve = async () => {
    if (!user) {
      alert('Você precisa estar logado para fazer uma reserva')
      router.push('/login')
      return
    }

    if (!selectedTimeSlot) {
      alert('Por favor, selecione um horário')
      return
    }

    try {
      // Criar reserva
      const bookingData = {
        field_id: fieldId,
        user_id: user.id,
        time_slot_id: selectedTimeSlot,
        date: selectedDate,
        status: 'PENDING',
        payment_status: 'PENDING',
        total_amount: field?.price_per_hour || 0
      }

      const result = await supabaseBookingService.createBooking(bookingData)
      
      if (result) {
        alert('Reserva realizada com sucesso!')
        router.push('/bookings')
      } else {
        throw new Error('Failed to create booking')
      }
    } catch (error) {
      console.error('Error creating booking:', error)
      alert('Erro ao realizar reserva')
    }
  }

  const generateTimeSlots = () => {
    const slots = []
    for (let hour = 8; hour <= 22; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00`
      const isBooked = bookings.some(booking => 
        booking.date === selectedDate && 
        booking.time_slot_id === time
      )
      
      slots.push({
        time,
        isBooked
      })
    }
    return slots
  }

  if (loading) {
    return (
      <div className="bg-slate-800 min-h-screen">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  if (!field) {
    return (
      <div className="bg-slate-800 min-h-screen">
        <div className="px-4 py-6">
          <Card className="bg-white p-8 text-center">
            <h3 className="text-lg font-medium text-slate-800 mb-2">Campo não encontrado</h3>
            <p className="text-slate-600 mb-4">O campo que você está procurando não existe ou foi removido.</p>
            <Button onClick={() => router.back()}>Voltar</Button>
          </Card>
        </div>
      </div>
    )
  }

  const timeSlots = generateTimeSlots()

  return (
    <div className="bg-slate-800 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 px-4 py-4 text-white">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => router.back()}
          className="text-white hover:bg-white/10"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-xl font-bold">Detalhes da Areninha</h1>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Informações do Campo */}
        <Card className="bg-white">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <h2 className="font-bold text-slate-800 text-xl">{field.name}</h2>
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <span className="font-medium">{field.rating.toFixed(1)}</span>
                <span className="text-sm text-slate-500">({reviews.length} avaliações)</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="w-4 h-4" />
                <span>{field.location}</span>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{field.field_type}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>8x8</span>
                </div>
              </div>
              
              <div className="pt-2 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-green-600 text-lg">{formatCurrency(field.price_per_hour)}/hora</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contato */}
        <Card className="bg-white">
          <CardHeader>
            <h3 className="font-bold text-slate-800">Contato</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="outline" className="w-full flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>(88) 99999-0000</span>
              </Button>
              <Button variant="outline" className="w-full flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                <span>Enviar Mensagem</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Horários Disponíveis */}
        <Card className="bg-white">
          <CardHeader>
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Reservar Horário
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-slate-600 text-sm mb-2 block">Data</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="text-slate-600 text-sm mb-2 block">Horários Disponíveis</label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((slot) => (
                    <Button
                      key={slot.time}
                      variant={selectedTimeSlot === slot.time ? "default" : "outline"}
                      className={`h-12 ${slot.isBooked ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={() => !slot.isBooked && setSelectedTimeSlot(slot.time)}
                      disabled={slot.isBooked}
                    >
                      {slot.isBooked ? (
                        <div className="flex items-center gap-1">
                          <X className="w-4 h-4" />
                          <span>{formatSupabaseTime(slot.time)}</span>
                        </div>
                      ) : selectedTimeSlot === slot.time ? (
                        <div className="flex items-center gap-1">
                          <Check className="w-4 h-4" />
                          <span>{formatSupabaseTime(slot.time)}</span>
                        </div>
                      ) : (
                        formatSupabaseTime(slot.time)
                      )}
                    </Button>
                  ))}
                </div>
              </div>
              
              <Button 
                className="w-full bg-blue-500 hover:bg-blue-600"
                onClick={handleReserve}
                disabled={!selectedTimeSlot}
              >
                Reservar Agora
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Avaliações */}
        <Card className="bg-white">
          <CardHeader>
            <h3 className="font-bold text-slate-800">Avaliações ({reviews.length})</h3>
          </CardHeader>
          <CardContent>
            {reviews.length === 0 ? (
              <p className="text-slate-500 text-center py-4">Nenhuma avaliação ainda. Seja o primeiro a avaliar!</p>
            ) : (
              <div className="space-y-4">
                {reviews.slice(0, 3).map((review) => (
                  <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-slate-800">Usuário Anônimo</h4>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-slate-500">
                        {formatSupabaseDate(review.created_at)}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="text-slate-600 text-sm">{review.comment}</p>
                    )}
                  </div>
                ))}
                {reviews.length > 3 && (
                  <Button variant="link" className="w-full">
                    Ver todas as avaliações
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}