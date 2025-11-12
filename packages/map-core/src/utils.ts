
/**
 * Clustering utilities using supercluster
 * TODO: Move to WebWorker/JSI for better performance
 */
export interface ClusterOptions {
  radius?: number;
  maxZoom?: number;
  minZoom?: number;
  minPoints?: number;
}

export interface ClusterPoint {
  id: string;
  lat: number;
  lng: number;
  properties?: Record<string, any>;
}

export interface Cluster {
  id: string;
  lat: number;
  lng: number;
  pointCount: number;
  pointIds: string[];
}

/**
 * Create clusters from a collection of points
 */
export const createCluster = (
  points: ClusterPoint[],
  options: ClusterOptions = {}
): Promise<(ClusterPoint | Cluster)[]> => {
  return new Promise((resolve) => {
    // Simple clustering implementation
    // TODO: Replace with supercluster when web workers are available
    const {
      radius = 60,
      maxZoom = 16,
      minPoints = 2
    } = options;

    // For now, return original points
    // In a real implementation, we'd use supercluster here
    resolve(points);
  });
};

/**
 * Debounce utility for map events
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};