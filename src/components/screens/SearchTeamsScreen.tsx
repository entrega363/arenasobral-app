'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Search, Users, MapPin, Phone, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { StatusBar } from '@/components/layout/StatusBar'
import { useToast } from '@/hooks/use-toast'

export function SearchTeamsScreen() {
  const router = useRouter()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  const mockTeams = [
    {
      id: 1,
      name: 'Vila Nove F.C.',
      location: 'Sobral Centro',
      players: 15,
      captain: 'João Silva',
      whatsapp: '(85) 99999-1234',
      category: 'Racha',
      description: 'Time tradicional do centro da cidade, sempre em busca de novos talentos.'
    },
    {
      id: 2,
      name: 'Amigos da Bola',
      location: 'Cohab',
      players: 12,
      captain: 'Pedro Santos',
      whatsapp: '(85) 99999-5678',
      category: 'Veterano',
      description: 'Time de veteranos que joga por diversão e amizade.'
    },
    {
      id: 3,
      name: 'Estrela do Norte',
      location: 'Alto da Brasília',
      players: 18,
      captain: 'Carlos Lima',
      whatsapp: '(85) 99999-9012',
      category: 'Sub20',
      description: 'Time jovem e competitivo, focado no desenvolvimento de talentos.'
    },
    {
      id: 4,
      name: 'União FC',
      location: 'Sinhá Sabóia',
      players: 14,
      captain: 'Antonio Costa',
      whatsapp: '(85) 99999-3456',
      category: '2Q',
      description: 'Time da segunda divisão com grandes ambições.'
    },
    {
      id: 5,
      name: 'Força Jovem',
      location: 'Dom Expedito',
      players: 16,
      captain: 'Rafael Mendes',
      whatsapp: '(85) 99999-7890',
      category: '1Q',
      description: 'Time da primeira divisão, sempre competindo nos principais torneios.'
    }
  ]

  const categories = ['Todas', 'Racha', 'Veterano', 'Sub20', '1Q', '2Q']

  const filteredTeams = mockTeams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         team.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === '' || selectedCategory === 'Todas' || 
                           team.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleJoinRequest = (team: any) => {
    toast({
      title: "Solicitação Enviada!",
      description: `Solicitação de entrada enviada para ${team.name}. Aguarde a resposta do time.`,
    })
  }

  const handleWhatsApp = (whatsapp: string) => {
    const cleanPhone = whatsapp.replace(/\D/g, '')
    window.open(`https://wa.me/55${cleanPhone}`, '_blank')
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      'Racha': 'bg-blue-100 text-blue-800',
      'Veterano': 'bg-purple-100 text-purple-800',
      'Sub20': 'bg-green-100 text-green-800',
      '1Q': 'bg-yellow-100 text-yellow-800',
      '2Q': 'bg-orange-100 text-orange-800'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'
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
        <h1 className="text-xl font-bold">Buscar Times</h1>
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

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category === 'Todas' ? '' : category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                (selectedCategory === category) || (selectedCategory === '' && category === 'Todas')
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      <div className="px-4 pb-8">
        <div className="mb-4">
          <p className="text-white text-sm">
            {filteredTeams.length} time(s) encontrado(s)
          </p>
        </div>

        <div className="space-y-4">
          {filteredTeams.map((team) => (
            <Card key={team.id} className="card-hover">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Team Logo/Icon */}
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-8 h-8 text-white" />
                  </div>

                  {/* Team Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{team.name}</h3>
                        <p className="text-sm text-gray-600">{team.players} jogadores</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${getCategoryColor(team.category)}`}>
                        {team.category}
                      </span>
                    </div>

                    <div className="space-y-1 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{team.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>Capitão: {team.captain}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {team.description}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleJoinRequest(team)}
                      >
                        Solicitar Entrada
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleWhatsApp(team.whatsapp)}
                        className="flex items-center gap-1"
                      >
                        <Phone className="w-4 h-4" />
                        Contato
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredTeams.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  Nenhum time encontrado
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