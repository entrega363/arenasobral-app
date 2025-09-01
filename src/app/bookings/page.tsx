import { SupabaseBookingsScreen } from '@/components/screens/SupabaseBookingsScreen'
import { AuthProvider } from '@/contexts/AuthContext'

export default function BookingsPage() {
  return (
    <AuthProvider>
      <SupabaseBookingsScreen />
    </AuthProvider>
  )
}