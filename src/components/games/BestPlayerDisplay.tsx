'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Player } from '@/types/game'
import { Share2 } from 'lucide-react'

interface BestPlayerDisplayProps {
  player: Player
  gameId: string
  gameInfo: string // Ex: "Vila Nove F.C. 2 x 1 Amigos da Bola"
}

export function BestPlayerDisplay({ player, gameId, gameInfo }: BestPlayerDisplayProps) {
  const handleShare = () => {
    const message = `🎉 Melhor jogador da partida! 🎉

${player.name} foi eleito o melhor jogador de ${gameInfo}!

Parabéns! ⚽`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200 p-4 mb-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-lg">⭐</span>
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-yellow-800">Melhor da Partida!</h3>
          <p className="text-sm text-yellow-700">
            <span className="font-semibold">{player.name}</span> • {player.position} • {player.teamName}
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleShare}
          className="border-yellow-300 text-yellow-700 hover:bg-yellow-50"
        >
          <Share2 className="w-4 h-4 mr-1" />
          Compartilhar
        </Button>
      </div>
    </Card>
  )
}