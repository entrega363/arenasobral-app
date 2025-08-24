'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft, Camera, Upload, Save } from 'lucide-react';

export default function EditProfileScreen() {
  const router = useRouter();
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('/api/placeholder/150/150');
  const [formData, setFormData] = useState({
    name: 'João Silva',
    email: 'joao@email.com',
    phone: '(85) 99999-9999',
    bio: 'Jogador apaixonado por futebol, sempre em busca de novos desafios.',
    position: 'Atacante',
    experience: 'Intermediário'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor, selecione apenas arquivos de imagem');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error('A imagem deve ter no máximo 5MB');
        return;
      }

      setProfilePhoto(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    // Simular salvamento
    toast.success('Perfil atualizado com sucesso!');
    
    setTimeout(() => {
      router.back();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="p-1 h-8 w-8"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex-1">
                <CardTitle className="text-2xl font-bold text-center">
                  Editar Perfil
                </CardTitle>
              </div>
            </div>
            <CardDescription className="text-center">
              Atualize suas informações pessoais
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Upload de foto de perfil */}
            <div className="space-y-2">
              <Label>Foto de Perfil</Label>
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <img
                    src={photoPreview}
                    alt="Foto de perfil"
                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                  />
                  <div className="absolute -bottom-2 -right-2">
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Button
                        type="button"
                        size="sm"
                        className="rounded-full w-10 h-10 p-0"
                      >
                        <Camera className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <p className="text-xs text-gray-500 text-center">
                  Clique no ícone da câmera para alterar a foto
                </p>
              </div>
            </div>

            {/* Campos do formulário */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">WhatsApp *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Posição</Label>
                <Input
                  id="position"
                  type="text"
                  value={formData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  placeholder="Ex: Atacante, Meio-campo..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Nível de Experiência</Label>
              <Input
                id="experience"
                type="text"
                value={formData.experience}
                onChange={(e) => handleInputChange('experience', e.target.value)}
                placeholder="Ex: Iniciante, Intermediário, Avançado"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Biografia</Label>
              <textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Conte um pouco sobre você..."
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                rows={4}
              />
            </div>

            {/* Botões de ação */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleSave}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar Alterações
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}