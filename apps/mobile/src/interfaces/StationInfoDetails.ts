import MarkerStatus from '@/enums/MarkerStatus'
import LatLng from './LatLng'

interface StationInfoDetails {
  id: number
  name: string
  status: MarkerStatus
  coordinate?: LatLng
  address?: string
  neighborhood?: string
  city?: string
  state?: string
  zipCode?: string
  distanceKm?: number
  openingHours?: string
}

export default StationInfoDetails
