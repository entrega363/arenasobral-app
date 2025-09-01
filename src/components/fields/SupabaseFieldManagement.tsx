'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, MapPin, DollarSign, Clock, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Field, FieldFormData } from '@/types'
import { supabaseFieldService } from '@/lib/supabase/fieldService'
import { useAuth } from '@/contexts/AuthContext'

interface FieldManagementProps {
  onFieldSelect?: (field: Field) => void
}

export function SupabaseFieldManagement({ onFieldSelect }: FieldManagementProps) {
  const { user } = useAuth()
  const [fields, setFields] = useState<Field[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingField, setEditingField] = useState<Field | null>(null)
  const [formData, setFormData] = useState<FieldFormData>({
    name: '',
    location: '',
    photo: '' // Adicionando campo para foto da arena
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      loadOwnerFields()
    }
  }, [user])

  const loadOwnerFields = async () => {
    try {
      setLoading(true)
      if (!user) return

      // Get fields by owner ID from Supabase
      const ownerFields = await supabaseFieldService.getFieldsByOwnerId(user.id)
      setFields(ownerFields)
    } catch (error) {
      console.error('Error loading owner fields:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Verificar se é uma imagem
    if (!file.type.match('image.*')) {
      alert('Por favor, selecione um arquivo de imagem válido')
      return
    }

    // Verificar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 5MB')
      return
    }

    // Fazer upload da imagem para o Supabase Storage
    try {
      // Aqui você pode implementar o upload para o Supabase Storage
      // Por enquanto, continuaremos usando base64 para simplificar
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImagePreview(result)
        setFormData({ ...formData, photo: result })
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Erro ao fazer upload da imagem')
    }
  }

  const handleAddField = () => {
    setShowAddForm(true)
    setEditingField(null)
    setFormData({ name: '', location: '', photo: '' }) // Inicializando com campo de foto vazio
    setImagePreview(null)
  }

  const handleEditField = (field: Field) => {
    setEditingField(field)
    setShowAddForm(true)
    setFormData({
      name: field.name,
      location: field.location,
      photo: field.photos && field.photos.length > 0 ? field.photos[0].url : '' // Preenche a foto se existir
    })
    setImagePreview(field.photos && field.photos.length > 0 ? field.photos[0].url : null)
  }

  const handleSaveField = async () => {
    try {
      if (!formData.name.trim() || !formData.location.trim()) {
        alert('Preencha todos os campos obrigatórios')
        return
      }

      if (!user) {
        alert('Você precisa estar logado para salvar uma areninha')
        return
      }

      if (editingField) {
        // Update existing field in Supabase
        const updatedField = await supabaseFieldService.updateField(editingField.id, {
          name: formData.name,
          location: formData.location,
          photo: formData.photo
        })
        
        if (updatedField) {
          setFields(fields.map(f => f.id === editingField.id ? updatedField : f))
        }
      } else {
        // Add new field to Supabase
        const newField = await supabaseFieldService.createField(formData, user.id)
        
        if (newField) {
          setFields([...fields, newField])
        }
      }

      setShowAddForm(false)
      setEditingField(null)
      setFormData({ name: '', location: '', photo: '' })
      setImagePreview(null)
      alert(editingField ? 'Areninha atualizada com sucesso!' : 'Areninha adicionada com sucesso!')
    } catch (error) {
      console.error('Error saving field:', error)
      alert('Erro ao salvar areninha')
    }
  }

  const handleDeleteField = async (fieldId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta areninha?')) return

    try {
      const success = await supabaseFieldService.deleteField(fieldId)
      
      if (success) {
        setFields(fields.filter(field => field.id !== fieldId))
        alert('Areninha excluída com sucesso!')
      } else {
        throw new Error('Failed to delete field')
      }
    } catch (error) {
      console.error('Error deleting field:', error)
      alert('Erro ao excluir areninha')
    }
  }

  const getFieldStats = (field: Field) => {
    const bookings = field.bookings || []
    const confirmedBookings = bookings.filter(b => b.status === 'CONFIRMED')
    const totalRevenue = confirmedBookings.reduce((sum, booking) => sum + booking.timeSlot.price, 0)
    
    return {
      totalBookings: confirmedBookings.length,
      totalRevenue,
      availableSlots: field.timeSlots.filter(slot => slot.available).length
    }
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-white text-lg font-bold">Minhas Areninhas</h2>
        <Button onClick={handleAddField} className="bg-blue-500 hover:bg-blue-600">
          <Plus className="w-4 h-4 mr-2" />
          Adicionar
        </Button>
      </div>

      {/* Add/Edit Field Form */}
        {showAddForm && (
          <Card className="bg-white mb-6">
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-4">
                {editingField ? 'Editar Areninha' : 'Adicionar Nova Areninha'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome da Areninha *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Arena Sobral Central"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Localização *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Sobral Centro"
                  />
                </div>
                
                {/* Campo para foto da arena */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Foto da Arena
                  </label>
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">Formatos suportados: JPG, PNG, GIF (máx. 5MB)</p>
                    </div>
                    {(imagePreview || formData.photo) && (
                      <div className="mt-2">
                        <img 
                          src={imagePreview || formData.photo} 
                          alt="Pré-visualização da arena" 
                          className="w-16 h-16 object-cover rounded-md border"
                          onError={(e) => {
                            e.currentTarget.src = 'https://placehold.co/300x200?text=Imagem+não+disponível'
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={handleSaveField}
                    className="flex-1"
                  >
                    Salvar
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowAddForm(false)
                      setEditingField(null)
                      setFormData({ name: '', location: '', photo: '' })
                      setImagePreview(null)
                    }}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

      {/* Fields List */}
      {fields.length === 0 ? (
        <Card className="bg-white p-8 text-center">
          <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-slate-800 mb-2">Nenhuma areninha cadastrada</h3>
          <p className="text-slate-600 mb-4">Adicione sua primeira areninha para começar a receber reservas</p>
          <Button onClick={handleAddField} className="bg-blue-500 hover:bg-blue-600">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Areninha
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {fields.map((field) => {
            const stats = getFieldStats(field)
            
            return (
              <Card key={field.id} className="bg-white p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 text-lg mb-1">{field.name}</h3>
                    <div className="flex items-center gap-2 text-slate-600 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{field.location}</span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm text-slate-600">{field.rating.toFixed(1)}</span>
                      <span className="text-xs text-slate-500">
                        ({field.reviews.length} avaliações)
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditField(field)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteField(field.id)}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span className="font-bold text-blue-600">{stats.totalBookings}</span>
                    </div>
                    <span className="text-xs text-slate-500">Reservas</span>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="font-bold text-green-600">R$ {stats.totalRevenue}</span>
                    </div>
                    <span className="text-xs text-slate-500">Receita</span>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Clock className="w-4 h-4 text-orange-600" />
                      <span className="font-bold text-orange-600">{stats.availableSlots}</span>
                    </div>
                    <span className="text-xs text-slate-500">Horários</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onFieldSelect?.(field)}
                    className="flex-1"
                  >
                    Ver Reservas
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    Configurar
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}