'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Users, 
  User, 
  Trophy, 
  MapPin, 
  Calendar, 
  Star, 
  Award, 
  Target, 
  Flag,
  Clock,
  CheckCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { StatusBar } from '@/components/layout/StatusBar'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'

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
  players: Player[]
  recentGames: Game[]
}

interface Player {
  id: string
  name: string
  position: string
  age: number
}

interface Game {
  id: string
  opponent: string
  date: string
  result: 'win' | 'loss' | 'draw'
  score: string
}

export default function TeamProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [team, setTeam] = useState<Team | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))

      // Mock data for team profile
      const mockTeam: Team = {
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
        description: 'Time tradicional do centro da cidade, sempre em busca de novos talentos. Fundado em 2018, o Vila Nove F.C. cresceu para se tornar um dos times mais respeitados do cenário amador de Sobral.',
        rating: 4.8,
        players: [
          { id: '1', name: 'Carlos Mendes', position: 'Técnico', age: 35 },
          { id: '2', name: 'João Silva', position: 'Goleiro', age: 28 },
          { id: '3', name: 'Pedro Santos', position: 'Zagueiro', age: 30 },
          { id: '4', name: 'Felipe Costa', position: 'Zagueiro', age: 26 },
          { id: '5', name: 'Antônio Oliveira', position: 'Lateral', age: 27 },
          { id: '6', name: 'Ricardo Lima', position: 'Volante', age: 29 },
          { id: '7', name: 'Thiago Rocha', position: 'Meio-campo', age: 25 },
          { id: '8', name: 'Marcos Andrade', position: 'Meio-campo', age: 26 },
          { id: '9', name: 'Paulo Henrique', position: 'Meio-campo', age: 24 },
          { id: '10', name: 'Roberto Ferreira', position: 'Atacante', age: 27 },
          { id: '11', name: 'Carlos Eduardo', position: 'Atacante', age: 25 },
          { id: '12', name: 'Fernando Souza', position: 'Atacante', age: 23 },
          { id: '13', name: 'Diego Martins', position: 'Reserva', age: 22 },
          { id: '14', name: 'André Luiz', position: 'Reserva', age: 24 },
          { id: '15', name: 'Bruno Alves', position: 'Reserva', age: 26 }
        ],
        recentGames: [
          { id: '1', opponent: 'Amigos da Bola', date: '20/08/2025', result: 'win', score: '3-1' },
          { id: '2', opponent: 'Estrela do Norte', date: '15/08/2025', result: 'draw', score: '2-2' },
          { id: '3', opponent: 'União FC', date: '10/08/2025', result: 'win', score: '2-0' },
          { id: '4', opponent: 'Força Jovem', date: '05/08/2025', result: 'loss', score: '1-2' },
          { id: '5', opponent: 'Campeões do Norte', date: '01/08/2025', result: 'win', score: '4-1' }
        ]
      }

      setTeam(mockTeam)
    } catch (err) {
      setError('Erro ao carregar dados do time')
      console.error('Error loading team data:', err)
    } finally {
      setLoading(false)
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
          <h1 className="text-xl font-bold">Perfil do Time</h1>
        </div>
        <div className="px-4 py-8">
          <LoadingSpinner size="lg" text="Carregando perfil..." variant="white" />
        </div>
      </div>
    )
  }

  if (error || !team) {
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
          <h1 className="text-xl font-bold">Perfil do Time</h1>
        </div>
        <div className="px-4 py-8">
          <ErrorMessage
            title="Erro ao carregar"
            message={error || 'Time não encontrado'}
            onRetry={loadData}
          />
        </div>
      </div>
    )
  }

  const totalGames = team.wins + team.losses + team.draws
  const winPercentage = totalGames > 0 ? Math.round((team.wins / totalGames) * 100) : 0

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
        <h1 className="text-xl font-bold">Perfil do Time</h1>
      </div>

      <div className="px-4 pb-8">
        {/* Team Header */}
        <Card className="bg-gradient-to-br from-green-600 to-green-800 text-white mb-6">
          <div className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-4">
                <Users className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">{team.name}</h2>
              <p className="text-green-100 mb-1">{team.location} • {team.category}</p>
              <div className="flex items-center gap-1 mb-3">
                <Star className="w-5 h-5 text-yellow-300 fill-current" />
                <span className="font-semibold">{team.rating}</span>
                <span className="text-green-100">• Fundado em {team.foundedYear}</span>
              </div>
              <div className="flex gap-2">
                <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">
                  {team.playersCount} jogadores
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Basic Info */}
        <Card className="bg-white mb-6">
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-3">Informações Básicas</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Técnico</p>
                  <p className="font-medium">{team.coach}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Presidente</p>
                  <p className="font-medium">{team.president}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Localização</p>
                  <p className="font-medium">{team.stadium || team.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Fundado</p>
                  <p className="font-medium">{team.foundedYear}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Description */}
        {team.description && (
          <Card className="bg-white mb-6">
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-3">Sobre o Time</h3>
              <p className="text-gray-600">{team.description}</p>
            </div>
          </Card>
        )}

        {/* Statistics */}
        <Card className="bg-white mb-6">
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Target className="w-5 h-5 text-green-600" />
              Estatísticas
            </h3>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">{team.wins}</div>
                <div className="text-xs text-gray-600">Vitórias</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{team.losses}</div>
                <div className="text-xs text-gray-600">Derrotas</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{team.draws}</div>
                <div className="text-xs text-gray-600">Empates</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{winPercentage}%</div>
                <div className="text-xs text-gray-600">Aproveit.</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Championships */}
        {team.championships.length > 0 && (
          <Card className="bg-white mb-6">
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Campeonatos Conquistados
              </h3>
              <div className="space-y-2">
                {team.championships.map((championship, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm">{championship}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Recent Games */}
        <Card className="bg-white mb-6">
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Últimos Jogos
            </h3>
            <div className="space-y-2">
              {team.recentGames.map((game) => (
                <div key={game.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium text-sm">{game.opponent}</p>
                    <p className="text-xs text-gray-600">{game.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      game.result === 'win' ? 'bg-green-100 text-green-800' :
                      game.result === 'loss' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {game.score}
                    </span>
                    {game.result === 'win' && <CheckCircle className="w-4 h-4 text-green-500" />}
                    {game.result === 'loss' && <Flag className="w-4 h-4 text-red-500" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Players */}
        <Card className="bg-white mb-6">
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-green-600" />
              Elenco ({team.playersCount} jogadores)
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {team.players.map((player) => (
                <div key={player.id} className="p-2 bg-gray-50 rounded text-sm">
                  <p className="font-medium truncate">{player.name}</p>
                  <p className="text-xs text-gray-600">{player.position}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="space-y-3">
          <Button 
            className="w-full bg-blue-500 hover:bg-blue-600"
            onClick={() => alert('Função de contato em breve disponível')}
          >
            Entrar em Contato
          </Button>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => router.back()}
          >
            Voltar
          </Button>
        </div>
      </div>
    </div>
  )
}