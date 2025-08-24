import FieldReserveScreen from '@/components/screens/FieldReserveScreen';

interface Props {
  params: {
    id: string;
  };
}

export default function FieldReservePage({ params }: Props) {
  return <FieldReserveScreen fieldId={params.id} />;
}