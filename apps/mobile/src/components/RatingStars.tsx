import { Star } from '@tamagui/lucide-icons'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Text, XStack } from 'tamagui'

interface RatingStarProps {
  value?: number
  defaultValue?: number
  max?: number
  onChange?: (value: number) => void
  readonly?: boolean
  colorActive?: string
  colorInactive?: string
  showNumbers?: boolean
}

interface StarBtnProps {
  n: number
  active: boolean
  onPress: (n: number) => void
  colorActive: string
  colorInactive: string
  readonly?: boolean
  showNumbers?: boolean
}

const StarButton = ({ n, active, onPress, colorActive, colorInactive, readonly, showNumbers }: StarBtnProps) => {
  const color = active ? colorActive : colorInactive

  return (
    <Button
      size="$2"
      borderWidth={1}
      borderColor="$gray8"
      chromeless
      disabled={readonly}
      pressStyle={{ scale: 0.95 }}
      onPress={() => onPress(n)}
      icon={<Star size="$1.5" stroke={color} color={color} fill={color} />}
    >
      {showNumbers && <Text>{n}</Text>}
    </Button>
  )
}

const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max)

const RatingStars = ({
  value,
  defaultValue,
  max = 5,
  onChange,
  readonly = false,
  colorActive = '$yellow10',
  colorInactive = '$gray8',
  showNumbers = false,
}: RatingStarProps) => {
  const isControlled = value !== undefined
  const [internalValue, setInternalValue] = useState<number>(defaultValue ? clamp(defaultValue, 0, max) : 0)

  useEffect(() => {
    if (isControlled && value !== undefined) {
      setInternalValue(clamp(value, 0, max))
    }
  }, [isControlled, value, max])

  const setVal = useCallback(
    (n: number) => {
      if (readonly) return
      const next = clamp(n, 0, max)
      if (!isControlled) setInternalValue(next)
      onChange?.(next)
    },
    [isControlled, max, onChange, readonly]
  )

  const stars = useMemo(() => Array.from({ length: max }, (_, i) => i + 1), [max])

  return (
    <XStack ai="center" gap="$5">
      {stars.map((n) => (
        <StarButton
          key={n}
          n={n}
          active={internalValue >= n}
          onPress={setVal}
          colorActive={colorActive}
          colorInactive={colorInactive}
          readonly={readonly}
          showNumbers={showNumbers}
        />
      ))}
    </XStack>
  )
}

export default RatingStars
