#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')

// Substitua essas variáveis com suas credenciais do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://seu-projeto.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sua-chave-anonima'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function seedDatabase() {
  console.log('Populando banco de dados com dados de exemplo...')

  try {
    // Criar usuários de exemplo
    const users = [
      {
        id: '11111111-1111-1111-1111-111111111111',
        email: 'jogador@teste.com',
        user_type: 'PLAYER',
        name: 'Jogador Teste',
        phone: '(88) 99999-1111'
      },
      {
        id: '22222222-2222-2222-2222-222222222222',
        email: 'time@teste.com',
        user_type: 'TEAM_OWNER',
        name: 'Dono de Time Teste',
        phone: '(88) 99999-2222'
      },
      {
        id: '33333333-3333-3333-3333-333333333333',
        email: 'areninha@teste.com',
        user_type: 'FIELD_OWNER',
        name: 'Dono de Areninha Teste',
        phone: '(88) 99999-3333'
      }
    ]

    for (const user of users) {
      const { error } = await supabase.from('users').upsert(user)
      if (error) console.error('Erro ao criar usuário:', error)
      else console.log(`Usuário ${user.name} criado com sucesso!`)
    }

    // Criar campos de exemplo
    const fields = [
      {
        name: 'Arena Sobral Central',
        location: 'Centro',
        address: 'Rua Principal, 123 - Centro',
        description: 'Areninha society com vestiário e estacionamento',
        field_type: 'SOCIETY',
        price_per_hour: 80,
        rating: 4.5,
        owner_id: '33333333-3333-3333-3333-333333333333',
        photos: [
          {
            id: '1',
            url: 'https://placehold.co/600x400?text=Arena+Sobral+Central',
            alt: 'Arena Sobral Central',
            isPrimary: true
          }
        ],
        amenities: [
          { id: '1', name: 'Vestiário', icon: 'changing-room' },
          { id: '2', name: 'Estacionamento', icon: 'parking' },
          { id: '3', name: 'Bola', icon: 'ball' }
        ],
        rules: [
          'Uso obrigatório de chuteira',
          'Proibido fumar nas dependências',
          'Respeitar horário de início e fim'
        ],
        contact_info: {
          phone: '(88) 99999-3333',
          whatsapp: '(88) 99999-3333'
        }
      },
      {
        name: 'Quadra do Zé',
        location: 'Vila Nova',
        address: 'Rua das Palmeiras, 456 - Vila Nova',
        description: 'Quadra de grama sintética',
        field_type: 'GRASS',
        price_per_hour: 100,
        rating: 4.2,
        owner_id: '33333333-3333-3333-3333-333333333333',
        photos: [
          {
            id: '1',
            url: 'https://placehold.co/600x400?text=Quadra+do+Ze',
            alt: 'Quadra do Zé',
            isPrimary: true
          }
        ],
        amenities: [
          { id: '1', name: 'Vestiário', icon: 'changing-room' },
          { id: '2', name: 'Churrasqueira', icon: 'grill' }
        ],
        rules: [
          'Traga sua própria bola',
          'Limpar quadra após o uso',
          'Respeitar horário de início e fim'
        ],
        contact_info: {
          phone: '(88) 99999-4444',
          whatsapp: '(88) 99999-4444'
        }
      }
    ]

    for (const field of fields) {
      const { data, error } = await supabase.from('fields').insert(field).select()
      if (error) console.error('Erro ao criar campo:', error)
      else console.log(`Campo ${field.name} criado com sucesso!`)
    }

    // Criar times de exemplo
    const teams = [
      {
        name: 'Vila Nove F.C.',
        description: 'Time da Vila Nove',
        owner_id: '22222222-2222-2222-2222-222222222222'
      },
      {
        name: 'Amigos da Bola',
        description: 'Time de amigos que jogam aos finais de semana',
        owner_id: '22222222-2222-2222-2222-222222222222'
      }
    ]

    for (const team of teams) {
      const { data, error } = await supabase.from('teams').insert(team).select()
      if (error) console.error('Erro ao criar time:', error)
      else console.log(`Time ${team.name} criado com sucesso!`)
    }

    // Criar slots de tempo de exemplo
    const timeSlots = [
      {
        field_id: '11111111-1111-1111-1111-111111111111',
        day_of_week: 1, // Segunda
        start_time: '18:00:00',
        end_time: '19:00:00',
        price: 80,
        available: true
      },
      {
        field_id: '11111111-1111-1111-1111-111111111111',
        day_of_week: 1, // Segunda
        start_time: '19:00:00',
        end_time: '20:00:00',
        price: 80,
        available: true
      }
    ]

    for (const slot of timeSlots) {
      const { data, error } = await supabase.from('time_slots').insert(slot).select()
      if (error) console.error('Erro ao criar slot de tempo:', error)
      else console.log(`Slot de tempo criado com sucesso!`)
    }

    console.log('Banco de dados populado com sucesso!')
  } catch (error) {
    console.error('Erro ao popular banco de dados:', error)
  }
}

// Exportar função
module.exports = { seedDatabase }

// Executar se chamado diretamente
if (require.main === module) {
  seedDatabase()
}