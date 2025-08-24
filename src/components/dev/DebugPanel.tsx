'use client'

import { useState, useEffect } from 'react'
import { X, BarChart3, Database, Zap, Bug, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { analytics } from '@/lib/analytics'
import { cache, getCacheStats } from '@/lib/cache'
import { useResponsive } from '@/hooks/useResponsive'

interface DebugPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function DebugPanel({ isOpen, onClose }: DebugPanelProps) {
  const { isMobile, screenSize } = useResponsive()
  const [activeTab, setActiveTab] = useState<'analytics' | 'cache' | 'performance' | 'system'>('analytics')
  const [analyticsStats, setAnalyticsStats] = useState<any>({})
  const [performanceStats, setPerformanceStats] = useState<any>({})
  const [cacheStats, setCacheStats] = useState<any>({})

  useEffect(() => {
    if (isOpen) {
      updateStats()
      const interval = setInterval(updateStats, 2000)
      return () => clearInterval(interval)
    }
  }, [isOpen])

  const updateStats = () => {
    setAnalyticsStats(analytics.getEventStats())
    setPerformanceStats(analytics.getPerformanceStats())
    setCacheStats(getCacheStats())
  }

  if (!isOpen || process.env.NODE_ENV !== 'development') {
    return null
  }

  const tabs = [
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'cache', label: 'Cache', icon: Database },
    { id: 'performance', label: 'Performance', icon: Zap },
    { id: 'system', label: 'Sistema', icon: Settings }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4">
      <Card className={`bg-white ${isMobile ? 'w-full h-full' : 'w-4/5 h-4/5'} max-w-6xl overflow-hidden`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <div className="flex items-center gap-2">
            <Bug className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900">Debug Panel</h2>
            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">DEV</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex h-full">
          {/* Sidebar */}
          <div className={`border-r bg-gray-50 ${isMobile ? 'w-16' : 'w-48'}`}>
            <nav className="p-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`
                      w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors
                      ${activeTab === tab.id 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'text-gray-600 hover:bg-gray-100'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    {!isMobile && <span className="text-sm font-medium">{tab.label}</span>}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-auto">
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold">Analytics & Eventos</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4">
                    <h4 className="font-medium mb-3">Eventos Recentes</h4>
                    <div className="space-y-2 max-h-64 overflow-auto">
                      {Object.entries(analyticsStats).map(([event, count]) => (
                        <div key={event} className="flex justify-between text-sm">
                          <span className="text-gray-600">{event}</span>
                          <span className="font-medium">{count as number}</span>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h4 className="font-medium mb-3">Ações Rápidas</h4>
                    <div className="space-y-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => analytics.clear()}
                        className="w-full"
                      >
                        Limpar Analytics
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          const data = analytics.exportData()
                          console.log('Analytics Data:', data)
                        }}
                        className="w-full"
                      >
                        Exportar Dados
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'cache' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold">Cache Status</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4">
                    <h4 className="font-medium text-gray-600">Tamanho</h4>
                    <p className="text-2xl font-bold">{cacheStats.size}</p>
                    <p className="text-sm text-gray-500">itens armazenados</p>
                  </Card>
                  
                  <Card className="p-4">
                    <h4 className="font-medium text-gray-600">Uso</h4>
                    <p className="text-2xl font-bold">{cacheStats.usage?.toFixed(1)}%</p>
                    <p className="text-sm text-gray-500">da capacidade</p>
                  </Card>
                  
                  <Card className="p-4">
                    <h4 className="font-medium text-gray-600">Limite</h4>
                    <p className="text-2xl font-bold">{cacheStats.maxSize}</p>
                    <p className="text-sm text-gray-500">itens máximo</p>
                  </Card>
                </div>

                <Card className="p-4">
                  <h4 className="font-medium mb-3">Ações do Cache</h4>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        cache.clear()
                        updateStats()
                      }}
                    >
                      Limpar Cache
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        cache.cleanup()
                        updateStats()
                      }}
                    >
                      Limpar Expirados
                    </Button>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'performance' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold">Métricas de Performance</h3>
                
                <div className="space-y-4">
                  {Object.entries(performanceStats).map(([metric, stats]: [string, any]) => (
                    <Card key={metric} className="p-4">
                      <h4 className="font-medium mb-2">{metric}</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Média:</span>
                          <span className="ml-2 font-medium">{stats.avg?.toFixed(2)}ms</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Mín:</span>
                          <span className="ml-2 font-medium">{stats.min?.toFixed(2)}ms</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Máx:</span>
                          <span className="ml-2 font-medium">{stats.max?.toFixed(2)}ms</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Count:</span>
                          <span className="ml-2 font-medium">{stats.count}</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'system' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold">Informações do Sistema</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4">
                    <h4 className="font-medium mb-3">Tela</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Largura:</span>
                        <span>{screenSize.width}px</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Altura:</span>
                        <span>{screenSize.height}px</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Mobile:</span>
                        <span>{isMobile ? 'Sim' : 'Não'}</span>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h4 className="font-medium mb-3">Navegador</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>User Agent:</span>
                        <span className="text-xs truncate ml-2">
                          {typeof window !== 'undefined' ? window.navigator.userAgent.slice(0, 30) + '...' : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Online:</span>
                        <span>{typeof window !== 'undefined' ? (navigator.onLine ? 'Sim' : 'Não') : 'N/A'}</span>
                      </div>
                    </div>
                  </Card>
                </div>

                <Card className="p-4">
                  <h4 className="font-medium mb-3">LocalStorage</h4>
                  <div className="space-y-2 text-sm">
                    {typeof window !== 'undefined' && Object.keys(localStorage).map(key => (
                      <div key={key} className="flex justify-between">
                        <span className="truncate">{key}:</span>
                        <span className="text-gray-500 ml-2">
                          {(localStorage.getItem(key)?.length || 0)} chars
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}

// Hook para controlar o debug panel
export function useDebugPanel() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Shift + D para abrir debug panel
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
        e.preventDefault()
        setIsOpen(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen(prev => !prev)
  }
}