// Utilitários para validação de dados do Supabase

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password: string): boolean => {
  // Pelo menos 6 caracteres
  return password.length >= 6
}

export const validatePhoneNumber = (phone: string): boolean => {
  // Remover todos os caracteres não numéricos
  const cleaned = phone.replace(/\D/g, '')
  
  // Validar se tem 10 ou 11 dígitos
  return cleaned.length === 10 || cleaned.length === 11
}

export const validateCPF = (cpf: string): boolean => {
  // Remover todos os caracteres não numéricos
  const cleaned = cpf.replace(/\D/g, '')
  
  // Validar se tem 11 dígitos
  if (cleaned.length !== 11) return false
  
  // Validar CPF
  let sum = 0
  let remainder
  
  // Verificar se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleaned)) return false
  
  // Validar primeiro dígito verificador
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleaned.substring(i - 1, i)) * (11 - i)
  }
  
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cleaned.substring(9, 10))) return false
  
  // Validar segundo dígito verificador
  sum = 0
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleaned.substring(i - 1, i)) * (12 - i)
  }
  
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cleaned.substring(10, 11))) return false
  
  return true
}

export const validateFieldData = (fieldData: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  if (!fieldData.name || fieldData.name.trim().length === 0) {
    errors.push('Nome da areninha é obrigatório')
  }
  
  if (!fieldData.location || fieldData.location.trim().length === 0) {
    errors.push('Localização é obrigatória')
  }
  
  if (fieldData.price_per_hour && fieldData.price_per_hour < 0) {
    errors.push('Preço por hora deve ser maior ou igual a zero')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export const validateBookingData = (bookingData: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  if (!bookingData.field_id) {
    errors.push('Campo é obrigatório')
  }
  
  if (!bookingData.user_id) {
    errors.push('Usuário é obrigatório')
  }
  
  if (!bookingData.time_slot_id) {
    errors.push('Horário é obrigatório')
  }
  
  if (!bookingData.date) {
    errors.push('Data é obrigatória')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}