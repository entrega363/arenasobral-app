'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Search, Users, User, Trophy, MapPin, Calendar, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { StatusBar } from '@/components/layout/StatusBar'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { AdBannerCarousel } from '@/components/ads/AdBannerCarousel'

interface Team {
  id: string
  name: string
  location: string
  playersCount: number
  coach: string
  president: string
  championships: string[]
  wins: number
  losses: number
  draws: number
  category: string
  foundedYear: number
  stadium?: string
  description?: string
  rating: number
  logo?: string
}

export default function TeamsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [teams, setTeams] = useState<Team[]>([])
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

      // Mock data for teams
      const mockTeams: Team[] = [
        {
          id: '1',
          name: 'Vila Nove F.C.',
          location: 'Sobral Centro',
          playersCount: 15,
          coach: 'Carlos Mendes',
          president: 'João Silva',
          championships: ['Campeonato Municipal 2023', 'Torneio de Verão 2024'],
          wins: 12,
          losses: 3,
          draws: 2,
          category: 'Racha',
          foundedYear: 2018,
          stadium: 'Campo do Centro',
          description: 'Time tradicional do centro da cidade, sempre em busca de novos talentos.',
          rating: 4.8
        },
        {
          id: '2',
          name: 'Amigos da Bola',
          location: 'Cohab',
          playersCount: 12,
          coach: 'Pedro Santos',
          president: 'Antônio Costa',
          championships: ['Torneio Racha 2023'],
          wins: 8,
          losses: 5,
          draws: 3,
          category: 'Veterano',
          foundedYear: 2015,
          stadium: 'Quadra da Cohab',
          description: 'Time de veteranos que joga por diversão e amizade.',
          rating: 4.5
        },
        {
          id: '3',
          name: 'Estrela do Norte',
          location: 'Alto da Brasília',
          playersCount: 18,
          coach: 'Ricardo Lima',
          president: 'Felipe Oliveira',
          championships: ['Campeonato Sub20 2023', 'Torneio Juvenil 2024'],
          wins: 15,
          losses: 2,
          draws: 1,
          category: 'Sub20',
          foundedYear: 2017,
          stadium: 'Quadra Netifor',
          description: 'Time jovem e competitivo, focado no desenvolvimento de talentos.',
          rating: 4.9
        },
        {
          id: '4',
          name: 'União FC',
          location: 'Sinhá Sabóia',
          playersCount: 14,
          coach: 'Marcos Andrade',
          president: 'Roberto Ferreira',
          championships: [],
          wins: 6,
          losses: 7,
          draws: 4,
          category: '2Q',
          foundedYear: 2020,
          stadium: 'Campo da Sinhá',
          description: 'Time da segunda divisão com grandes ambições.',
          rating: 4.2
        },
        {
          id: '5',
          name: 'Força Jovem',
          location: 'Dom Expedito',
          playersCount: 16,
          coach: 'Thiago Rocha',
          president: 'Paulo Henrique',
          championships: ['Campeonato 1Q 2023'],
          wins: 14,
          losses: 2,
          draws: 2,
          category: '1Q',
          foundedYear: 2019,
          stadium: 'Quadra Dom Expedito',
          description: 'Time da primeira divisão, sempre competindo nos principais torneios.',
          rating: 4.7
        }
      ]

      setTeams(mockTeams)
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

  const filteredTeams = teams.filter(team => {
    const matchesSearch = 
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.coach.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === 'all' || team.category === selectedCategory
    
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
          <h1 className="text-xl font-bold">Times</h1>
        </div>
        <div className="px-4 py-8">
          <LoadingSpinner size="lg" text="Carregando times..." variant="white" />
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
          <h1 className="text-xl font-bold">Times</h1>
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
        <h1 className="text-xl font-bold">Times</h1>
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
              placeholder="Buscar por nome, localização ou técnico..."
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
        
        {/* Teams Count */}
        <div className="mb-4">
          <p className="text-white text-sm">
            {filteredTeams.length} time(s) encontrado(s)
          </p>
        </div>

        {/* Teams List */}
        <div className="space-y-4">
          {filteredTeams.length === 0 ? (
            <Card className="bg-white p-8 text-center">
              <div className="text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Nenhum time encontrado</h3>
                <p className="text-sm">
                  Tente ajustar os filtros de busca ou termo de pesquisa.
                </p>
              </div>
            </Card>
          ) : (
            filteredTeams.map((team) => (
              <Card key={team.id} className="bg-white">
                <div className="p-4">
                  <div className="flex gap-4">
                    {/* Team Logo */}
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    
                    {/* Team Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">{team.name}</h3>
                          <p className="text-sm text-gray-600">{team.location} • {team.category}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{team.rating}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>Jogadores: {team.playersCount}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>Técnico: {team.coach}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>Presidente: {team.president}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Trophy className="w-4 h-4" />
                          <span>Campeonatos: {team.championships.length}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>Fundado em {team.foundedYear}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="flex-1"
                          onClick={() => router.push(`/teams/${team.id}`)}
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