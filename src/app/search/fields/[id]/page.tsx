import { FieldDetailsScreen } from '@/components/screens/FieldDetailsScreen'

interface FieldDetailsPageProps {
  params: {
    id: string
  }
}

export default function FieldDetailsPage({ params }: FieldDetailsPageProps) {
  return <FieldDetailsScreen fieldId={params.id} />
}