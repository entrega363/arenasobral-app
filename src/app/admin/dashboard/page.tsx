'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Users, 
  User, 
  Shield, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Ban,
  Calendar,
  MapPin,
  Trophy,
  Upload,
  Image,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { StatusBar } from '@/components/layout/StatusBar'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { AdminAuth } from '@/components/admin/AdminAuth'

interface User {
  id: string
  name: string
  email: string
  type: 'player' | 'team_owner' | 'field_owner'
  status: 'active' | 'inactive' | 'blocked'
  registrationDate: string
  lastLogin: string
  location?: string
  teamName?: string
  fieldName?: string
  phone?: string
  category?: string
}

interface BannerImage {
  id: string
  url: string
  title: string
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [userTypeFilter, setUserTypeFilter] = useState<'all' | 'player' | 'team_owner' | 'field_owner'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'blocked'>('all')
  const [bannerImages, setBannerImages] = useState<BannerImage[]>([])
  const [newImageTitle, setNewImageTitle] = useState('')
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterUsers()
  }, [users, searchTerm, userTypeFilter, statusFilter])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Mock data for users
      const mockUsers: User[] = [
        {
          id: '1',
          name: 'João Silva',
          email: 'joao.silva@email.com',
          type: 'player',
          status: 'active',
          registrationDate: '2024-01-15',
          lastLogin: '2024-08-20',
          location: 'Sobral Centro',
          phone: '(85) 99999-1111',
          category: 'Racha'
        },
        {
          id: '2',
          name: 'Carlos Mendes',
          email: 'carlos.mendes@email.com',
          type: 'team_owner',
          status: 'active',
          registrationDate: '2024-02-20',
          lastLogin: '2024-08-19',
          location: 'Cohab',
          teamName: 'Vila Nove F.C.',
          phone: '(85) 99999-2222'
        },
        {
          id: '3',
          name: 'Pedro Santos',
          email: 'pedro.santos@email.com',
          type: 'field_owner',
          status: 'blocked',
          registrationDate: '2024-03-10',
          lastLogin: '2024-08-10',
          location: 'Alto da Brasília',
          fieldName: 'Arena Central',
          phone: '(85) 99999-3333'
        },
        {
          id: '4',
          name: 'Antônio Costa',
          email: 'antonio.costa@email.com',
          type: 'player',
          status: 'inactive',
          registrationDate: '2024-04-05',
          lastLogin: '2024-07-15',
          location: 'Sinhá Sabóia',
          phone: '(85) 99999-4444',
          category: 'Veterano'
        },
        {
          id: '5',
          name: 'Felipe Oliveira',
          email: 'felipe.oliveira@email.com',
          type: 'team_owner',
          status: 'active',
          registrationDate: '2024-05-12',
          lastLogin: '2024-08-22',
          location: 'Dom Expedito',
          teamName: 'Força Jovem',
          phone: '(85) 99999-5555'
        },
        {
          id: '6',
          name: 'Ricardo Lima',
          email: 'ricardo.lima@email.com',
          type: 'field_owner',
          status: 'active',
          registrationDate: '2024-06-18',
          lastLogin: '2024-08-21',
          location: 'Centro',
          fieldName: 'Quadra Netifor',
          phone: '(85) 99999-6666'
        },
        {
          id: '7',
          name: 'Thiago Rocha',
          email: 'thiago.rocha@email.com',
          type: 'player',
          status: 'active',
          registrationDate: '2024-07-22',
          lastLogin: '2024-08-23',
          location: 'Cidade Dr. José Euclides',
          phone: '(85) 99999-7777',
          category: 'Sub20'
        }
      ]

      setUsers(mockUsers)
      setFilteredUsers(mockUsers)
      
      // Carregar imagens do banner
      const savedImages = localStorage.getItem('bannerImages')
      if (savedImages) {
        try {
          setBannerImages(JSON.parse(savedImages))
        } catch (e) {
          // Usar imagens padrão se houver erro
          setBannerImages([
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
          ])
        }
      } else {
        // Imagens padrão
        setBannerImages([
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
        ])
      }
    } catch (err) {
      setError('Erro ao carregar dados')
      console.error('Error loading data:', err)
    } finally {
      setLoading(false)
    }
  }

  const filterUsers = () => {
    let filtered = [...users]

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        (user.location && user.location.toLowerCase().includes(term)) ||
        (user.teamName && user.teamName.toLowerCase().includes(term)) ||
        (user.fieldName && user.fieldName.toLowerCase().includes(term))
      )
    }

    // Apply user type filter
    if (userTypeFilter !== 'all') {
      filtered = filtered.filter(user => user.type === userTypeFilter)
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter)
    }

    setFilteredUsers(filtered)
  }

  const getUserTypeLabel = (type: User['type']) => {
    switch (type) {
      case 'player': return 'Jogador'
      case 'team_owner': return 'Dono de Time'
      case 'field_owner': return 'Dono de Areninha'
      default: return type
    }
  }

  const getUserTypeColor = (type: User['type']) => {
    switch (type) {
      case 'player': return 'bg-blue-100 text-blue-800'
      case 'team_owner': return 'bg-green-100 text-green-800'
      case 'field_owner': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: User['status']) => {
    switch (status) {
      case 'active': return 'Ativo'
      case 'inactive': return 'Inativo'
      case 'blocked': return 'Bloqueado'
      default: return status
    }
  }

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-yellow-100 text-yellow-800'
      case 'blocked': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleActivateUser = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: 'active' } : user
    ))
  }

  const handleDeactivateUser = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: 'inactive' } : user
    ))
  }

  const handleBlockUser = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: 'blocked' } : user
    ))
  }

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated')
    document.cookie = "adminAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax"
    router.push('/admin/login')
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setPreviewUrl(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const saveBannerImage = () => {
    if (!previewUrl || !newImageTitle.trim()) {
      alert('Por favor, selecione uma imagem e insira um título.')
      return
    }

    setUploading(true)
    
    try {
      // Simular upload (em produção, aqui faríamos uma chamada à API)
      setTimeout(() => {
        const newImage: BannerImage = {
          id: Date.now().toString(),
          url: previewUrl,
          title: newImageTitle.trim()
        }
        
        const updatedImages = [...bannerImages, newImage]
        setBannerImages(updatedImages)
        localStorage.setItem('bannerImages', JSON.stringify(updatedImages))
        
        // Resetar formulário
        setPreviewUrl(null)
        setNewImageTitle('')
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
        
        setUploading(false)
        alert('Imagem adicionada com sucesso!')
      }, 1000)
    } catch (error) {
      setUploading(false)
      alert('Erro ao salvar imagem. Tente novamente.')
    }
  }

  const removeBannerImage = (imageId: string) => {
    const updatedImages = bannerImages.filter(img => img.id !== imageId)
    setBannerImages(updatedImages)
    localStorage.setItem('bannerImages', JSON.stringify(updatedImages))
    alert('Imagem removida com sucesso!')
  }

  const triggerFileSelect = () => {
    fileInputRef.current?.click()
  }

  if (loading) {
    return (
      <div className="bg-slate-800 min-h-screen">
        <StatusBar />
        <div className="flex items-center gap-4 px-4 py-4 text-white">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => router.back()}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold">Painel Administrativo</h1>
        </div>
        <div className="px-4 py-8">
          <LoadingSpinner size="lg" text="Carregando usuários..." variant="white" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-slate-800 min-h-screen">
        <StatusBar />
        <div className="flex items-center gap-4 px-4 py-4 text-white">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => router.back()}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold">Painel Administrativo</h1>
        </div>
        <div className="px-4 py-8">
          <ErrorMessage
            title="Erro ao carregar"
            message={error}
            onRetry={loadData}
          />
        </div>
      </div>
    )
  }

  return (
    <AdminAuth>
      <div className="bg-slate-800 min-h-screen">
        <StatusBar />
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 text-white">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => router.back()}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Painel Administrativo</h1>
              <p className="text-sm text-slate-300">Gerencie todos os usuários do sistema</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className="text-white hover:bg-white/10"
          >
            Sair
          </Button>
        </div>

        <div className="px-4 pb-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-white p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-800">
                    {users.filter(u => u.status === 'active').length}
                  </div>
                  <div className="text-sm text-slate-600">Ativos</div>
                </div>
              </div>
            </Card>
            
            <Card className="bg-white p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-800">
                    {users.filter(u => u.status === 'inactive').length}
                  </div>
                  <div className="text-sm text-slate-600">Inativos</div>
                </div>
              </div>
            </Card>
            
            <Card className="bg-white p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Ban className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-800">
                    {users.filter(u => u.status === 'blocked').length}
                  </div>
                  <div className="text-sm text-slate-600">Bloqueados</div>
                </div>
              </div>
            </Card>
            
            <Card className="bg-white p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-800">
                    {users.length}
                  </div>
                  <div className="text-sm text-slate-600">Total</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Banner Management Section */}
          <Card className="bg-white p-6 mb-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Image className="w-5 h-5" />
              Gerenciamento de Banner de Publicidade
            </h2>
            
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-600">
                Gerencie as imagens exibidas no carrossel de propagandas
              </p>
              <Button
                onClick={() => router.push('/admin/ads')}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Image className="w-4 h-4 mr-2" />
                Gerenciar Propagandas
              </Button>
            </div>
          </Card>

          {/* Search and Filters */}
          <Card className="bg-white p-4 mb-6">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar por nome, email ou localização..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-600 mb-2">Tipo de Usuário</label>
                  <select
                    value={userTypeFilter}
                    onChange={(e) => setUserTypeFilter(e.target.value as any)}
                    className="w-full px-4 py-3 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Todos os tipos</option>
                    <option value="player">Jogadores</option>
                    <option value="team_owner">Donos de Time</option>
                    <option value="field_owner">Donos de Areninha</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm text-slate-600 mb-2">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="w-full px-4 py-3 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Todos os status</option>
                    <option value="active">Ativo</option>
                    <option value="inactive">Inativo</option>
                    <option value="blocked">Bloqueado</option>
                  </select>
                </div>
              </div>
            </div>
          </Card>
          
          {/* Users Count */}
          <div className="mb-4">
            <p className="text-white text-sm">
              {filteredUsers.length} usuário(s) encontrado(s)
            </p>
          </div>

          {/* Users List */}
          <div className="space-y-4">
            {filteredUsers.length === 0 ? (
              <Card className="bg-white p-8 text-center">
                <div className="text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">Nenhum usuário encontrado</h3>
                  <p className="text-sm">
                    Tente ajustar os filtros de busca ou termo de pesquisa.
                  </p>
                </div>
              </Card>
            ) : (
              filteredUsers.map((user) => (
                <Card key={user.id} className="bg-white">
                  <div className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">{user.name}</h3>
                            <p className="text-sm text-gray-600">{user.email}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUserTypeColor(user.type)}`}>
                              {getUserTypeLabel(user.type)}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                              {getStatusLabel(user.status)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Cadastro: {new Date(user.registrationDate).toLocaleDateString('pt-BR')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Último acesso: {new Date(user.lastLogin).toLocaleDateString('pt-BR')}</span>
                          </div>
                          {user.location && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              <span>{user.location}</span>
                            </div>
                          )}
                          {user.phone && (
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              <span>{user.phone}</span>
                            </div>
                          )}
                          {user.teamName && (
                            <div className="flex items-center gap-2">
                              <Trophy className="w-4 h-4" />
                              <span>Time: {user.teamName}</span>
                            </div>
                          )}
                          {user.fieldName && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              <span>Areninha: {user.fieldName}</span>
                            </div>
                          )}
                          {user.category && (
                            <div className="flex items-center gap-2">
                              <Trophy className="w-4 h-4" />
                              <span>Categoria: {user.category}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2 min-w-fit">
                        {user.status !== 'active' && (
                          <Button 
                            size="sm" 
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                            onClick={() => handleActivateUser(user.id)}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Ativar
                          </Button>
                        )}
                        {user.status !== 'inactive' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDeactivateUser(user.id)}
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Desativar
                          </Button>
                        )}
                        {user.status !== 'blocked' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="border-red-500 text-red-500 hover:bg-red-50"
                            onClick={() => handleBlockUser(user.id)}
                          >
                            <Ban className="w-4 h-4 mr-2" />
                            Bloquear
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminAuth>
  )
}