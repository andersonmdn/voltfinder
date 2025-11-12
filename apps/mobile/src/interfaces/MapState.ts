import MarkerStatus from '@/enums/MarkerStatus'
import { Region } from 'react-native-maps'
import LatLng from './LatLng'
import PolygonOptions from './PolygonOptions'
import PolylineOptions from './PolylineOptions'

interface MapState {
  markers: Array<{
    id: number
    coordinate: LatLng
    status?: MarkerStatus
  }>
  polylines: Array<{
    id: string
    coordinates: LatLng[]
    options?: PolylineOptions
  }>
  polygons: Array<{
    id: string
    coordinates: LatLng[]
    options?: PolygonOptions
  }>
  region: Region
}

export default MapState
