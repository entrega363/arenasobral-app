'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Upload, Image, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { StatusBar } from '@/components/layout/StatusBar'

export function AdminAdsDashboard() {
  const router = useRouter()
  const [ads, setAds] = useState([
    { id: 1, name: 'Propaganda 1', class: 'ad-placeholder-1' },
    { id: 2, name: 'Propaganda 2', class: 'ad-placeholder-2' },
    { id: 3, name: 'Propaganda 3', class: 'ad-placeholder-3' },
    { id: 4, name: 'Propaganda 4', class: 'ad-placeholder-4' },
    { id: 5, name: 'Propaganda 5', class: 'ad-placeholder-5' }
  ])

  const handleUploadAds = () => {
    router.push('/admin/upload-ads')
  }

  const handleDeleteAd = (id: number) => {
    setAds(ads.filter(ad => ad.id !== id))
  }

  const handleBack = () => {
    router.push('/admin/dashboard')
  }

  return (
    <div className="bg-slate-800 min-h-screen">
      <StatusBar />
      
      <div className="flex items-center gap-4 px-4 py-4 text-white">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleBack}
          className="text-white hover:bg-white/10"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-xl font-bold">Gerenciar Propagandas</h1>
      </div>
      
      <div className="px-4 py-6">
        <Card className="bg-white rounded-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Propagandas do Carrossel</h2>
              <p className="text-slate-600">
                Gerencie as imagens exibidas no carrossel de propagandas
              </p>
            </div>
            <Button
              onClick={handleUploadAds}
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload de Imagens
            </Button>
          </div>
          
          {ads.length === 0 ? (
            <div className="text-center py-12">
              <Image className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">Nenhuma propaganda cadastrada</h3>
              <p className="text-gray-500 mb-4">Adicione imagens para exibir no carrossel</p>
              <Button onClick={handleUploadAds} className="bg-blue-500 text-white hover:bg-blue-600">
                Adicionar Primeira Propaganda
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ads.map((ad) => (
                <Card key={ad.id} className="overflow-hidden">
                  <div className={`h-32 ${ad.class} ad-placeholder flex items-center justify-center`}>
                    <span className="text-xl font-bold text-white drop-shadow-lg">
                      {ad.name}
                    </span>
                  </div>
                  <div className="p-3 flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-700">{ad.name}</span>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteAd(ad.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>
        
        <div className="flex gap-3">
          <Button
            onClick={handleBack}
            className="flex-1 bg-gray-500 text-white font-medium py-3 rounded-lg hover:bg-gray-600 transition"
          >
            Voltar ao Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}