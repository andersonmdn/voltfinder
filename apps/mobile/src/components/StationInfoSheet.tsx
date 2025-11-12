import MarkerStatus from '@/enums/MarkerStatus'
import StationInfo from '@/interfaces/StationInfo'
import StationInfoDetails from '@/interfaces/StationInfoDetails'
import { Clock, MapPin, Navigation, X } from '@tamagui/lucide-icons'
import { useEffect, useState } from 'react'
import { Button, Paragraph, Separator, Sheet, SheetProps, SizableText, Theme, XStack, YStack } from 'tamagui'
import Badge from './Badge'

type Props = {
  open: boolean
  setOpen: (v: boolean) => void
  station: StationInfo
  onNavigate?: () => void
  onSchedule?: () => void
} & Partial<Pick<SheetProps, 'snapPoints' | 'dismissOnSnapToBottom' | 'modal'>>

enum PlugType {
  TYPE1 = 'Tipo 1 (SAE J1772)',
  TYPE2 = 'Tipo 2 (Mennekes)',
  CCS = 'CCS (Combo)',
  CHADEMO = 'CHAdeMO',
  TESLA = 'Tesla Supercharger',
}

interface Plug {
  id: number
  type: PlugType
  powerKw: number
  isAvailable: boolean
}

export function StationInfoSheet({
  open,
  setOpen,
  station,
  onNavigate,
  onSchedule,
  snapPoints = [60],
  dismissOnSnapToBottom = true,
  modal = true,
}: Props) {
  const [details, setDetails] = useState<StationInfoDetails>()
  const [plugs, setPlugs] = useState<Plug[]>([])

  useEffect(() => {
    console.log('[StationInfoSheet] Loading details for station:', station)
    // Buscar informações adicionais da estação na API
    // MOCKED POR ENQUANTO
    setDetails({
      id: station.id,
      name: 'Estação Vila Madalena',
      status: station.status,
      coordinate: { lat: -23.561199, lng: -46.658723 },
      address: 'R. Harmonia, 456 - Vila Madalena',
      neighborhood: 'Vila Madalena',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '05435-000',
      distanceKm: 1.2,
      openingHours: 'Seg - Sab das 8:00 as 12:00 e 14:00 as 22:00',
    })

    setPlugs([
      { id: 1, type: PlugType.CCS, powerKw: 50, isAvailable: true },
      { id: 2, type: PlugType.TYPE2, powerKw: 22, isAvailable: false },
      { id: 3, type: PlugType.CHADEMO, powerKw: 150, isAvailable: true },
      { id: 4, type: PlugType.TESLA, powerKw: 150, isAvailable: true },
      { id: 5, type: PlugType.TYPE1, powerKw: 150, isAvailable: true },
    ])

    console.log('[StationInfoSheet] Station details set:', details)
  }, [station])

  return (
    <Sheet
      forceRemoveScrollEnabled={open}
      modal={modal}
      snapPoints={snapPoints}
      dismissOnSnapToBottom={dismissOnSnapToBottom}
      open={open}
      onOpenChange={setOpen}
      animation="medium"
    >
      <Sheet.Overlay />
      <Sheet.Handle />
      <Sheet.Frame bg="$background" p="$4" gap="$3">
        <XStack ai="center" jc="space-between" gap="$1">
          <SizableText size="$6" fow="700">
            {details?.name}
          </SizableText>
          <XStack ai="center" gap="$2">
            <Badge status={details?.status || MarkerStatus.MAINTENANCE} />
          </XStack>
          <Button chromeless circular icon={X} scaleIcon={2} onPress={() => setOpen(false)} backgroundColor="$gray6" size="$2" />
        </XStack>

        <XStack ai="center" gap="$2">
          <Paragraph size="$4">{details?.address}</Paragraph>
        </XStack>

        <XStack ai="center" gap="$2">
          <MapPin size="$1.5" color="$green11" />
          <Paragraph size="$4">{details?.distanceKm} Km</Paragraph>
        </XStack>

        <XStack ai="center" gap="$2">
          <Clock size="$1" color="$green11" />
          <Paragraph size="$2">{details?.openingHours}</Paragraph>
        </XStack>

        <Separator borderWidth={1} />

        <YStack gap="$2">
          <SizableText size="$4" fow="700">
            Pontos de Conexão
          </SizableText>
          {plugs.map((plug) => (
            <XStack key={plug.id} jc="space-between" ai="center">
              <Paragraph size="$3">
                {plug.type} - {plug.powerKw} kW
              </Paragraph>
              <YStack px="$2" py="$1" br="$10" bg={plug.isAvailable ? '$green5' : '$red5'}>
                <SizableText size="$2" fow="700" color={plug.isAvailable ? '$green11' : '$red11'}>
                  {plug.isAvailable ? 'Disponível' : 'Indisponível'}
                </SizableText>
              </YStack>
            </XStack>
          ))}
        </YStack>

        <XStack mt="auto" gap="$3" jc="space-between">
          <Button variant="outlined" onPress={onSchedule} flex={1} icon={Clock}>
            Agendar
          </Button>
          <Theme name="green">
            <Button onPress={onNavigate} icon={Navigation} flex={1}>
              Ir agora
            </Button>
          </Theme>
        </XStack>
      </Sheet.Frame>
    </Sheet>
  )
}
