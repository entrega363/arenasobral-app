import React, { useState } from 'react';
import { ArrowLeft, User, Users, Calendar, MessageSquare, Trophy, Clock, MapPin, ChevronDown, ChevronRight } from 'lucide-react';

const ArenaSobralApp = () => {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedTab, setSelectedTab] = useState('reservas');
  const [selectedPlayerPhoto, setSelectedPlayerPhoto] = useState(null);
  const [contractOffers, setContractOffers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [joinRequests, setJoinRequests] = useState([]);
  const [friendlyMatches, setFriendlyMatches] = useState([]);
  const [fieldBookings, setFieldBookings] = useState([]);
  const [fieldTimeSlots, setFieldTimeSlots] = useState([
    {
      id: 1,
      day: 'Segunda-feira',
      timeSlots: [
        { id: 1, time: '06:00 - 07:00', price: 80, available: true },
        { id: 2, time: '07:00 - 08:00', price: 80, available: true },
        { id: 3, time: '18:00 - 19:00', price: 120, available: false },
        { id: 4, time: '19:00 - 20:00', price: 120, available: true },
        { id: 5, time: '20:00 - 21:00', price: 120, available: true },
        { id: 6, time: '21:00 - 22:00', price: 120, available: true }
      ]
    },
    {
      id: 2,
      day: 'Terça-feira',
      timeSlots: [
        { id: 7, time: '06:00 - 07:00', price: 80, available: true },
        { id: 8, time: '07:00 - 08:00', price: 80, available: true },
        { id: 9, time: '18:00 - 19:00', price: 120, available: true },
        { id: 10, time: '19:00 - 20:00', price: 120, available: false },
        { id: 11, time: '20:00 - 21:00', price: 120, available: true },
        { id: 12, time: '21:00 - 22:00', price: 120, available: true }
      ]
    }
  ]);
  const [fieldStats, setFieldStats] = useState({
    totalBookings: 45,
    weeklyRevenue: 2400,
    occupancyRate: 78,
    nextBooking: '18:00 - Vila Nove F.C.'
  });
  const [teamSchedule, setTeamSchedule] = useState([
    {
      id: 1,
      opponent: 'Amigos da Bola',
      date: '15/08/2025',
      time: '19:00',
      location: 'Campo do Centro',
      type: 'amistoso',
      status: 'confirmado'
    },
    {
      id: 2,
      opponent: 'Estrela do Norte',
      date: '22/08/2025',
      time: '20:00',
      location: 'Quadra Netifor',
      type: 'amistoso',
      status: 'confirmado'
    },
    {
      id: 3,
      opponent: 'União FC',
      date: '29/08/2025',
      time: '18:30',
      location: 'Campo da Cohab',
      type: 'amistoso',
      status: 'pendente'
    }
  ]);

  // Mock data
  const tournaments = [
    { name: 'Cup Futebol', date: '2 a 13 de Maio 2024', status: 'Inscrição Aberta' },
    { name: 'Campeonato Sobralense', date: '10 a 23 de Junho 2024', status: 'Inscrição Encerrada' },
    { name: 'Torneio Municipal', date: '5 a 17 de Julho 2024', status: 'Inscrição Encerrada' }
  ];

  const registeredTeams = [
    { 
      id: 1, 
      name: 'Vila Nove F.C.', 
      location: 'Sobral Centro', 
      players: 15, 
      captain: 'João Silva',
      whatsapp: '(85) 99999-1234',
      category: 'Racha',
      playersList: [1, 5] // IDs dos jogadores no time
    },
    { 
      id: 2, 
      name: 'Amigos da Bola', 
      location: 'Cohab', 
      players: 12, 
      captain: 'Pedro Santos',
      whatsapp: '(85) 99999-5678',
      category: 'Veterano',
      playersList: [2, 4]
    },
    { 
      id: 3, 
      name: 'Estrela do Norte', 
      location: 'Alto da Brasília', 
      players: 18, 
      captain: 'Carlos Lima',
      whatsapp: '(85) 99999-9012',
      category: 'Sub20',
      playersList: [3, 6]
    },
    { 
      id: 4, 
      name: 'União FC', 
      location: 'Sinhá Sabóia', 
      players: 14, 
      captain: 'Antonio Costa',
      whatsapp: '(85) 99999-3456',
      category: '2Q',
      playersList: [5]
    },
    { 
      id: 5, 
      name: 'Força Jovem', 
      location: 'Dom Expedito', 
      players: 16, 
      captain: 'Rafael Mendes',
      whatsapp: '(85) 99999-7890',
      category: '1Q',
      playersList: [1, 3]
    }
  ];

  const registeredPlayers = [
    {
      id: 1,
      name: 'João Silva',
      age: 25,
      position: 'Atacante',
      location: 'Sobral Centro',
      whatsapp: '(85) 99999-1111',
      experience: '5 anos',
      currentTeam: 'Vila Nove F.C.',
      availability: 'Noite',
      category: 'Racha',
      teamsCount: 2, // Quantidade de times que participa
      photo: 'assets/joao-silva.jpeg?prompt=Young%20Brazilian%20soccer%20player%2025%20years%20old%20smiling%20professional%20headshot'
    },
    {
      id: 2,
      name: 'Pedro Santos',
      age: 28,
      position: 'Goleiro',
      location: 'Cohab',
      whatsapp: '(85) 99999-2222',
      experience: '7 anos',
      currentTeam: 'Sem time',
      availability: 'Tarde/Noite',
      category: 'Veterano',
      teamsCount: 0,
      photo: 'assets/pedro-santos.jpeg?prompt=Brazilian%20soccer%20goalkeeper%2028%20years%20old%20confident%20smile%20professional%20photo'
    },
    {
      id: 3,
      name: 'Carlos Lima',
      age: 30,
      position: 'Zagueiro',
      location: 'Alto da Brasília',
      whatsapp: '(85) 99999-3333',
      experience: '8 anos',
      currentTeam: 'Estrela do Norte',
      availability: 'Final de Semana',
      category: '1Q',
      teamsCount: 1,
      photo: 'assets/carlos-lima.jpeg?prompt=Brazilian%20defender%20soccer%20player%2030%20years%20old%20serious%20professional%20headshot'
    },
    {
      id: 4,
      name: 'Marco Antonio',
      age: 23,
      position: 'Meio-campo',
      location: 'Dom Expedito',
      whatsapp: '(85) 99999-4444',
      experience: '3 anos',
      currentTeam: 'Sem time',
      availability: 'Manhã/Tarde',
      category: 'Sub20',
      teamsCount: 0,
      photo: 'assets/marco-antonio.jpeg?prompt=Young%20Brazilian%20midfielder%2023%20years%20old%20friendly%20smile%20athletic%20photo'
    },
    {
      id: 5,
      name: 'Felipe Costa',
      age: 26,
      position: 'Atacante',
      location: 'Centro',
      whatsapp: '(85) 99999-5555',
      experience: '4 anos',
      currentTeam: 'União FC',
      availability: 'Noite',
      category: '2Q',
      teamsCount: 1,
      photo: 'assets/felipe-costa.jpeg?prompt=Brazilian%20striker%2026%20years%20old%20confident%20expression%20professional%20soccer%20photo'
    },
    {
      id: 6,
      name: 'Ricardo Oliveira',
      age: 32,
      position: 'Zagueiro',
      location: 'Sinhá Sabóia',
      whatsapp: '(85) 99999-6666',
      experience: '10 anos',
      currentTeam: 'Sem time',
      availability: 'Qualquer horário',
      category: 'Veterano',
      teamsCount: 0,
      photo: 'assets/ricardo-oliveira.jpeg?prompt=Experienced%20Brazilian%20defender%2032%20years%20old%20mature%20professional%20soccer%20headshot'
    }
  ];

  const todaySchedule = [
    { time: '19:00', team: 'Quadra Netifor. Vila Nove F.C.', duration: '20:00' },
    { time: '20:00', team: 'Amigos da Bola', duration: '20:00' }
  ];

  const handleContactPlayer = (player) => {
    const newOffer = {
      id: Date.now(),
      playerName: player.name,
      teamName: 'Vila Nove F.C.', // Nome do time que está contratando (pode ser dinâmico)
      teamId: 1, // ID do time que está fazendo a proposta
      position: player.position,
      date: new Date().toLocaleDateString('pt-BR'),
      status: 'pending' // pending, accepted, rejected
    };
    
    setContractOffers(prev => [...prev, newOffer]);
    alert(`Proposta enviada para ${player.name}! Aguarde a resposta.`);
  };

  const handleOfferResponse = (offerId, response) => {
    setContractOffers(prev => 
      prev.map(offer => 
        offer.id === offerId 
          ? { ...offer, status: response }
          : offer
      )
    );
  };

  const handlePlayerSelection = (player) => {
    setSelectedPlayers(prev => {
      const isSelected = prev.find(p => p.id === player.id);
      if (isSelected) {
        return prev.filter(p => p.id !== player.id);
      } else {
        return [...prev, player];
      }
    });
  };

  const handleJoinTeamRequest = (team) => {
    const newRequest = {
      id: Date.now(),
      playerName: 'José dos Santos', // Nome do usuário atual
      playerId: 'current-user',
      teamName: team.name,
      teamId: team.id,
      position: 'Meio-campo', // Posição do jogador atual
      date: new Date().toLocaleDateString('pt-BR'),
      status: 'pending' // pending, accepted, rejected
    };
    
    setJoinRequests(prev => [...prev, newRequest]);
    alert(`Solicitação enviada para ${team.name}! Aguarde a resposta do time.`);
  };

  const handleJoinRequestResponse = (requestId, response) => {
    setJoinRequests(prev => 
      prev.map(request => 
        request.id === requestId 
          ? { ...request, status: response }
          : request
      )
    );
  };

  const handleScheduleFriendlyMatch = (opponent) => {
    const newMatch = {
      id: Date.now(),
      homeTeam: 'Vila Nove F.C.', // Time do usuário atual
      homeTeamId: 1,
      awayTeam: opponent === 'random' ? 'Time Aleatório' : opponent.name,
      awayTeamId: opponent === 'random' ? 'random' : opponent.id,
      date: new Date().toLocaleDateString('pt-BR'),
      time: '19:00', // Horário padrão
      location: 'A definir',
      status: 'pending', // pending, confirmed, cancelled
      isRandom: opponent === 'random'
    };
    
    setFriendlyMatches(prev => [...prev, newMatch]);
    
    if (opponent === 'random') {
      alert('Amistoso marcado! Aguarde outros times se interessarem.');
    } else {
      alert(`Convite de amistoso enviado para ${opponent.name}! Aguarde a confirmação.`);
    }
  };

  const handleTimeSlotUpdate = (dayId, slotId, updates) => {
    setFieldTimeSlots(prev => 
      prev.map(day => 
        day.id === dayId 
          ? {
              ...day, 
              timeSlots: day.timeSlots.map(slot => 
                slot.id === slotId ? { ...slot, ...updates } : slot
              )
            }
          : day
      )
    );
  };

  const handleAddTimeSlot = (dayId) => {
    const newSlot = {
      id: Date.now(),
      time: '00:00 - 01:00',
      price: 100,
      available: true
    };
    
    setFieldTimeSlots(prev => 
      prev.map(day => 
        day.id === dayId 
          ? { ...day, timeSlots: [...day.timeSlots, newSlot] }
          : day
      )
    );
  };

  const handleRemoveTimeSlot = (dayId, slotId) => {
    setFieldTimeSlots(prev => 
      prev.map(day => 
        day.id === dayId 
          ? { ...day, timeSlots: day.timeSlots.filter(slot => slot.id !== slotId) }
          : day
      )
    );
  };

  const handleFriendlyMatchResponse = (matchId, response) => {
    setFriendlyMatches(prev => 
      prev.map(match => 
        match.id === matchId 
          ? { ...match, status: response }
          : match
      )
    );
  };

  const handleGameAction = (gameId, action) => {
    if (action === 'cancel') {
      setTeamSchedule(prev => 
        prev.map(game => 
          game.id === gameId 
            ? { ...game, status: 'cancelado' }
            : game
        )
      );
      alert('Jogo cancelado com sucesso!');
    } else if (action === 'reschedule') {
      // Simular nova data/horário (em uma implementação real, abriria modal para editar)
      const newDate = prompt('Nova data (DD/MM/AAAA):', '05/09/2025');
      const newTime = prompt('Novo horário:', '19:30');
      const newLocation = prompt('Novo local:', 'Campo do Centro');
      
      if (newDate && newTime && newLocation) {
        setTeamSchedule(prev => 
          prev.map(game => 
            game.id === gameId 
              ? { 
                  ...game, 
                  date: newDate, 
                  time: newTime, 
                  location: newLocation,
                  status: 'pendente' // Volta para pendente após remarcar
                }
              : game
          )
        );
        alert('Jogo remarcado com sucesso! Aguardando confirmação do adversário.');
      }
    } else if (action === 'confirm') {
      setTeamSchedule(prev => 
        prev.map(game => 
          game.id === gameId 
            ? { ...game, status: 'confirmado' }
            : game
        )
      );
      alert('Jogo confirmado com sucesso!');
    }
  }

  const StatusBar = () => (
    <div className="flex justify-between items-center text-white text-sm px-4 py-2">
      <div className="flex items-center gap-1">
        <div className="flex gap-1">
          <div className="w-1 h-3 bg-white rounded"></div>
          <div className="w-1 h-3 bg-white rounded"></div>
          <div className="w-1 h-3 bg-white rounded"></div>
          <div className="w-1 h-3 bg-white/50 rounded"></div>
        </div>
        <div className="ml-2 flex items-center gap-1">
          <div className="w-4 h-2 bg-white rounded-sm"></div>
        </div>
      </div>
      <div className="font-medium">
        {currentScreen === 'home' && '9:41'}
        {currentScreen === 'myteam' && '9:41'}
        {currentScreen === 'manager' && ''}
        {currentScreen === 'tournaments' && '9:36'}
      </div>
      <div className="flex items-center gap-1">
        <div className="flex gap-1">
          <div className="w-1 h-3 bg-white rounded"></div>
          <div className="w-1 h-3 bg-white rounded"></div>
          <div className="w-1 h-3 bg-white rounded"></div>
          <div className="w-1 h-3 bg-white/50 rounded"></div>
        </div>
        <div className="w-6 h-3 bg-white rounded-sm flex items-center justify-end pr-0.5">
          <div className="w-4 h-2 bg-slate-800 rounded-sm"></div>
        </div>
      </div>
    </div>
  );

  const HomeScreen = () => (
    <div className="bg-slate-800 min-h-screen">
      <StatusBar />
      <div className="px-6 py-8">
        <h1 className="text-white text-4xl font-bold mb-8">ArenaSobral</h1>
        <div className="space-y-4">
          <button 
            onClick={() => setCurrentScreen('login')}
            className="w-full bg-white rounded-xl p-4 flex items-center gap-4 shadow-lg"
          >
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 text-left">
              <span className="text-lg font-medium text-slate-800 block">Login ArenaSobral</span>
              <span className="text-sm text-slate-500">Jogadores • Donos de Time • Areninhas</span>
            </div>
          </button>

          <button 
            onClick={() => setCurrentScreen('searchteams')}
            className="w-full bg-white rounded-xl p-4 flex items-center gap-4 shadow-lg"
          >
            <div className="w-12 h-12 bg-slate-600 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <span className="text-lg font-medium text-slate-800">Buscar Times</span>
          </button>

          <button 
            onClick={() => setCurrentScreen('searchplayers')}
            className="w-full bg-white rounded-xl p-4 flex items-center gap-4 shadow-lg"
          >
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <span className="text-lg font-medium text-slate-800">Buscar Jogadores</span>
          </button>

          <button 
            onClick={() => setCurrentScreen('playerboard')}
            className="w-full bg-white rounded-xl p-4 flex items-center gap-4 shadow-lg"
          >
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <span className="text-lg font-medium text-slate-800">Painel do Jogador</span>
          </button>

          <button 
            onClick={() => setCurrentScreen('teamowner')}
            className="w-full bg-white rounded-xl p-4 flex items-center gap-4 shadow-lg"
          >
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <span className="text-lg font-medium text-slate-800">Painel do Dono do Time</span>
          </button>

          <button 
            onClick={() => setCurrentScreen('fieldowner')}
            className="w-full bg-white rounded-xl p-4 flex items-center gap-4 shadow-lg"
          >
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <span className="text-lg font-medium text-slate-800">Areninha Privada</span>
          </button>

          <button 
            onClick={() => setCurrentScreen('fieldschedule')}
            className="w-full bg-white rounded-xl p-4 flex items-center gap-4 shadow-lg"
          >
            <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 text-left">
              <span className="text-lg font-medium text-slate-800 block">Gerenciar Horários</span>
              <span className="text-sm text-slate-500">Cadastrar horários das quadras</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  const LoginScreen = () => (
    <div className="bg-slate-800 min-h-screen">
      <StatusBar />
      <div className="flex items-center gap-4 px-4 py-4 text-white">
        <button onClick={() => setCurrentScreen('home')}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">Login ArenaSobral</h1>
      </div>
      
      <div className="px-4 py-8">
        <div className="bg-white rounded-xl p-6">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Bem-vindo ao ArenaSobral</h2>
            <p className="text-slate-600">Entre em sua conta para acessar todas as funcionalidades</p>
          </div>

          <div className="mb-6">
            <label className="text-slate-600 text-sm mb-2 block">Email *</label>
            <input 
              type="email" 
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="seu.email@exemplo.com"
            />
          </div>

          <div className="mb-6">
            <label className="text-slate-600 text-sm mb-2 block">Senha *</label>
            <input 
              type="password" 
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Sua senha"
            />
          </div>

          <div className="mb-6">
            <label className="text-slate-600 text-sm mb-2 block">Tipo de Conta *</label>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input type="radio" name="userType" value="player" className="text-blue-500" />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-800">Jogador</div>
                    <div className="text-sm text-slate-600">Buscar times, participar de jogos</div>
                  </div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input type="radio" name="userType" value="teamowner" className="text-blue-500" />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-800">Dono de Time</div>
                    <div className="text-sm text-slate-600">Gerenciar equipe, marcar jogos</div>
                  </div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input type="radio" name="userType" value="fieldowner" className="text-blue-500" />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-800">Dono de Areninha</div>
                    <div className="text-sm text-slate-600">Gerenciar quadra, horários e reservas</div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <button 
            onClick={() => {
              const userType = document.querySelector('input[name="userType"]:checked')?.value;
              if (userType === 'player') {
                setCurrentScreen('playerboard');
              } else if (userType === 'teamowner') {
                setCurrentScreen('teamowner');
              } else if (userType === 'fieldowner') {
                setCurrentScreen('fieldownerpanel');
              } else {
                alert('Por favor, selecione o tipo de conta');
              }
            }}
            className="w-full bg-blue-500 text-white font-medium py-3 rounded-lg mb-4 hover:bg-blue-600 transition"
          >
            Entrar
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-3">
              Ainda não tem uma conta?
            </p>
            <button 
              onClick={() => setCurrentScreen('register')}
              className="text-blue-500 text-sm font-medium hover:text-blue-600 transition"
            >
              Criar Conta Grátis
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center mb-3">
              Esqueceu a senha?
            </p>
            <button className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg text-sm hover:bg-gray-200 transition">
              Recuperar Senha
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const RegisterScreen = () => {
    const [selectedUserType, setSelectedUserType] = useState('');

    const handleUserTypeChange = (userType) => {
      setSelectedUserType(userType);
    };

    return (
      <div className="bg-slate-800 min-h-screen">
        <StatusBar />
        <div className="flex items-center gap-4 px-4 py-4 text-white">
          <button onClick={() => setCurrentScreen('login')}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">Criar Conta</h1>
        </div>
        
        <div className="px-4 py-4">
          <div className="bg-white rounded-xl p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Criar Sua Conta</h2>
              <p className="text-slate-600">Escolha o tipo de conta que melhor se adequa a você</p>
            </div>

            <div className="mb-6">
              <label className="text-slate-600 text-sm mb-2 block">Nome Completo *</label>
              <input 
                type="text" 
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Seu nome completo"
              />
            </div>

            <div className="mb-6">
              <label className="text-slate-600 text-sm mb-2 block">Email *</label>
              <input 
                type="email" 
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="seu.email@exemplo.com"
              />
            </div>

            <div className="mb-6">
              <label className="text-slate-600 text-sm mb-2 block">WhatsApp *</label>
              <input 
                type="tel" 
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="(85) 99999-9999"
              />
            </div>

            <div className="mb-6">
              <label className="text-slate-600 text-sm mb-2 block">Senha *</label>
              <input 
                type="password" 
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Crie uma senha segura"
              />
            </div>

            <div className="mb-6">
              <label className="text-slate-600 text-sm mb-2 block">Confirmar Senha *</label>
              <input 
                type="password" 
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirme sua senha"
              />
            </div>

            <div className="mb-6">
              <label className="text-slate-600 text-sm mb-2 block">Tipo de Conta *</label>
              <div className="space-y-3">
                <label 
                  className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition ${
                    selectedUserType === 'player' 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => handleUserTypeChange('player')}
                >
                  <input 
                    type="radio" 
                    name="registerUserType" 
                    value="player" 
                    checked={selectedUserType === 'player'}
                    onChange={() => handleUserTypeChange('player')}
                    className="text-purple-500" 
                  />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-800">Jogador</div>
                      <div className="text-sm text-slate-600">Buscar times, participar de jogos, marcar peladas</div>
                    </div>
                  </div>
                </label>

                <label 
                  className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition ${
                    selectedUserType === 'teamowner' 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => handleUserTypeChange('teamowner')}
                >
                  <input 
                    type="radio" 
                    name="registerUserType" 
                    value="teamowner" 
                    checked={selectedUserType === 'teamowner'}
                    onChange={() => handleUserTypeChange('teamowner')}
                    className="text-green-500" 
                  />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-800">Dono de Time</div>
                      <div className="text-sm text-slate-600">Gerenciar equipe, recrutar jogadores, marcar amistosos</div>
                    </div>
                  </div>
                </label>

                <label 
                  className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition ${
                    selectedUserType === 'fieldowner' 
                      ? 'border-orange-500 bg-orange-50' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => handleUserTypeChange('fieldowner')}
                >
                  <input 
                    type="radio" 
                    name="registerUserType" 
                    value="fieldowner" 
                    checked={selectedUserType === 'fieldowner'}
                    onChange={() => handleUserTypeChange('fieldowner')}
                    className="text-orange-500" 
                  />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-800">Dono de Areninha</div>
                      <div className="text-sm text-slate-600">Cadastrar quadra, gerenciar horários e reservas</div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Dynamic fields based on user type */}
            {selectedUserType === 'player' && (
              <div className="mb-6">
                <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                  <h4 className="font-bold text-purple-800 mb-3">Informações do Jogador</h4>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-slate-500 mb-1 block">Idade</label>
                        <input 
                          type="number" 
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-slate-800"
                          placeholder="25"
                          min="16"
                          max="50"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-500 mb-1 block">Posição</label>
                        <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-slate-800">
                          <option value="">Selecione</option>
                          <option value="goleiro">Goleiro</option>
                          <option value="zagueiro">Zagueiro</option>
                          <option value="meio-campo">Meio-campo</option>
                          <option value="atacante">Atacante</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Categoria Preferida</label>
                      <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-slate-800">
                        <option value="">Selecione</option>
                        <option value="racha">Racha - futebol recreativo</option>
                        <option value="sub20">Sub20 - até 20 anos</option>
                        <option value="2q">2Q - Segundo Quadro</option>
                        <option value="1q">1Q - Primeiro Quadro</option>
                        <option value="veterano">Veterano - acima de 35 anos</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Experiência</label>
                      <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-slate-800">
                        <option value="">Selecione</option>
                        <option value="iniciante">Iniciante (0-1 ano)</option>
                        <option value="2-3anos">2-3 anos</option>
                        <option value="4-5anos">4-5 anos</option>
                        <option value="6-10anos">6-10 anos</option>
                        <option value="mais10anos">Mais de 10 anos</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Disponibilidade</label>
                      <div className="grid grid-cols-2 gap-2">
                        <label className="flex items-center gap-1 text-xs">
                          <input type="checkbox" className="rounded" />
                          <span>Manhã</span>
                        </label>
                        <label className="flex items-center gap-1 text-xs">
                          <input type="checkbox" className="rounded" />
                          <span>Tarde</span>
                        </label>
                        <label className="flex items-center gap-1 text-xs">
                          <input type="checkbox" className="rounded" />
                          <span>Noite</span>
                        </label>
                        <label className="flex items-center gap-1 text-xs">
                          <input type="checkbox" className="rounded" />
                          <span>Final de Semana</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Altura e Peso (opcional)</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input 
                          type="text" 
                          className="border border-gray-200 rounded-lg px-2 py-1 text-slate-800 text-xs"
                          placeholder="Altura (cm)"
                        />
                        <input 
                          type="text" 
                          className="border border-gray-200 rounded-lg px-2 py-1 text-slate-800 text-xs"
                          placeholder="Peso (kg)"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedUserType === 'teamowner' && (
              <div className="mb-6">
                <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <h4 className="font-bold text-green-800 mb-3">Informações do Time</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Nome do Time</label>
                      <input 
                        type="text" 
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-slate-800"
                        placeholder="Nome da sua equipe"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-slate-500 mb-1 block">Nome do Presidente</label>
                        <input 
                          type="text" 
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-slate-800"
                          placeholder="Nome do presidente"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-500 mb-1 block">Nome do Técnico</label>
                        <input 
                          type="text" 
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-slate-800"
                          placeholder="Nome do técnico"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-slate-500 mb-1 block">Categoria do Time</label>
                        <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-slate-800">
                          <option value="">Selecione</option>
                          <option value="racha">Racha</option>
                          <option value="sub20">Sub20</option>
                          <option value="2q">2Q</option>
                          <option value="1q">1Q</option>
                          <option value="veterano">Veterano</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-slate-500 mb-1 block">Nº Jogadores Atual</label>
                        <input 
                          type="number" 
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-slate-800"
                          placeholder="15"
                          min="11"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Horários Disponíveis</label>
                      <div className="grid grid-cols-2 gap-2">
                        <label className="flex items-center gap-1 text-xs">
                          <input type="checkbox" className="rounded" />
                          <span>Manhã</span>
                        </label>
                        <label className="flex items-center gap-1 text-xs">
                          <input type="checkbox" className="rounded" />
                          <span>Tarde</span>
                        </label>
                        <label className="flex items-center gap-1 text-xs">
                          <input type="checkbox" className="rounded" />
                          <span>Noite</span>
                        </label>
                        <label className="flex items-center gap-1 text-xs">
                          <input type="checkbox" className="rounded" />
                          <span>Final de Semana</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Descrição do Time</label>
                      <textarea 
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-slate-800 h-16 resize-none text-xs"
                        placeholder="Conte sobre seu time, objetivos, estilo de jogo..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedUserType === 'fieldowner' && (
              <div className="mb-6">
                <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                  <h4 className="font-bold text-orange-800 mb-3">Informações da Areninha</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Nome da Areninha</label>
                      <input 
                        type="text" 
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-slate-800"
                        placeholder="Nome da sua areninha"
                      />
                    </div>
                    
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Endereço Completo</label>
                      <textarea 
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-slate-800 h-16 resize-none"
                        placeholder="Rua, número, bairro, cidade, CEP"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Tipos de Quadra</label>
                      <div className="grid grid-cols-2 gap-2">
                        <label className="flex items-center gap-1 text-xs">
                          <input type="checkbox" className="rounded" />
                          <span>Society</span>
                        </label>
                        <label className="flex items-center gap-1 text-xs">
                          <input type="checkbox" className="rounded" />
                          <span>Futsal</span>
                        </label>
                        <label className="flex items-center gap-1 text-xs">
                          <input type="checkbox" className="rounded" />
                          <span>Areia</span>
                        </label>
                        <label className="flex items-center gap-1 text-xs">
                          <input type="checkbox" className="rounded" />
                          <span>Concreto</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Facilidades</label>
                      <div className="grid grid-cols-2 gap-2">
                        <label className="flex items-center gap-1 text-xs">
                          <input type="checkbox" className="rounded" />
                          <span>Vestiário</span>
                        </label>
                        <label className="flex items-center gap-1 text-xs">
                          <input type="checkbox" className="rounded" />
                          <span>Chuveiro</span>
                        </label>
                        <label className="flex items-center gap-1 text-xs">
                          <input type="checkbox" className="rounded" />
                          <span>Estacionamento</span>
                        </label>
                        <label className="flex items-center gap-1 text-xs">
                          <input type="checkbox" className="rounded" />
                          <span>Iluminação</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Horário de Funcionamento</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input 
                          type="time" 
                          className="border border-gray-200 rounded-lg px-2 py-1 text-slate-800 text-xs"
                          placeholder="Abertura"
                        />
                        <input 
                          type="time" 
                          className="border border-gray-200 rounded-lg px-2 py-1 text-slate-800 text-xs"
                          placeholder="Fechamento"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Preços por Hora</label>
                      <div className="space-y-2">
                        <div className="grid grid-cols-3 gap-2">
                          <div className="flex items-center gap-1">
                            <span className="text-xs">Manhã R$</span>
                            <input 
                              type="number" 
                              className="flex-1 border border-gray-200 rounded-lg px-2 py-1 text-slate-800 text-xs"
                              placeholder="80"
                            />
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs">Tarde R$</span>
                            <input 
                              type="number" 
                              className="flex-1 border border-gray-200 rounded-lg px-2 py-1 text-slate-800 text-xs"
                              placeholder="100"
                            />
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs">Noite R$</span>
                            <input 
                              type="number" 
                              className="flex-1 border border-gray-200 rounded-lg px-2 py-1 text-slate-800 text-xs"
                              placeholder="120"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center gap-1">
                            <span className="text-xs">Fim de Semana R$</span>
                            <input 
                              type="number" 
                              className="flex-1 border border-gray-200 rounded-lg px-2 py-1 text-slate-800 text-xs"
                              placeholder="150"
                            />
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs">Feriado R$</span>
                            <input 
                              type="number" 
                              className="flex-1 border border-gray-200 rounded-lg px-2 py-1 text-slate-800 text-xs"
                              placeholder="180"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Data de Cadastro</label>
                      <input 
                        type="date" 
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-slate-800 text-xs"
                        defaultValue={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Data de Início do Funcionamento</label>
                      <input 
                        type="date" 
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-slate-800 text-xs"
                        placeholder="Quando a areninha começou a funcionar"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Status de Funcionamento</label>
                      <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-slate-800 text-xs">
                        <option value="">Selecione</option>
                        <option value="funcionando">Funcionando Normalmente</option>
                        <option value="reforma">Em Reforma</option>
                        <option value="manutencao">Em Manutenção</option>
                        <option value="fechado_temporario">Fechado Temporariamente</option>
                        <option value="inauguracao">Aguardando Inauguração</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Dias de Funcionamento</label>
                      <div className="grid grid-cols-2 gap-2">
                        <label className="flex items-center gap-1 text-xs">
                          <input type="checkbox" className="rounded" defaultChecked />
                          <span>Segunda-feira</span>
                        </label>
                        <label className="flex items-center gap-1 text-xs">
                          <input type="checkbox" className="rounded" defaultChecked />
                          <span>Terça-feira</span>
                        </label>
                        <label className="flex items-center gap-1 text-xs">
                          <input type="checkbox" className="rounded" defaultChecked />
                          <span>Quarta-feira</span>
                        </label>
                        <label className="flex items-center gap-1 text-xs">
                          <input type="checkbox" className="rounded" defaultChecked />
                          <span>Quinta-feira</span>
                        </label>
                        <label className="flex items-center gap-1 text-xs">
                          <input type="checkbox" className="rounded" defaultChecked />
                          <span>Sexta-feira</span>
                        </label>
                        <label className="flex items-center gap-1 text-xs">
                          <input type="checkbox" className="rounded" defaultChecked />
                          <span>Sábado</span>
                        </label>
                        <label className="flex items-center gap-1 text-xs">
                          <input type="checkbox" className="rounded" />
                          <span>Domingo</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-slate-500 mb-2 block font-semibold">Horários de Funcionamento (Hora a Hora)</label>
                      <div className="bg-gray-50 rounded-lg p-3 space-y-3">
                        <div className="text-xs text-gray-600 mb-2">
                          Configure os horários disponíveis para aluguel da quadra:
                        </div>
                        
                        {/* Horários da Manhã */}
                        <div>
                          <div className="text-xs font-medium text-blue-600 mb-2">🌅 Manhã (06:00 - 11:59)</div>
                          <div className="space-y-1">
                            {Array.from({ length: 6 }, (_, i) => {
                              const hour = 6 + i;
                              const timeSlot = `${hour.toString().padStart(2, '0')}:00 - ${(hour + 1).toString().padStart(2, '0')}:00`;
                              const defaultPrice = 80; // Preço padrão manhã
                              return (
                                <div key={timeSlot} className="bg-white rounded p-2 border border-gray-200">
                                  <div className="flex items-center gap-2 mb-1">
                                    <input type="checkbox" className="rounded text-blue-500" />
                                    <span className="text-gray-700 text-xs font-medium">{timeSlot}</span>
                                  </div>
                                  <div className="flex items-center gap-1 ml-5">
                                    <span className="text-xs text-gray-600">R$</span>
                                    <input 
                                      type="number" 
                                      className="w-16 border border-gray-200 rounded px-2 py-1 text-xs"
                                      defaultValue={defaultPrice}
                                      min="0"
                                      step="5"
                                    />
                                    <span className="text-xs text-gray-500">/hora</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Horários da Tarde */}
                        <div>
                          <div className="text-xs font-medium text-orange-600 mb-2">☀️ Tarde (12:00 - 17:59)</div>
                          <div className="space-y-1">
                            {Array.from({ length: 6 }, (_, i) => {
                              const hour = 12 + i;
                              const timeSlot = `${hour.toString().padStart(2, '0')}:00 - ${(hour + 1).toString().padStart(2, '0')}:00`;
                              const defaultPrice = 100; // Preço padrão tarde
                              return (
                                <div key={timeSlot} className="bg-white rounded p-2 border border-gray-200">
                                  <div className="flex items-center gap-2 mb-1">
                                    <input type="checkbox" className="rounded text-orange-500" defaultChecked />
                                    <span className="text-gray-700 text-xs font-medium">{timeSlot}</span>
                                  </div>
                                  <div className="flex items-center gap-1 ml-5">
                                    <span className="text-xs text-gray-600">R$</span>
                                    <input 
                                      type="number" 
                                      className="w-16 border border-gray-200 rounded px-2 py-1 text-xs"
                                      defaultValue={defaultPrice}
                                      min="0"
                                      step="5"
                                    />
                                    <span className="text-xs text-gray-500">/hora</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Horários da Noite */}
                        <div>
                          <div className="text-xs font-medium text-purple-600 mb-2">🌙 Noite (18:00 - 23:59)</div>
                          <div className="space-y-1">
                            {Array.from({ length: 6 }, (_, i) => {
                              const hour = 18 + i;
                              const timeSlot = `${hour.toString().padStart(2, '0')}:00 - ${(hour + 1).toString().padStart(2, '0')}:00`;
                              const defaultPrice = 120; // Preço padrão noite
                              return (
                                <div key={timeSlot} className="bg-white rounded p-2 border border-gray-200">
                                  <div className="flex items-center gap-2 mb-1">
                                    <input type="checkbox" className="rounded text-purple-500" defaultChecked />
                                    <span className="text-gray-700 text-xs font-medium">{timeSlot}</span>
                                  </div>
                                  <div className="flex items-center gap-1 ml-5">
                                    <span className="text-xs text-gray-600">R$</span>
                                    <input 
                                      type="number" 
                                      className="w-16 border border-gray-200 rounded px-2 py-1 text-xs"
                                      defaultValue={defaultPrice}
                                      min="0"
                                      step="5"
                                    />
                                    <span className="text-xs text-gray-500">/hora</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Horários da Madrugada */}
                        <div>
                          <div className="text-xs font-medium text-gray-600 mb-2">🌃 Madrugada (00:00 - 05:59)</div>
                          <div className="space-y-1">
                            {Array.from({ length: 6 }, (_, i) => {
                              const hour = i;
                              const timeSlot = `${hour.toString().padStart(2, '0')}:00 - ${(hour + 1).toString().padStart(2, '0')}:00`;
                              const defaultPrice = 150; // Preço padrão madrugada (mais caro)
                              return (
                                <div key={timeSlot} className="bg-white rounded p-2 border border-gray-200">
                                  <div className="flex items-center gap-2 mb-1">
                                    <input type="checkbox" className="rounded text-gray-500" />
                                    <span className="text-gray-700 text-xs font-medium">{timeSlot}</span>
                                  </div>
                                  <div className="flex items-center gap-1 ml-5">
                                    <span className="text-xs text-gray-600">R$</span>
                                    <input 
                                      type="number" 
                                      className="w-16 border border-gray-200 rounded px-2 py-1 text-xs"
                                      defaultValue={defaultPrice}
                                      min="0"
                                      step="5"
                                    />
                                    <span className="text-xs text-gray-500">/hora</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Botões de ação rápida */}
                        <div className="border-t pt-2 mt-3">
                          <div className="text-xs text-gray-600 mb-2">Ações rápidas:</div>
                          <div className="flex gap-2">
                            <button 
                              type="button"
                              className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
                              onClick={() => {
                                // Marcar todos os horários comerciais (06:00-22:00)
                                const checkboxes = document.querySelectorAll('input[type="checkbox"]');
                                checkboxes.forEach(cb => cb.checked = true);
                              }}
                            >
                              Marcar Todos
                            </button>
                            <button 
                              type="button"
                              className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                              onClick={() => {
                                // Marcar apenas horários comerciais
                                const checkboxes = document.querySelectorAll('input[type="checkbox"]');
                                checkboxes.forEach((cb, index) => {
                                  if (index >= 6 && index <= 17) { // 06:00 às 17:00
                                    cb.checked = true;
                                  }
                                });
                              }}
                            >
                              Apenas Comercial
                            </button>
                            <button 
                              type="button"
                              className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
                              onClick={() => {
                                // Desmarcar todos
                                const checkboxes = document.querySelectorAll('input[type="checkbox"]');
                                checkboxes.forEach(cb => cb.checked = false);
                              }}
                            >
                              Limpar Todos
                            </button>
                          </div>
                        </div>

                        <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded">
                          💡 <strong>Dica:</strong> Marque os horários disponíveis e defina o preço de cada um. 
                          Os valores podem ser ajustados individualmente conforme a demanda de cada período.
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-slate-500 mb-2 block font-semibold">Cadastrar Horário Individual</label>
                      <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                        <div className="text-xs text-blue-700 mb-3 font-medium">
                          📅 Adicionar horários específicos por quadra
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <label className="text-xs text-slate-600 mb-1 block">Selecionar Quadra</label>
                            <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-slate-800 text-xs">
                              <option value="">Selecione a quadra</option>
                              <option value="quadra1">Quadra 1</option>
                              <option value="quadra2">Quadra 2</option>
                              <option value="quadra3">Quadra 3</option>
                              <option value="quadra4">Quadra 4</option>
                            </select>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs text-slate-600 mb-1 block">Horário de Início</label>
                              <input 
                                type="time" 
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-slate-800 text-xs"
                                defaultValue="18:00"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-slate-600 mb-1 block">Horário de Término</label>
                              <input 
                                type="time" 
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-slate-800 text-xs"
                                defaultValue="19:00"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs text-slate-600 mb-1 block">Preço (R$)</label>
                              <input 
                                type="number" 
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-slate-800 text-xs"
                                placeholder="120"
                                min="0"
                                step="10"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-slate-600 mb-1 block">Dia da Semana</label>
                              <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-slate-800 text-xs">
                                <option value="">Selecione</option>
                                <option value="segunda">Segunda-feira</option>
                                <option value="terca">Terça-feira</option>
                                <option value="quarta">Quarta-feira</option>
                                <option value="quinta">Quinta-feira</option>
                                <option value="sexta">Sexta-feira</option>
                                <option value="sabado">Sábado</option>
                                <option value="domingo">Domingo</option>
                                <option value="todos">Todos os dias</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="text-xs text-slate-600 mb-1 block">Observações (opcional)</label>
                            <input 
                              type="text" 
                              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-slate-800 text-xs"
                              placeholder="Ex: Horário nobre, Desconto especial, etc."
                            />
                          </div>

                          <div className="flex gap-2 pt-2">
                            <button 
                              type="button"
                              className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg text-xs font-bold hover:bg-green-600 transition shadow-md flex items-center justify-center gap-1"
                            >
                              <span>+</span>
                              Cadastrar Horário
                            </button>
                            <button 
                              type="button"
                              className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg text-xs font-bold hover:bg-blue-600 transition shadow-md flex items-center justify-center gap-1"
                            >
                              <span>📋</span>
                              Adicionar Horário
                            </button>
                          </div>

                          <div className="bg-white rounded p-2 border border-gray-100 mt-3">
                            <div className="text-xs text-gray-600 font-medium mb-2">Horários Cadastrados:</div>
                            <div className="space-y-1 max-h-24 overflow-y-auto">
                              <div className="text-xs bg-gray-50 p-2 rounded border-l-4 border-green-400 flex justify-between items-center">
                                <div>
                                  <strong>Quadra 1:</strong> 18:00-19:00<br/>
                                  <span className="text-green-600 font-semibold">💰 R$ 120,00</span> | Segunda-feira
                                </div>
                                <button className="text-red-500 hover:text-red-700 ml-2">🗑️</button>
                              </div>
                              <div className="text-xs bg-gray-50 p-2 rounded border-l-4 border-blue-400 flex justify-between items-center">
                                <div>
                                  <strong>Quadra 2:</strong> 19:00-20:00<br/>
                                  <span className="text-blue-600 font-semibold">💰 R$ 150,00</span> | Terça-feira
                                </div>
                                <button className="text-red-500 hover:text-red-700 ml-2">🗑️</button>
                              </div>
                              <div className="text-xs bg-gray-50 p-2 rounded border-l-4 border-purple-400 flex justify-between items-center">
                                <div>
                                  <strong>Quadra 3:</strong> 20:00-21:00<br/>
                                  <span className="text-purple-600 font-semibold">💰 R$ 180,00</span> | Fim de semana
                                </div>
                                <button className="text-red-500 hover:text-red-700 ml-2">🗑️</button>
                              </div>
                              <div className="text-xs bg-gray-50 p-2 rounded border-l-4 border-orange-400 flex justify-between items-center">
                                <div>
                                  <strong>Quadra 4:</strong> 21:00-22:00<br/>
                                  <span className="text-orange-600 font-semibold">💰 R$ 200,00</span> | Todos os dias
                                </div>
                                <button className="text-red-500 hover:text-red-700 ml-2">🗑️</button>
                              </div>
                              <div className="text-xs text-gray-400 italic text-center py-1">
                                ✅ 4 horários configurados
                              </div>
                            </div>
                          </div>

                          <div className="text-xs text-blue-600 bg-white p-2 rounded border border-blue-200">
                            <strong>💡 Como usar:</strong><br/>
                            1. Selecione a quadra<br/>
                            2. Defina início (18h) e término (19h)<br/>
                            3. Configure preço e dia<br/>
                            4. Clique em "Cadastrar Horário" para salvar<br/>
                            5. Use "Adicionar Horário" para criar mais slots
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-6">
              <label className="text-slate-600 text-sm mb-2 block">Localização (Bairro/Região) *</label>
              <input 
                type="text" 
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Seu bairro ou região em Sobral"
              />
            </div>

            <button 
              onClick={() => {
                if (selectedUserType) {
                  alert('Conta criada com sucesso! Agora você pode fazer login.');
                  setCurrentScreen('login');
                } else {
                  alert('Por favor, selecione o tipo de conta');
                }
              }}
              className="w-full bg-blue-500 text-white font-medium py-3 rounded-lg mb-4 hover:bg-blue-600 transition"
            >
              Criar Conta
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-3">
                Já tem uma conta?
              </p>
              <button 
                onClick={() => setCurrentScreen('login')}
                className="text-blue-500 text-sm font-medium hover:text-blue-600 transition"
              >
                Fazer Login
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              Ao criar sua conta, você concorda com nossos termos de uso e política de privacidade
            </p>
          </div>
        </div>
      </div>
    );
  };

  const FieldScheduleScreen = () => {
    const [selectedDate, setSelectedDate] = useState('08/08/2025');
    const [selectedSport, setSelectedSport] = useState('Beach Tennis');
    const [selectedPeriod, setSelectedPeriod] = useState('Madrugada');
    
    const sports = ['Beach Tennis', 'Futebol', 'Vôlei', 'Futsal'];
    const periods = ['Madrugada', 'Manhã', 'Tarde', 'Noite'];
    
    const timeSlots = ['18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '00:00'];
    
    const [fieldAvailability, setFieldAvailability] = useState({
      'QUADRA 1': {
        '18:00': 'Indisponível',
        '19:00': 'Indisponível', 
        '20:00': 'Indisponível',
        '21:00': 'Indisponível',
        '22:00': 'Disponível',
        '23:00': 'Disponível',
        '00:00': 'Disponível'
      },
      'QUADRA 2': {
        '18:00': 'Indisponível',
        '19:00': 'Indisponível',
        '20:00': 'Indisponível', 
        '21:00': 'Indisponível',
        '22:00': 'Disponível',
        '23:00': 'Disponível',
        '00:00': 'Disponível'
      },
      'QUADRA 3': {
        '18:00': 'Indisponível',
        '19:00': 'Indisponível',
        '20:00': 'Indisponível',
        '21:00': 'Indisponível', 
        '22:00': 'Disponível',
        '23:00': 'Disponível',
        '00:00': 'Disponível'
      },
      'QUADRA 4': {
        '18:00': 'Indisponível',
        '19:00': 'Indisponível',
        '20:00': 'Indisponível',
        '21:00': 'Indisponível',
        '22:00': 'Disponível', 
        '23:00': 'Disponível',
        '00:00': 'Disponível'
      }
    });

    const toggleAvailability = (quadra, horario) => {
      setFieldAvailability(prev => ({
        ...prev,
        [quadra]: {
          ...prev[quadra],
          [horario]: prev[quadra][horario] === 'Disponível' ? 'Indisponível' : 'Disponível'
        }
      }));
    };

    return (
      <div className="bg-slate-700 min-h-screen">
        <StatusBar />
        
        <div className="p-4">
          {/* Card container with proper spacing */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-xl max-w-sm mx-auto">
            {/* Header with dark background */}
            <div className="bg-slate-700 text-white px-4 py-5">
              <div className="flex items-center gap-3 mb-4">
                <button onClick={() => setCurrentScreen('home')} className="text-white hover:text-gray-200">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-lg font-bold text-white">FAÇA SUA RESERVA</h1>
              </div>
              
              {/* Controls in proper layout */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-200">ESPORTE:</label>
                    <select 
                      value={selectedSport}
                      onChange={(e) => setSelectedSport(e.target.value)}
                      className="w-full bg-white text-slate-800 px-2 py-1.5 rounded text-xs border-0 focus:ring-2 focus:ring-blue-400"
                    >
                      {sports.map(sport => (
                        <option key={sport} value={sport}>{sport}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-200">Data:</label>
                    <div className="flex items-center bg-white rounded overflow-hidden">
                      <select className="flex-1 bg-white text-slate-800 px-2 py-1.5 text-xs border-0">
                        <option>08/08/2025</option>
                      </select>
                      <div className="p-1.5 bg-blue-500">
                        <Calendar className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-200">Período:</label>
                  <div className="flex gap-1">
                    {periods.map(period => (
                      <button
                        key={period}
                        onClick={() => setSelectedPeriod(period)}
                        className={`px-3 py-1 text-xs rounded font-medium transition ${
                          selectedPeriod === period 
                            ? 'bg-blue-500 text-white shadow-md' 
                            : 'bg-gray-200 text-slate-700 hover:bg-gray-300'
                        }`}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Time slots header with orange styling */}
            <div className="bg-gray-50 p-3">
              <div className="grid grid-cols-8 gap-1">
                <div></div> {/* Empty space for quadra labels */}
                {timeSlots.map(time => (
                  <div key={time} className="text-center font-bold bg-orange-400 text-white py-2 px-1 rounded text-xs">
                    {time}
                  </div>
                ))}
              </div>
            </div>

            {/* Quadras grid with better spacing */}
            <div className="p-3 bg-white">
              {Object.entries(fieldAvailability).map(([quadra, horarios], index) => (
                <div key={quadra} className="grid grid-cols-8 gap-1 mb-2">
                  <div className={`py-2 px-2 font-bold text-center text-white rounded text-xs flex items-center justify-center ${
                    index === 0 ? 'bg-blue-500' :
                    index === 1 ? 'bg-orange-500' :
                    index === 2 ? 'bg-purple-500' :
                    'bg-green-500'
                  }`}>
                    {quadra}
                  </div>
                  
                  {timeSlots.map(time => (
                    <button
                      key={`${quadra}-${time}`}
                      onClick={() => toggleAvailability(quadra, time)}
                      className={`py-2 px-1 text-center rounded text-xs font-medium transition-all border ${
                        horarios[time] === 'Disponível'
                          ? 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200 shadow-sm'
                          : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-150'
                      }`}
                    >
                      {horarios[time] === 'Disponível' ? 'Disponível' : 'Indisponível'}
                    </button>
                  ))}
                </div>
              ))}
            </div>

            {/* Action buttons with improved styling */}
            <div className="p-4 bg-white border-t border-gray-100">
              <div className="flex gap-2 mb-4">
                <button className="flex-1 bg-blue-500 text-white py-2.5 px-4 rounded-lg text-xs font-bold hover:bg-blue-600 transition shadow-md">
                  Salvar Alterações
                </button>
                <button className="flex-1 bg-gray-400 text-white py-2.5 px-4 rounded-lg text-xs font-bold hover:bg-gray-500 transition shadow-md">
                  Limpar Seleção
                </button>
              </div>
              
              {/* Legend with better formatting */}
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-gray-700 font-medium">Disponível</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    <span className="text-gray-700 font-medium">Indisponível</span>
                  </div>
                </div>
                
                <p className="text-xs text-gray-600 leading-relaxed">
                  Clique nos horários para alterar disponibilidade. 
                  Quadras disponíveis podem ser reservadas pelos usuários.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Screens que foram removidas - vou restaurar
  const SearchTeamsScreen = () => (
    <div className="bg-slate-800 min-h-screen">
      <StatusBar />
      <div className="flex items-center gap-4 px-4 py-4 text-white">
        <button onClick={() => setCurrentScreen('home')}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">Buscar Times</h1>
      </div>
      
      <div className="px-4 py-4">
        <div className="bg-white rounded-xl p-4 mb-4">
          <input 
            type="text" 
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Buscar times por nome, categoria ou localização..."
          />
        </div>

        <div className="space-y-4">
          {registeredTeams.map(team => (
            <div key={team.id} className="bg-white rounded-xl p-4 shadow-lg">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{team.name}</h3>
                  <p className="text-sm text-gray-600">{team.location} • {team.category}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">{team.players} jogadores</div>
                </div>
              </div>
              
              <div className="mb-3">
                <p className="text-sm text-gray-700 mb-1">
                  <strong>Capitão:</strong> {team.captain}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>WhatsApp:</strong> {team.whatsapp}
                </p>
              </div>

              <button 
                onClick={() => handleJoinTeamRequest(team)}
                className="w-full bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-600 transition"
              >
                Solicitar Entrada
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const SearchPlayersScreen = () => (
    <div className="bg-slate-800 min-h-screen">
      <StatusBar />
      <div className="flex items-center gap-4 px-4 py-4 text-white">
        <button onClick={() => setCurrentScreen('home')}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">Buscar Jogadores</h1>
      </div>
      
      <div className="px-4 py-4">
        <div className="bg-white rounded-xl p-4 mb-4">
          <input 
            type="text" 
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Buscar jogadores por nome, posição ou localização..."
          />
        </div>

        <div className="space-y-4">
          {registeredPlayers.map(player => (
            <div key={player.id} className="bg-white rounded-xl p-4 shadow-lg">
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                  <img src={player.photo} alt={player.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">{player.name}</h3>
                      <p className="text-sm text-gray-600">{player.age} anos • {player.position}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3">
                    <div><strong>Localização:</strong> {player.location}</div>
                    <div><strong>Experiência:</strong> {player.experience}</div>
                    <div><strong>Disponibilidade:</strong> {player.availability}</div>
                    <div><strong>Time Atual:</strong> {player.currentTeam}</div>
                  </div>

                  <button 
                    onClick={() => handleContactPlayer(player)}
                    className="w-full bg-green-500 text-white py-2 rounded-lg font-medium hover:bg-green-600 transition"
                  >
                    Fazer Proposta
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const PlayerBoardScreen = () => (
    <div className="bg-slate-800 min-h-screen">
      <StatusBar />
      <div className="flex items-center gap-4 px-4 py-4 text-white">
        <button onClick={() => setCurrentScreen('home')}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">Painel do Jogador</h1>
      </div>
      
      <div className="px-4 py-4">
        <div className="bg-white rounded-xl p-4 mb-4">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Bem-vindo, José!</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{contractOffers.length}</div>
              <div className="text-sm text-blue-800">Propostas</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{joinRequests.length}</div>
              <div className="text-sm text-green-800">Solicitações</div>
            </div>
          </div>

          {contractOffers.length > 0 && (
            <div className="mb-4">
              <h3 className="font-bold text-slate-800 mb-2">Propostas Recebidas:</h3>
              <div className="space-y-2">
                {contractOffers.map(offer => (
                  <div key={offer.id} className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-slate-800">{offer.teamName}</p>
                        <p className="text-sm text-gray-600">Posição: {offer.position}</p>
                        <p className="text-xs text-gray-500">{offer.date}</p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleOfferResponse(offer.id, 'accepted')}
                          className="bg-green-500 text-white px-3 py-1 rounded text-xs"
                        >
                          Aceitar
                        </button>
                        <button 
                          onClick={() => handleOfferResponse(offer.id, 'rejected')}
                          className="bg-red-500 text-white px-3 py-1 rounded text-xs"
                        >
                          Recusar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <button 
            onClick={() => setCurrentScreen('searchteams')}
            className="w-full bg-blue-500 text-white rounded-xl p-4 flex items-center gap-4 shadow-lg"
          >
            <Users className="w-6 h-6" />
            <span className="text-lg font-medium">Buscar Times</span>
          </button>

          <button 
            onClick={() => setCurrentScreen('tournaments')}
            className="w-full bg-green-500 text-white rounded-xl p-4 flex items-center gap-4 shadow-lg"
          >
            <Trophy className="w-6 h-6" />
            <span className="text-lg font-medium">Torneios</span>
          </button>

          <button 
            onClick={() => setCurrentScreen('fieldschedule')}
            className="w-full bg-orange-500 text-white rounded-xl p-4 flex items-center gap-4 shadow-lg"
          >
            <MapPin className="w-6 h-6" />
            <span className="text-lg font-medium">Buscar Areninha</span>
          </button>
        </div>
      </div>
    </div>
  );

  const TeamOwnerScreen = () => (
    <div className="bg-slate-800 min-h-screen">
      <StatusBar />
      <div className="flex items-center gap-4 px-4 py-4 text-white">
        <button onClick={() => setCurrentScreen('home')}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">Painel do Dono do Time</h1>
      </div>
      
      <div className="px-4 py-4">
        <div className="bg-white rounded-xl p-4 mb-4">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Vila Nove F.C.</h2>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-blue-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">15</div>
              <div className="text-sm text-blue-800">Jogadores</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">3</div>
              <div className="text-sm text-green-800">Jogos</div>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-orange-600">{friendlyMatches.length}</div>
              <div className="text-sm text-orange-800">Amistosos</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <button 
            onClick={() => setCurrentScreen('searchplayers')}
            className="w-full bg-green-500 text-white rounded-xl p-4 flex items-center gap-4 shadow-lg"
          >
            <User className="w-6 h-6" />
            <span className="text-lg font-medium">Contratar Jogadores</span>
          </button>

          <button 
            onClick={() => setCurrentScreen('myteam')}
            className="w-full bg-blue-500 text-white rounded-xl p-4 flex items-center gap-4 shadow-lg"
          >
            <Users className="w-6 h-6" />
            <span className="text-lg font-medium">Meu Time</span>
          </button>

          <button 
            onClick={() => setCurrentScreen('manager')}
            className="w-full bg-purple-500 text-white rounded-xl p-4 flex items-center gap-4 shadow-lg"
          >
            <MessageSquare className="w-6 h-6" />
            <span className="text-lg font-medium">Gerenciar Time</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen />;
      case 'login':
        return <LoginScreen />;
      case 'register':
        return <RegisterScreen />;
      case 'fieldschedule':
        return <FieldScheduleScreen />;
      case 'searchteams':
        return <SearchTeamsScreen />;
      case 'searchplayers':
        return <SearchPlayersScreen />;
      case 'playerboard':
        return <PlayerBoardScreen />;
      case 'teamowner':
        return <TeamOwnerScreen />;
      default:
        return <HomeScreen />;
    }
  }

  return (
    <div className="max-w-sm mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden relative">
      {renderCurrentScreen()}
    </div>
  );
};

export default ArenaSobralApp;