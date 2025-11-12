import { FilterSheet } from '@/components/FilterSheet'
import { NearbySheet } from '@/components/NearbySheet'
import { StationInfoSheet } from '@/components/StationInfoSheet'
import EventType from '@/enums/EventType'
import MarkerStatus from '@/enums/MarkerStatus'
import StationInfo from '@/interfaces/StationInfo'
import { Search, SlidersHorizontal } from '@tamagui/lucide-icons'
import { useCallback, useEffect, useRef, useState } from 'react'
import { View } from 'react-native'
import { Button, Input, Text, XStack, YStack } from 'tamagui'
import { useReactNativeMapAdapter } from '../../hooks/useReactNativeMapAdapter'

export default function MapScreen() {
  const mapAdapter = useReactNativeMapAdapter()
  const initialized = useRef(false)
  const [selectedStation, setSelectedStation] = useState<StationInfo | null>(null)
  const [openStationInfo, setOpenStationInfo] = useState(false)
  const [openFilter, setOpenFilter] = useState(false)

  // DEMO MARKERS - Buscar da API futuramente
  const demoMarkers = useRef([
    { id: 1, lat: -23.561199, lng: -46.658723, status: MarkerStatus.CLOSED },
    { id: 2, lat: -23.56126, lng: -46.66052, status: MarkerStatus.FREE },
    { id: 3, lat: -23.559424, lng: -46.658657, status: MarkerStatus.BUSY },
    { id: 4, lat: -23.56322, lng: -46.661995, status: MarkerStatus.MAINTENANCE },
  ])

  // Memoize event handlers to prevent unnecessary re-registrations
  const handlePinMarker = useCallback((marker: StationInfo) => {
    console.log('[Home] Pin marker selected:', marker)
    setSelectedStation(marker)
    setOpenStationInfo(true)
  }, [])

  const handleRegionChanged = useCallback((event: any) => {
    console.log('[Home] Region changed:', event)
  }, [])

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    // Add demo markers only once
    demoMarkers.current.forEach((marker) => {
      mapAdapter.addMarker(marker.id, { lat: marker.lat, lng: marker.lng }, marker.status as MarkerStatus)
    })

    // Register event listeners
    mapAdapter.on(EventType.PIN_MARKER, handlePinMarker)
    //mapAdapter.on(EventType.REGION_CHANGED, handleRegionChanged)

    return () => {
      // Cleanup listeners properly
      //mapAdapter.off(EventType.PIN_MARKER, handlePinMarker)
      //mapAdapter.off(EventType.REGION_CHANGED, handleRegionChanged)
    }
  }, [mapAdapter, handlePinMarker, handleRegionChanged])

  const handleCenterToSF = useCallback(() => {
    mapAdapter.setCamera({ lat: -23.5605805, lng: -46.661941 }, 13)
  }, [mapAdapter])

  const handleFitBounds = useCallback(() => {
    // Ir para todos os marcadores de demonstração
    mapAdapter.fitBounds({ lat: -23.561199, lng: -46.658723 }, { lat: -23.56322, lng: -46.661995 }, 100)
  }, [mapAdapter])

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <YStack flex={1} mt="$4">
        <XStack
          padding="$3"
          backgroundColor="$background"
          alignItems="center"
          borderBottomWidth={1}
          borderBottomColor="$borderColor"
          justifyContent="space-between"
        >
          <XStack alignItems="center" justifyContent="flex-start" width="65%">
            <Search color="$color"></Search>
            <Input placeholder="Pesquisar" borderWidth={0} minWidth={200} />
          </XStack>

          <Button transparent onPress={() => setOpenFilter(true)}>
            <SlidersHorizontal color="$color" />
            <Text>Filtrar</Text>
          </Button>
        </XStack>

        {/* Map container */}
        <View style={{ flex: 1 }}>
          <mapAdapter.MapComponent />
        </View>

        <StationInfoSheet open={openStationInfo} setOpen={setOpenStationInfo} station={selectedStation || ({} as StationInfo)} />
        <FilterSheet open={openFilter} setOpen={setOpenFilter} />
        <NearbySheet />

        {/* Controls */}
        <XStack padding="$4" justifyContent="center" mb={50}>
          <Button onPress={handleCenterToSF} size="$3">
            Centralizar em SP
          </Button>
          <Button onPress={handleFitBounds} size="$3">
            Ir para marcadores
          </Button>
        </XStack>
      </YStack>
    </View>
  )
}
