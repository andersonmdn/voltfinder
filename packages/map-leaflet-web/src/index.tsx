import {
    IMapAdapter,
    LatLng,
    MarkerOptions,
    PolygonOptions,
    PolylineOptions,
    debounce
} from '@voltfinder/map-core';
import L from 'leaflet';
import { createMarkerIcon, loadLeafletCSS } from './internal';

export class LeafletMapAdapter implements IMapAdapter {
  private map: L.Map | null = null;
  private markers: Map<string, L.Marker> = new Map();
  private polylines: Map<string, L.Polyline> = new Map();
  private polygons: Map<string, L.Polygon> = new Map();
  private eventHandlers: Map<string, Function[]> = new Map();
  private debouncedRegionChanged: Function;

  constructor() {
    // Load Leaflet CSS when adapter is created
    loadLeafletCSS();
    
    // Create debounced region change handler
    this.debouncedRegionChanged = debounce((payload: any) => {
      this.emit('regionChanged', payload);
    }, 200);
  }

  mount(container: HTMLElement | null): void {
    if (!container || typeof window === 'undefined') return;

    // Initialize map with OpenStreetMap tiles
    this.map = L.map(container, {
      attributionControl: true,
      zoomControl: true
    }).setView([37.7749, -122.4194], 13);

    // Add OpenStreetMap tile layer with attribution
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(this.map);

    // Set up event listeners
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.emit('press', { position: { lat: e.latlng.lat, lng: e.latlng.lng } });
    });

    this.map.on('moveend zoomend', () => {
      if (!this.map) return;
      
      const center = this.map.getCenter();
      const bounds = this.map.getBounds();
      const zoom = this.map.getZoom();

      this.debouncedRegionChanged({
        center: { lat: center.lat, lng: center.lng },
        zoom,
        bounds: {
          nw: { lat: bounds.getNorth(), lng: bounds.getWest() },
          se: { lat: bounds.getSouth(), lng: bounds.getEast() }
        }
      });
    });
  }

  unmount(): void {
    if (this.map) {
      // Clear all overlays
      this.markers.clear();
      this.polylines.clear();
      this.polygons.clear();
      
      // Remove map
      this.map.remove();
      this.map = null;
    }
    
    // Clear event handlers
    this.eventHandlers.clear();
  }

  setCamera(pos: LatLng, zoom: number): void {
    if (!this.map) return;
    this.map.setView([pos.lat, pos.lng], zoom);
  }

  fitBounds(nw: LatLng, se: LatLng, padding?: number): void {
    if (!this.map) return;
    
    const bounds = L.latLngBounds([se.lat, nw.lng], [nw.lat, se.lng]);
    const options = padding ? { padding: [padding, padding] } : {};
    this.map.fitBounds(bounds, options);
  }

  addMarker(id: string, pos: LatLng, opts?: MarkerOptions): void {
    if (!this.map) return;

    // Remove existing marker if it exists
    this.removeMarker(id);

    const icon = createMarkerIcon(opts?.iconUrl, opts?.anchor);
    const marker = L.marker([pos.lat, pos.lng], { 
      icon,
      zIndexOffset: opts?.zIndex || 0
    }).addTo(this.map);

    this.markers.set(id, marker);
  }

  removeMarker(id: string): void {
    const marker = this.markers.get(id);
    if (marker && this.map) {
      this.map.removeLayer(marker);
      this.markers.delete(id);
    }
  }

  addPolyline(id: string, pts: LatLng[], opts?: PolylineOptions): void {
    if (!this.map) return;

    // Remove existing polyline if it exists
    const existing = this.polylines.get(id);
    if (existing) {
      this.map.removeLayer(existing);
    }

    const latLngs = pts.map(pt => [pt.lat, pt.lng] as L.LatLngTuple);
    const polyline = L.polyline(latLngs, {
      color: opts?.color || '#3b82f6',
      weight: opts?.width || 3,
      opacity: 0.8
    }).addTo(this.map);

    this.polylines.set(id, polyline);
  }

  addPolygon(id: string, pts: LatLng[], opts?: PolygonOptions): void {
    if (!this.map) return;

    // Remove existing polygon if it exists
    const existing = this.polygons.get(id);
    if (existing) {
      this.map.removeLayer(existing);
    }

    const latLngs = pts.map(pt => [pt.lat, pt.lng] as L.LatLngTuple);
    const polygon = L.polygon(latLngs, {
      color: opts?.strokeColor || '#3b82f6',
      weight: opts?.strokeWidth || 2,
      fillColor: opts?.fillColor || '#3b82f6',
      fillOpacity: opts?.opacity || 0.2
    }).addTo(this.map);

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

  private emit(event: string, payload: any): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => handler(payload));
    }
  }
}