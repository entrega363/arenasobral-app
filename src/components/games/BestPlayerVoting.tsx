'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Player } from '@/types/game'
import { useVotingTimer } from '@/hooks/useVotingTimer'

interface BestPlayerVotingProps {
  gameId: string
  players: Player[]
  onVote: (playerId: string) => void
  votingEndTime?: string
  currentVote?: string
  isVotingActive: boolean
}

export function BestPlayerVoting({ 
  gameId, 
  players, 
  onVote, 
  votingEndTime,
  currentVote,
  isVotingActive
}: BestPlayerVotingProps) {
  const [selectedPlayer, setSelectedPlayer] = useState(currentVote || '')
  const { formattedTime, isExpired } = useVotingTimer(votingEndTime)

  const handleSubmitVote = () => {
    if (selectedPlayer) {
      onVote(selectedPlayer)
    }
  }

  if (!isVotingActive || isExpired) {
    return (
      <Card className="bg-white p-4 mb-4">
        <h3 className="font-semibold text-lg mb-2">Votação Encerrada</h3>
        <p className="text-sm text-gray-600">
          A votação para o melhor jogador foi encerrada.
        </p>
      </Card>
    )
  }

  return (
    <Card className="bg-white p-4 mb-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-lg">Votar no Melhor Jogador</h3>
        {formattedTime && (
          <div className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
            Tempo: {formattedTime}
          </div>
        )}
      </div>
      
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {players.map((player) => (
          <div 
            key={player.id}
            className={`flex items-center gap-3 p-2 rounded cursor-pointer ${
              selectedPlayer === player.id 
                ? 'bg-blue-100 border border-blue-300' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => setSelectedPlayer(player.id)}
          >
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs">
              {player.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1">
              <div className="font-medium text-sm">{player.name}</div>
              <div className="text-xs text-gray-500">{player.position} • {player.teamName}</div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex gap-2 mt-3">
        <Button 
          onClick={handleSubmitVote} 
          disabled={!selectedPlayer}
          className="flex-1"
        >
          Votar
        </Button>
      </div>
    </Card>
  )
}