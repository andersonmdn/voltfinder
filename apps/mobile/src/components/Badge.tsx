import MarkerStatus from '@/enums/MarkerStatus'
import StationInfo from '@/interfaces/StationInfo'
import { useEffect, useState } from 'react'
import { SizableText, YStack } from 'tamagui'

interface BadgeProps {
  status: StationInfo['status']
}

const statusBadge = (s: StationInfo['status']) => {
  switch (s) {
    case MarkerStatus.CLOSED:
      return { label: 'Fechado', bg: '$gray5', color: '$gray11' }
    case MarkerStatus.BUSY:
      return { label: 'Ocupada', bg: '$yellow5', color: '$yellow11' }
    case MarkerStatus.FREE:
      return { label: 'Disponível', bg: '$green5', color: '$green11' }
    default:
      return { label: 'Manutenção', bg: '$red5', color: '$red11' }
  }
}

const Badge = ({ status }: BadgeProps) => {
  const [badge, setBadge] = useState(statusBadge(status))

  useEffect(() => {
    setBadge(statusBadge(status))
  }, [status])

  return (
    <YStack px="$2" py="$1" br="$10" bg={badge.bg}>
      <SizableText size="$2" fow="700" color={badge.color}>
        {badge.label}
      </SizableText>
    </YStack>
  )
}

export default Badge
