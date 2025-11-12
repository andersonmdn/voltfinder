import MarkerStatus from '@/enums/MarkerStatus'
import { MapPin, Plug, Star } from '@tamagui/lucide-icons'
import { useState } from 'react'
import { Card, Paragraph, Separator, Sheet, SizableText, XStack, YStack } from 'tamagui'
import Badge from './Badge'

type Station = {
  id: string
  name: string
  distance: string
  address: string
  plugs: string
  rating: number
  status: MarkerStatus
}

const stations: Station[] = [
  {
    id: '1',
    name: 'Shopping Eldorado',
    distance: '0.8 km',
    address: 'Av. Rebouças, 3970 - Pinheiros',
    plugs: 'Tipo 2, CCS',
    rating: 4.5,
    status: MarkerStatus.FREE,
  },
  {
    id: '2',
    name: 'Estação Vila Madalena',
    distance: '1.2 km',
    address: 'R. Harmonia, 456 - Vila Madalena',
    plugs: 'Tipo 2',
    rating: 4.5,
    status: MarkerStatus.CLOSED,
  },
  {
    id: '3',
    name: 'Parque Ibirapuera',
    distance: '1.5 km',
    address: 'Av. Pedro Álvares Cabral - Vila Mariana',
    plugs: 'CHAdeMO, CCS',
    rating: 4.8,
    status: MarkerStatus.BUSY,
  },
  {
    id: '4',
    name: 'Shopping JK Iguatemi',
    distance: '2.0 km',
    address: 'Av. Pres. Juscelino Kubitschek, 2041 - Itaim Bibi',
    plugs: 'Tipo 2, CCS, CHAdeMO',
    rating: 4.7,
    status: MarkerStatus.MAINTENANCE,
  },
  // ...
]

export function NearbySheet() {
  const [open, setOpen] = useState(true)
  const [position, setPosition] = useState(2) // 0=max, 1=meio, 2=peek
  const snapPoints = [90, 55, 8] // em % da altura da tela
  const peekIndex = snapPoints.length - 1

  return (
    <Sheet
      portalProps={{ zIndex: 10 }}
      modal={false}
      open={open}
      onOpenChange={(next: boolean) => {
        // Nunca fechar completamente; só alternar entre peek e expandido
        if (!next) {
          setPosition(peekIndex)
          setOpen(true)
        }
      }}
      snapPoints={snapPoints}
      snapPointsMode="percent"
      position={position}
      onPositionChange={setPosition}
      dismissOnSnapToBottom={false}
      animation="quick"
      zIndex={10}
    >
      <Sheet.Handle />

      <Sheet.Frame bg="$background" p="$3" pt="$2" br="$8" elevation="$4" gap="$3">
        {/* Cabeçalho sempre visível (peek) */}
        <XStack ai="center" jc="space-between">
          <SizableText size="$5" fontWeight="700">
            Pontos próximos
          </SizableText>
          <SizableText size="$5" color="$gray11">
            {stations.length} encontrados
          </SizableText>
        </XStack>

        {/* No peek: “dock” de abas; quando expande: lista de cards */}
        {position === 2 ? (
          <XStack ai="center" jc="space-around" mt="$2" />
        ) : (
          <Sheet.ScrollView showsVerticalScrollIndicator>
            <YStack gap="$3" pb="$8">
              {stations.map((s) => (
                <StationCard key={s.id} s={s} />
              ))}
            </YStack>
          </Sheet.ScrollView>
        )}
      </Sheet.Frame>
    </Sheet>
  )
}

function Tab({ icon: Icon, label, active = false }: { icon: any; label: string; active?: boolean }) {
  return (
    <YStack ai="center" gap="$1" opacity={active ? 1 : 0.7}>
      <Icon size={24} />
      <Paragraph size="$2">{label}</Paragraph>
    </YStack>
  )
}

function StationCard({ s }: { s: Station }) {
  return (
    <Card bordered br="$6" p="$3" bw={2}>
      <YStack gap="$2">
        <XStack ai="center" jc="space-between">
          <SizableText size="$5" fontWeight="700">
            {s.name}
          </SizableText>
          <Badge status={s.status} />
        </XStack>

        <XStack ai="center" gap="$2">
          <MapPin size={16} color="$green11" />
          <Paragraph size="$2">{s.distance}</Paragraph>
        </XStack>

        <Paragraph size="$2" color="$gray11">
          {s.address}
        </Paragraph>
        <XStack ai="center" gap="$1" justifyContent="space-between">
          <Paragraph size="$2">
            <Plug size={16} color="$green11" /> {s.plugs}
          </Paragraph>
          <XStack ai="center" gap="$1">
            <Star size={16} color="$yellow10" />
            <Paragraph size="$2">{s.rating}</Paragraph>
          </XStack>
        </XStack>

        <Separator />
      </YStack>
    </Card>
  )
}
