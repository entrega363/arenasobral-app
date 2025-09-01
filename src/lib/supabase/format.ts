// Utilitários para formatar dados do Supabase

export const formatSupabaseDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

export const formatSupabaseTime = (timeString: string): string => {
  return timeString.substring(0, 5)
}

export const formatSupabaseDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount)
}

export const formatPhoneNumber = (phone: string): string => {
  // Remover todos os caracteres não numéricos
  const cleaned = phone.replace(/\D/g, '')
  
  // Formatar como (XX) XXXXX-XXXX
  if (cleaned.length === 11) {
    return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 7)}-${cleaned.substring(7)}`
  }
  
  // Formatar como (XX) XXXX-XXXX
  if (cleaned.length === 10) {
    return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 6)}-${cleaned.substring(6)}`
  }
  
  return phone
}

export const formatRating = (rating: number): string => {
  return rating.toFixed(1).replace('.', ',')
}

export const formatUserName = (firstName: string, lastName?: string): string => {
  if (lastName) {
    return `${firstName} ${lastName.charAt(0)}.`
  }
  return firstName
}