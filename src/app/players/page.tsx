'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Search, User, MapPin, Phone, Mail, Calendar, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { StatusBar } from '@/components/layout/StatusBar'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { AdBannerCarousel } from '@/components/ads/AdBannerCarousel'

interface Player {
  id: string
  name: string
  age: number
  position: string
  location: string
  phoneNumber: string
  email: string
  experience: string
  teamsCount: number
  rating: number
  avatar?: string
  availability: string
  category: string
  currentTeam?: string
}

export default function PlayersPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [players, setPlayers] = useState<Player[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Mock data for players
      const mockPlayers: Player[] = [
        {
          id: '1',
          name: 'João Silva',
          age: 25,
          position: 'Atacante',
          location: 'Sobral Centro',
          phoneNumber: '(85) 99999-1111',
          email: 'joao.silva@email.com',
          experience: '5 anos',
          teamsCount: 2,
          rating: 4.8,
          availability: 'Noite',
          category: 'Racha',
          currentTeam: 'Vila Nove F.C.'
        },
        {
          id: '2',
          name: 'Pedro Santos',
          age: 28,
          position: 'Goleiro',
          location: 'Cohab',
          phoneNumber: '(85) 99999-2222',
          email: 'pedro.santos@email.com',
          experience: '7 anos',
          teamsCount: 0,
          rating: 4.9,
          availability: 'Tarde/Noite',
          category: 'Veterano',
          currentTeam: 'Sem time'
        },
        {
          id: '3',
          name: 'Carlos Lima',
          age: 30,
          position: 'Zagueiro',
          location: 'Alto da Brasília',
          phoneNumber: '(85) 99999-3333',
          email: 'carlos.lima@email.com',
          experience: '8 anos',
          teamsCount: 1,
          rating: 4.7,
          availability: 'Final de Semana',
          category: '1Q',
          currentTeam: 'Estrela do Norte'
        },
        {
          id: '4',
          name: 'Marco Antonio',
          age: 23,
          position: 'Meio-campo',
          location: 'Dom Expedito',
          phoneNumber: '(85) 99999-4444',
          email: 'marco.antonio@email.com',
          experience: '3 anos',
          teamsCount: 0,
          rating: 4.5,
          availability: 'Manhã/Tarde',
          category: 'Sub20',
          currentTeam: 'Sem time'
        },
        {
          id: '5',
          name: 'Felipe Costa',
          age: 26,
          position: 'Atacante',
          location: 'Centro',
          phoneNumber: '(85) 99999-5555',
          email: 'felipe.costa@email.com',
          experience: '4 anos',
          teamsCount: 1,
          rating: 4.6,
          availability: 'Noite',
          category: '2Q',
          currentTeam: 'União FC'
        }
      ]

      setPlayers(mockPlayers)
    } catch (err) {
      setError('Erro ao carregar dados')
      console.error('Error loading data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleUploadClick = () => {
    router.push('/admin/upload-ads')
  }

  const filteredPlayers = players.filter(player => {
    const matchesSearch = 
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.category.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === 'all' || player.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const categories = ['all', 'Racha', 'Veterano', 'Sub20', '2Q', '1Q']

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
          <h1 className="text-xl font-bold">Jogadores</h1>
        </div>
        <div className="px-4 py-8">
          <LoadingSpinner size="lg" text="Carregando jogadores..." variant="white" />
        </div>
      </div>
    )
  }

  if (error) {
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
          <h1 className="text-xl font-bold">Jogadores</h1>
        </div>
        <div className="px-4 py-8">
          <ErrorMessage
            title="Erro ao carregar"
            message={error}
            onRetry={loadData}
          />
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
        <h1 className="text-xl font-bold">Jogadores</h1>
      </div>

      <div className="px-4 pb-8">
        {/* Ad Banner Carousel */}
        <div className="mb-6">
          <AdBannerCarousel isAdmin={false} onUpload={handleUploadClick} />
        </div>
        
        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nome, posição ou localização..."
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
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                  selectedCategory === category
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category === 'all' ? 'Todas' : category}
              </button>
            ))}
          </div>
        </div>
        
        {/* Players Count */}
        <div className="mb-4">
          <p className="text-white text-sm">
            {filteredPlayers.length} jogador(es) encontrado(s)
          </p>
        </div>

        {/* Players List */}
        <div className="space-y-4">
          {filteredPlayers.length === 0 ? (
            <Card className="bg-white p-8 text-center">
              <div className="text-gray-500">
                <User className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Nenhum jogador encontrado</h3>
                <p className="text-sm">
                  Tente ajustar os filtros de busca ou termo de pesquisa.
                </p>
              </div>
            </Card>
          ) : (
            filteredPlayers.map((player) => (
              <Card key={player.id} className="bg-white">
                <div className="p-4">
                  <div className="flex gap-4">
                    {/* Player Avatar */}
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    
                    {/* Player Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">{player.name}</h3>
                          <p className="text-sm text-gray-600">{player.age} anos • {player.position}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{player.rating}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{player.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>Disponibilidade: {player.availability}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {player.category}
                          </span>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            {player.currentTeam || 'Sem time'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="flex-1"
                          onClick={() => router.push(`/players/${player.id}`)}
                        >
                          Ver Perfil
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}