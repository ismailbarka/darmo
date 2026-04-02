import { Provider } from '@/core/types/provider-type';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Marker } from 'react-native-maps';
import { trackEvent } from '../services/analytics';
import ProviderMarkerUI from './provider-marker';

function ProvidersMarker({
  provider,
  onSelectProvider,
  isVisible = true
}: {
  provider: Provider;
  onSelectProvider: (provider: Provider | null) => void;
  isVisible?: boolean;
}) {
  const [tracksViewChanges, setTracksViewChanges] = useState(true);

  useEffect(() => {
    setTracksViewChanges(true);
    const timeout = setTimeout(() => {
      setTracksViewChanges(false);
    }, 500);
    return () => clearTimeout(timeout);
  }, [isVisible]);

  const handlePress = useCallback(() => {
    if (!isVisible) return;

    trackEvent('map_marker_tapped', {
      provider_id: provider.id,
      provider_name: provider.name,
      category: provider.categoryName,
      distance_meters: Math.round(provider.distance)
    });

    onSelectProvider(provider);
  }, [provider, onSelectProvider, isVisible]);

  const coordinate = useMemo(() => {
    return {
      latitude: provider.latitude,
      longitude: provider.longitude
    };
  }, [provider.latitude, provider.longitude]);

  return (
    <Marker
      coordinate={coordinate}
      tracksViewChanges={tracksViewChanges}
      onPress={handlePress}
      title={provider.name}
      opacity={isVisible ? 1 : 0}
    >
      <ProviderMarkerUI
        categoryName={provider.categoryName}
        photoUrl={provider.photoUrl}
      />
    </Marker>
  );
}

export default memo(ProvidersMarker, (prev, next) => {
  return (
    prev.provider.id === next.provider.id && prev.isVisible === next.isVisible
  );
});
