/**
 * Sistema de analytics e métricas para monitorar performance e uso
 */

interface AnalyticsEvent {
  name: string
  properties?: Record<string, any>
  timestamp: number
  sessionId: string
  userId?: string
}

interface PerformanceMetric {
  name: string
  value: number
  timestamp: number
  metadata?: Record<string, any>
}

class Analytics {
  private events: AnalyticsEvent[] = []
  private metrics: PerformanceMetric[] = []
  private sessionId: string
  private userId?: string
  private isEnabled: boolean = true

  constructor() {
    this.sessionId = this.generateSessionId()
    this.setupPerformanceObserver()
  }

  /**
   * Gera ID único para a sessão
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Configura observador de performance
   */
  private setupPerformanceObserver(): void {
    if (typeof window === 'undefined') return

    // Observa métricas de navegação
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.recordMetric(entry.name, entry.duration, {
              entryType: entry.entryType,
              startTime: entry.startTime
            })
          }
        })

        observer.observe({ entryTypes: ['navigation', 'measure', 'paint'] })
      } catch (error) {
        console.warn('Performance Observer não suportado:', error)
      }
    }
  }

  /**
   * Define o usuário atual
   */
  setUser(userId: string): void {
    this.userId = userId
  }

  /**
   * Habilita/desabilita analytics
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled
  }

  /**
   * Registra um evento
   */
  track(eventName: string, properties?: Record<string, any>): void {
    if (!this.isEnabled) return

    const event: AnalyticsEvent = {
      name: eventName,
      properties,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId
    }

    this.events.push(event)
    
    // Mantém apenas os últimos 1000 eventos
    if (this.events.length > 1000) {
      this.events = this.events.slice(-1000)
    }

    // Log em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Analytics Event:', eventName, properties)
    }
  }

  /**
   * Registra uma métrica de performance
   */
  recordMetric(name: string, value: number, metadata?: Record<string, any>): void {
    if (!this.isEnabled) return

    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      metadata
    }

    this.metrics.push(metric)

    // Mantém apenas as últimas 500 métricas
    if (this.metrics.length > 500) {
      this.metrics = this.metrics.slice(-500)
    }

    // Log métricas importantes
    if (process.env.NODE_ENV === 'development' && value > 1000) {
      console.warn('⚠️ Performance Warning:', name, `${value}ms`, metadata)
    }
  }

  /**
   * Mede tempo de execução de uma função
   */
  time<T>(name: string, fn: () => T): T {
    const start = performance.now()
    const result = fn()
    const duration = performance.now() - start
    
    this.recordMetric(name, duration)
    return result
  }

  /**
   * Mede tempo de execução de uma função assíncrona
   */
  async timeAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now()
    const result = await fn()
    const duration = performance.now() - start
    
    this.recordMetric(name, duration)
    return result
  }

  /**
   * Obtém estatísticas dos eventos
   */
  getEventStats(): Record<string, number> {
    const stats: Record<string, number> = {}
    
    for (const event of this.events) {
      stats[event.name] = (stats[event.name] || 0) + 1
    }
    
    return stats
  }

  /**
   * Obtém estatísticas de performance
   */
  getPerformanceStats(): Record<string, { avg: number; min: number; max: number; count: number }> {
    const stats: Record<string, { values: number[]; avg: number; min: number; max: number; count: number }> = {}
    
    for (const metric of this.metrics) {
      if (!stats[metric.name]) {
        stats[metric.name] = { values: [], avg: 0, min: Infinity, max: 0, count: 0 }
      }
      
      stats[metric.name].values.push(metric.value)
      stats[metric.name].min = Math.min(stats[metric.name].min, metric.value)
      stats[metric.name].max = Math.max(stats[metric.name].max, metric.value)
      stats[metric.name].count++
    }
    
    // Calcula médias
    for (const [name, data] of Object.entries(stats)) {
      data.avg = data.values.reduce((sum, val) => sum + val, 0) / data.values.length
      delete (data as any).values // Remove valores para economizar memória
    }
    
    return stats
  }

  /**
   * Exporta dados para análise
   */
  exportData(): { events: AnalyticsEvent[]; metrics: PerformanceMetric[]; session: string } {
    return {
      events: [...this.events],
      metrics: [...this.metrics],
      session: this.sessionId
    }
  }

  /**
   * Limpa dados armazenados
   */
  clear(): void {
    this.events = []
    this.metrics = []
  }
}

// Instância global
export const analytics = new Analytics()

// Eventos pré-definidos
export const AnalyticsEvents = {
  // Navegação
  PAGE_VIEW: 'page_view',
  NAVIGATION: 'navigation',
  
  // Busca
  SEARCH_PERFORMED: 'search_performed',
  SEARCH_RESULTS: 'search_results',
  FILTER_APPLIED: 'filter_applied',
  
  // Areninhas
  FIELD_VIEWED: 'field_viewed',
  FIELD_CLICKED: 'field_clicked',
  
  // Reservas
  BOOKING_STARTED: 'booking_started',
  BOOKING_STEP: 'booking_step',
  BOOKING_COMPLETED: 'booking_completed',
  BOOKING_CANCELLED: 'booking_cancelled',
  
  // Erros
  ERROR_OCCURRED: 'error_occurred',
  API_ERROR: 'api_error',
  
  // Performance
  COMPONENT_RENDER: 'component_render',
  DATA_LOAD: 'data_load',
  
  // Interações
  BUTTON_CLICKED: 'button_clicked',
  FORM_SUBMITTED: 'form_submitted',
  MODAL_OPENED: 'modal_opened',
  MODAL_CLOSED: 'modal_closed'
} as const

// Hook para usar analytics em componentes React
export function useAnalytics() {
  const trackEvent = (eventName: string, properties?: Record<string, any>) => {
    analytics.track(eventName, properties)
  }

  const trackPageView = (pageName: string, properties?: Record<string, any>) => {
    analytics.track(AnalyticsEvents.PAGE_VIEW, {
      page: pageName,
      ...properties
    })
  }

  const trackError = (error: Error, context?: Record<string, any>) => {
    analytics.track(AnalyticsEvents.ERROR_OCCURRED, {
      error: error.message,
      stack: error.stack,
      context
    })
  }

  const measurePerformance = <T>(name: string, fn: () => T): T => {
    return analytics.time(name, fn)
  }

  const measurePerformanceAsync = <T>(name: string, fn: () => Promise<T>): Promise<T> => {
    return analytics.timeAsync(name, fn)
  }

  return {
    trackEvent,
    trackPageView,
    trackError,
    measurePerformance,
    measurePerformanceAsync
  }
}

// Utilitários para métricas específicas
export const PerformanceMetrics = {
  COMPONENT_MOUNT: 'component_mount',
  COMPONENT_UPDATE: 'component_update',
  API_CALL: 'api_call',
  SEARCH_QUERY: 'search_query',
  RENDER_TIME: 'render_time',
  LOAD_TIME: 'load_time'
} as const

// Decorator para medir performance de métodos
export function measureMethod(metricName?: string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value
    const name = metricName || `${target.constructor.name}.${propertyName}`

    descriptor.value = function (...args: any[]) {
      return analytics.time(name, () => method.apply(this, args))
    }

    return descriptor
  }
}

// Decorator para medir performance de métodos assíncronos
export function measureAsyncMethod(metricName?: string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value
    const name = metricName || `${target.constructor.name}.${propertyName}`

    descriptor.value = function (...args: any[]) {
      return analytics.timeAsync(name, () => method.apply(this, args))
    }

    return descriptor
  }
}