import FiltersScrollView from '@/core/components/home-screen/filters-scroll-view';
import ListCardBottomsheet from '@/core/components/home-screen/list-card-bottomsheet';
import LocateMe from '@/core/components/home-screen/locate-me';
import ProviderCardBottomsheet from '@/core/components/home-screen/provider-card-bottomsheet';
import ProvidersMarker from '@/core/components/providers-marker';
import useCategories from '@/core/hooks/queries/use-categories';
import useProviders from '@/core/hooks/queries/use-providers';
import useCurrentLocation from '@/core/hooks/use-current-location';
import useFilteredProviders from '@/core/hooks/use-filtered-providers';
import { trackEvent } from '@/core/services/analytics';
import { Provider } from '@/core/types/provider-type';
import AppButton from '@/core/ui/app-button';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import MapView from 'react-native-maps';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isListOpen, setIsListOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null
  );

  const mapRef = useRef<MapView | null>(null);

  const { region } = useCurrentLocation();

  const lat = region?.latitude?.toString();
  const lng = region?.longitude?.toString();

  const {
    data: providers = [],
    isLoading,
    isError,
    error,
    refetch: refetchProviders
  } = useProviders(lat, lng, '5000');
  const filteredProviders = useFilteredProviders(providers, selectedCategory);
  const visibleProviderIds = useMemo(
    () => new Set(filteredProviders.map(p => p.id)),
    [filteredProviders]
  );

  const {
    data: categories = [],
    isLoading: categoriesIsLoading,
    isError: categoriesIsError,
    error: categoriesError,
    refetch: refetchCategories
  } = useCategories();
  const filterCategories = useMemo(() => {
    return ['All', ...categories.map(c => c.name)];
  }, [categories]);

  const handleOpenList = useCallback(() => {
    trackEvent('list_opened', {
      active_category: selectedCategory,
      providers_count: filteredProviders.length
    });

    setIsListOpen(true);
  }, [filteredProviders.length, selectedCategory]);

  useEffect(() => {
    trackEvent('screen_viewed', { screen: 'home' });
  }, []);

  const handleLocateMe = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    mapRef.current?.animateToRegion(region, 500);
  }, [mapRef, region]);

  const handleCloseList = useCallback(() => {
    setIsListOpen(false);
  }, []);

  if (isLoading || categoriesIsLoading)
    return (
      <View style={styles.stateContainer}>
        <ActivityIndicator
          size="large"
          color="#007AFF"
          style={{ marginBottom: 16 }}
        />
        <Text style={styles.loadingTitle}>Finding services near you…</Text>
        <Text style={styles.loadingSubtitle}>This may take a moment</Text>
      </View>
    );

  if (isError || categoriesIsError) {
    const errorMessage =
      error?.message || categoriesError?.message || 'Something went wrong';
    return (
      <View style={styles.stateContainer}>
        <View style={styles.errorIconCircle}>
          <Ionicons name="alert-circle" size={48} color="#FF3B30" />
        </View>
        <Text style={styles.errorTitle}>Oops, something went wrong</Text>
        <Text style={styles.errorMessage}>{errorMessage}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            refetchProviders();
            refetchCategories();
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="refresh" size={20} color="#fff" />
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <View style={styles.map}>
        <MapView
          ref={mapRef}
          style={styles.map}
          region={region}
          showsUserLocation={false}
          showsCompass={false}
          showsScale={false}
          showsTraffic={false}
          showsBuildings={false}
          showsIndoors={false}
          toolbarEnabled={false}
          zoomControlEnabled={false}
          rotateEnabled={false}
          pitchEnabled={false}
        >
          {providers?.map(provider => {
            return (
              <ProvidersMarker
                key={provider.id.toString()}
                provider={provider}
                onSelectProvider={setSelectedProvider}
                isVisible={visibleProviderIds.has(provider.id)}
              />
            );
          })}
        </MapView>

        <FiltersScrollView
          filterCategories={filterCategories}
          category={selectedCategory}
          onSelectedCategoryChange={setSelectedCategory}
          providersCount={filteredProviders.length}
        />
      </View>
      {selectedProvider && (
        <ProviderCardBottomsheet
          provider={selectedProvider}
          onSelectedProvider={setSelectedProvider}
          source="map"
        />
      )}
      <LocateMe onPress={handleLocateMe} />
      <AppButton
        style={styles.button}
        onPress={handleOpenList}
        icon={<Ionicons name="list" size={24} color="#007AFF" />}
      />
      {isListOpen && (
        <ListCardBottomsheet
          onClose={handleCloseList}
          providers={filteredProviders}
          category={selectedCategory}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject
  },
  button: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5
  },
  stateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 32
  },
  loadingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 6
  },
  loadingSubtitle: {
    fontSize: 14,
    color: '#8E8E93'
  },
  errorIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 8,
    textAlign: 'center'
  },
  errorMessage: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  }
});
