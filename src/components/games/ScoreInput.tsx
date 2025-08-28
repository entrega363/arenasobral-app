'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

interface ScoreInputProps {
  team1Name: string
  team2Name: string
  onScoreSubmit: (team1Score: number, team2Score: number) => void
  onCancel: () => void
}

export function ScoreInput({ team1Name, team2Name, onScoreSubmit, onCancel }: ScoreInputProps) {
  const [team1Score, setTeam1Score] = useState('')
  const [team2Score, setTeam2Score] = useState('')

  const handleSubmit = () => {
    const score1 = parseInt(team1Score)
    const score2 = parseInt(team2Score)
    
    if (isNaN(score1) || isNaN(score2)) {
      alert('Por favor, insira valores numéricos válidos para os placares')
      return
    }
    
    // Atualizar estatísticas dos jogadores dos times com base no resultado
    console.log(`Atualizando estatísticas dos jogadores após o resultado: ${team1Name} ${score1} x ${score2} ${team2Name}`)
    
    onScoreSubmit(score1, score2)
  }

  return (
    <Card className="bg-white p-4 mb-4">
      <h3 className="font-semibold text-lg mb-3">Registrar Placar</h3>
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 text-center">
          <div className="font-medium">{team1Name}</div>
          <Input
            type="number"
            value={team1Score}
            onChange={(e) => setTeam1Score(e.target.value)}
            className="mt-2 text-center"
            min="0"
          />
        </div>
        
        <div className="text-2xl font-bold">x</div>
        
        <div className="flex-1 text-center">
          <div className="font-medium">{team2Name}</div>
          <Input
            type="number"
            value={team2Score}
            onChange={(e) => setTeam2Score(e.target.value)}
            className="mt-2 text-center"
            min="0"
          />
        </div>
      </div>
      
      <div className="flex gap-2 mt-4">
        <Button onClick={handleSubmit} className="flex-1">
          Confirmar Placar
        </Button>
        <Button variant="outline" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
      </div>
    </Card>
  )
}