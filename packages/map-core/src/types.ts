/**
 * Common types for map abstraction layer
 */

export interface LatLng {
  lat: number;
  lng: number;
}

export interface Bounds {
  nw: LatLng;
  se: LatLng;
}

export interface GeoJSONPoint {
  type: 'Point';
  coordinates: [number, number]; // [lng, lat]
}

export interface GeoJSONFeature {
  type: 'Feature';
  geometry: GeoJSONPoint;
  properties: Record<string, any>;
}

export interface GeoJSONFeatureCollection {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}

/**
 * Helper functions for converting between GeoJSON and LatLng
 */
export const geoUtils = {
  /**
   * Convert LatLng array to GeoJSON FeatureCollection
   */
  latLngArrayToGeoJSON(points: LatLng[]): GeoJSONFeatureCollection {
    return {
      type: 'FeatureCollection',
      features: points.map((point, index) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [point.lng, point.lat]
        },
        properties: { id: index }
      }))
    };
  },

  /**
   * Convert GeoJSON FeatureCollection to LatLng array
   */
  geoJSONToLatLngArray(collection: GeoJSONFeatureCollection): LatLng[] {
    return collection.features
      .filter(feature => feature.geometry.type === 'Point')
      .map(feature => ({
        lat: feature.geometry.coordinates[1],
        lng: feature.geometry.coordinates[0]
      }));
  },

  /**
   * Calculate bounds from LatLng array
   */
  calculateBounds(points: LatLng[]): Bounds | null {
    if (points.length === 0) return null;

    let minLat = points[0].lat;
    let maxLat = points[0].lat;
    let minLng = points[0].lng;
    let maxLng = points[0].lng;

    points.forEach(point => {
      minLat = Math.min(minLat, point.lat);
      maxLat = Math.max(maxLat, point.lat);
      minLng = Math.min(minLng, point.lng);
      maxLng = Math.max(maxLng, point.lng);
    });

    return {
      nw: { lat: maxLat, lng: minLng },
      se: { lat: minLat, lng: maxLng }
    };
  },

  /**
   * Calculate center point from bounds
   */
  boundsCenter(bounds: Bounds): LatLng {
    return {
      lat: (bounds.nw.lat + bounds.se.lat) / 2,
      lng: (bounds.nw.lng + bounds.se.lng) / 2
    };
  }
};