import { SupabaseFieldOwnerDashboard } from '@/components/screens/SupabaseFieldOwnerDashboard'
import { AuthProvider } from '@/contexts/AuthContext'

export default function FieldOwnerDashboardPage() {
  return (
    <AuthProvider>
      <SupabaseFieldOwnerDashboard />
    </AuthProvider>
  )
}