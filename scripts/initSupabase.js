#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')

// Substitua essas variáveis com suas credenciais do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://seu-projeto.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sua-chave-anonima'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function initDatabase() {
  console.log('Inicializando banco de dados do Supabase...')

  try {
    // Criar tabela de usuários
    const { error: usersError } = await supabase.rpc('create_users_table')
    if (usersError) console.error('Erro ao criar tabela de usuários:', usersError)
    else console.log('Tabela de usuários criada com sucesso!')

    // Criar tabela de campos
    const { error: fieldsError } = await supabase.rpc('create_fields_table')
    if (fieldsError) console.error('Erro ao criar tabela de campos:', fieldsError)
    else console.log('Tabela de campos criada com sucesso!')

    // Criar tabela de reservas
    const { error: bookingsError } = await supabase.rpc('create_bookings_table')
    if (bookingsError) console.error('Erro ao criar tabela de reservas:', bookingsError)
    else console.log('Tabela de reservas criada com sucesso!')

    // Criar tabela de times
    const { error: teamsError } = await supabase.rpc('create_teams_table')
    if (teamsError) console.error('Erro ao criar tabela de times:', teamsError)
    else console.log('Tabela de times criada com sucesso!')

    // Criar tabela de jogadores
    const { error: playersError } = await supabase.rpc('create_players_table')
    if (playersError) console.error('Erro ao criar tabela de jogadores:', playersError)
    else console.log('Tabela de jogadores criada com sucesso!')

    // Criar tabela de avaliações
    const { error: reviewsError } = await supabase.rpc('create_reviews_table')
    if (reviewsError) console.error('Erro ao criar tabela de avaliações:', reviewsError)
    else console.log('Tabela de avaliações criada com sucesso!')

    // Criar tabela de jogos
    const { error: gamesError } = await supabase.rpc('create_games_table')
    if (gamesError) console.error('Erro ao criar tabela de jogos:', gamesError)
    else console.log('Tabela de jogos criada com sucesso!')

    console.log('Banco de dados inicializado com sucesso!')
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error)
  }
}

// Funções para criar tabelas individualmente
async function createUsersTable() {
  const { error } = await supabase.rpc('create_users_table')
  if (error) throw error
}

async function createFieldsTable() {
  const { error } = await supabase.rpc('create_fields_table')
  if (error) throw error
}

async function createBookingsTable() {
  const { error } = await supabase.rpc('create_bookings_table')
  if (error) throw error
}

async function createTeamsTable() {
  const { error } = await supabase.rpc('create_teams_table')
  if (error) throw error
}

async function createPlayersTable() {
  const { error } = await supabase.rpc('create_players_table')
  if (error) throw error
}

async function createReviewsTable() {
  const { error } = await supabase.rpc('create_reviews_table')
  if (error) throw error
}

async function createGamesTable() {
  const { error } = await supabase.rpc('create_games_table')
  if (error) throw error
}

// Exportar funções
module.exports = {
  initDatabase,
  createUsersTable,
  createFieldsTable,
  createBookingsTable,
  createTeamsTable,
  createPlayersTable,
  createReviewsTable,
  createGamesTable
}

// Executar se chamado diretamente
if (require.main === module) {
  initDatabase()
}