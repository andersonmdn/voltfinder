import { Accessibility, Check, Plug, Power, Ruler, Star, X, Zap } from '@tamagui/lucide-icons'
import { useMemo, useState } from 'react'
import { Button, Checkbox, Label, Paragraph, ScrollView, Separator, Sheet, SheetProps, SizableText, Slider, XStack, YStack, styled } from 'tamagui'
import RatingStars from './RatingStars'
import SectionTitle from './SectionTitle'

/* ---------- Tipos ---------- */
export type ConnectorType = 'TYPE1' | 'TYPE2' | 'CCS' | 'CHADEMO' | 'TESLA'
export type SpeedCategory = 'SLOW' | 'SEMI' | 'FAST' | 'ULTRA'
export type PaymentMethod = 'FREE' | 'PIX' | 'CREDIT' | 'DEBIT' | 'APPLE' | 'GOOGLE'
export type Amenity = 'WIFI' | 'BATHROOM' | 'FOOD' | 'CONVENIENCE' | 'HOTEL'
export type Operator = 'ENELX' | 'EDP' | 'VOLVO' | 'SHELL'

const connectors: [ConnectorType, string][] = [
  ['TYPE1', 'Tipo 1 (SAE J1772)'],
  ['TYPE2', 'Tipo 2 (Mennekes)'],
  ['CCS', 'CCS Combo'],
  ['CHADEMO', 'CHAdeMO'],
  ['TESLA', 'Tesla Supercharger'],
]

const speeds: [SpeedCategory, string][] = [
  ['SLOW', 'Lenta (até 7 kW)'],
  ['SEMI', 'Semi-rápida (7-22 kW)'],
  ['FAST', 'Rápida (22-50 kW)'],
  ['ULTRA', 'Ultrarrápida (acima de 50 kW)'],
]

export type Filters = {
  accessible?: boolean
  connectors: ConnectorType[]
  speeds: SpeedCategory[]
  payments: PaymentMethod[]
  availableOnly?: boolean
  distanceKm: number
  amenities: Amenity[]
  minRating?: 1 | 2 | 3 | 4 | 5
  operators: Operator[]
}

type Props = {
  open: boolean
  setOpen: (v: boolean) => void
  initial?: Partial<Filters>
  onApply?: (filters: Filters) => void
  onClear?: () => void
} & Partial<Pick<SheetProps, 'snapPoints' | 'dismissOnSnapToBottom' | 'modal'>>

/* ---------- UI helpers ---------- */
const Dot = styled(YStack, { w: 8, h: 8, br: 99, bg: '$color' })

function CheckRow({ id, label, checked, onCheckedChange }: { id: string; label: string; checked?: boolean; onCheckedChange: (v: boolean) => void }) {
  return (
    <XStack ai="center" gap="$2" my="$1.5">
      <Checkbox id={id} checked={!!checked} onCheckedChange={(v) => onCheckedChange(!!v)}>
        <Checkbox.Indicator>
          <Check />
        </Checkbox.Indicator>
      </Checkbox>
      <Label htmlFor={id}>{label}</Label>
    </XStack>
  )
}

/* ---------- Componente ---------- */
export function FilterSheet({ open, setOpen, initial, onApply, onClear, snapPoints = [85], dismissOnSnapToBottom = true, modal = true }: Props) {
  const defaults: Filters = useMemo(
    () => ({
      accessible: false,
      connectors: [],
      speeds: [],
      payments: [],
      availableOnly: false,
      distanceKm: 5,
      amenities: [],
      minRating: undefined,
      operators: [],
      ...initial,
    }),
    [initial]
  )

  const [state, setState] = useState<Filters>(defaults)

  const toggleInArray = <T,>(arr: T[], item: T) => (arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item])

  return (
    <Sheet open={open} onOpenChange={setOpen} modal={modal} snapPoints={snapPoints} dismissOnSnapToBottom={dismissOnSnapToBottom} animation="medium">
      <Sheet.Overlay />
      <Sheet.Handle />
      <Sheet.Frame bg="$background" p="$3" pt="$2" gap="$3">
        {/* Cabeçalho */}
        <XStack ai="center" jc="space-between" mb="$1">
          <SizableText size="$6" fow="700">
            Filtros
          </SizableText>
          <Button chromeless circular icon={X} onPress={() => setOpen(false)} />
        </XStack>

        <Separator />

        {/* Conteúdo rolável */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <YStack pb="$8">
            {/* Acessibilidade */}
            <SectionTitle icon={Accessibility} iconColor="$green10">
              Acessibilidade
            </SectionTitle>
            <CheckRow
              id="accessible"
              label="Vaga acessível (PNE)"
              checked={state.accessible}
              onCheckedChange={(v) => setState((s) => ({ ...s, accessible: v }))}
            />

            <Separator mt="$3" />

            {/* Conectores */}
            <SectionTitle icon={Plug} iconColor="$green10">
              Tipo de conector
            </SectionTitle>
            {connectors.map(([key, label]) => (
              <CheckRow
                key={key}
                id={`conn-${key}`}
                label={label}
                checked={state.connectors.includes(key)}
                onCheckedChange={() => setState((s) => ({ ...s, connectors: toggleInArray(s.connectors, key) }))}
              />
            ))}

            <Separator mt="$3" />

            {/* Velocidade */}
            <SectionTitle icon={Zap} iconColor="$green10">
              Velocidade da carga
            </SectionTitle>
            {speeds.map(([key, label]) => (
              <CheckRow
                key={key}
                id={`speed-${key}`}
                label={label}
                checked={state.speeds.includes(key)}
                onCheckedChange={() => setState((s) => ({ ...s, speeds: toggleInArray(s.speeds, key) }))}
              />
            ))}

            <Separator mt="$3" />

            {/* Disponibilidade */}
            <SectionTitle icon={Power} iconColor="$green10">
              Disponibilidade
            </SectionTitle>
            <CheckRow
              id="available"
              label="Livre"
              checked={state.availableOnly}
              onCheckedChange={(v) => setState((s) => ({ ...s, availableOnly: v }))}
            />

            <Separator mt="$3" />

            {/* Distância */}
            <SectionTitle icon={Ruler} iconColor="$green10">
              Distância
            </SectionTitle>
            <XStack ai="center" jc="space-between" mb="$1">
              <Paragraph size="$3" opacity={0.7}>
                Até
              </Paragraph>
              <Paragraph size="$3" fow="700">
                {state.distanceKm} Km
              </Paragraph>
            </XStack>
            <Slider defaultValue={[state.distanceKm]} min={1} max={20} step={1} onValueChange={(v) => setState((s) => ({ ...s, distanceKm: v[0] }))}>
              <Slider.Track>
                <Slider.TrackActive />
              </Slider.Track>
              <Slider.Thumb circular size="$2" index={0} />
            </Slider>
            <XStack jc="space-between">
              <Paragraph size="$2" opacity={0.6}>
                1 km
              </Paragraph>
              <Paragraph size="$2" opacity={0.6}>
                20 km
              </Paragraph>
            </XStack>

            <Separator mt="$3" />

            {/* Avaliação mínima */}
            <SectionTitle icon={Star} iconColor="$green10">
              Avaliação mínima
            </SectionTitle>
            <XStack gap="$2" fw="wrap">
              <RatingStars
                value={state.minRating}
                onChange={(v) => setState((s) => ({ ...s, minRating: v === 0 ? undefined : (v as 1 | 2 | 3 | 4 | 5) }))}
                showNumbers={true}
              />
            </XStack>
          </YStack>
        </ScrollView>
      </Sheet.Frame>
    </Sheet>
  )
}
