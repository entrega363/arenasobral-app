'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Clock, Plus, Trash2, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBar } from '@/components/layout/StatusBar'
import { formatCurrency } from '@/lib/utils'

export function FieldScheduleScreen() {
  const router = useRouter()
  const [selectedDay, setSelectedDay] = useState(0)

  const weekDays = [
    'Segunda-feira',
    'Terça-feira', 
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
    'Domingo'
  ]

  const [timeSlots, setTimeSlots] = useState([
    {
      id: 1,
      day: 0, // Segunda
      time: '06:00 - 07:00',
      price: 80,
      available: true
    },
    {
      id: 2,
      day: 0,
      time: '07:00 - 08:00',
      price: 80,
      available: true
    },
    {
      id: 3,
      day: 0,
      time: '18:00 - 19:00',
      price: 120,
      available: false
    },
    {
      id: 4,
      day: 0,
      time: '19:00 - 20:00',
      price: 120,
      available: true
    },
    {
      id: 5,
      day: 1, // Terça
      time: '06:00 - 07:00',
      price: 80,
      available: true
    },
    {
      id: 6,
      day: 1,
      time: '19:00 - 20:00',
      price: 120,
      available: false
    }
  ])

  const filteredSlots = timeSlots.filter(slot => slot.day === selectedDay)

  const handleAddSlot = () => {
    const newSlot = {
      id: Date.now(),
      day: selectedDay,
      time: '00:00 - 01:00',
      price: 100,
      available: true
    }
    setTimeSlots(prev => [...prev, newSlot])
  }

  const handleRemoveSlot = (slotId: number) => {
    setTimeSlots(prev => prev.filter(slot => slot.id !== slotId))
  }

  const toggleAvailability = (slotId: number) => {
    setTimeSlots(prev => 
      prev.map(slot => 
        slot.id === slotId 
          ? { ...slot, available: !slot.available }
          : slot
      )
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
        <h1 className="text-xl font-bold">Gerenciar Horários</h1>
      </div>

      {/* Day Selector */}
      <div className="px-4 mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {weekDays.map((day, index) => (
            <button
              key={index}
              onClick={() => setSelectedDay(index)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                selectedDay === index
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>
      
      <div className="px-4 pb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-lg font-semibold">
            {weekDays[selectedDay]}
          </h2>
          <Button 
            size="sm"
            onClick={handleAddSlot}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Adicionar Horário
          </Button>
        </div>

        <div className="space-y-4">
          {filteredSlots.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  Nenhum horário cadastrado
                </h3>
                <p className="text-gray-500 mb-4">
                  Adicione horários para este dia da semana.
                </p>
                <Button onClick={handleAddSlot}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Primeiro Horário
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredSlots.map((slot) => (
              <Card key={slot.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <div>
                        <h3 className="font-semibold">{slot.time}</h3>
                        <p className="text-sm text-gray-600">
                          {formatCurrency(slot.price)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleAvailability(slot.id)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                          slot.available
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {slot.available ? 'Disponível' : 'Ocupado'}
                      </button>

                      <Button
                        size="sm"
                        variant="outline"
                        className="p-2"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRemoveSlot(slot.id)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Summary */}
        {filteredSlots.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Resumo do Dia</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {filteredSlots.length}
                  </div>
                  <div className="text-sm text-gray-600">Total de Horários</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {filteredSlots.filter(slot => slot.available).length}
                  </div>
                  <div className="text-sm text-gray-600">Disponíveis</div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="text-lg font-semibold text-gray-800">
                  Receita Potencial: {formatCurrency(
                    filteredSlots.reduce((acc, slot) => acc + slot.price, 0)
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}