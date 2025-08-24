'use client'

import { Field } from '@/types'
import { Card } from '@/components/ui/card'
import { Star, MapPin } from 'lucide-react'
import { useResponsive } from '@/hooks/useResponsive'

interface FieldCardProps {
  field: Field
  onClick: (fieldId: string) => void
}

export function FieldCard({ field, onClick }: FieldCardProps) {
  const { isMobile } = useResponsive()
  
  const handleClick = () => {
    onClick(field.id)
  }

  const formatFieldType = (type: string) => {
    const types = {
      'SOCIETY': 'Society',
      'FUTSAL': 'Futsal',
      'BEACH': 'Beach Soccer',
      'INDOOR': 'Indoor'
    }
    return types[type as keyof typeof types] || type
  }

  return (
    <Card 
      className={`bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-200 cursor-pointer ${
        isMobile 
          ? 'hover:shadow-lg active:shadow-xl active:scale-[0.98]' 
          : 'hover:shadow-xl transform hover:-translate-y-1'
      }`}
      onClick={handleClick}
    >
      <div className={isMobile ? 'p-3' : 'p-4'}>
        <div className={`flex gap-${isMobile ? '3' : '4'}`}>
          {/* Field Image */}
          <div className={`bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden ${
            isMobile ? 'w-20 h-20' : 'w-24 h-24'
          }`}>
            {field.photos.length > 0 && field.photos[0].isPrimary ? (
              <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                <span className="text-white text-xs font-bold">ARENA</span>
              </div>
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400 text-xs font-medium">SEM FOTO</span>
              </div>
            )}
          </div>

          {/* Field Information */}
          <div className="flex-1 min-w-0">
            {/* Header with name and rating */}
            <div className={`flex items-start justify-between ${isMobile ? 'mb-1' : 'mb-2'}`}>
              <h3 className={`font-bold text-slate-800 leading-tight truncate pr-2 ${
                isMobile ? 'text-base' : 'text-lg'
              }`}>
                {field.name}
              </h3>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className={`font-medium text-slate-700 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                  {field.rating.toFixed(1)}
                </span>
              </div>
            </div>
            
            {/* Location */}
            <div className={`flex items-center gap-1 ${isMobile ? 'mb-2' : 'mb-3'}`}>
              <MapPin className="w-4 h-4 text-slate-400" />
              <p className={`text-slate-600 truncate ${isMobile ? 'text-xs' : 'text-sm'}`}>
                {field.location}
              </p>
            </div>
            
            {/* Price and Type */}
            <div className={`flex items-center justify-between ${isMobile ? 'mb-2' : 'mb-3'}`}>
              <span className={`text-green-600 font-bold ${isMobile ? 'text-base' : 'text-lg'}`}>
                R$ {field.pricePerHour}
                <span className={`font-normal text-slate-500 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                  /hora
                </span>
              </span>
              <span className={`text-slate-600 bg-slate-100 rounded-full font-medium ${
                isMobile ? 'text-xs px-2 py-1' : 'text-xs px-3 py-1'
              }`}>
                {formatFieldType(field.fieldType)}
              </span>
            </div>

            {/* Amenities Preview */}
            {field.amenities.length > 0 && (
              <div className="flex gap-1 flex-wrap">
                {field.amenities.slice(0, 3).map((amenity) => (
                  <span 
                    key={amenity.id} 
                    className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded font-medium"
                  >
                    {amenity.name}
                  </span>
                ))}
                {field.amenities.length > 3 && (
                  <span className="text-xs text-slate-500 px-2 py-1">
                    +{field.amenities.length - 3} mais
                  </span>
                )}
              </div>
            )}

            {/* Reviews count */}
            {field.reviews.length > 0 && (
              <div className="mt-2 text-xs text-slate-500">
                {field.reviews.length} avaliação{field.reviews.length !== 1 ? 'ões' : ''}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}