import { renderHook, act, waitFor } from '@testing-library/react'
import { useAsyncOperation } from '@/hooks/useAsyncOperation'

describe('useAsyncOperation', () => {
  it('deve inicializar com valores padrão', () => {
    const { result } = renderHook(() => useAsyncOperation())
    
    expect(result.current.data).toBeNull()
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(typeof result.current.execute).toBe('function')
    expect(typeof result.current.reset).toBe('function')
    expect(typeof result.current.setData).toBe('function')
    expect(typeof result.current.setError).toBe('function')
  })

  it('deve inicializar com dados iniciais', () => {
    const initialData = { id: 1, name: 'Teste' }
    const { result } = renderHook(() => useAsyncOperation(initialData))
    
    expect(result.current.data).toEqual(initialData)
  })

  it('deve executar operação com sucesso', async () => {
    const { result } = renderHook(() => useAsyncOperation<string>())
    
    const mockOperation = jest.fn().mockResolvedValue('sucesso')
    
    let executePromise: Promise<string | null>
    
    act(() => {
      executePromise = result.current.execute(mockOperation)
    })
    
    // Verifica estado de loading
    expect(result.current.loading).toBe(true)
    expect(result.current.error).toBeNull()
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    
    expect(result.current.data).toBe('sucesso')
    expect(result.current.error).toBeNull()
    expect(mockOperation).toHaveBeenCalledTimes(1)
    
    const executeResult = await executePromise!
    expect(executeResult).toBe('sucesso')
  })

  it('deve lidar com erro na operação', async () => {
    const { result } = renderHook(() => useAsyncOperation<string>())
    
    const mockError = new Error('Erro de teste')
    const mockOperation = jest.fn().mockRejectedValue(mockError)
    
    let executePromise: Promise<string | null>
    
    act(() => {
      executePromise = result.current.execute(mockOperation)
    })
    
    // Verifica estado de loading
    expect(result.current.loading).toBe(true)
    expect(result.current.error).toBeNull()
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    
    expect(result.current.data).toBeNull()
    expect(result.current.error).toBe('Erro de teste')
    expect(mockOperation).toHaveBeenCalledTimes(1)
    
    const executeResult = await executePromise!
    expect(executeResult).toBeNull()
  })

  it('deve lidar com erro não-Error', async () => {
    const { result } = renderHook(() => useAsyncOperation<string>())
    
    const mockOperation = jest.fn().mockRejectedValue('string error')
    
    act(() => {
      result.current.execute(mockOperation)
    })
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    
    expect(result.current.error).toBe('Ocorreu um erro inesperado')
  })

  it('deve resetar estado', () => {
    const initialData = 'inicial'
    const { result } = renderHook(() => useAsyncOperation(initialData))
    
    // Modifica o estado
    act(() => {
      result.current.setData('modificado')
      result.current.setError('erro')
    })
    
    expect(result.current.data).toBe('modificado')
    expect(result.current.error).toBe('erro')
    
    // Reseta
    act(() => {
      result.current.reset()
    })
    
    expect(result.current.data).toBe(initialData)
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('deve permitir definir dados manualmente', () => {
    const { result } = renderHook(() => useAsyncOperation<string>())
    
    act(() => {
      result.current.setData('dados manuais')
    })
    
    expect(result.current.data).toBe('dados manuais')
  })

  it('deve permitir definir erro manualmente', () => {
    const { result } = renderHook(() => useAsyncOperation<string>())
    
    act(() => {
      result.current.setError('erro manual')
    })
    
    expect(result.current.error).toBe('erro manual')
  })

  it('deve limpar erro ao executar nova operação', async () => {
    const { result } = renderHook(() => useAsyncOperation<string>())
    
    // Define erro inicial
    act(() => {
      result.current.setError('erro inicial')
    })
    
    expect(result.current.error).toBe('erro inicial')
    
    // Executa nova operação
    const mockOperation = jest.fn().mockResolvedValue('sucesso')
    
    act(() => {
      result.current.execute(mockOperation)
    })
    
    // Erro deve ser limpo imediatamente
    expect(result.current.error).toBeNull()
    expect(result.current.loading).toBe(true)
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    
    expect(result.current.data).toBe('sucesso')
    expect(result.current.error).toBeNull()
  })

  it('deve executar múltiplas operações sequencialmente', async () => {
    const { result } = renderHook(() => useAsyncOperation<number>())
    
    const operation1 = jest.fn().mockResolvedValue(1)
    const operation2 = jest.fn().mockResolvedValue(2)
    
    // Primeira operação
    act(() => {
      result.current.execute(operation1)
    })
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    
    expect(result.current.data).toBe(1)
    
    // Segunda operação
    act(() => {
      result.current.execute(operation2)
    })
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    
    expect(result.current.data).toBe(2)
    expect(operation1).toHaveBeenCalledTimes(1)
    expect(operation2).toHaveBeenCalledTimes(1)
  })

  it('deve logar erros no console', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
    const { result } = renderHook(() => useAsyncOperation<string>())
    
    const mockError = new Error('Erro de teste')
    const mockOperation = jest.fn().mockRejectedValue(mockError)
    
    act(() => {
      result.current.execute(mockOperation)
    })
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    
    expect(consoleSpy).toHaveBeenCalledWith('AsyncOperation error:', mockError)
    
    consoleSpy.mockRestore()
  })
})