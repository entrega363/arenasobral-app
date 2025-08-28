'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { StatusBar } from '@/components/layout/StatusBar'
import { FieldCard } from '@/components/fields/FieldCard'
import { FilterPanel } from '@/components/fields/FilterPanel'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { SkeletonCard } from '@/components/ui/SkeletonCard'
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout'
import { MobileSearchInput } from '@/components/ui/MobileSearchInput'
import { AdBannerCarousel } from '@/components/ads/AdBannerCarousel'
import { FieldService } from '@/lib/fieldService'
import { Field, FieldFilters } from '@/types'
import { useResponsive } from '@/hooks/useResponsive'
import { useAsyncOperation } from '@/hooks/useAsyncOperation'

export function SearchFieldsScreen() {
  const router = useRouter()
  const { isMobile } = useResponsive()
  const { data: fields, loading, error, execute: loadFields } = useAsyncOperation<Field[]>([])
  const [filteredFields, setFilteredFields] = useState<Field[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<FieldFilters>({})

  useEffect(() => {
    loadFieldsData()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [fields, searchTerm, filters])

  const loadFieldsData = async () => {
    await loadFields(async () => {
      // Simulate network delay for better UX demonstration
      await new Promise(resolve => setTimeout(resolve, 500))
      return FieldService.getAllFields()
    })
  }

  const applyFilters = () => {
    if (!fields) return
    let result = fields

    // Combine search term with filters
    const combinedFilters: FieldFilters = {
      ...filters,
      location: searchTerm || filters.location
    }

    // Apply filters if any exist
    if (searchTerm || Object.keys(filters).length > 0) {
      result = FieldService.searchFields(combinedFilters)
    }

    setFilteredFields(result)
  }

  const handleFiltersChange = (newFilters: FieldFilters) => {
    setFilters(newFilters)
  }

  const handleFieldClick = (fieldId: string) => {
    router.push(`/search/fields/${fieldId}`)
  }

  const handleUploadClick = () => {
    router.push('/admin/upload-ads')
  }

  const clearFilters = () => {
    setFilters({})
    setSearchTerm('')
    setShowFilters(false)
  }

  const closeFilters = () => {
    setShowFilters(false)
  }

  if (loading) {
    return (
      <ResponsiveLayout
        title="Buscar Areninhas"
        showBackButton={true}
        showBottomNav={true}
      >
        <div className="px-4 pb-8">
          <div className="mb-6">
            <div className="flex gap-2">
              <div className="flex-1 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
          <SkeletonCard variant="field" count={3} />
        </div>
      </ResponsiveLayout>
    )
  }

  if (error) {
    return (
      <ResponsiveLayout
        title="Buscar Areninhas"
        showBackButton={true}
        showBottomNav={true}
      >
        <div className="px-4 py-8">
          <ErrorMessage
            title="Erro ao carregar areninhas"
            message={error}
            onRetry={loadFieldsData}
          />
        </div>
      </ResponsiveLayout>
    )
  }

  return (
    <ResponsiveLayout
      title="Buscar Areninhas"
      showBackButton={true}
      showBottomNav={true}
    >
      {/* Header with enhanced title */}
      <div className="px-4 pt-4">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-white">Buscar Areninhas</h1>
          <p className="text-slate-300 text-sm">Encontre e reserve quadras esportivas próximas a você</p>
        </div>
        
        {/* Ad Banner Carousel */}
        <AdBannerCarousel isAdmin={false} onUpload={handleUploadClick} />
      </div>
      
      {/* Search and Filter Bar */}
      <MobileSearchInput
        value={searchTerm}
        onChange={setSearchTerm}
        onFilterClick={() => setShowFilters(!showFilters)}
        placeholder="Buscar por nome ou localização..."
        showFilterButton={true}
      />

      {/* Active Filters Indicator */}
      {Object.keys(filters).length > 0 && (
        <div className="px-4 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-white text-sm">Filtros ativos:</span>
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="bg-blue-500 text-white border-blue-500 hover:bg-blue-600 text-xs"
            >
              Limpar Filtros
            </Button>
          </div>
        </div>
      )}

      {/* Results */}
      <div className={`px-4 ${isMobile ? 'pb-4' : 'pb-8'}`}>
        {filteredFields.length === 0 ? (
          <Card className={`bg-white text-center ${isMobile ? 'p-6' : 'p-8'}`}>
            <div className="text-gray-500 mb-4">
              <Search className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <h3 className={`font-medium mb-2 ${isMobile ? 'text-base' : 'text-lg'}`}>
                Nenhuma areninha encontrada
              </h3>
              <p className="text-sm">
                {searchTerm || Object.keys(filters).length > 0
                  ? 'Tente ajustar sua busca ou filtros'
                  : 'Não há areninhas disponíveis no momento'
                }
              </p>
            </div>
            {(searchTerm || Object.keys(filters).length > 0) && (
              <Button onClick={clearFilters} variant="outline">
                Limpar Busca
              </Button>
            )}
          </Card>
        ) : (
          <div className={`space-y-${isMobile ? '3' : '4'}`}>
            <div className="text-white text-sm mb-4">
              {filteredFields.length} areninha{filteredFields.length !== 1 ? 's' : ''} encontrada{filteredFields.length !== 1 ? 's' : ''}
            </div>
            
            {filteredFields.map((field) => (
              <FieldCard 
                key={field.id} 
                field={field} 
                onClick={handleFieldClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <FilterPanel
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={clearFilters}
          onClose={() => setShowFilters(false)}
        />
      )}
    </ResponsiveLayout>
  )
}