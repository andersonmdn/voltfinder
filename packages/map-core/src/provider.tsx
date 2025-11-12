import React, { createContext, ReactNode, useContext } from 'react';
import { IMapAdapter } from './IMapAdapter';

type MapProvider = 'leaflet' | 'google' | 'rn-maps';

interface MapContextValue {
  adapter: IMapAdapter | null;
  isLoading: boolean;
  error: string | null;
}

const MapContext = createContext<MapContextValue>({
  adapter: null,
  isLoading: true,
  error: null,
});

interface MapProviderProps {
  children: ReactNode;
  provider?: MapProvider;
}

// Simple context provider for map adapter
export const MapProviderComponent: React.FC<MapProviderProps> = ({ 
  children 
}) => {
  // In practice, this would be initialized by the actual implementation
  const contextValue: MapContextValue = {
    adapter: null,
    isLoading: false,
    error: null
  };

  return (
    <MapContext.Provider value={contextValue}>
      {children}
    </MapContext.Provider>
  );
};

export const useMapAdapter = (): MapContextValue => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMapAdapter must be used within a MapProvider');
  }
  return context;
};
