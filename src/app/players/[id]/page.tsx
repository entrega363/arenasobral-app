'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, User, MapPin, Phone, Mail, Calendar, Star, Award, Users, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { StatusBar } from '@/components/layout/StatusBar'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'

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
  bio?: string
  achievements?: string[]
  stats?: {
    gamesPlayed: number
    goals: number
    assists: number
    cleanSheets?: number
    bestPlayerAwards?: number
    wins?: number // Adicionando vitórias
    draws?: number // Adicionando empates
    losses?: number // Adicionando derrotas
  }
  gameHistory?: { // Adicionando histórico de jogos
    gameId: string
    date: string
    opponent: string
    result: 'win' | 'draw' | 'loss'
    goalsScored: number
    assistsMade: number
    minutesPlayed: number
    rating: number
  }[]
}

export default function PlayerProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [player, setPlayer] = useState<Player | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))

      // Mock data for player profile
      const mockPlayer: Player = {
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
        currentTeam: 'Vila Nove F.C.',
        bio: 'Jogador apaixonado por futebol desde criança. Participa de jogos amistosos há mais de 5 anos. Gosto de jogar principalmente como atacante, mas consigo jogar em outras posições quando necessário.',
        achievements: [
          'Melhor jogador do torneio 2023',
          'Artilheiro do campeonato 2022',
          'Jogador mais fair-play 2024'
        ],
        stats: {
          gamesPlayed: 45,
          goals: 28,
          assists: 12,
          bestPlayerAwards: 8, // Adicionando contagem de prêmios de melhor jogador
          wins: 28, // Adicionando vitórias
          draws: 10, // Adicionando empates
          losses: 7 // Adicionando derrotas
        },
        gameHistory: [ // Adicionando histórico de jogos
          {
            gameId: '1',
            date: '20/08/2025',
            opponent: 'Amigos da Bola',
            result: 'win',
            goalsScored: 2,
            assistsMade: 1,
            minutesPlayed: 90,
            rating: 8.5
          },
          {
            gameId: '2',
            date: '15/08/2025',
            opponent: 'Estrela do Norte',
            result: 'draw',
            goalsScored: 1,
            assistsMade: 0,
            minutesPlayed: 90,
            rating: 7.0
          },
          {
            gameId: '3',
            date: '10/08/2025',
            opponent: 'União FC',
            result: 'win',
            goalsScored: 1,
            assistsMade: 2,
            minutesPlayed: 90,
            rating: 8.0
          }
        ]
      }

      setPlayer(mockPlayer)
    } catch (err) {
      setError('Erro ao carregar dados do jogador')
      console.error('Error loading player data:', err)
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
          <h1 className="text-xl font-bold">Perfil do Jogador</h1>
        </div>
        <div className="px-4 py-8">
          <LoadingSpinner size="lg" text="Carregando perfil..." variant="white" />
        </div>
      </div>
    )
  }

  if (error || !player) {
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
          <h1 className="text-xl font-bold">Perfil do Jogador</h1>
        </div>
        <div className="px-4 py-8">
          <ErrorMessage
            title="Erro ao carregar"
            message={error || 'Jogador não encontrado'}
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
        <h1 className="text-xl font-bold">Perfil do Jogador</h1>
      </div>

      <div className="px-4 pb-8">
        {/* Player Header */}
        <Card className="bg-gradient-to-br from-blue-600 to-blue-800 text-white mb-6">
          <div className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-4">
                <User className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">{player.name}</h2>
              <p className="text-blue-100 mb-1">{player.age} anos • {player.position}</p>
              <div className="flex items-center gap-1 mb-3">
                <Star className="w-5 h-5 text-yellow-300 fill-current" />
                <span className="font-semibold">{player.rating}</span>
                <span className="text-blue-100">• {player.experience}</span>
              </div>
              <div className="flex gap-2">
                <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">
                  {player.category}
                </span>
                {player.currentTeam && (
                  <span className="bg-green-500/20 text-green-200 text-xs px-3 py-1 rounded-full">
                    {player.currentTeam}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Contact Info */}
        <Card className="bg-white mb-6">
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-3">Contato</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-600" />
                <span>{player.phoneNumber}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-600" />
                <span>{player.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-blue-600" />
                <span>{player.location}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span>Disponibilidade: {player.availability}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* About */}
        {player.bio && (
          <Card className="bg-white mb-6">
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-3">Sobre</h3>
              <p className="text-gray-600">{player.bio}</p>
            </div>
          </Card>
        )}

        {/* Stats */}
        {player.stats && (
          <Card className="bg-white mb-6">
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-3">Estatísticas</h3>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{player.stats.gamesPlayed}</div>
                  <div className="text-sm text-gray-600">Jogos</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{player.stats.goals}</div>
                  <div className="text-sm text-gray-600">Gols</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">{player.stats.assists}</div>
                  <div className="text-sm text-gray-600">Assist.</div>
                </div>
                {player.stats.bestPlayerAwards !== undefined && (
                  <div>
                    <div className="text-2xl font-bold text-yellow-600">{player.stats.bestPlayerAwards}</div>
                    <div className="text-sm text-gray-600">Melhor</div>
                  </div>
                )}
              </div>
              
              {/* Vitórias, Empates e Derrotas */}
              {(player.stats.wins !== undefined || player.stats.draws !== undefined || player.stats.losses !== undefined) && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="font-medium text-center mb-3">Resultado dos Jogos</h4>
                  <div className="grid grid-cols-3 gap-4">
                    {player.stats.wins !== undefined && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{player.stats.wins}</div>
                        <div className="text-sm text-gray-600">Vitórias</div>
                      </div>
                    )}
                    {player.stats.draws !== undefined && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{player.stats.draws}</div>
                        <div className="text-sm text-gray-600">Empates</div>
                      </div>
                    )}
                    {player.stats.losses !== undefined && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{player.stats.losses}</div>
                        <div className="text-sm text-gray-600">Derrotas</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Achievements */}
        {player.achievements && player.achievements.length > 0 && (
          <Card className="bg-white mb-6">
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                Conquistas
              </h3>
              <div className="space-y-2">
                {player.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm">{achievement}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Game History */}
        {player.gameHistory && player.gameHistory.length > 0 && (
          <Card className="bg-white mb-6">
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Histórico de Jogos
              </h3>
              <div className="space-y-3">
                {player.gameHistory.map((game) => (
                  <div key={game.gameId} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium text-sm">{game.opponent}</p>
                      <p className="text-xs text-gray-600">{game.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {game.goalsScored} gol{game.goalsScored !== 1 ? 's' : ''} • {game.assistsMade} assist.
                        </div>
                        <div className="text-xs text-gray-600">
                          {game.minutesPlayed} min
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        game.result === 'win' ? 'bg-green-100 text-green-800' :
                        game.result === 'draw' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {game.result === 'win' ? 'Vitória' : game.result === 'draw' ? 'Empate' : 'Derrota'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

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