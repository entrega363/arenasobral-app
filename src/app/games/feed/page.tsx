'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Calendar, Clock, MapPin, Users, Trophy, Search, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { StatusBar } from '@/components/layout/StatusBar'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { AdBannerCarousel } from '@/components/ads/AdBannerCarousel'
import { ScoreInput } from '@/components/games/ScoreInput'
import { BestPlayerVoting } from '@/components/games/BestPlayerVoting'
import { BestPlayerDisplay } from '@/components/games/BestPlayerDisplay'
import { Game, Player } from '@/types/game'

export default function GamesFeedPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [games, setGames] = useState<Game[]>([])
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming')
  const [searchTerm, setSearchTerm] = useState('')
  const [editingGameId, setEditingGameId] = useState<string | null>(null)
  const [votingGameId, setVotingGameId] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Mock data for games
      const mockGames: Game[] = [
        {
          id: '1',
          team1: {
            id: '1',
            name: 'Vila Nove F.C.'
          },
          team2: {
            id: '2',
            name: 'Amigos da Bola'
          },
          date: '2024-08-25',
          time: '19:00',
          location: 'Campo do Centro',
          status: 'CONFIRMED',
          type: 'FRIENDLY'
        },
        {
          id: '2',
          team1: {
            id: '3',
            name: 'Estrela do Norte'
          },
          team2: {
            id: '4',
            name: 'União FC'
          },
          date: '2024-08-26',
          time: '15:00',
          location: 'Quadra Netifor',
          status: 'CONFIRMED',
          type: 'TOURNAMENT'
        },
        {
          id: '3',
          team1: {
            id: '5',
            name: 'Força Jovem'
          },
          team2: {
            id: '1',
            name: 'Vila Nove F.C.'
          },
          date: '2024-08-27',
          time: '18:30',
          location: 'Campo da Cohab',
          status: 'PENDING',
          type: 'FRIENDLY'
        },
        {
          id: '4',
          team1: {
            id: '2',
            name: 'Amigos da Bola',
            score: 2
          },
          team2: {
            id: '3',
            name: 'Estrela do Norte',
            score: 1
          },
          date: '2024-08-24',
          time: '20:00',
          location: 'Quadra Netifor',
          status: 'FINISHED',
          type: 'LEAGUE',
          bestPlayer: {
            id: 'player1',
            name: 'João Silva',
            position: 'Atacante',
            teamId: '2',
            teamName: 'Amigos da Bola',
            rating: 4.8
          }
        }
      ]

      setGames(mockGames)
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

  const handleScoreSubmit = (gameId: string, team1Score: number, team2Score: number) => {
    setGames(prevGames => 
      prevGames.map(game => 
        game.id === gameId 
          ? { 
              ...game, 
              team1: { ...game.team1, score: team1Score },
              team2: { ...game.team2, score: team2Score },
              status: 'FINISHED'
            }
          : game
      )
    )
    setEditingGameId(null)
  }

  const handleStartVoting = (gameId: string) => {
    // In a real app, this would set a 10-minute timer
    const votingEndTime = new Date(Date.now() + 10 * 60 * 1000).toISOString()
    
    setGames(prevGames => 
      prevGames.map(game => 
        game.id === gameId 
          ? { ...game, votingEndTime }
          : game
      )
    )
    setVotingGameId(gameId)
  }

  const handleVote = (gameId: string, playerId: string) => {
    // In a real app, this would send the vote to the server
    console.log(`Voted for player ${playerId} in game ${gameId}`)
    
    // For demo purposes, we'll just set a best player
    const game = games.find(g => g.id === gameId)
    if (game) {
      const mockPlayer: Player = {
        id: playerId,
        name: 'João Silva',
        position: 'Atacante',
        teamId: game.team1.id,
        teamName: game.team1.name,
        rating: 4.8
      }
      
      setGames(prevGames => 
        prevGames.map(g => 
          g.id === gameId 
            ? { ...g, bestPlayer: mockPlayer }
            : g
        )
      )
      setVotingGameId(null)
    }
  }

  const filteredGames = games.filter(game => {
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      const matchesTeam1 = game.team1.name.toLowerCase().includes(searchLower)
      const matchesTeam2 = game.team2.name.toLowerCase().includes(searchLower)
      const matchesLocation = game.location.toLowerCase().includes(searchLower)
      const matchesDate = game.date.includes(searchTerm)
      
      if (!matchesTeam1 && !matchesTeam2 && !matchesLocation && !matchesDate) {
        return false
      }
    }
    
    // Apply date filter
    if (filter === 'upcoming') {
      const gameDate = new Date(game.date)
      const today = new Date()
      return gameDate >= today
    }
    if (filter === 'past') {
      const gameDate = new Date(game.date)
      const today = new Date()
      return gameDate < today
    }
    return true
  })

  const getStatusColor = (status: Game['status']) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'CANCELED':
        return 'bg-red-100 text-red-800'
      case 'FINISHED':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: Game['type']) => {
    switch (type) {
      case 'FRIENDLY':
        return 'bg-blue-100 text-blue-800'
      case 'TOURNAMENT':
        return 'bg-purple-100 text-purple-800'
      case 'LEAGUE':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
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
          <h1 className="text-xl font-bold">Feed de Jogos</h1>
        </div>
        <div className="px-4 py-8">
          <LoadingSpinner size="lg" text="Carregando jogos..." variant="white" />
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
          <h1 className="text-xl font-bold">Feed de Jogos</h1>
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
        <h1 className="text-xl font-bold">Feed de Jogos</h1>
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
              placeholder="Buscar por times, local ou data..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Filters */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('upcoming')}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === 'upcoming'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-slate-700 hover:bg-gray-50'
              }`}
            >
              Próximos
            </button>
            <button
              onClick={() => setFilter('past')}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === 'past'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-slate-700 hover:bg-gray-50'
              }`}
            >
              Passados
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-slate-700 hover:bg-gray-50'
              }`}
            >
              Todos
            </button>
          </div>
        </div>

        {/* Games List */}
        <div>
          {filteredGames.length === 0 ? (
            <Card className="bg-white p-8 text-center">
              <div className="text-gray-500">
                <Trophy className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Nenhum jogo encontrado</h3>
                <p className="text-sm">
                  {filter === 'upcoming' 
                    ? 'Não há jogos programados no momento' 
                    : filter === 'past' 
                      ? 'Não há jogos passados registrados' 
                      : 'Não há jogos registrados'}
                </p>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredGames.map((game) => (
                <div key={game.id}>
                  {/* Best Player Display */}
                  {game.bestPlayer && (
                    <BestPlayerDisplay 
                      player={game.bestPlayer}
                      gameId={game.id}
                      gameInfo={`${game.team1.name} ${game.team1.score || 0} x ${game.team2.score || 0} ${game.team2.name}`}
                    />
                  )}
                  
                  <Card className="bg-white">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(game.status)}`}>
                            {game.status === 'CONFIRMED' && 'Confirmado'}
                            {game.status === 'PENDING' && 'Pendente'}
                            {game.status === 'CANCELED' && 'Cancelado'}
                            {game.status === 'FINISHED' && 'Finalizado'}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(game.type)}`}>
                            {game.type === 'FRIENDLY' && 'Amistoso'}
                            {game.type === 'TOURNAMENT' && 'Torneio'}
                            {game.type === 'LEAGUE' && 'Liga'}
                          </span>
                        </div>
                        
                        {game.status === 'CONFIRMED' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setEditingGameId(game.id)}
                          >
                            Registrar Placar
                          </Button>
                        )}
                      </div>
                      
                      {/* Score Input Form */}
                      {editingGameId === game.id && (
                        <ScoreInput
                          team1Name={game.team1.name}
                          team2Name={game.team2.name}
                          onScoreSubmit={(team1Score, team2Score) => 
                            handleScoreSubmit(game.id, team1Score, team2Score)
                          }
                          onCancel={() => setEditingGameId(null)}
                        />
                      )}
                      
                      {/* Best Player Voting */}
                      {game.status === 'FINISHED' && !game.bestPlayer && votingGameId === game.id && (
                        <BestPlayerVoting
                          gameId={game.id}
                          players={[
                            {
                              id: 'player1',
                              name: 'João Silva',
                              position: 'Atacante',
                              teamId: game.team1.id,
                              teamName: game.team1.name,
                              rating: 4.8
                            },
                            {
                              id: 'player2',
                              name: 'Pedro Santos',
                              position: 'Meio-campo',
                              teamId: game.team1.id,
                              teamName: game.team1.name,
                              rating: 4.6
                            },
                            {
                              id: 'player3',
                              name: 'Carlos Lima',
                              position: 'Zagueiro',
                              teamId: game.team2.id,
                              teamName: game.team2.name,
                              rating: 4.7
                            },
                            {
                              id: 'player4',
                              name: 'Felipe Costa',
                              position: 'Goleiro',
                              teamId: game.team2.id,
                              teamName: game.team2.name,
                              rating: 4.9
                            }
                          ]}
                          onVote={(playerId) => handleVote(game.id, playerId)}
                          isVotingActive={true}
                        />
                      )}
                      
                      {/* Start Voting Button */}
                      {game.status === 'FINISHED' && !game.bestPlayer && !votingGameId && (
                        <Button 
                          size="sm" 
                          className="mb-4"
                          onClick={() => handleStartVoting(game.id)}
                        >
                          <Star className="w-4 h-4 mr-2" />
                          Iniciar Votação do Melhor Jogador
                        </Button>
                      )}
                      
                      <div className="text-center mb-4">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <span className="font-bold text-slate-800">{game.team1.name}</span>
                          <span className="text-slate-500">
                            {game.team1.score !== undefined ? game.team1.score : '?'}
                          </span>
                          <span className="text-slate-500">vs</span>
                          <span className="text-slate-500">
                            {game.team2.score !== undefined ? game.team2.score : '?'}
                          </span>
                          <span className="font-bold text-slate-800">{game.team2.name}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(game.date).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{game.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{game.location}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}