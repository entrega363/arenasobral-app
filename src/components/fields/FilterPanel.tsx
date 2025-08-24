'use client'

import { useState } from 'react'
import { X, MapPin, DollarSign, Calendar, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { FieldFilters } from '@/types'

interface FilterPanelProps {
  filters: FieldFilters
  onFiltersChange: (filters: FieldFilters) => void
  onClearFilters: () => void
  onClose: () => void
}

export function FilterPanel({ filters, onFiltersChange, onClearFilters, onClose }: FilterPanelProps) {
  const [localFilters, setLocalFilters] = useState<FieldFilters>(filters)

  const fieldTypes = [
    { value: 'SOCIETY', label: 'Society' },
    { value: 'FUTSAL', label: 'Futsal' },
    { value: 'BEACH', label: 'Beach Soccer' },
    { value: 'INDOOR', label: 'Indoor' }
  ]

  const amenitiesList = [
    { id: '1', name: 'Vestiário' },
    { id: '2', name: 'Estacionamento' },
    { id: '3', name: 'Iluminação' },
    { id: '4', name: 'Chuveiro' },
    { id: '5', name: 'Cobertura' },
    { id: '6', name: 'Arquibancada' },
    { id: '7', name: 'Som Ambiente' },
    { id: '8', name: 'Lanchonete' },
    { id: '9', name: 'Wi-Fi' }
  ]

  const handleLocationChange = (location: string) => {
    setLocalFilters(prev => ({ ...prev, location: location || undefined }))
  }

  const handlePriceRangeChange = (min: number, max: number) => {
    setLocalFilters(prev => ({
      ...prev,
      priceRange: min > 0 || max < 200 ? { min, max } : undefined
    }))
  }

  const handleFieldTypeChange = (fieldType: string) => {
    setLocalFilters(prev => ({
      ...prev,
      fieldType: fieldType ? fieldType as any : undefined
    }))
  }

  const handleAmenityToggle = (amenityId: string) => {
    setLocalFilters(prev => {
      const currentAmenities = prev.amenities || []
      const isSelected = currentAmenities.includes(amenityId)
      
      const newAmenities = isSelected
        ? currentAmenities.filter(id => id !== amenityId)
        : [...currentAmenities, amenityId]
      
      return {
        ...prev,
        amenities: newAmenities.length > 0 ? newAmenities : undefined
      }
    })
  }

  const handleTimeRangeChange = (start: string, end: string) => {
    setLocalFilters(prev => ({
      ...prev,
      timeRange: start || end ? { start, end } : undefined
    }))
  }

  const applyFilters = () => {
    onFiltersChange(localFilters)
    onClose()
  }

  const clearFilters = () => {
    setLocalFilters({})
    onClearFilters()
    onClose()
  }

  const hasActiveFilters = Object.keys(localFilters).length > 0

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
      <Card className="w-full max-h-[80vh] overflow-y-auto bg-white rounded-t-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold text-slate-800">Filtros</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-4 space-y-6">
          {/* Location Filter */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-slate-600" />
              <label className="font-medium text-slate-700">Localização</label>
            </div>
            <input
              type="text"
              placeholder="Digite o bairro ou região..."
              value={localFilters.location || ''}
              onChange={(e) => handleLocationChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Price Range Filter */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="w-5 h-5 text-slate-600" />
              <label className="font-medium text-slate-700">Faixa de Preço (por hora)</label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-slate-600 mb-1 block">Mínimo</label>
                <input
                  type="number"
                  placeholder="R$ 0"
                  min="0"
                  value={localFilters.priceRange?.min || ''}
                  onChange={(e) => handlePriceRangeChange(
                    parseInt(e.target.value) || 0,
                    localFilters.priceRange?.max || 200
                  )}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm text-slate-600 mb-1 block">Máximo</label>
                <input
                  type="number"
                  placeholder="R$ 200"
                  min="0"
                  value={localFilters.priceRange?.max || ''}
                  onChange={(e) => handlePriceRangeChange(
                    localFilters.priceRange?.min || 0,
                    parseInt(e.target.value) || 200
                  )}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Field Type Filter */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-slate-600" />
              <label className="font-medium text-slate-700">Tipo de Quadra</label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {fieldTypes.map((type) => (
                <label
                  key={type.value}
                  className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition ${
                    localFilters.fieldType === type.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="fieldType"
                    value={type.value}
                    checked={localFilters.fieldType === type.value}
                    onChange={(e) => handleFieldTypeChange(e.target.value)}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium">{type.label}</span>
                </label>
              ))}
            </div>
            {localFilters.fieldType && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleFieldTypeChange('')}
                className="mt-2 text-slate-500 hover:text-slate-700"
              >
                Limpar seleção
              </Button>
            )}
          </div>

          {/* Time Range Filter */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-slate-600" />
              <label className="font-medium text-slate-700">Horário Preferido</label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-slate-600 mb-1 block">Das</label>
                <input
                  type="time"
                  value={localFilters.timeRange?.start || ''}
                  onChange={(e) => handleTimeRangeChange(
                    e.target.value,
                    localFilters.timeRange?.end || ''
                  )}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm text-slate-600 mb-1 block">Até</label>
                <input
                  type="time"
                  value={localFilters.timeRange?.end || ''}
                  onChange={(e) => handleTimeRangeChange(
                    localFilters.timeRange?.start || '',
                    e.target.value
                  )}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Amenities Filter */}
          <div>
            <label className="font-medium text-slate-700 mb-3 block">Comodidades</label>
            <div className="grid grid-cols-2 gap-2">
              {amenitiesList.map((amenity) => (
                <label
                  key={amenity.id}
                  className={`flex items-center gap-2 p-2 border rounded-lg cursor-pointer transition ${
                    localFilters.amenities?.includes(amenity.id)
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={localFilters.amenities?.includes(amenity.id) || false}
                    onChange={() => handleAmenityToggle(amenity.id)}
                    className="sr-only"
                  />
                  <span className="text-sm">{amenity.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex gap-3">
          <Button
            variant="outline"
            onClick={clearFilters}
            className="flex-1"
            disabled={!hasActiveFilters}
          >
            Limpar Filtros
          </Button>
          <Button
            onClick={applyFilters}
            className="flex-1 bg-blue-500 hover:bg-blue-600"
          >
            Aplicar Filtros
          </Button>
        </div>
      </Card>
    </div>
  )
}