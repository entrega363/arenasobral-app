'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { useResponsive } from '@/hooks/useResponsive'

interface Step {
  id: string
  title: string
  description?: string
}

interface ProgressStepsProps {
  steps: Step[]
  currentStep: number
  completedSteps?: number[]
  className?: string
}

export function ProgressSteps({
  steps,
  currentStep,
  completedSteps = [],
  className = ''
}: ProgressStepsProps) {
  const { isMobile } = useResponsive()

  const getStepStatus = (stepIndex: number) => {
    if (completedSteps.includes(stepIndex)) return 'completed'
    if (stepIndex === currentStep) return 'current'
    if (stepIndex < currentStep) return 'completed'
    return 'upcoming'
  }

  const getStepClasses = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          circle: 'bg-green-500 border-green-500 text-white',
          title: 'text-green-600 font-medium',
          description: 'text-green-500',
          connector: 'bg-green-500'
        }
      case 'current':
        return {
          circle: 'bg-blue-500 border-blue-500 text-white ring-4 ring-blue-100',
          title: 'text-blue-600 font-medium',
          description: 'text-blue-500',
          connector: 'bg-gray-200'
        }
      default:
        return {
          circle: 'bg-white border-gray-300 text-gray-400',
          title: 'text-gray-500',
          description: 'text-gray-400',
          connector: 'bg-gray-200'
        }
    }
  }

  if (isMobile) {
    // Layout simplificado para mobile
    return (
      <div className={`px-4 py-3 bg-white border-b ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {steps.map((_, index) => {
                const status = getStepStatus(index)
                const classes = getStepClasses(status)
                
                return (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      status === 'completed' ? 'bg-green-500' :
                      status === 'current' ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  />
                )
              })}
            </div>
            <span className="text-sm text-gray-600">
              Etapa {currentStep + 1} de {steps.length}
            </span>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">
              {steps[currentStep]?.title}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Layout completo para desktop
  return (
    <div className={`bg-white border-b ${className}`}>
      <div className="max-w-4xl mx-auto px-6 py-6">
        <nav aria-label="Progresso da reserva">
          <ol className="flex items-center justify-between">
            {steps.map((step, stepIndex) => {
              const status = getStepStatus(stepIndex)
              const classes = getStepClasses(status)
              const isLast = stepIndex === steps.length - 1

              return (
                <li key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    {/* Círculo do step */}
                    <div
                      className={`
                        w-10 h-10 rounded-full border-2 flex items-center justify-center
                        transition-all duration-200 ${classes.circle}
                      `}
                    >
                      {status === 'completed' ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <span className="text-sm font-medium">
                          {stepIndex + 1}
                        </span>
                      )}
                    </div>
                    
                    {/* Título e descrição */}
                    <div className="mt-3 text-center">
                      <div className={`text-sm transition-colors ${classes.title}`}>
                        {step.title}
                      </div>
                      {step.description && (
                        <div className={`text-xs mt-1 transition-colors ${classes.description}`}>
                          {step.description}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Conector */}
                  {!isLast && (
                    <div className="flex-1 mx-4 mt-[-20px]">
                      <div
                        className={`h-0.5 transition-colors duration-300 ${classes.connector}`}
                      />
                    </div>
                  )}
                </li>
              )
            })}
          </ol>
        </nav>
      </div>
    </div>
  )
}

// Hook para gerenciar progresso de steps
export function useProgressSteps(totalSteps: number) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCompletedSteps(prev => [...prev, currentStep])
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCompletedSteps(prev => prev.filter(step => step !== currentStep - 1))
      setCurrentStep(prev => prev - 1)
    }
  }

  const goToStep = (step: number) => {
    if (step >= 0 && step < totalSteps) {
      setCurrentStep(step)
      setCompletedSteps(prev => prev.filter(s => s < step))
    }
  }

  const completeStep = (step: number) => {
    setCompletedSteps(prev => {
      if (prev.includes(step)) return prev
      return [...prev, step]
    })
  }

  const reset = () => {
    setCurrentStep(0)
    setCompletedSteps([])
  }

  return {
    currentStep,
    completedSteps,
    nextStep,
    prevStep,
    goToStep,
    completeStep,
    reset,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === totalSteps - 1,
    progress: ((currentStep + 1) / totalSteps) * 100
  }
}