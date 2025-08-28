'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Plus, X } from 'lucide-react'

interface GoalScorer {
  playerId: string
  playerName: string
  goals: number
}

interface ScoreInputProps {
  team1Name: string
  team2Name: string
  team1Players?: { id: string; name: string }[]
  team2Players?: { id: string; name: string }[]
  onScoreSubmit: (team1Score: number, team2Score: number, team1Goals?: GoalScorer[], team2Goals?: GoalScorer[]) => void
  onCancel: () => void
}

export function ScoreInput({ team1Name, team2Name, team1Players = [], team2Players = [], onScoreSubmit, onCancel }: ScoreInputProps) {
  // Garantir que os dados dos jogadores estão no formato correto
  const validTeam1Players = Array.isArray(team1Players) ? team1Players : [];
  const validTeam2Players = Array.isArray(team2Players) ? team2Players : [];
  
  const [team1Score, setTeam1Score] = useState('')
  const [team2Score, setTeam2Score] = useState('')
  const [team1Goals, setTeam1Goals] = useState<GoalScorer[]>([])
  const [team2Goals, setTeam2Goals] = useState<GoalScorer[]>([])
  const [newTeam1Scorer, setNewTeam1Scorer] = useState({ playerId: '', goals: 1 })
  const [newTeam2Scorer, setNewTeam2Scorer] = useState({ playerId: '', goals: 1 })

  const handleSubmit = () => {
    const score1 = parseInt(team1Score)
    const score2 = parseInt(team2Score)
    
    if (isNaN(score1) || isNaN(score2)) {
      alert('Por favor, insira valores numéricos válidos para os placares')
      return
    }
    
    // Verificar se a soma dos gols corresponde ao placar registrado
    const totalTeam1Goals = team1Goals.reduce((sum, scorer) => sum + scorer.goals, 0)
    const totalTeam2Goals = team2Goals.reduce((sum, scorer) => sum + scorer.goals, 0)
    
    if (totalTeam1Goals !== score1 || totalTeam2Goals !== score2) {
      alert(`A soma dos gols registrados (${totalTeam1Goals} e ${totalTeam2Goals}) não corresponde ao placar (${score1} e ${score2}).`)
      return
    }
    
    // Atualizar estatísticas dos jogadores com base nos gols marcados
    console.log(`Atualizando estatísticas dos jogadores após o resultado: ${team1Name} ${score1} x ${score2} ${team2Name}`)
    
    onScoreSubmit(score1, score2, team1Goals, team2Goals)
  }

  const addTeam1Scorer = () => {
    if (!newTeam1Scorer.playerId || newTeam1Scorer.goals <= 0) {
      alert('Por favor, selecione um jogador e informe a quantidade de gols (maior que zero)')
      return
    }
    
    const player = validTeam1Players.find(p => p.id === newTeam1Scorer.playerId)
    if (!player) return
    
    const existingScorer = team1Goals.find(scorer => scorer.playerId === newTeam1Scorer.playerId)
    if (existingScorer) {
      setTeam1Goals(prev => 
        prev.map(scorer => 
          scorer.playerId === newTeam1Scorer.playerId 
            ? { ...scorer, goals: scorer.goals + newTeam1Scorer.goals } 
            : scorer
        )
      )
    } else {
      setTeam1Goals(prev => [
        ...prev,
        { playerId: newTeam1Scorer.playerId, playerName: player.name, goals: newTeam1Scorer.goals }
      ])
    }
    
    setNewTeam1Scorer({ playerId: '', goals: 1 })
  }

  const addTeam2Scorer = () => {
    if (!newTeam2Scorer.playerId || newTeam2Scorer.goals <= 0) {
      alert('Por favor, selecione um jogador e informe a quantidade de gols (maior que zero)')
      return
    }
    
    const player = validTeam2Players.find(p => p.id === newTeam2Scorer.playerId)
    if (!player) return
    
    const existingScorer = team2Goals.find(scorer => scorer.playerId === newTeam2Scorer.playerId)
    if (existingScorer) {
      setTeam2Goals(prev => 
        prev.map(scorer => 
          scorer.playerId === newTeam2Scorer.playerId 
            ? { ...scorer, goals: scorer.goals + newTeam2Scorer.goals } 
            : scorer
        )
      )
    } else {
      setTeam2Goals(prev => [
        ...prev,
        { playerId: newTeam2Scorer.playerId, playerName: player.name, goals: newTeam2Scorer.goals }
      ])
    }
    
    setNewTeam2Scorer({ playerId: '', goals: 1 })
  }

  const removeTeam1Scorer = (playerId: string) => {
    setTeam1Goals(prev => prev.filter(scorer => scorer.playerId !== playerId))
  }

  const removeTeam2Scorer = (playerId: string) => {
    setTeam2Goals(prev => prev.filter(scorer => scorer.playerId !== playerId))
  }

  return (
    <Card className="bg-white p-4 mb-4">
      <h3 className="font-semibold text-lg mb-3">Registrar Placar e Artilheiros</h3>
      
      {/* Score Input */}
      <div className="flex items-center justify-between gap-4 mb-6">
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
      
      {/* Team 1 Goalscorers */}
      <div className="mb-6">
        <h4 className="font-medium mb-2">{team1Name} - Gols Marcados:</h4>
        
        {/* Add Scorer */}
        <div className="flex gap-2 mb-2">
          <select
            value={newTeam1Scorer.playerId}
            onChange={(e) => setNewTeam1Scorer(prev => ({ ...prev, playerId: e.target.value }))}
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Selecione um jogador</option>
            {validTeam1Players.map(player => (
              <option key={player.id} value={player.id}>{player.name}</option>
            ))}
          </select>
          <Input
            type="number"
            value={newTeam1Scorer.goals}
            onChange={(e) => setNewTeam1Scorer(prev => ({ ...prev, goals: parseInt(e.target.value) || 1 }))}
            className="w-20 text-center"
            min="1"
          />
          <Button onClick={addTeam1Scorer} size="sm">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Scorers List */}
        {team1Goals.length > 0 && (
          <div className="space-y-2">
            {team1Goals.map((scorer) => (
              <div key={scorer.playerId} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <span className="text-sm">{scorer.playerName}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{scorer.goals} gol{scorer.goals !== 1 ? 's' : ''}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeTeam1Scorer(scorer.playerId)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Team 2 Goalscorers */}
      <div className="mb-6">
        <h4 className="font-medium mb-2">{team2Name} - Gols Marcados:</h4>
        
        {/* Add Scorer */}
        <div className="flex gap-2 mb-2">
          <select
            value={newTeam2Scorer.playerId}
            onChange={(e) => setNewTeam2Scorer(prev => ({ ...prev, playerId: e.target.value }))}
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Selecione um jogador</option>
            {validTeam2Players.map(player => (
              <option key={player.id} value={player.id}>{player.name}</option>
            ))}
          </select>
          <Input
            type="number"
            value={newTeam2Scorer.goals}
            onChange={(e) => setNewTeam2Scorer(prev => ({ ...prev, goals: parseInt(e.target.value) || 1 }))}
            className="w-20 text-center"
            min="1"
          />
          <Button onClick={addTeam2Scorer} size="sm">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Scorers List */}
        {team2Goals.length > 0 && (
          <div className="space-y-2">
            {team2Goals.map((scorer) => (
              <div key={scorer.playerId} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <span className="text-sm">{scorer.playerName}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{scorer.goals} gol{scorer.goals !== 1 ? 's' : ''}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeTeam2Scorer(scorer.playerId)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex gap-2">
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