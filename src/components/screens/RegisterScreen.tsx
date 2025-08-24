'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft, User, Users, Building2 } from 'lucide-react';

export default function RegisterScreen() {
  const router = useRouter();
  const [userType, setUserType] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRegister = () => {
    if (!userType) {
      toast.error('Selecione o tipo de usuário');
      return;
    }

    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    // Simular registro
    toast.success('Conta criada com sucesso!');
    
    // Redirecionar para login após registro
    setTimeout(() => {
      router.push('/login');
    }, 1500);
  };

  const userTypes = [
    {
      value: 'player',
      label: 'Jogador',
      icon: User,
      description: 'Encontre times e participe de jogos'
    },
    {
      value: 'team_owner',
      label: 'Dono de Time',
      icon: Users,
      description: 'Gerencie seu time e encontre jogadores'
    },
    {
      value: 'field_owner',
      label: 'Dono de Areninha',
      icon: Building2,
      description: 'Gerencie sua areninha e agendamentos'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
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
                Criar Conta
              </CardTitle>
            </div>
          </div>
          <CardDescription className="text-center">
            Junte-se ao ArenaSobral e comece a jogar
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Seleção do tipo de usuário */}
          <div className="space-y-2">
            <Label htmlFor="userType">Tipo de Usuário *</Label>
            <Select value={userType} onValueChange={setUserType}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de usuário" />
              </SelectTrigger>
              <SelectContent>
                {userTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <div>
                          <div className="font-medium">{type.label}</div>
                          <div className="text-xs text-gray-500">{type.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Campos do formulário */}
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo *</Label>
            <Input
              id="name"
              type="text"
              placeholder="Digite seu nome completo"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail *</Label>
            <Input
              id="email"
              type="email"
              placeholder="Digite seu e-mail"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">WhatsApp *</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(85) 99999-9999"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha *</Label>
            <Input
              id="password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Digite a senha novamente"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            />
          </div>

          <Button 
            onClick={handleRegister}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Criar Conta Grátis
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              Já tem uma conta?
            </p>
            <Button 
              variant="link"
              onClick={() => router.push('/login')}
              className="text-blue-500 text-sm font-medium hover:text-blue-600 transition"
            >
              Fazer Login
            </Button>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Ao criar uma conta, você concorda com nossos{' '}
              <span className="text-blue-500 cursor-pointer hover:underline">
                Termos de Uso
              </span>{' '}
              e{' '}
              <span className="text-blue-500 cursor-pointer hover:underline">
                Política de Privacidade
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}