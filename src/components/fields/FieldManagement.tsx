'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, MapPin, DollarSign, Clock, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Field, FieldFormData } from '@/types'
import { FieldService } from '@/lib/fieldService'

interface FieldManagementProps {
  onFieldSelect?: (field: Field) => void
}

export function FieldManagement({ onFieldSelect }: FieldManagementProps) {
  const [fields, setFields] = useState<Field[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingField, setEditingField] = useState<Field | null>(null)
  const [formData, setFormData] = useState<FieldFormData>({
    name: '',
    location: '',
    photo: '' // Adicionando campo para foto da arena
  })

  useEffect(() => {
    loadOwnerFields()
  }, [])

  const loadOwnerFields = async () => {
    try {
      setLoading(true)
      // Get current user
      const currentUser = localStorage.getItem('currentUser')
      if (!currentUser) return

      const user = JSON.parse(currentUser)
      
      // Get all fields and filter by owner
      const allFields = FieldService.getAllFields()
      const ownerFields = allFields.filter(field => field.ownerId === user.email)
      
      setFields(ownerFields)
    } catch (error) {
      console.error('Error loading owner fields:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddField = () => {
    setShowAddForm(true)
    setEditingField(null)
    setFormData({ name: '', location: '', photo: '' }) // Inicializando com campo de foto vazio
  }

  const handleEditField = (field: Field) => {
    setEditingField(field)
    setShowAddForm(true)
    setFormData({
      name: field.name,
      location: field.location,
      photo: field.photos && field.photos.length > 0 ? field.photos[0].url : '' // Preenche a foto se existir
    })
  }

  const handleSaveField = async () => {
    try {
      if (!formData.name.trim() || !formData.location.trim()) {
        alert('Preencha todos os campos obrigatórios')
        return
      }

      const currentUser = localStorage.getItem('currentUser')
      if (!currentUser) return

      const user = JSON.parse(currentUser)

      if (editingField) {
        // Update existing field
        const allFields = FieldService.getAllFields()
        const updatedFields = allFields.map(field => 
          field.id === editingField.id 
            ? { 
                ...field, 
                name: formData.name, 
                location: formData.location,
                ...(formData.photo && { photo: formData.photo }) // Atualiza a foto se fornecida
              }
            : field
        )
        localStorage.setItem('arenasobral_fields', JSON.stringify(updatedFields))
      } else {
        // Add new field
        const newField: Field = {
          id: Date.now().toString(),
          name: formData.name,
          location: formData.location,
          address: formData.location,
          description: `Areninha ${formData.name} localizada em ${formData.location}`,
          fieldType: 'SOCIETY',
          pricePerHour: 80,
          rating: 0,
          ownerId: user.email,
          owner: {} as any,
          photos: formData.photo ? [{ id: '1', url: formData.photo, alt: formData.name, isPrimary: true }] : [], // Adiciona foto se fornecida
          amenities: [
            { id: '1', name: 'Vestiário', icon: 'changing-room' },
            { id: '2', name: 'Estacionamento', icon: 'parking' }
          ],
          reviews: [],
          rules: [
            'Uso obrigatório de chuteira ou tênis',
            'Proibido fumar nas dependências',
            'Respeitar horário de início e fim'
          ],
          contactInfo: {
            phone: '(88) 99999-0000',
            whatsapp: '(88) 99999-0000'
          },
          timeSlots: [
            { id: `ts_${Date.now()}_1`, fieldId: Date.now().toString(), dayOfWeek: 1, startTime: '08:00', endTime: '09:00', price: 80, available: true, field: {} as any },
            { id: `ts_${Date.now()}_2`, fieldId: Date.now().toString(), dayOfWeek: 1, startTime: '18:00', endTime: '19:00', price: 100, available: true, field: {} as any }
          ],
          bookings: []
        }

        const allFields = FieldService.getAllFields()
        allFields.push(newField)
        localStorage.setItem('arenasobral_fields', JSON.stringify(allFields))
      }

      setShowAddForm(false)
      setEditingField(null)
      loadOwnerFields()
      alert(editingField ? 'Areninha atualizada com sucesso!' : 'Areninha adicionada com sucesso!')
    } catch (error) {
      console.error('Error saving field:', error)
      alert('Erro ao salvar areninha')
    }
  }

  const handleDeleteField = async (fieldId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta areninha?')) return

    try {
      const allFields = FieldService.getAllFields()
      const updatedFields = allFields.filter(field => field.id !== fieldId)
      localStorage.setItem('arenasobral_fields', JSON.stringify(updatedFields))
      
      loadOwnerFields()
      alert('Areninha excluída com sucesso!')
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
                    Foto da Arena (URL)
                  </label>
                  <input
                    type="text"
                    value={formData.photo || ''}
                    onChange={(e) => setFormData({...formData, photo: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Cole a URL da foto da sua arena"
                  />
                  {formData.photo && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 mb-1">Pré-visualização:</p>
                      <img 
                        src={formData.photo} 
                        alt="Pré-visualização da arena" 
                        className="w-32 h-32 object-cover rounded-md border"
                        onError={(e) => {
                          e.currentTarget.src = 'https://placehold.co/300x200?text=Imagem+não+disponível'
                        }}
                      />
                    </div>
                  )}
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