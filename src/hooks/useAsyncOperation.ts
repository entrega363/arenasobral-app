import { useState, useCallback } from 'react'

interface AsyncOperationState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

interface UseAsyncOperationReturn<T> {
  data: T | null
  loading: boolean
  error: string | null
  execute: (operation: () => Promise<T>) => Promise<T | null>
  reset: () => void
  setData: (data: T | null) => void
  setError: (error: string | null) => void
}

export function useAsyncOperation<T = any>(
  initialData: T | null = null
): UseAsyncOperationReturn<T> {
  const [state, setState] = useState<AsyncOperationState<T>>({
    data: initialData,
    loading: false,
    error: null
  })

  const execute = useCallback(async (operation: () => Promise<T>): Promise<T | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const result = await operation()
      setState(prev => ({ ...prev, data: result, loading: false }))
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro inesperado'
      setState(prev => ({ ...prev, error: errorMessage, loading: false }))
      return null
    }
  }, [])

  const reset = useCallback(() => {
    setState({
      data: initialData,
      loading: false,
      error: null
    })
  }, [initialData])

  const setData = useCallback((data: T | null) => {
    setState(prev => ({ ...prev, data }))
  }, [])

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }))
  }, [])

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    execute,
    reset,
    setData,
    setError
  }
}

// Hook específico para operações de retry
export function useRetryableOperation<T = any>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  retryDelay: number = 1000
) {
  const [retryCount, setRetryCount] = useState(0)
  const asyncOp = useAsyncOperation<T>()

  const executeWithRetry = useCallback(async (): Promise<T | null> => {
    let attempts = 0
    
    while (attempts <= maxRetries) {
      const result = await asyncOp.execute(operation)
      
      if (result !== null) {
        setRetryCount(0)
        return result
      }
      
      attempts++
      setRetryCount(attempts)
      
      if (attempts <= maxRetries) {
        await new Promise(resolve => setTimeout(resolve, retryDelay * attempts))
      }
    }
    
    return null
  }, [operation, maxRetries, retryDelay, asyncOp])

  const retry = useCallback(() => {
    setRetryCount(0)
    return executeWithRetry()
  }, [executeWithRetry])

  return {
    ...asyncOp,
    retryCount,
    maxRetries,
    executeWithRetry,
    retry
  }
}