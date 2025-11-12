import MarkerStatus from '@/enums/MarkerStatus'
import LatLng from './LatLng'

interface StationInfo {
  id: number
  status: MarkerStatus
  coordinate: LatLng
}

export default StationInfo
