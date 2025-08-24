import { BookingConfirmationScreen } from '@/components/screens/BookingConfirmationScreen'

interface BookingConfirmationPageProps {
  params: {
    id: string
  }
}

export default function BookingConfirmationPage({ params }: BookingConfirmationPageProps) {
  return <BookingConfirmationScreen bookingId={params.id} />
}