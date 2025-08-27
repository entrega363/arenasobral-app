'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'

interface BannerImage {
  id: string
  url: string
  title: string
}

export function PlayerAdvertisingBanner() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [images, setImages] = useState<BannerImage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBannerImages()
  }, [])

  useEffect(() => {
    if (images.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [images.length])

  const loadBannerImages = () => {
    try {
      // Carregar imagens do localStorage ou usar padrão
      const savedImages = localStorage.getItem('playerBannerImages')
      if (savedImages) {
        try {
          const parsedImages = JSON.parse(savedImages)
          setImages(parsedImages)
        } catch (e) {
          setDefaultImages()
        }
      } else {
        setDefaultImages()
      }
    } catch (e) {
      setDefaultImages()
    } finally {
      setLoading(false)
    }
  }

  const setDefaultImages = () => {
    const defaultImages: BannerImage[] = [
      {
        id: '1',
        url: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&h=400&fit=crop',
        title: 'Arena Sobral - Melhor experiência esportiva'
      },
      {
        id: '2',
        url: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&h=400&fit=crop',
        title: 'Campeonato Regional 2025'
      },
      {
        id: '3',
        url: 'https://images.unsplash.com/photo-1574629810360-7efbbebbb6f1?w=800&h=400&fit=crop',
        title: 'Novas Areninhas Disponíveis'
      },
      {
        id: '4',
        url: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800&h=400&fit=crop',
        title: 'Descontos Especiais para Times'
      },
      {
        id: '5',
        url: 'https://images.unsplash.com/photo-1508098682722-e9ef8ac663ed?w=800&h=400&fit=crop',
        title: 'Evento Esportivo Exclusivo'
      }
    ]
    setImages(defaultImages)
  }

  if (loading) {
    return (
      <Card className="relative overflow-hidden rounded-xl mx-4 mb-6 h-48 md:h-64 bg-gray-200 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-500">Carregando banner...</div>
        </div>
      </Card>
    )
  }

  if (images.length === 0) {
    return null
  }

  return (
    <Card className="relative overflow-hidden rounded-xl mx-4 mb-6">
      <div className="relative h-48 md:h-64">
        <img
          src={images[currentIndex].url}
          alt={images[currentIndex].title}
          className="w-full h-full object-cover transition-opacity duration-1000"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h3 className="text-white font-semibold text-lg">
            {images[currentIndex].title}
          </h3>
        </div>
      </div>
      
      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? 'bg-white w-4' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </Card>
  )
}

export function AdminPlayerAdvertisingBanner() {
  const [images, setImages] = useState<BannerImage[]>([])
  const [newImage, setNewImage] = useState<{ url: string; title: string }>({ url: '', title: '' })
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    loadBannerImages()
  }, [])

  const loadBannerImages = () => {
    try {
      const savedImages = localStorage.getItem('playerBannerImages')
      if (savedImages) {
        try {
          const parsedImages = JSON.parse(savedImages)
          setImages(parsedImages)
        } catch (e) {
          setDefaultImages()
        }
      } else {
        setDefaultImages()
      }
    } catch (e) {
      setDefaultImages()
    }
  }

  const setDefaultImages = () => {
    const defaultImages: BannerImage[] = [
      {
        id: '1',
        url: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&h=400&fit=crop',
        title: 'Arena Sobral - Melhor experiência esportiva'
      },
      {
        id: '2',
        url: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&h=400&fit=crop',
        title: 'Campeonato Regional 2025'
      },
      {
        id: '3',
        url: 'https://images.unsplash.com/photo-1574629810360-7efbbebbb6f1?w=800&h=400&fit=crop',
        title: 'Novas Areninhas Disponíveis'
      },
      {
        id: '4',
        url: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800&h=400&fit=crop',
        title: 'Descontos Especiais para Times'
      },
      {
        id: '5',
        url: 'https://images.unsplash.com/photo-1508098682722-e9ef8ac663ed?w=800&h=400&fit=crop',
        title: 'Evento Esportivo Exclusivo'
      }
    ]
    setImages(defaultImages)
    localStorage.setItem('playerBannerImages', JSON.stringify(defaultImages))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setPreviewUrl(event.target.result as string)
          // Atualizar também a URL da nova imagem
          setNewImage({...newImage, url: event.target.result as string})
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const addImage = () => {
    if (!newImage.url || !newImage.title) {
      alert('Por favor, preencha todos os campos')
      return
    }

    const newBannerImage: BannerImage = {
      id: Date.now().toString(),
      url: newImage.url,
      title: newImage.title
    }

    const updatedImages = [...images, newBannerImage]
    setImages(updatedImages)
    localStorage.setItem('playerBannerImages', JSON.stringify(updatedImages))
    
    // Reset form
    setNewImage({ url: '', title: '' })
    setPreviewUrl(null)
    alert('Imagem adicionada com sucesso!')
  }

  const removeImage = (id: string) => {
    const updatedImages = images.filter(image => image.id !== id)
    setImages(updatedImages)
    localStorage.setItem('playerBannerImages', JSON.stringify(updatedImages))
    alert('Imagem removida com sucesso!')
  }

  const triggerFileSelect = () => {
    const fileInput = document.getElementById('player-banner-image-upload')
    if (fileInput) {
      fileInput.click()
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Gerenciar Banner de Propaganda (Painel do Jogador)</h3>
        
        {/* Add New Image Form */}
        <Card className="bg-white p-4 mb-6">
          <h4 className="font-medium mb-3">Adicionar Nova Imagem</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Título</label>
              <input
                type="text"
                value={newImage.title}
                onChange={(e) => setNewImage({...newImage, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Título da imagem"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Imagem</label>
              <input
                id="player-banner-image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              
              {previewUrl ? (
                <div className="relative">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-full h-32 object-cover rounded-md border border-gray-200"
                  />
                  <button
                    type="button"
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                    onClick={() => {
                      setPreviewUrl(null)
                      setNewImage({...newImage, url: ''})
                    }}
                  >
                    ×
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={triggerFileSelect}
                  className="w-full p-4 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center gap-2 hover:border-blue-400 hover:bg-blue-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-600">Clique para selecionar uma imagem</span>
                  <span className="text-xs text-gray-500">(JPG, PNG, WEBP)</span>
                </button>
              )}
            </div>
            
            <button 
              onClick={addImage}
              disabled={isUploading || !newImage.url || !newImage.title}
              className="w-full bg-blue-500 text-white font-medium py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isUploading ? 'Adicionando...' : 'Adicionar Imagem'}
            </button>
          </div>
        </Card>
        
        {/* Current Images */}
        <Card className="bg-white p-4">
          <h4 className="font-medium mb-3">Imagens Atuais ({images.length})</h4>
          
          {images.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-lg font-medium mb-2">Nenhuma imagem cadastrada</h3>
              <p className="text-sm">
                Adicione imagens usando o formulário acima.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {images.map((image) => (
                <div key={image.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
                  <img 
                    src={image.url} 
                    alt={image.title} 
                    className="w-16 h-16 object-cover rounded-md border border-gray-200"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{image.title}</p>
                    <p className="text-xs text-gray-600 truncate">
                      {new URL(image.url).hostname}
                    </p>
                  </div>
                  <button
                    onClick={() => removeImage(image.id)}
                    className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}