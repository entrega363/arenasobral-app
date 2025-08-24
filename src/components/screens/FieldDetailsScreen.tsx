'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Star, MapPin, Phone, MessageCircle, Mail, Clock, Users, Wifi, Car, Lightbulb, Droplets } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { StatusBar } from '@/components/layout/StatusBar'
import { BookingCalendar } from '@/components/fields/BookingCalendar'
import { BookingModal } from '@/components/fields/BookingModal'
import { FieldService } from '@/lib/fieldService'
import { Field, TimeSlot, BookingFormData } from '@/types'

interface FieldDetailsScreenProps {
  fieldId: string
}

export function FieldDetailsScreen({ fieldId }: FieldDetailsScreenProps) {
  const router = useRouter()
  const [field, setField] = useState<Field | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0)
  const [showBookingCalendar, setShowBookingCalendar] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot>()
  const [showBookingCalendar, setShowBookingCalendar] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [showBookingCalendar, setShowBookingCalendar] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null)
  const [showBookingModal, setShowBookingModal] = useState(false)

  useEffect(() => {
    loadFieldDetails()
  }, [fieldId])

  const loadFieldDetails = async () => {
    try {
      setLoading(true)
      setError(null)
      const fieldData = FieldService.getFieldById(fieldId)
      
      if (!fieldData) {
        setError('Areninha não encontrada')
        return
      }
      
      setField(fieldData)
    } catch (err) {
      setError('Erro ao carregar detalhes da areninha')
      console.error('Error loading field details:', err)
    } finally {
      setLoading(false)
    }
  }

  const getAmenityIcon = (iconName: string) => {
    const icons = {
      'changing-room': Users,
      'parking': Car,
      'lightbulb': Lightbulb,
      'shower': Droplets,
      'wifi': Wifi,
      'default': Clock
    }
    return icons[iconName as keyof typeof icons] || icons.default
  }

  const formatFieldType = (type: string) => {
    const types = {
      'SOCIETY': 'Society',
      'FUTSAL': 'Futsal', 
      'BEACH': 'Beach Soccer',
      'INDOOR': 'Indoor'
    }
    return types[type as keyof typeof types] || type
  }

  const handleBookingClick = () => {
    // Check if user is logged in
    const currentUser = localStorage.getItem('currentUser')
    if (!currentUser) {
      router.push('/login')
      return
    }
    
    setShowBookingCalendar(true)
  }

  const handleTimeSlotSelect = (date: Date, timeSlot: TimeSlot) => {
    setSelectedDate(date)
    setSelectedTimeSlot(timeSlot)
  }

  const handleBookingConfirm = () => {
    if (!selectedDate || !selectedTimeSlot) return
    setShowBookingModal(true)
  }

  const handleBookingSubmit = async (bookingData: BookingFormData) => {
    if (!selectedDate || !selectedTimeSlot || !field) return

    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
      
      const bookingId = FieldService.createBooking({
        fieldId: field.id,
        timeSlotId: selectedTimeSlot.id,
        playerName: bookingData.playerName,
        playerWhatsapp: bookingData.playerWhatsapp,
        playerEmail: bookingData.playerEmail,
        date: selectedDate,
        status: 'CONFIRMED',
        notes: bookingData.notes,
        paymentMethod: bookingData.paymentMethod
      })

      if (bookingId) {
        setShowBookingModal(false)
        setShowBookingCalendar(false)
        setSelectedDate(null)
        setSelectedTimeSlot(null)
        
        // Show success message
        alert(`Reserva confirmada com sucesso!\n\nID da Reserva: ${bookingId}\nData: ${selectedDate.toLocaleDateString('pt-BR')}\nHorário: ${selectedTimeSlot.startTime} - ${selectedTimeSlot.endTime}\n\nVocê receberá uma confirmação por WhatsApp em breve.`)
      } else {
        alert('Erro ao processar reserva. O horário pode não estar mais disponível.')
      }
    } catch (error) {
      console.error('Error creating booking:', error)
      alert('Erro ao processar reserva. Tente novamente.')
    }
  }

  const handleProceedToBooking = () => {
    if (!selectedDate || !selectedTimeSlot) return
    setShowBookingModal(true)
  }

  const handleCloseBookingModal = () => {
    setShowBookingModal(false)
  }

  const handleBookingConfirm = (bookingData: BookingFormData) => {
    handleBookingSubmit(bookingData)
  }
    setSelectedDate(date)
    setSelectedTimeSlot(timeSlot)
  }

  const handleProceedToBooking = () => {
    if (!selectedDate || !selectedTimeSlot) return
    setShowBookingModal(true)
  }

  const handleBookingConfirm = async (bookingData: BookingFormData) => {
    if (!selectedDate || !selectedTimeSlot || !field) return

    try {
      // Create booking
      const bookingId = FieldService.createBooking({
        fieldId: field.id,
        timeSlotId: selectedTimeSlot.id,
        playerName: bookingData.playerName,
        playerWhatsapp: bookingData.playerWhatsapp,
        playerEmail: bookingData.playerEmail,
        date: selectedDate,
        status: 'CONFIRMED',
        field: field,
        timeSlot: selectedTimeSlot,
        notes: bookingData.notes,
        paymentMethod: bookingData.paymentMethod
      })

      if (bookingId) {
        // Close modals and navigate to confirmation
        setShowBookingModal(false)
        setShowBookingCalendar(false)
        
        // Navigate to confirmation page
        router.push(`/booking/confirmation/${bookingId}`)
        
        // Reset selections
        setSelectedDate(null)
        setSelectedTimeSlot(null)
      } else {
        alert('Erro ao criar reserva. Tente novamente.')
      }
    } catch (error) {
      console.error('Error confirming booking:', error)
      alert('Erro ao confirmar reserva. Tente novamente.')
    }
  }

  const handleCloseBookingModal = () => {
    setShowBookingModal(false)
  }

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
          <h1 className="text-xl font-bold">Detalhes da Areninha</h1>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Carregando detalhes...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !field) {
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
          <h1 className="text-xl font-bold">Detalhes da Areninha</h1>
        </div>
        <div className="px-4 py-8">
          <Card className="bg-red-50 border-red-200 p-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => router.back()} variant="outline">
              Voltar
            </Button>
          </Card>
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
        <h1 className="text-xl font-bold truncate">{field.name}</h1>
      </div>

      <div className="px-4 pb-8 space-y-4">
        {/* Photo Gallery */}
        <Card className="bg-white rounded-xl overflow-hidden">
          <div className="aspect-video bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
            {field.photos.length > 0 ? (
              <div className="text-white text-center">
                <div className="text-2xl font-bold mb-2">ARENA</div>
                <div className="text-sm opacity-80">Foto {selectedPhotoIndex + 1} de {field.photos.length}</div>
              </div>
            ) : (
              <div className="text-white text-center">
                <div className="text-xl font-bold">SEM FOTOS</div>
              </div>
            )}
          </div>
          
          {field.photos.length > 1 && (
            <div className="p-4">
              <div className="flex gap-2 overflow-x-auto">
                {field.photos.map((photo, index) => (
                  <button
                    key={photo.id}
                    onClick={() => setSelectedPhotoIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 transition ${
                      selectedPhotoIndex === index 
                        ? 'border-blue-500' 
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="w-full h-full bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 text-xs font-bold">IMG</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Basic Info */}
        <Card className="bg-white rounded-xl p-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">{field.name}</h2>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-slate-500" />
                <span className="text-slate-600">{field.address}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="font-medium">{field.rating.toFixed(1)}</span>
                  <span className="text-slate-500 text-sm">
                    ({field.reviews.length} avaliação{field.reviews.length !== 1 ? 'ões' : ''})
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">
                R$ {field.pricePerHour}
              </div>
              <div className="text-sm text-slate-500">por hora</div>
              <div className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded mt-1">
                {formatFieldType(field.fieldType)}
              </div>
            </div>
          </div>

          <p className="text-slate-700 leading-relaxed">{field.description}</p>
        </Card>

        {/* Amenities */}
        {field.amenities.length > 0 && (
          <Card className="bg-white rounded-xl p-4">
            <h3 className="text-lg font-bold text-slate-800 mb-3">Comodidades</h3>
            <div className="grid grid-cols-2 gap-3">
              {field.amenities.map((amenity) => {
                const IconComponent = getAmenityIcon(amenity.icon)
                return (
                  <div key={amenity.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                    <IconComponent className="w-5 h-5 text-blue-600" />
                    <span className="text-slate-700">{amenity.name}</span>
                  </div>
                )
              })}
            </div>
          </Card>
        )}

        {/* Rules */}
        {field.rules.length > 0 && (
          <Card className="bg-white rounded-xl p-4">
            <h3 className="text-lg font-bold text-slate-800 mb-3">Regras</h3>
            <ul className="space-y-2">
              {field.rules.map((rule, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-slate-700">{rule}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Contact Info */}
        <Card className="bg-white rounded-xl p-4">
          <h3 className="text-lg font-bold text-slate-800 mb-3">Contato</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-blue-600" />
              <span className="text-slate-700">{field.contactInfo.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <MessageCircle className="w-5 h-5 text-green-600" />
              <span className="text-slate-700">{field.contactInfo.whatsapp}</span>
            </div>
            {field.contactInfo.email && (
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-red-600" />
                <span className="text-slate-700">{field.contactInfo.email}</span>
              </div>
            )}
          </div>
        </Card>

        {/* Reviews */}
        {field.reviews.length > 0 && (
          <Card className="bg-white rounded-xl p-4">
            <h3 className="text-lg font-bold text-slate-800 mb-3">Avaliações</h3>
            <div className="space-y-4">
              {field.reviews.slice(0, 3).map((review) => (
                <div key={review.id} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-sm font-bold">
                        {review.userName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-slate-800">{review.userName}</div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${
                              i < review.rating 
                                ? 'text-yellow-500 fill-current' 
                                : 'text-gray-300'
                            }`} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-700 text-sm">{review.comment}</p>
                </div>
              ))}
              {field.reviews.length > 3 && (
                <div className="text-center">
                  <Button variant="outline" size="sm">
                    Ver todas as avaliações ({field.reviews.length})
                  </Button>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Location Map Placeholder */}
        <Card className="bg-white rounded-xl p-4">
          <h3 className="text-lg font-bold text-slate-800 mb-3">Localização</h3>
          <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MapPin className="w-12 h-12 mx-auto mb-2" />
              <p className="text-sm">Mapa será implementado</p>
              <p className="text-xs">{field.address}</p>
            </div>
          </div>
        </Card>

        {/* Booking Calendar */}
        {showBookingCalendar && (
          <div className="space-y-4">
            <BookingCalendar
              field={field}
              onTimeSlotSelect={handleTimeSlotSelect}
              selectedDate={selectedDate || undefined}
              selectedTimeSlot={selectedTimeSlot || undefined}
            />
            
            {selectedDate && selectedTimeSlot && (
              <div className="flex gap-3">
                <Button 
                  variant="outline"
                  onClick={() => setShowBookingCalendar(false)}
                  className="flex-1"
                >
                  Voltar
                </Button>
                <Button 
                  onClick={handleProceedToBooking}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold"
                >
                  Confirmar Reserva
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Booking Button */}
        {!showBookingCalendar && (
          <div className="sticky bottom-4">
            <Button 
              onClick={handleBookingClick}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 text-lg rounded-xl shadow-lg"
            >
              Reservar Horário
            </Button>
          </div>
        )}

        {/* Booking Modal */}
        {showBookingModal && selectedDate && selectedTimeSlot && (
          <BookingModal
            isOpen={showBookingModal}
            onClose={handleCloseBookingModal}
            field={field}
            selectedDate={selectedDate}
            selectedTimeSlot={selectedTimeSlot}
            onConfirm={handleBookingConfirm}
          />
        )}
      </div>
    </div>
  )
}