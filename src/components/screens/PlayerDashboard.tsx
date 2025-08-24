'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, User, Users, Calendar, MessageSquare, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBar } from '@/components/layout/StatusBar'

export function PlayerDashboard() {
  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState('overview')

  const stats = {
    teamsCount: 2,
    contractOffers: 3,
    nextGame: 'Amanhã às 19:00',
    position: 'Atacante'
  }

  const recentOffers = [
    {
      id: 1,
      teamName: 'Vila Nove F.C.',
      position: 'Atacante',
      date: '24/08/2025',
      status: 'pending'
    },
    {
      id: 2,
      teamName: 'Estrela do Norte',
      position: 'Atacante',
      date: '23/08/2025',
      status: 'pending'
    }
  ]

  const myTeams = [
    {
      id: 1,
      name: 'Vila Nove F.C.',
      category: 'Racha',
      nextGame: 'Amanhã às 19:00 vs Amigos da Bola'
    },
    {
      id: 2,
      name: 'Força Jovem',
      category: '1Q',
      nextGame: 'Domingo às 15:00 vs União FC'
    }
  ]

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: User },
    { id: 'teams', label: 'Meus Times', icon: Users },
    { id: 'offers', label: 'Propostas', icon: MessageSquare },
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
        <h1 className="text-xl font-bold">Painel do Jogador</h1>
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
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-600">{stats.teamsCount}</div>
                  <div className="text-sm text-gray-600">Times Ativos</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">{stats.contractOffers}</div>
                  <div className="text-sm text-gray-600">Propostas</div>
                </CardContent>
              </Card>
            </div>

            {/* Profile Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Meu Perfil
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>Posição:</strong> {stats.position}</p>
                  <p><strong>Próximo Jogo:</strong> {stats.nextGame}</p>
                  <p><strong>Status:</strong> <span className="text-green-600">Ativo</span></p>
                </div>
                <Button 
                  className="w-full mt-4"
                  onClick={() => router.push('/profile/edit')}
                >
                  Editar Perfil
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {selectedTab === 'teams' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-white text-lg font-semibold">Meus Times</h2>
              <Button 
                size="sm"
                onClick={() => router.push('/search/teams')}
              >
                Buscar Times
              </Button>
            </div>
            
            {myTeams.map((team) => (
              <Card key={team.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{team.name}</h3>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {team.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{team.nextGame}</p>
                  <Button size="sm" variant="outline" className="w-full">
                    Ver Detalhes
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {selectedTab === 'offers' && (
          <div className="space-y-4">
            <h2 className="text-white text-lg font-semibold">Propostas Recebidas</h2>
            
            {recentOffers.map((offer) => (
              <Card key={offer.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{offer.teamName}</h3>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      Pendente
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Posição: {offer.position} • {offer.date}
                  </p>
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
            <h2 className="text-white text-lg font-semibold">Próximos Jogos</h2>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <h3 className="font-semibold">Vila Nove F.C. vs Amigos da Bola</h3>
                    <p className="text-sm text-gray-600">Amanhã às 19:00 • Campo do Centro</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="w-full">
                  Ver Detalhes
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Calendar className="w-5 h-5 text-green-600" />
                  <div>
                    <h3 className="font-semibold">Força Jovem vs União FC</h3>
                    <p className="text-sm text-gray-600">Domingo às 15:00 • Quadra Netifor</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="w-full">
                  Ver Detalhes
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}