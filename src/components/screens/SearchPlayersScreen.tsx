'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Search, User, MapPin, Clock, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { StatusBar } from '@/components/layout/StatusBar'
import { useToast } from '@/hooks/use-toast'

export function SearchPlayersScreen() {
  const router = useRouter()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPosition, setSelectedPosition] = useState('')

  const mockPlayers = [
    {
      id: 1,
      name: 'João Silva',
      age: 25,
      position: 'Atacante',
      location: 'Sobral Centro',
      whatsapp: '(85) 99999-1111',
      experience: '5 anos',
      currentTeam: 'Vila Nove F.C.',
      availability: 'Noite',
      category: 'Racha',
      teamsCount: 2,
      photo: '/api/placeholder/100/100'
    },
    {
      id: 2,
      name: 'Pedro Santos',
      age: 28,
      position: 'Goleiro',
      location: 'Cohab',
      whatsapp: '(85) 99999-2222',
      experience: '7 anos',
      currentTeam: 'Sem time',
      availability: 'Tarde/Noite',
      category: 'Veterano',
      teamsCount: 0,
      photo: '/api/placeholder/100/100'
    },
    {
      id: 3,
      name: 'Carlos Lima',
      age: 30,
      position: 'Zagueiro',
      location: 'Alto da Brasília',
      whatsapp: '(85) 99999-3333',
      experience: '8 anos',
      currentTeam: 'Estrela do Norte',
      availability: 'Final de Semana',
      category: '1Q',
      teamsCount: 1,
      photo: '/api/placeholder/100/100'
    },
    {
      id: 4,
      name: 'Marco Antonio',
      age: 23,
      position: 'Meio-campo',
      location: 'Dom Expedito',
      whatsapp: '(85) 99999-4444',
      experience: '3 anos',
      currentTeam: 'Sem time',
      availability: 'Manhã/Tarde',
      category: 'Sub20',
      teamsCount: 0,
      photo: '/api/placeholder/100/100'
    }
  ]

  const positions = ['Todos', 'Goleiro', 'Zagueiro', 'Meio-campo', 'Atacante']

  const filteredPlayers = mockPlayers.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         player.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPosition = selectedPosition === '' || selectedPosition === 'Todos' || 
                           player.position === selectedPosition
    return matchesSearch && matchesPosition
  })

  const handleContactPlayer = (player: any) => {
    toast({
      title: "Proposta Enviada!",
      description: `Proposta de contrato enviada para ${player.name}. Aguarde a resposta.`,
    })
  }

  const handleWhatsApp = (whatsapp: string) => {
    const cleanPhone = whatsapp.replace(/\D/g, '')
    window.open(`https://wa.me/55${cleanPhone}`, '_blank')
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
        <h1 className="text-xl font-bold">Buscar Jogadores</h1>
      </div>

      {/* Search and Filters */}
      <div className="px-4 mb-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por nome ou localização..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Position Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {positions.map((position) => (
            <button
              key={position}
              onClick={() => setSelectedPosition(position === 'Todos' ? '' : position)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                (selectedPosition === position) || (selectedPosition === '' && position === 'Todos')
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {position}
            </button>
          ))}
        </div>
      </div>
      
      <div className="px-4 pb-8">
        <div className="mb-4">
          <p className="text-white text-sm">
            {filteredPlayers.length} jogador(es) encontrado(s)
          </p>
        </div>

        <div className="space-y-4">
          {filteredPlayers.map((player) => (
            <Card key={player.id} className="card-hover">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Player Photo */}
                  <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-8 h-8 text-gray-600" />
                  </div>

                  {/* Player Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{player.name}</h3>
                        <p className="text-sm text-gray-600">{player.age} anos</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {player.position}
                        </span>
                        {player.teamsCount > 0 && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                            {player.teamsCount} time(s)
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{player.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{player.availability}</span>
                      </div>
                      <p><strong>Experiência:</strong> {player.experience}</p>
                      <p><strong>Time Atual:</strong> {player.currentTeam}</p>
                      <p><strong>Categoria:</strong> {player.category}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleContactPlayer(player)}
                      >
                        Contratar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleWhatsApp(player.whatsapp)}
                        className="flex items-center gap-1"
                      >
                        <Phone className="w-4 h-4" />
                        WhatsApp
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredPlayers.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  Nenhum jogador encontrado
                </h3>
                <p className="text-gray-500">
                  Tente ajustar os filtros de busca ou termo de pesquisa.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}