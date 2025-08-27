'use client'

import { useState, useEffect } from 'react'

export function useVotingTimer(endTime?: string) {
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    if (!endTime) {
      setTimeLeft(null)
      setIsExpired(false)
      return
    }

    const updateTimer = () => {
      const endTimeMs = new Date(endTime).getTime()
      const now = new Date().getTime()
      const difference = endTimeMs - now

      if (difference > 0) {
        setTimeLeft(Math.floor(difference / 1000))
        setIsExpired(false)
      } else {
        setTimeLeft(0)
        setIsExpired(true)
      }
    }

    updateTimer()
    const timer = setInterval(updateTimer, 1000)

    return () => clearInterval(timer)
  }, [endTime])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return {
    timeLeft,
    isExpired,
    formattedTime: timeLeft !== null ? formatTime(timeLeft) : null
  }
}