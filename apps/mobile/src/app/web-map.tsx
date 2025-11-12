import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { Button, H1, Paragraph, Spinner, XStack, YStack } from 'tamagui';

// Dynamic imports for web adapters
const loadMapAdapter = async () => {
  const provider = process.env.EXPO_PUBLIC_MAP_PROVIDER || 'leaflet';
  
  switch (provider) {
    case 'google':
      const { GoogleMapAdapter } = await import('@voltfinder/map-google-web');
      return new GoogleMapAdapter();
    case 'leaflet':
    default:
      const { LeafletMapAdapter } = await import('@voltfinder/map-leaflet-web');
      return new LeafletMapAdapter();
  }
};

export default function WebMapPage() {
  const [adapter, setAdapter] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // SSR check
    if (typeof window === 'undefined') return;

    const initializeMap = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const adapterInstance = await loadMapAdapter();
        setAdapter(adapterInstance);

        if (mapContainerRef.current) {
          adapterInstance.mount(mapContainerRef.current);

          // Add demo markers
          const demoMarkers = [
            { id: 'marker1', lat: 37.7749, lng: -122.4194 },
            { id: 'marker2', lat: 37.7849, lng: -122.4094 },
            { id: 'marker3', lat: 37.7649, lng: -122.4294 },
            { id: 'marker4', lat: 37.7549, lng: -122.4394 },
            { id: 'marker5', lat: 37.7949, lng: -122.3994 }
          ];

          demoMarkers.forEach(marker => {
            adapterInstance.addMarker(marker.id, { lat: marker.lat, lng: marker.lng });
          });

          // Set up event listeners
          adapterInstance.on('press', (event: any) => {
            console.log('Map pressed:', event.position);
            alert(`Map Pressed - Lat: ${event.position.lat.toFixed(4)}, Lng: ${event.position.lng.toFixed(4)}`);
          });

          adapterInstance.on('regionChanged', (event: any) => {
            console.log('Region changed:', event);
          });
        }
      } catch (err) {
        console.error('Failed to initialize map:', err);
        setError(err instanceof Error ? err.message : 'Failed to load map adapter');
      } finally {
        setIsLoading(false);
      }
    };

    initializeMap();

    return () => {
      if (adapter) {
        adapter.unmount();
      }
    };
  }, []);

  const handleCenterToSF = () => {
    if (adapter) {
      adapter.setCamera({ lat: 37.7749, lng: -122.4194 }, 13);
    }
  };

  const handleFitBounds = () => {
    if (adapter) {
      adapter.fitBounds(
        { lat: 37.7949, lng: -122.4394 },
        { lat: 37.7549, lng: -122.3994 },
        100
      );
    }
  };

  // SSR fallback
  if (typeof window === 'undefined') {
    return null;
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <H1>Map Error</H1>
        <Paragraph color="red">Failed to load map: {error}</Paragraph>
        <Paragraph size="$3" marginTop="$3">
          Please check your environment variables and try again.
        </Paragraph>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Spinner size="large" />
        <Paragraph marginTop="$3">Loading map...</Paragraph>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <YStack flex={1}>
        {/* Map container */}
        <View style={{ flex: 1, position: 'relative' }}>
          <div 
            ref={mapContainerRef}
            style={{ 
              width: '100%', 
              height: '100%',
              minHeight: '400px'
            }} 
          />
        </View>
        
        {/* Controls */}
        <XStack padding="$4" space="$2" backgroundColor="$background" justifyContent="center">
          <Button onPress={handleCenterToSF} size="$3">
            Center to SF
          </Button>
          <Button onPress={handleFitBounds} size="$3">
            Fit All Markers
          </Button>
        </XStack>

        {/* Info */}
        <YStack padding="$4" backgroundColor="$gray2">
          <Paragraph size="$3" textAlign="center">
            Map Provider: {process.env.EXPO_PUBLIC_MAP_PROVIDER || 'leaflet'}
          </Paragraph>
          <Paragraph size="$2" textAlign="center" marginTop="$1" color="$gray10">
            Switch providers using EXPO_PUBLIC_MAP_PROVIDER environment variable
          </Paragraph>
        </YStack>
      </YStack>
    </View>
  );
}