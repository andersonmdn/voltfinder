import MarkerStatus from '@/enums/MarkerStatus'
import React from 'react'
import { MapMarkerProps, Marker } from 'react-native-maps'
import { Image } from 'tamagui'

type Props = Omit<MapMarkerProps, 'coordinate'> & {
  coordinate: { latitude: number; longitude: number }
  status?: MarkerStatus
  size?: number
}

// Memoize the image sources to prevent re-creation
const markerImages = {
  [MarkerStatus.FREE]: require('../../assets/markers/Free.png'),
  [MarkerStatus.CLOSED]: require('../../assets/markers/Closed.png'),
  [MarkerStatus.MAINTENANCE]: require('../../assets/markers/Maintenance.png'),
  [MarkerStatus.BUSY]: require('../../assets/markers/Busy.png'),
} as const

export const PinMarker = React.memo(({ coordinate, size = 40, status = MarkerStatus.BUSY, ...rest }: Props) => {
  const imageSource = markerImages[status]
  const [tracks, setTracks] = React.useState(true)

  return (
    <Marker coordinate={coordinate} anchor={{ x: 0.5, y: 1 }} {...rest} tracksViewChanges={tracks}>
      <Image source={imageSource} width={size} height={size} objectFit="contain" onLoadEnd={() => setTimeout(() => setTracks(false), 5000)} />
    </Marker>
  )
})
