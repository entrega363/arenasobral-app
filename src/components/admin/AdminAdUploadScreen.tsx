'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { StatusBar } from '@/components/layout/StatusBar'

export function AdminAdUploadScreen() {
  const router = useRouter()
  const [images, setImages] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setImages(prev => [...prev, ...files])
      
      // Create preview URLs
      const newPreviewUrls = files.map(file => URL.createObjectURL(file))
      setPreviewUrls(prev => [...prev, ...newPreviewUrls])
    }
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    setPreviewUrls(prev => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (images.length === 0) return
    
    setIsUploading(true)
    
    // Simulate upload process
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // In a real app, you would upload to a server here
    console.log('Uploading images:', images)
    
    setIsUploading(false)
    alert('Imagens enviadas com sucesso!')
    router.push('/admin/dashboard')
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
        <h1 className="text-xl font-bold">Upload de Propagandas</h1>
      </div>
      
      <div className="px-4 py-6">
        <Card className="bg-white rounded-xl p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-800 mb-2">Enviar Novas Propagandas</h2>
            <p className="text-slate-600">
              Selecione até 5 imagens para exibir no carrossel de propagandas.
            </p>
          </div>
          
          {/* Image upload area */}
          <div className="mb-6">
            <label className="block text-slate-600 text-sm mb-2">
              Selecione as imagens
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">
                  Clique para selecionar imagens ou arraste e solte aqui
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  PNG, JPG, GIF até 5MB
                </p>
              </label>
            </div>
          </div>
          
          {/* Image previews */}
          {previewUrls.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-slate-800 mb-3">Pré-visualização</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Upload button */}
          <div className="flex gap-3">
            <Button
              onClick={handleUpload}
              disabled={images.length === 0 || isUploading}
              className="flex-1 bg-blue-500 text-white font-medium py-3 rounded-lg hover:bg-blue-600 transition"
            >
              {isUploading ? 'Enviando...' : 'Enviar Imagens'}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex-1 font-medium py-3 rounded-lg"
            >
              Cancelar
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}