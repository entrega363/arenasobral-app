'use client'

import { useParams } from 'next/navigation'
import { SupabaseFieldDetails } from '@/components/fields/SupabaseFieldDetails'
import { AuthProvider } from '@/contexts/AuthContext'

export default function FieldDetailsPage() {
  const params = useParams()
  const fieldId = params.id as string

  return (
    <AuthProvider>
      <SupabaseFieldDetails fieldId={fieldId} />
    </AuthProvider>
  )
}