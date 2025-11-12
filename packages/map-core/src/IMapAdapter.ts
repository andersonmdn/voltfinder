import { LatLng } from './types';

export interface MarkerOptions {
  iconUrl?: string;
  anchor?: [number, number];
  zIndex?: number;
}

export interface PolylineOptions {
  width?: number;
  color?: string;
}

export interface PolygonOptions {
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  opacity?: number;
}

export interface MapEvent {
  type: 'press' | 'regionChanged';
  payload?: any;
}

export interface RegionChangedEvent {
  center: LatLng;
  zoom: number;
  bounds: {
    nw: LatLng;
    se: LatLng;
  };
}

export interface PressEvent {
  position: LatLng;
}

/**
 * Common interface for all map adapters
 */
export interface IMapAdapter {
  /**
   * Mount the map to a container element
   */
  mount(container: HTMLElement | null): void;

  /**
   * Unmount and cleanup the map
   */
  unmount(): void;

  /**
   * Set camera position and zoom
   */
  setCamera(pos: LatLng, zoom: number): void;

  /**
   * Fit map to bounds with optional padding
   */
  fitBounds(nw: LatLng, se: LatLng, padding?: number): void;

  /**
   * Add a marker to the map
   */
  addMarker(id: string, pos: LatLng, opts?: MarkerOptions): void;

  /**
   * Remove a marker from the map
   */
  removeMarker(id: string): void;

  /**
   * Add a polyline to the map
   */
  addPolyline(id: string, pts: LatLng[], opts?: PolylineOptions): void;

  /**
   * Add a polygon to the map
   */
  addPolygon(id: string, pts: LatLng[], opts?: PolygonOptions): void;

  /**
   * Subscribe to map events
   */
  on(event: 'press' | 'regionChanged', cb: (payload: any) => void): void;

  /**
   * Unsubscribe from map events
   */
  off(event: 'press' | 'regionChanged', cb: (payload: any) => void): void;
}