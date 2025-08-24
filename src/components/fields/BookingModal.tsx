'use client'

import { useState } from 'react'
import { X, Calendar, Clock, MapPin, CreditCard, Smartphone, Banknote } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Field, TimeSlot, BookingFormData } from '@/types'

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  field: Field
  selectedDate: Date
  selectedTimeSlot: TimeSlot
  onConfirm: (bookingData: BookingFormData) => void
}

export function BookingModal({
  isOpen,
  onClose,
  field,
  selectedDate,
  selectedTimeSlot,
  onConfirm
}: BookingModalProps) {
  const [formData, setFormData] = useState<BookingFormData>({
    playerName: '',
    playerWhatsapp: '',
    playerEmail: '',
    notes: '',
    paymentMethod: 'PIX'
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  if (!isOpen) return null

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.playerName.trim()) {
      newErrors.playerName = 'Nome é obrigatório'
    }

    if (!formData.playerWhatsapp.trim()) {
      newErrors.playerWhatsapp = 'WhatsApp é obrigatório'
    } else if (!/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(formData.playerWhatsapp)) {
      newErrors.playerWhatsapp = 'Formato: (88) 99999-9999'
    }

    if (formData.playerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.playerEmail)) {
      newErrors.playerEmail = 'Email inválido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof BookingFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleWhatsAppChange = (value: string) => {
    // Auto-format WhatsApp number
    let formatted = value.replace(/\D/g, '')
    if (formatted.length >= 11) {
      formatted = formatted.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    } else if (formatted.length >= 7) {
      formatted = formatted.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3')
    } else if (formatted.length >= 3) {
      formatted = formatted.replace(/(\d{2})(\d{0,5})/, '($1) $2')
    }
    handleInputChange('playerWhatsapp', formatted)
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      onConfirm(formData)
    } catch (error) {
      console.error('Error creating booking:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (time: string) => {
    return time.substring(0, 5)
  }

  const paymentMethods = [
    { value: 'PIX', label: 'PIX', icon: Smartphone, description: 'Pagamento instantâneo' },
    { value: 'CARD', label: 'Cartão', icon: CreditCard, description: 'Débito ou crédito' },
    { value: 'CASH', label: 'Dinheiro', icon: Banknote, description: 'Pagamento no local' }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-white rounded-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-slate-800">Confirmar Reserva</h2>
          <Button variant="ghost" size="icon" onClick={onClose} disabled={loading}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-4 space-y-6">
          {/* Booking Summary */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-bold text-blue-800 mb-3">Resumo da Reserva</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-blue-700">
                <MapPin className="w-4 h-4" />
                <span>{field.name}</span>
              </div>
              <div className="flex items-center gap-2 text-blue-700">
                <Calendar className="w-4 h-4" />
                <span>{selectedDate.toLocaleDateString('pt-BR')}</span>
              </div>
              <div className="flex items-center gap-2 text-blue-700">
                <Clock className="w-4 h-4" />
                <span>{formatTime(selectedTimeSlot.startTime)} - {formatTime(selectedTimeSlot.endTime)}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-blue-200">
                <span className="font-medium text-blue-800">Total:</span>
                <span className="font-bold text-blue-800 text-lg">R$ {selectedTimeSlot.price}</span>
              </div>
            </div>
          </div>

          {/* Player Information */}
          <div>
            <h3 className="font-bold text-slate-800 mb-3">Seus Dados</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  value={formData.playerName}
                  onChange={(e) => handleInputChange('playerName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.playerName ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="Digite seu nome completo"
                  disabled={loading}
                />
                {errors.playerName && (
                  <p className="text-red-500 text-xs mt-1">{errors.playerName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  WhatsApp *
                </label>
                <input
                  type="text"
                  value={formData.playerWhatsapp}
                  onChange={(e) => handleWhatsAppChange(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.playerWhatsapp ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="(88) 99999-9999"
                  maxLength={15}
                  disabled={loading}
                />
                {errors.playerWhatsapp && (
                  <p className="text-red-500 text-xs mt-1">{errors.playerWhatsapp}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email (opcional)
                </label>
                <input
                  type="email"
                  value={formData.playerEmail}
                  onChange={(e) => handleInputChange('playerEmail', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.playerEmail ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="seu.email@exemplo.com"
                  disabled={loading}
                />
                {errors.playerEmail && (
                  <p className="text-red-500 text-xs mt-1">{errors.playerEmail}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Observações (opcional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Alguma observação especial..."
                  rows={3}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <h3 className="font-bold text-slate-800 mb-3">Forma de Pagamento</h3>
            <div className="space-y-2">
              {paymentMethods.map((method) => {
                const IconComponent = method.icon
                return (
                  <label
                    key={method.value}
                    className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition ${
                      formData.paymentMethod === method.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.value}
                      checked={formData.paymentMethod === method.value}
                      onChange={(e) => handleInputChange('paymentMethod', e.target.value as any)}
                      className="sr-only"
                      disabled={loading}
                    />
                    <IconComponent className="w-5 h-5" />
                    <div>
                      <div className="font-medium">{method.label}</div>
                      <div className="text-sm opacity-75">{method.description}</div>
                    </div>
                  </label>
                )
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1 bg-blue-500 hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Confirmando...
              </div>
            ) : (
              'Confirmar Reserva'
            )}
          </Button>
        </div>
      </Card>
    </div>
  )
}