'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Star, Clock, Users, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { supabaseFieldService } from '@/lib/supabase/fieldService'
import { SupabaseField } from '@/types'
import { formatCurrency } from '@/lib/supabase/format'

interface FieldListProps {
  filters?: {
    location?: string
    fieldType?: string
    minPrice?: number
    maxPrice?: number
  }
}

export function SupabaseFieldList({ filters }: FieldListProps) {
  const router = useRouter()
  const [fields, setFields] = useState<SupabaseField[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    loadFields()
  }, [filters])

  const loadFields = async () => {
    try {
      setLoading(true)
      
      // Obter todos os campos do Supabase
      let allFields = await supabaseFieldService.getAllFields()
      
      // Aplicar filtros se fornecidos
      if (filters) {
        if (filters.location) {
          allFields = allFields.filter(field => 
            field.location.toLowerCase().includes(filters.location!.toLowerCase())
          )
        }
        
        if (filters.fieldType) {
          allFields = allFields.filter(field => 
            field.field_type === filters.fieldType
          )
        }
        
        if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
          allFields = allFields.filter(field => {
            const price = field.price_per_hour
            return (
              (filters.minPrice === undefined || price >= filters.minPrice) &&
              (filters.maxPrice === undefined || price <= filters.maxPrice)
            )
          })
        }
      }
      
      setFields(allFields)
    } catch (error) {
      console.error('Error loading fields:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFieldClick = (fieldId: string) => {
    router.push(`/search/fields/${fieldId}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex justify-between items-center">
        <h2 className="text-white text-lg font-bold">Areninhas Disponíveis</h2>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="text-white border-white hover:bg-white/10"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filtros
        </Button>
      </div>

      {showFilters && (
        <Card className="bg-white/10 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-white text-sm mb-1 block">Localização</label>
                <input
                  type="text"
                  placeholder="Digite a localização"
                  className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-white/70"
                />
              </div>
              <div>
                <label className="text-white text-sm mb-1 block">Tipo de Campo</label>
                <select className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white">
                  <option value="">Todos</option>
                  <option value="SOCIETY">Society</option>
                  <option value="GRASS">Gramado</option>
                  <option value="CONCRETE">Quadra</option>
                </select>
              </div>
              <div>
                <label className="text-white text-sm mb-1 block">Preço Máximo</label>
                <input
                  type="number"
                  placeholder="R$ 0"
                  className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-white/70"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button className="flex-1 bg-blue-500 hover:bg-blue-600">Aplicar Filtros</Button>
              <Button variant="outline" className="flex-1 text-white border-white hover:bg-white/10">Limpar</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de Campos */}
      {fields.length === 0 ? (
        <Card className="bg-white p-8 text-center">
          <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-slate-800 mb-2">Nenhuma areninha encontrada</h3>
          <p className="text-slate-600">Tente ajustar seus filtros de busca</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {fields.map((field) => (
            <Card 
              key={field.id} 
              className="bg-white cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleFieldClick(field.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-slate-800 text-lg">{field.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{field.rating.toFixed(1)}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{field.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>Society</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>8x8</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <span className="font-bold text-green-600">{formatCurrency(field.price_per_hour)}/hora</span>
                    <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                      Reservar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}