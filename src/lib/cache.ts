/**
 * Sistema de cache simples para melhorar performance
 */

interface CacheItem<T> {
  data: T
  timestamp: number
  ttl: number // Time to live em milliseconds
}

class SimpleCache {
  private cache = new Map<string, CacheItem<any>>()
  private maxSize = 100 // Máximo de itens no cache

  /**
   * Armazena um item no cache
   */
  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    // Remove itens expirados se o cache estiver cheio
    if (this.cache.size >= this.maxSize) {
      this.cleanup()
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  /**
   * Recupera um item do cache
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key)
    
    if (!item) {
      return null
    }

    // Verifica se o item expirou
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }

    return item.data as T
  }

  /**
   * Remove um item do cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  /**
   * Limpa itens expirados
   */
  cleanup(): void {
    const now = Date.now()
    
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key)
      }
    }
  }

  /**
   * Limpa todo o cache
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * Retorna o tamanho atual do cache
   */
  size(): number {
    return this.cache.size
  }

  /**
   * Verifica se uma chave existe no cache
   */
  has(key: string): boolean {
    const item = this.cache.get(key)
    
    if (!item) {
      return false
    }

    // Verifica se não expirou
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return false
    }

    return true
  }
}

// Instância global do cache
export const cache = new SimpleCache()

/**
 * Hook para usar cache com React
 */
export function useCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 5 * 60 * 1000
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true)
      setError(null)

      // Tenta buscar do cache primeiro
      if (!forceRefresh) {
        const cachedData = cache.get<T>(key)
        if (cachedData) {
          setData(cachedData)
          setLoading(false)
          return cachedData
        }
      }

      // Busca dados frescos
      const freshData = await fetcher()
      
      // Armazena no cache
      cache.set(key, freshData, ttl)
      setData(freshData)
      
      return freshData
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMessage)
      console.error('Erro ao buscar dados:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [key, fetcher, ttl])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const refresh = () => fetchData(true)
  const clearCache = () => cache.delete(key)

  return {
    data,
    loading,
    error,
    refresh,
    clearCache
  }
}

/**
 * Utilitários para chaves de cache
 */
export const CacheKeys = {
  // Areninhas
  ALL_FIELDS: 'fields:all',
  FIELD_BY_ID: (id: string) => `fields:${id}`,
  FIELD_SEARCH: (filters: string) => `fields:search:${filters}`,
  
  // Horários
  TIME_SLOTS: (fieldId: string, date: string) => `timeslots:${fieldId}:${date}`,
  
  // Reservas
  USER_BOOKINGS: (userId: string) => `bookings:user:${userId}`,
  FIELD_BOOKINGS: (fieldId: string) => `bookings:field:${fieldId}`,
  
  // Outros
  USER_PROFILE: (userId: string) => `profile:${userId}`,
  FIELD_REVIEWS: (fieldId: string) => `reviews:${fieldId}`
}

/**
 * Middleware para cache automático
 */
export function withCache<T extends any[], R>(
  fn: (...args: T) => R,
  keyGenerator: (...args: T) => string,
  ttl: number = 5 * 60 * 1000
) {
  return (...args: T): R => {
    const key = keyGenerator(...args)
    
    // Tenta buscar do cache
    const cached = cache.get<R>(key)
    if (cached) {
      return cached
    }

    // Executa função e armazena resultado
    const result = fn(...args)
    cache.set(key, result, ttl)
    
    return result
  }
}

/**
 * Invalidação de cache por padrão
 */
export function invalidateCache(pattern: string): void {
  const keysToDelete: string[] = []
  
  for (const [key] of cache['cache'].entries()) {
    if (key.includes(pattern)) {
      keysToDelete.push(key)
    }
  }
  
  keysToDelete.forEach(key => cache.delete(key))
}

/**
 * Pré-carregamento de dados
 */
export async function preloadData<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 5 * 60 * 1000
): Promise<void> {
  try {
    // Só pré-carrega se não estiver no cache
    if (!cache.has(key)) {
      const data = await fetcher()
      cache.set(key, data, ttl)
    }
  } catch (error) {
    console.warn('Erro no pré-carregamento:', error)
  }
}

/**
 * Estatísticas do cache
 */
export function getCacheStats() {
  return {
    size: cache.size(),
    maxSize: cache['maxSize'],
    usage: (cache.size() / cache['maxSize']) * 100
  }
}