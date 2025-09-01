// Utilitários para lidar com erros do Supabase

export interface SupabaseError {
  message: string
  code: string
  details?: any
}

export const handleSupabaseError = (error: any): SupabaseError => {
  if (error.code) {
    // Erro do Supabase
    return {
      message: error.message,
      code: error.code,
      details: error.details
    }
  } else {
    // Erro genérico
    return {
      message: error.message || 'Ocorreu um erro desconhecido',
      code: 'UNKNOWN_ERROR',
      details: error
    }
  }
}

export const getErrorMessage = (error: SupabaseError): string => {
  switch (error.code) {
    case '23505':
      return 'Este registro já existe'
    case '23503':
      return 'Referência inválida'
    case '23502':
      return 'Campo obrigatório não preenchido'
    case '42501':
      return 'Permissão negada'
    case 'invalid_email':
      return 'Email inválido'
    case 'invalid_password':
      return 'Senha inválida'
    case 'user_not_found':
      return 'Usuário não encontrado'
    case 'email_already_exists':
      return 'Este email já está em uso'
    default:
      return error.message
  }
}

export const isSupabaseError = (error: any): error is SupabaseError => {
  return error && typeof error === 'object' && 'code' in error && 'message' in error
}