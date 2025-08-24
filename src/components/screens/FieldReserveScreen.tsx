'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft, MapPin, Clock, Star, Phone, Calendar, User, CreditCard } from 'lucide-react';

interface Props {
  fieldId: string;
}

export default function FieldReserveScreen({ fieldId }: Props) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [customerData, setCustomerData] = useState({
    name: '',
    phone: '',
    email: ''
  });

  // Dados simulados da areninha (baseado no ID)
  const getFieldData = (id: string) => {
    const fields = {
      '1': {
        name: 'Arena Central',
        address: 'Rua Principal, 123 - Centro',
        phone: '(85) 99999-1111',
        rating: 4.8,
        pricePerHour: 80,
        image: '/api/placeholder/400/250'
      },
      '2': {
        name: 'Quadra do Bairro',
        address: 'Av. das Flores, 456 - Jardim',
        phone: '(85) 99999-2222',
        rating: 4.5,
        pricePerHour: 60,
        image: '/api/placeholder/400/250'
      },
      '3': {
        name: 'Arena Premium',
        address: 'Rua dos Esportes, 789 - Vila Nova',
        phone: '(85) 99999-3333',
        rating: 4.9,
        pricePerHour: 120,
        image: '/api/placeholder/400/250'
      },
      '4': {
        name: 'Quadra Comunitária',
        address: 'Rua da Comunidade, 321 - Periferia',
        phone: '(85) 99999-4444',
        rating: 4.2,
        pricePerHour: 40,
        image: '/api/placeholder/400/250'
      }
    };
    return fields[id as keyof typeof fields] || fields['1'];
  };

  const field = getFieldData(fieldId);

  // Horários disponíveis (simulados)
  const availableTimes = [
    '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'
  ];

  // Próximos 7 dias
  const getAvailableDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('pt-BR', { 
          weekday: 'short', 
          day: '2-digit', 
          month: '2-digit' 
        })
      });
    }
    return dates;
  };

  const availableDates = getAvailableDates();

  const handleInputChange = (field: string, value: string) => {
    setCustomerData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleReserve = () => {
    if (!selectedDate || !selectedTime) {
      toast.error('Selecione data e horário');
      return;
    }

    if (!customerData.name || !customerData.phone) {
      toast.error('Preencha seus dados de contato');
      return;
    }

    // Simular reserva
    toast.success('Reserva realizada com sucesso!');
    
    setTimeout(() => {
      router.back();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="bg-slate-800 px-4 py-4">
        <div className="flex items-center gap-4 text-white">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => router.back()}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold">Reservar Horário</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Informações da areninha */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-4">
              <img
                src={field.image}
                alt={field.name}
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h2 className="text-xl font-bold">{field.name}</h2>
                <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                  <MapPin className="w-3 h-3" />
                  {field.address}
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                  <Phone className="w-3 h-3" />
                  {field.phone}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{field.rating}</span>
                  </div>
                  <div>
                    <span className="text-lg font-bold text-green-600">
                      R$ {field.pricePerHour}
                    </span>
                    <span className="text-sm text-gray-500">/hora</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seleção de data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Selecionar Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {availableDates.map((date) => (
                <Button
                  key={date.value}
                  variant={selectedDate === date.value ? 'default' : 'outline'}
                  onClick={() => setSelectedDate(date.value)}
                  className="h-12"
                >
                  {date.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Seleção de horário */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Selecionar Horário
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2">
              {availableTimes.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? 'default' : 'outline'}
                  onClick={() => setSelectedTime(time)}
                  className="h-12"
                >
                  {time}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Dados do cliente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Seus Dados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                type="text"
                placeholder="Digite seu nome"
                value={customerData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">WhatsApp *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(85) 99999-9999"
                value={customerData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail (opcional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={customerData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Resumo da reserva */}
        {selectedDate && selectedTime && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Resumo da Reserva
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Data:</span>
                  <span className="font-medium">
                    {new Date(selectedDate).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Horário:</span>
                  <span className="font-medium">{selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duração:</span>
                  <span className="font-medium">1 hora</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-green-600">R$ {field.pricePerHour}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Botão de reserva */}
        <Button
          onClick={handleReserve}
          className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg"
          disabled={!selectedDate || !selectedTime}
        >
          Confirmar Reserva
        </Button>

        <p className="text-xs text-gray-500 text-center">
          Ao confirmar, você será contatado via WhatsApp para finalizar o pagamento
        </p>
      </div>
    </div>
  );
}