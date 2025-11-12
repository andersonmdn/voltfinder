import { PinMarker } from '@/components/PinMarker'
import EventType from '@/enums/EventType'
import MarkerStatus from '@/enums/MarkerStatus'
import LatLng from '@/interfaces/LatLng'
import MapState from '@/interfaces/MapState'
import { useCallback, useMemo, useRef, useState } from 'react'
import { Platform } from 'react-native'
import MapView, { MapPressEvent, PROVIDER_GOOGLE, Region } from 'react-native-maps'

const debounce = <T extends (...args: any[]) => any>(func: T, delay: number): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(null, args), delay)
  }
}

export const useReactNativeMapAdapter = () => {
  const mapRef = useRef<MapView>(null)
  const [mapState, setMapState] = useState<MapState>({
    markers: [],
    polylines: [],
    polygons: [],
    region: {
      latitude: -23.5605805,
      longitude: -46.661941,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
  })

  const eventHandlers = useRef<Map<string, Function[]>>(new Map())

  const debouncedRegionChanged = useRef(
    debounce((payload: any) => {
      console.log('[MapAdapter] Region changed:', payload)
      const handlers = eventHandlers.current.get('regionChanged')
      if (handlers) {
        handlers.forEach((handler) => handler(payload))
      }
    }, 200)
  ).current

  const emit = useCallback((event: string, payload: any) => {
    console.log('[MapAdapter] Emitting event:', event, payload)
    const handlers = eventHandlers.current.get(event)
    if (handlers) {
      handlers.forEach((handler) => handler(payload))
    }
  }, [])

  const setCamera = useCallback((pos: LatLng, zoom: number) => {
    console.log('[MapAdapter] Setting camera:', { pos, zoom })
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: pos.lat,
          longitude: pos.lng,
          latitudeDelta: zoomToLatitudeDelta(zoom),
          longitudeDelta: zoomToLongitudeDelta(zoom, pos.lat),
        },
        1000
      )
    }
  }, [])

  const fitBounds = useCallback((nw: LatLng, se: LatLng, padding = 50) => {
    console.log('[MapAdapter] Fitting bounds:', { nw, se, padding })
    if (mapRef.current) {
      mapRef.current.fitToCoordinates(
        [
          { latitude: nw.lat, longitude: nw.lng },
          { latitude: se.lat, longitude: se.lng },
        ],
        {
          edgePadding: {
            top: padding,
            right: padding,
            bottom: padding,
            left: padding,
          },
          animated: true,
        }
      )
    }
  }, [])

  const addMarker = useCallback((id: number, pos: LatLng, status: MarkerStatus) => {
    console.log('[MapAdapter] Adding marker:', { id, pos, status })
    setMapState((prev) => ({
      ...prev,
      markers: [...prev.markers.filter((m) => m.id !== id), { id, coordinate: pos, status }],
    }))
  }, [])

  const removeMarker = useCallback((id: number) => {
    console.log('[MapAdapter] Removing marker:', id)
    setMapState((prev) => ({
      ...prev,
      markers: prev.markers.filter((m) => m.id !== id),
    }))
  }, [])

  // const addPolyline = useCallback((id: string, pts: LatLng[], opts?: PolylineOptions) => {
  //   console.log('[MapAdapter] Adding polyline:', { id, pointsCount: pts.length, opts })
  //   setMapState((prev) => ({
  //     ...prev,
  //     polylines: [...prev.polylines.filter((p) => p.id !== id), { id, coordinates: pts, options: opts }],
  //   }))
  // }, [])

  // const addPolygon = useCallback((id: string, pts: LatLng[], opts?: PolygonOptions) => {
  //   console.log('[MapAdapter] Adding polygon:', { id, pointsCount: pts.length, opts })
  //   setMapState((prev) => ({
  //     ...prev,
  //     polygons: [...prev.polygons.filter((p) => p.id !== id), { id, coordinates: pts, options: opts }],
  //   }))
  // }, [])

  const on = useCallback((event: EventType, cb: (payload: any) => void) => {
    console.log('[MapAdapter] Registering event listener:', event)
    if (!eventHandlers.current.has(event)) {
      eventHandlers.current.set(event, [])
    }
    eventHandlers.current.get(event)?.push(cb)
  }, [])

  const off = useCallback((event: EventType, cb: (payload: any) => void) => {
    console.log('[MapAdapter] Removing event listener:', event)
    const handlers = eventHandlers.current.get(event)
    if (handlers) {
      const index = handlers.indexOf(cb)
      if (index > -1) {
        handlers.splice(index, 1)
      }
    }
  }, [])

  // Helper functions - using useCallback to prevent re-creation
  const zoomToLatitudeDelta = useCallback((zoom: number): number => {
    return 180 / Math.pow(2, zoom)
  }, [])

  const zoomToLongitudeDelta = useCallback(
    (zoom: number, latitude: number): number => {
      const latitudeDelta = zoomToLatitudeDelta(zoom)
      return latitudeDelta * Math.cos((latitude * Math.PI) / 180)
    },
    [zoomToLatitudeDelta]
  )

  const latitudeDeltaToZoom = useCallback((latitudeDelta: number): number => {
    return Math.log2(180 / latitudeDelta)
  }, [])

  const handleMapPress = useCallback(
    (event: MapPressEvent) => {
      const { coordinate } = event.nativeEvent
      console.log('[MapAdapter] Map pressed:', coordinate)
      emit('press', { position: { lat: coordinate.latitude, lng: coordinate.longitude } })
    },
    [emit]
  )

  const handleRegionChangeComplete = useCallback(
    (region: Region) => {
      console.log('[MapAdapter] Region change complete:', region)
      debouncedRegionChanged({
        center: { lat: region.latitude, lng: region.longitude },
        zoom: latitudeDeltaToZoom(region.latitudeDelta),
        bounds: {
          nw: {
            lat: region.latitude + region.latitudeDelta / 2,
            lng: region.longitude - region.longitudeDelta / 2,
          },
          se: {
            lat: region.latitude - region.latitudeDelta / 2,
            lng: region.longitude + region.longitudeDelta / 2,
          },
        },
      })
    },
    [debouncedRegionChanged, latitudeDeltaToZoom]
  )

  // Memoize markers to prevent unnecessary re-renders
  const memoizedMarkers = useMemo(
    () =>
      mapState.markers.map((marker) => (
        <PinMarker
          key={marker.id}
          coordinate={{
            latitude: marker.coordinate.lat,
            longitude: marker.coordinate.lng,
          }}
          status={marker.status || MarkerStatus.FREE}
          onPress={() => emit(EventType.PIN_MARKER, marker)}
        />
      )),
    [mapState.markers, emit]
  )

  // // Memoize polylines
  // const memoizedPolylines = useMemo(
  //   () =>
  //     mapState.polylines.map((polyline) => (
  //       <Polyline
  //         key={polyline.id}
  //         coordinates={polyline.coordinates.map((coord) => ({
  //           latitude: coord.lat,
  //           longitude: coord.lng,
  //         }))}
  //         strokeColor={polyline.options?.color || '#3b82f6'}
  //         strokeWidth={polyline.options?.width || 3}
  //       />
  //     )),
  //   [mapState.polylines]
  // )

  // // Memoize polygons
  // const memoizedPolygons = useMemo(
  //   () =>
  //     mapState.polygons.map((polygon) => (
  //       <Polygon
  //         key={polygon.id}
  //         coordinates={polygon.coordinates.map((coord) => ({
  //           latitude: coord.lat,
  //           longitude: coord.lng,
  //         }))}
  //         fillColor={polygon.options?.fillColor || '#3b82f6'}
  //         strokeColor={polygon.options?.strokeColor || '#3b82f6'}
  //         strokeWidth={polygon.options?.strokeWidth || 2}
  //       />
  //     )),
  //   [mapState.polygons]
  // )

  // Create a memoized MapComponent to prevent unnecessary re-renders
  const MapComponent = useMemo(
    () => () =>
      (
        <MapView
          ref={mapRef}
          style={{ flex: 1 }}
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          initialRegion={mapState.region}
          onPress={handleMapPress}
          onRegionChangeComplete={handleRegionChangeComplete}
          showsUserLocation
          showsMyLocationButton
        >
          {memoizedMarkers}
          {/* {memoizedPolylines} */}
          {/* {memoizedPolygons} */}
        </MapView>
      ),
    [mapState.region, handleMapPress, handleRegionChangeComplete, memoizedMarkers /*, memoizedPolylines, memoizedPolygons*/]
  )

  return {
    MapComponent,
    setCamera,
    fitBounds,
    addMarker,
    removeMarker,
    //addPolyline,
    //addPolygon,
    on,
    off,
  }
}
