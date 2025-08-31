'use client'

import { useState, useEffect } from 'react'

interface VotingTimerProps {
  endTime: string
}

export function VotingTimer({ endTime }: VotingTimerProps) {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    const calculateTimeLeft = () => {
      const end = new Date(endTime).getTime()
      const now = new Date().getTime()
      const difference = end - now

      if (difference <= 0) {
        return 'Votação encerrada!'
      }

      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
    }

    // Calcular imediatamente
    setTimeLeft(calculateTimeLeft())

    // Atualizar a cada segundo
    const timer = setInterval(() => {
      const time = calculateTimeLeft()
      setTimeLeft(time)
      
      // Parar o timer quando a votação terminar
      if (time === 'Votação encerrada!') {
        clearInterval(timer)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [endTime])

  return <span>{timeLeft}</span>
}