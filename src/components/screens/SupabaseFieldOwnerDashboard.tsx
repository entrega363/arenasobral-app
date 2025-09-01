'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, MapPin, Calendar, DollarSign, Users, Clock, TrendingUp, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBar } from '@/components/layout/StatusBar'
import { SupabaseFieldManagement } from '@/components/fields/SupabaseFieldManagement'
import { FieldBookingsView } from '@/components/fields/FieldBookingsView'
import { AdBannerCarousel } from '@/components/ads/AdBannerCarousel'
import { formatCurrency } from '@/lib/utils'
import { Field } from '@/types'
import { useAuth } from '@/contexts/AuthContext'

export function SupabaseFieldOwnerDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState('overview')
  const [selectedField, setSelectedField] = useState<Field | null>(null)
  const [showFieldBookings, setShowFieldBookings] = useState(false)

  const handleUploadClick = () => {
    router.push('/admin/upload-ads')
  }

  const fieldStats = {
    totalBookings: 45,
    weeklyRevenue: 2400,
    occupancyRate: 78,
    nextBooking: '18:00 - Vila Nove F.C.',
    availableSlots: 12
  }

  const todaySchedule = [
    {
      id: 1,
      time: '18:00 - 19:00',
      team: 'Vila Nove F.C.',
      contact: '(85) 99999-1234',
      price: 120,
      status: 'confirmado'
    },
    {
      id: 2,
      time: '19:00 - 20:00',
      team: 'Amigos da Bola',
      contact: '(85) 99999-5678',
      price: 120,
      status: 'confirmado'
    },
    {
      id: 3,
      time: '20:00 - 21:00',
      team: 'Disponível',
      contact: '',
      price: 120,
      status: 'disponivel'
    }
  ]

  const weeklyStats = [
    { day: 'Seg', bookings: 6, revenue: 480 },
    { day: 'Ter', bookings: 8, revenue: 640 },
    { day: 'Qua', bookings: 5, revenue: 400 },
    { day: 'Qui', bookings: 7, revenue: 560 },
    { day: 'Sex', bookings: 9, revenue: 720 },
    { day: 'Sáb', bookings: 10, revenue: 800 },
    { day: 'Dom', bookings: 8, revenue: 640 }
  ]

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: TrendingUp },
    { id: 'fields', label: 'Areninhas', icon: MapPin },
    { id: 'schedule', label: 'Agenda', icon: Calendar },
    { id: 'bookings', label: 'Reservas', icon: Users },
    { id: 'revenue', label: 'Receita', icon: DollarSign }
  ]

  const handleFieldSelect = (field: Field) => {
    setSelectedField(field)
    setShowFieldBookings(true)
  }

  const handleBackToFields = () => {
    setShowFieldBookings(false)
    setSelectedField(null)
  }

  if (!user) {
    return (
      <div className="bg-slate-800 min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-bold mb-4">Acesso Restrito</h2>
          <p className="mb-4">Você precisa estar logado como proprietário de areninha para acessar esta página.</p>
          <Button onClick={() => router.push('/login')}>Fazer Login</Button>
        </Card>
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
        <h1 className="text-xl font-bold">Painel da Areninha</h1>
      </div>

      {/* Ad Banner Carousel */}
      <div className="px-4 mb-6">
        <AdBannerCarousel isAdmin={false} onUpload={handleUploadClick} />
      </div>

      {/* Tabs */}
      <div className="px-4 mb-6">
        <div className="flex space-x-1 bg-white/10 rounded-lg p-1">
          {tabs.map((tab) => {
            const IconComponent = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition ${
                  selectedTab === tab.id
                    ? 'bg-white text-slate-800'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>
      
      <div className="px-4 pb-8">
        {showFieldBookings && selectedField ? (
          <FieldBookingsView 
            field={selectedField} 
            onBack={handleBackToFields}
          />
        ) : selectedTab === 'fields' ? (
          <SupabaseFieldManagement onFieldSelect={handleFieldSelect} />
        ) : selectedTab === 'overview' && (
          <div className="space-y-6">
            {/* Field Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Arena Sobral Centro
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>Localização:</strong> Sobral Centro</p>
                  <p><strong>Próxima Reserva:</strong> {fieldStats.nextBooking}</p>
                  <p><strong>Status:</strong> <span className="text-green-600">Ativo</span></p>
                </div>
              </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-600">{fieldStats.totalBookings}</div>
                  <div className="text-sm text-gray-600">Reservas (mês)</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(fieldStats.weeklyRevenue)}
                  </div>
                  <div className="text-sm text-gray-600">Receita (semana)</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-orange-600">{fieldStats.occupancyRate}%</div>
                  <div className="text-sm text-gray-600">Taxa Ocupação</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-purple-600">{fieldStats.availableSlots}</div>
                  <div className="text-sm text-gray-600">Horários Livres</div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <Button 
                className="h-16 flex flex-col gap-1"
                onClick={() => setSelectedTab('fields')}
              >
                <MapPin className="w-5 h-5" />
                Minhas Areninhas
              </Button>
              <Button 
                variant="outline"
                className="h-16 flex flex-col gap-1"
                onClick={() => setSelectedTab('bookings')}
              >
                <Users className="w-5 h-5" />
                Ver Reservas
              </Button>
            </div>
          </div>
        )}

        {selectedTab === 'schedule' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-white text-lg font-semibold">Agenda de Hoje</h2>
              <Button 
                size="sm"
                onClick={() => router.push('/field/schedule')}
              >
                Gerenciar
              </Button>
            </div>
            
            {todaySchedule.map((slot) => (
              <Card key={slot.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <div>
                        <h3 className="font-semibold">{slot.time}</h3>
                        <p className="text-sm text-gray-600">{slot.team}</p>
                        {slot.contact && (
                          <p className="text-xs text-gray-500">{slot.contact}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-green-600">
                        {formatCurrency(slot.price)}
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        slot.status === 'confirmado' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {slot.status}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {selectedTab === 'bookings' && (
          <div className="space-y-4">
            <h2 className="text-white text-lg font-semibold">Reservas Recentes</h2>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">Vila Nove F.C.</h3>
                    <p className="text-sm text-gray-600">Hoje às 18:00-19:00</p>
                    <p className="text-xs text-gray-500">(85) 99999-1234</p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-green-600">{formatCurrency(120)}</div>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      Pago
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">Amigos da Bola</h3>
                    <p className="text-sm text-gray-600">Hoje às 19:00-20:00</p>
                    <p className="text-xs text-gray-500">(85) 99999-5678</p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-orange-600">{formatCurrency(120)}</div>
                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                      Pendente
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {selectedTab === 'revenue' && (
          <div className="space-y-4">
            <h2 className="text-white text-lg font-semibold">Receita Semanal</h2>
            
            {weeklyStats.map((day, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{day.day}</h3>
                      <p className="text-sm text-gray-600">{day.bookings} reservas</p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-green-600">
                        {formatCurrency(day.revenue)}
                      </div>
                      <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${(day.bookings / 10) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-2">
                    {formatCurrency(weeklyStats.reduce((acc, day) => acc + day.revenue, 0))}
                  </div>
                  <div className="text-sm text-gray-600">Total da Semana</div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}