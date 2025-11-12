import {
    debounce,
    IMapAdapter,
    LatLng,
    MarkerOptions,
    PolygonOptions,
    PolylineOptions
} from '@voltfinder/map-core';
import { getGoogleMaps, MAP_THEMES } from './internal';

export type MapTheme = 'light' | 'dark';

export class GoogleMapAdapter implements IMapAdapter {
  private map: google.maps.Map | null = null;
  private markers: Map<string, google.maps.Marker> = new Map();
  private polylines: Map<string, google.maps.Polyline> = new Map();
  private polygons: Map<string, google.maps.Polygon> = new Map();
  private eventHandlers: Map<string, Function[]> = new Map();
  private listeners: google.maps.MapsEventListener[] = [];
  private debouncedRegionChanged: Function;
  private theme: MapTheme;

  constructor(theme: MapTheme = 'light') {
    this.theme = theme;
    
    // Create debounced region change handler
    this.debouncedRegionChanged = debounce((payload: any) => {
      this.emit('regionChanged', payload);
    }, 200);
  }

  async mount(container: HTMLElement | null): Promise<void> {
    if (!container || typeof window === 'undefined') return;

    try {
      // Load Google Maps API
      await getGoogleMaps();

      // Initialize map
      this.map = new google.maps.Map(container, {
        center: { lat: 37.7749, lng: -122.4194 },
        zoom: 13,
        styles: MAP_THEMES[this.theme],
        mapTypeControl: false,
        fullscreenControl: true,
        streetViewControl: false,
        zoomControl: true,
        clickableIcons: false,
        gestureHandling: 'auto'
      });

      // Set up event listeners
      const clickListener = this.map.addListener('click', (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
          this.emit('press', { 
            position: { 
              lat: e.latLng.lat(), 
              lng: e.latLng.lng() 
            } 
          });
        }
      });

      const idleListener = this.map.addListener('idle', () => {
        if (!this.map) return;
        
        const center = this.map.getCenter();
        const bounds = this.map.getBounds();
        const zoom = this.map.getZoom();

        if (center && bounds && zoom !== undefined) {
          this.debouncedRegionChanged({
            center: { lat: center.lat(), lng: center.lng() },
            zoom,
            bounds: {
              nw: { 
                lat: bounds.getNorthEast().lat(), 
                lng: bounds.getSouthWest().lng() 
              },
              se: { 
                lat: bounds.getSouthWest().lat(), 
                lng: bounds.getNorthEast().lng() 
              }
            }
          });
        }
      });

      this.listeners = [clickListener, idleListener];

    } catch (error) {
      console.error('Failed to initialize Google Maps:', error);
      throw error;
    }
  }

  unmount(): void {
    // Clear all listeners
    this.listeners.forEach(listener => {
      google.maps.event.removeListener(listener);
    });
    this.listeners = [];

    // Clear all overlays
    this.markers.forEach(marker => marker.setMap(null));
    this.polylines.forEach(polyline => polyline.setMap(null));
    this.polygons.forEach(polygon => polygon.setMap(null));
    
    this.markers.clear();
    this.polylines.clear();
    this.polygons.clear();
    
    // Clear map reference
    this.map = null;
    
    // Clear event handlers
    this.eventHandlers.clear();
  }

  setCamera(pos: LatLng, zoom: number): void {
    if (!this.map) return;
    
    this.map.setCenter({ lat: pos.lat, lng: pos.lng });
    this.map.setZoom(zoom);
  }

  fitBounds(nw: LatLng, se: LatLng, padding?: number): void {
    if (!this.map) return;
    
    const bounds = new google.maps.LatLngBounds();
    bounds.extend({ lat: nw.lat, lng: nw.lng });
    bounds.extend({ lat: se.lat, lng: se.lng });
    
    const options = padding ? { padding } : {};
    this.map.fitBounds(bounds, options);
  }

  addMarker(id: string, pos: LatLng, opts?: MarkerOptions): void {
    if (!this.map) return;

    // Remove existing marker if it exists
    this.removeMarker(id);

    const markerOptions: google.maps.MarkerOptions = {
      position: { lat: pos.lat, lng: pos.lng },
      map: this.map,
      zIndex: opts?.zIndex || 0
    };

    if (opts?.iconUrl) {
      markerOptions.icon = {
        url: opts.iconUrl,
        anchor: opts.anchor ? new google.maps.Point(opts.anchor[0], opts.anchor[1]) : undefined
      };
    }

    const marker = new google.maps.Marker(markerOptions);
    this.markers.set(id, marker);
  }

  removeMarker(id: string): void {
    const marker = this.markers.get(id);
    if (marker) {
      marker.setMap(null);
      this.markers.delete(id);
    }
  }

  addPolyline(id: string, pts: LatLng[], opts?: PolylineOptions): void {
    if (!this.map) return;

    // Remove existing polyline if it exists
    const existing = this.polylines.get(id);
    if (existing) {
      existing.setMap(null);
    }

    const path = pts.map(pt => ({ lat: pt.lat, lng: pt.lng }));
    const polyline = new google.maps.Polyline({
      path,
      geodesic: true,
      strokeColor: opts?.color || '#3b82f6',
      strokeOpacity: 0.8,
      strokeWeight: opts?.width || 3,
      map: this.map
    });

    this.polylines.set(id, polyline);
  }

  addPolygon(id: string, pts: LatLng[], opts?: PolygonOptions): void {
    if (!this.map) return;

    // Remove existing polygon if it exists
    const existing = this.polygons.get(id);
    if (existing) {
      existing.setMap(null);
    }

    const path = pts.map(pt => ({ lat: pt.lat, lng: pt.lng }));
    const polygon = new google.maps.Polygon({
      paths: path,
      strokeColor: opts?.strokeColor || '#3b82f6',
      strokeOpacity: 0.8,
      strokeWeight: opts?.strokeWidth || 2,
      fillColor: opts?.fillColor || '#3b82f6',
      fillOpacity: opts?.opacity || 0.2,
      map: this.map
    });

    this.polygons.set(id, polygon);
  }

  on(event: 'press' | 'regionChanged', cb: (payload: any) => void): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)?.push(cb);
  }

  off(event: 'press' | 'regionChanged', cb: (payload: any) => void): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      const index = handlers.indexOf(cb);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  /**
   * Change map theme
   */
  setTheme(theme: MapTheme): void {
    if (!this.map) return;
    
    this.theme = theme;
    this.map.setOptions({ styles: MAP_THEMES[theme] });
  }

  private emit(event: string, payload: any): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => handler(payload));
    }
  }
}