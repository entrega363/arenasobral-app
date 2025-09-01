'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Filter, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { SupabaseFieldList } from '@/components/fields/SupabaseFieldList'

export default function SearchFieldsPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    location: '',
    fieldType: '',
    minPrice: undefined as number | undefined,
    maxPrice: undefined as number | undefined
  })

  const handleSearch = () => {
    setFilters(prev => ({
      ...prev,
      location: searchTerm
    }))
  }

  const handleApplyFilters = (newFilters: typeof filters) => {
    setFilters(newFilters)
  }

  return (
    <div className="bg-slate-800 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 px-4 py-4 text-white">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => router.back()}
          className="text-white hover:bg-white/10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Button>
        <h1 className="text-xl font-bold">Buscar Areninhas</h1>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Barra de Busca */}
        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por localização..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button 
                onClick={handleSearch}
                className="bg-blue-500 hover:bg-blue-600"
              >
                Buscar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Campos */}
        <SupabaseFieldList filters={filters} />
      </div>
    </div>
  )
}