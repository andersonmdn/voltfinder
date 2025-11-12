import L from 'leaflet';

// Default marker icons configuration
const createDefaultIcon = (color: string = 'blue') => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background-color: ${color};
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

export const defaultMarkerIcon = createDefaultIcon('#3b82f6');

export const createMarkerIcon = (iconUrl?: string, anchor?: [number, number]) => {
  if (iconUrl) {
    return L.icon({
      iconUrl,
      iconSize: [32, 32],
      iconAnchor: anchor || [16, 32],
      popupAnchor: [0, -32]
    });
  }
  return defaultMarkerIcon;
};

// Convert hex color to rgba
export const hexToRgba = (hex: string, alpha: number = 1): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Load Leaflet CSS dynamically to avoid SSR issues
export const loadLeafletCSS = () => {
  if (typeof window === 'undefined') return;
  
  const cssLoaded = document.querySelector('link[href*="leaflet.css"]');
  if (cssLoaded) return;

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
  link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
  link.crossOrigin = '';
  document.head.appendChild(link);
};