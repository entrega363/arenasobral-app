import { Suspense } from 'react'
import { BookingConfirmationScreen } from '@/components/screens/BookingConfirmationScreen'

export default function BookingConfirmationPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <BookingConfirmationScreen />
    </Suspense>
  )
}