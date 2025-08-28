'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Users, UserPlus, Calendar, Trophy, MessageSquare, Star, Edit3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBar } from '@/components/layout/StatusBar'
import { AdBannerCarousel } from '@/components/ads/AdBannerCarousel'
import { ScoreInput } from '@/components/games/ScoreInput'
import { BestPlayerVoting } from '@/components/games/BestPlayerVoting'
import { BestPlayerDisplay } from '@/components/games/BestPlayerDisplay'

export function TeamOwnerDashboard() {
  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState('overview')
  const [editingGameId, setEditingGameId] = useState<string | null>(null)
  const [votedGames, setVotedGames] = useState<Record<string, string>>({}) // gameId: playerId
  const [teamStats, setTeamStats] = useState({
    playersCount: 15,
    nextGame: 'Amanhã às 19:00 vs Amigos da Bola',
    pendingRequests: 2,
    wins: 8,
    losses: 3,
    draws: 2 // Adicionando empates
  })

  const handleUploadClick = () => {
    router.push('/admin/upload-ads')
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
      id: '1',
      opponent: 'Amigos da Bola',
      date: 'Amanhã',
      time: '19:00',
      location: 'Campo do Centro',
      status: 'confirmado',
      createdByTeam: 'Vila Nove F.C.' // Time que marcou o jogo
    },
    {
      id: '2',
      opponent: 'Estrela do Norte',
      date: 'Domingo',
      time: '15:00',
      location: 'Quadra Netifor',
      status: 'pendente',
      createdByTeam: 'Vila Nove F.C.' // Time que marcou o jogo
    },
    {
      id: '3',
      opponent: 'Força Jovem',
      date: 'Quarta',
      time: '20:00',
      location: 'Campo da Cohab',
      status: 'finalizado',
      team1Score: 2,
      team2Score: 1,
      bestPlayer: 'João Silva',
      createdByTeam: 'Vila Nove F.C.', // Time que marcou o jogo
      players: [
        { id: 'p1', name: 'João Silva', position: 'Atacante', teamId: 't1', teamName: 'Vila Nove F.C.', rating: 4.8 },
        { id: 'p2', name: 'Carlos Mendes', position: 'Meio-campo', teamId: 't1', teamName: 'Vila Nove F.C.', rating: 4.5 },
        { id: 'p3', name: 'Pedro Santos', position: 'Zagueiro', teamId: 't1', teamName: 'Vila Nove F.C.', rating: 4.3 },
        { id: 'p4', name: 'Felipe Costa', position: 'Goleiro', teamId: 't1', teamName: 'Vila Nove F.C.', rating: 4.7 },
        { id: 'p5', name: 'Ricardo Oliveira', position: 'Lateral', teamId: 't1', teamName: 'Vila Nove F.C.', rating: 4.2 }
      ],
      goals: [ // Adicionando gols marcados
        { playerId: 'p1', playerName: 'João Silva', goals: 2 },
        { playerId: 'p3', playerName: 'Pedro Santos', goals: 1 }
      ]
    }
  ]

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: Trophy },
    { id: 'players', label: 'Elenco', icon: Users },
    { id: 'requests', label: 'Solicitações', icon: MessageSquare },
    { id: 'games', label: 'Jogos', icon: Calendar }
  ]

  const handleScoreSubmit = (gameId: string, team1Score: number, team2Score: number, team1Goals: any[], team2Goals: any[]) => {
    // In a real app, this would update the game in the database
    console.log(`Game ${gameId} score updated: ${team1Score} - ${team2Score}`);
    setEditingGameId(null);
    
    // Atualizar as estatísticas do time com base no resultado
    if (team1Score > team2Score) {
      setTeamStats(prev => ({ ...prev, wins: prev.wins + 1 }));
    } else if (team1Score < team2Score) {
      setTeamStats(prev => ({ ...prev, losses: prev.losses + 1 }));
    } else {
      setTeamStats(prev => ({ ...prev, draws: prev.draws + 1 }));
    }
    
    // Atualizar estatísticas dos jogadores com base nos gols marcados
    console.log(`Atualizando estatísticas dos jogadores do time após o resultado: ${team1Score} - ${team2Score}`);
    console.log('Gols marcados pelo time 1:', team1Goals);
    console.log('Gols marcados pelo time 2:', team2Goals);
    
    // Em uma aplicação real, isso atualizaria o perfil de cada jogador do time
    // Por exemplo: incrementar player.stats.goals para cada jogador que marcou
    
    // For demo purposes, we'll just show an alert
    alert(`Placar registrado: ${team1Score} - ${team2Score}\nEstatísticas atualizadas automaticamente!\nGols registrados para os jogadores.`);
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
        <h1 className="text-xl font-bold">Painel do Dono do Time</h1>
      </div>

      {/* Ad Banner Carousel */}
      <div className="px-4 mb-6">
        <AdBannerCarousel isAdmin={false} onUpload={handleUploadClick} />
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
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="text-2xl font-bold text-green-600">{teamStats.wins}</div>
                    <div className="text-sm text-gray-600">Vitórias</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-600">{teamStats.losses}</div>
                    <div className="text-sm text-gray-600">Derrotas</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{teamStats.draws}</div>
                    <div className="text-sm text-gray-600">Empates</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <p><strong>Jogadores:</strong> {teamStats.playersCount}</p>
                  <p><strong>Solicitações:</strong> {teamStats.pendingRequests}</p>
                  <p><strong>Próximo Jogo:</strong> {teamStats.nextGame}</p>
                  <p><strong>Categoria:</strong> Racha</p>
                  <p><strong>Localização:</strong> Sobral Centro</p>
                  <p><strong>Técnico:</strong> Carlos Mendes</p>
                  <p><strong>Presidente:</strong> João Silva</p>
                  <p><strong>Fundado em:</strong> 2015</p>
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

            {/* Search Fields Button */}
            <Card>
              <CardContent className="p-4">
                <Button 
                  className="w-full"
                  onClick={() => router.push('/search/fields')}
                >
                  Buscar Areninhas
                </Button>
              </CardContent>
            </Card>
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
                  {game.status === 'finalizado' && game.bestPlayer && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mb-3">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-yellow-800">
                          <span className="font-semibold">Melhor da partida:</span> {game.bestPlayer}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {editingGameId === game.id ? (
                    (() => {
                      console.log('Passing team players to ScoreInput:', game.players);
                      return (
                        <ScoreInput
                          team1Name="Vila Nove F.C."
                          team2Name={game.opponent}
                          team1Players={game.players || []}
                          team2Players={[]} // Em uma aplicação real, isso viria da API
                          onScoreSubmit={(team1Score, team2Score, team1Goals, team2Goals) => 
                            handleScoreSubmit(game.id, team1Score, team2Score, team1Goals || [], team2Goals || [])
                          }
                          onCancel={() => setEditingGameId(null)}
                        />
                      );
                    })()
                  ) : (
                    <>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">vs {game.opponent}</h3>
                        <span className={`text-xs px-2 py-1 rounded ${
                          game.status === 'confirmado' 
                            ? 'bg-green-100 text-green-800' 
                            : game.status === 'pendente'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {game.status === 'confirmado' && 'Confirmado'}
                          {game.status === 'pendente' && 'Pendente'}
                          {game.status === 'finalizado' && 'Finalizado'}
                        </span>
                      </div>
                      
                      {game.status === 'finalizado' && (
                        <div className="text-center mb-2">
                          <div className="text-lg font-bold">
                            {game.team1Score} <span className="text-gray-500">x</span> {game.team2Score}
                          </div>
                        </div>
                      )}
                      
                      {/* Exibir gols marcados */}
                      {game.status === 'finalizado' && game.goals && game.goals.length > 0 && (
                        <div className="mb-3 p-3 bg-gray-50 rounded">
                          <h4 className="font-medium text-sm mb-2">Gols Marcados:</h4>
                          <div className="space-y-1">
                            {game.goals.map((goal, index) => (
                              <div key={index} className="flex justify-between text-xs">
                                <span>{goal.playerName}</span>
                                <span className="font-medium">{goal.goals} gol{goal.goals !== 1 ? 's' : ''}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <p className="text-sm text-gray-600 mb-3">
                        {game.date} às {game.time} • {game.location}
                      </p>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          Detalhes
                        </Button>
                        
                        {game.status === 'confirmado' && game.createdByTeam === 'Vila Nove F.C.' && (
                          <Button 
                            size="sm" 
                            className="flex-1"
                            onClick={() => setEditingGameId(game.id)}
                          >
                            <Edit3 className="w-4 h-4 mr-1" />
                            Registrar Placar
                          </Button>
                        )}
                        
                        {game.status === 'confirmado' && game.createdByTeam !== 'Vila Nove F.C.' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="flex-1"
                            disabled
                          >
                            <Edit3 className="w-4 h-4 mr-1" />
                            Registrar Placar
                          </Button>
                        )}
                        
                        {game.status === 'pendente' && (
                          <Button size="sm" className="flex-1">
                            Confirmar
                          </Button>
                        )}
                      </div>
                      
                      {/* Mensagem de permissão */}
                      {game.status === 'confirmado' && game.createdByTeam !== 'Vila Nove F.C.' && (
                        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded text-center">
                          <p className="text-sm text-yellow-800">
                            ⚠️ Apenas o time que marcou este jogo ({game.createdByTeam}) pode registrar o placar.
                          </p>
                        </div>
                      )}
                      
                      {/* Votação para melhor jogador - somente para jogos finalizados */}
                      {game.status === 'finalizado' && game.team1Score && game.team2Score && (
                        <>
                          {game.bestPlayer ? (
                            <BestPlayerDisplay 
                              player={game.players.find(p => p.name === game.bestPlayer) || game.players[0]}
                              gameId={game.id}
                              gameInfo={`Vila Nove F.C. ${game.team1Score} x ${game.team2Score} ${game.opponent}`}
                            />
                          ) : (
                            <BestPlayerVoting
                              gameId={game.id}
                              players={game.players}
                              onVote={(playerId) => {
                                // Em uma aplicação real, isso seria enviado para o servidor
                                console.log(`Voto registrado para o jogador ${playerId} no jogo ${game.id}`)
                                
                                // Atualizar a contagem de vezes que o jogador foi eleito o melhor da partida
                                const player = game.players.find(p => p.id === playerId);
                                if (player) {
                                  console.log(`Jogador ${player.name} foi eleito o melhor da partida!`);
                                  // Em uma aplicação real, isso seria salvo no perfil do jogador
                                  // Por exemplo: incrementar player.stats.bestPlayerAwards
                                  alert(`Jogador ${player.name} foi eleito o melhor da partida!`);
                                }
                                
                                setVotedGames(prev => ({ ...prev, [game.id]: playerId }))
                                alert('Voto registrado! Obrigado por participar.')
                              }}
                              isVotingActive={game.createdByTeam === 'Vila Nove F.C.'}
                              currentVote={votedGames[game.id]}
                            />
                          )}
                        </>
                      )}
                      
                      {/* Verificação de permissão para registrar placar e votar */}
                      {game.status === 'finalizado' && !game.team1Score && !game.team2Score && (
                        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded text-center">
                          <p className="text-sm text-yellow-800">
                            ⚠️ Apenas o time que marcou este jogo pode registrar o placar e iniciar a votação.
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}