'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Calendar, Clock, MapPin, Users, Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { StatusBar } from '@/components/layout/StatusBar'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'

interface Team {
  id: string
  name: string
  location: string
  players: number
  rating: number
  avatar?: string
}

interface GameRequest {
  id: string
  team: Team
  preferredDate: string
  preferredTime: string
  location: string
  gameType: 'FRIENDLY' | 'TOURNAMENT'
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED'
}

export default function ScheduleGamePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [availableTeams, setAvailableTeams] = useState<Team[]>([])
  const [gameRequests, setGameRequests] = useState<GameRequest[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGameType, setSelectedGameType] = useState<'FRIENDLY' | 'TOURNAMENT'>('FRIENDLY')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Mock data for available teams
      const mockTeams: Team[] = [
        {
          id: '1',
          name: 'FC Sobral',
          location: 'Centro, Sobral',
          players: 11,
          rating: 4.5
        },
        {
          id: '2',
          name: 'Unidos da Vila',
          location: 'Dom Expedito, Sobral',
          players: 10,
          rating: 4.2
        },
        {
          id: '3',
          name: 'Estrela do Norte',
          location: 'Cidade Dr. José Euclides',
          players: 12,
          rating: 4.7
        }
      ]

      // Mock data for game requests
      const mockRequests: GameRequest[] = [
        {
          id: '1',
          team: mockTeams[0],
          preferredDate: '2024-08-30',
          preferredTime: '19:00',
          location: 'Arena Central',
          gameType: 'FRIENDLY',
          status: 'PENDING'
        }
      ]

      setAvailableTeams(mockTeams)
      setGameRequests(mockRequests)
    } catch (err) {
      setError('Erro ao carregar dados')
      console.error('Error loading data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSendGameRequest = (teamId: string) => {
    // TODO: Implement game request logic
    alert(`Solicitação de jogo enviada para o time!`)
  }

  const filteredTeams = availableTeams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
          <h1 className="text-xl font-bold">Marcar Jogo</h1>
        </div>
        <div className="px-4 py-8">
          <LoadingSpinner size="lg" text="Carregando times disponíveis..." variant="white" />
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
          <h1 className="text-xl font-bold">Marcar Jogo</h1>
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
        <h1 className="text-xl font-bold">Marcar Jogo</h1>
      </div>

      <div className="px-4 pb-8">
        {/* Game Type Selection */}
        <div className="mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedGameType('FRIENDLY')}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition ${
                selectedGameType === 'FRIENDLY'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-slate-700 hover:bg-gray-50'
              }`}
            >
              Jogo Amistoso
            </button>
            <button
              onClick={() => setSelectedGameType('TOURNAMENT')}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition ${
                selectedGameType === 'TOURNAMENT'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-slate-700 hover:bg-gray-50'
              }`}
            >
              Torneio
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar times..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Pending Requests */}
        {gameRequests.length > 0 && (
          <div className="mb-6">
            <h2 className="text-white font-bold mb-3">Solicitações Pendentes</h2>
            <div className="space-y-3">
              {gameRequests.map((request) => (
                <Card key={request.id} className="bg-yellow-50 border-yellow-200">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-slate-800">{request.team.name}</h3>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                        Pendente
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-slate-600 mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(request.preferredDate).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{request.preferredTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{request.location}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 bg-blue-500 hover:bg-blue-600">
                        Aceitar
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        Recusar
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Available Teams */}
        <div>
          <h2 className="text-white font-bold mb-3">Times Disponíveis</h2>
          {filteredTeams.length === 0 ? (
            <Card className="bg-white p-8 text-center">
              <div className="text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Nenhum time encontrado</h3>
                <p className="text-sm">
                  {searchTerm ? 'Tente ajustar sua busca' : 'Não há times disponíveis no momento'}
                </p>
              </div>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredTeams.map((team) => (
                <Card key={team.id} className="bg-white">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-bold text-lg">
                            {team.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-800">{team.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <MapPin className="w-4 h-4" />
                            <span>{team.location}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-1">
                          <span className="text-yellow-500">★</span>
                          <span className="text-sm font-medium">{team.rating}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-slate-600">
                          <Users className="w-4 h-4" />
                          <span>{team.players} jogadores</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleSendGameRequest(team.id)}
                      className="w-full bg-blue-500 hover:bg-blue-600"
                    >
                      Solicitar Jogo
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 pt-6 border-t border-slate-600">
          <div className="flex gap-3">
            <Button
              onClick={() => router.push('/search/teams')}
              variant="outline"
              className="flex-1 bg-white"
            >
              <Search className="w-4 h-4 mr-2" />
              Buscar Times
            </Button>
            <Button
              onClick={() => router.push('/dashboard/team-owner')}
              variant="outline"
              className="flex-1 bg-white"
            >
              Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}