'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Users, UserPlus, Calendar, Trophy, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBar } from '@/components/layout/StatusBar'

export function TeamOwnerDashboard() {
  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState('overview')

  const teamStats = {
    playersCount: 15,
    nextGame: 'Amanhã às 19:00 vs Amigos da Bola',
    pendingRequests: 2,
    wins: 8,
    losses: 3
  }

  const recentRequests = [
    {
      id: 1,
      playerName: 'Carlos Silva',
      position: 'Meio-campo',
      experience: '5 anos',
      date: '24/08/2025'
    },
    {
      id: 2,
      playerName: 'Pedro Santos',
      position: 'Goleiro',
      experience: '7 anos',
      date: '23/08/2025'
    }
  ]

  const upcomingGames = [
    {
      id: 1,
      opponent: 'Amigos da Bola',
      date: 'Amanhã',
      time: '19:00',
      location: 'Campo do Centro',
      status: 'confirmado'
    },
    {
      id: 2,
      opponent: 'Estrela do Norte',
      date: 'Domingo',
      time: '15:00',
      location: 'Quadra Netifor',
      status: 'pendente'
    }
  ]

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: Trophy },
    { id: 'players', label: 'Elenco', icon: Users },
    { id: 'requests', label: 'Solicitações', icon: MessageSquare },
    { id: 'games', label: 'Jogos', icon: Calendar }
  ]

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
        <h1 className="text-xl font-bold">Painel do Dono do Time</h1>
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
        {selectedTab === 'overview' && (
          <div className="space-y-6">
            {/* Team Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Vila Nove F.C.
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-2xl font-bold text-green-600">{teamStats.playersCount}</div>
                    <div className="text-sm text-gray-600">Jogadores</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{teamStats.pendingRequests}</div>
                    <div className="text-sm text-gray-600">Solicitações</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <p><strong>Próximo Jogo:</strong> {teamStats.nextGame}</p>
                  <p><strong>Categoria:</strong> Racha</p>
                  <p><strong>Localização:</strong> Sobral Centro</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <Button 
                className="h-20 flex flex-col gap-2"
                onClick={() => router.push('/search/players')}
              >
                <UserPlus className="w-6 h-6" />
                Buscar Jogadores
              </Button>
              <Button 
                variant="outline"
                className="h-20 flex flex-col gap-2"
                onClick={() => router.push('/games/schedule')}
              >
                <Calendar className="w-6 h-6" />
                Marcar Jogo
              </Button>
            </div>
          </div>
        )}

        {selectedTab === 'players' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-white text-lg font-semibold">Elenco ({teamStats.playersCount} jogadores)</h2>
              <Button 
                size="sm"
                onClick={() => router.push('/search/players')}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Contratar
              </Button>
            </div>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    JS
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">João Silva</h3>
                    <p className="text-sm text-gray-600">Atacante • 25 anos • 5 anos exp.</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    Capitão
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                    FC
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Felipe Costa</h3>
                    <p className="text-sm text-gray-600">Atacante • 26 anos • 4 anos exp.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {selectedTab === 'requests' && (
          <div className="space-y-4">
            <h2 className="text-white text-lg font-semibold">Solicitações de Entrada</h2>
            
            {recentRequests.map((request) => (
              <Card key={request.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-semibold">
                      {request.playerName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{request.playerName}</h3>
                      <p className="text-sm text-gray-600">
                        {request.position} • {request.experience}
                      </p>
                      <p className="text-xs text-gray-500">{request.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      Aceitar
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      Recusar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {selectedTab === 'games' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-white text-lg font-semibold">Próximos Jogos</h2>
              <Button 
                size="sm"
                onClick={() => router.push('/games/schedule')}
              >
                Marcar Jogo
              </Button>
            </div>
            
            {upcomingGames.map((game) => (
              <Card key={game.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">vs {game.opponent}</h3>
                    <span className={`text-xs px-2 py-1 rounded ${
                      game.status === 'confirmado' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {game.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {game.date} às {game.time} • {game.location}
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      Detalhes
                    </Button>
                    {game.status === 'pendente' && (
                      <Button size="sm" className="flex-1">
                        Confirmar
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}