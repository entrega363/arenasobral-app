import { SupabaseLoginScreen } from '@/components/screens/SupabaseLoginScreen'
import { AuthProvider } from '@/contexts/AuthContext'

export default function LoginPage() {
  return (
    <AuthProvider>
      <SupabaseLoginScreen />
    </AuthProvider>
  )
}