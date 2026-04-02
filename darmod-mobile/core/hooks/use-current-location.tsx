import * as Location from 'expo-location';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Linking } from 'react-native';
import { Region } from 'react-native-maps';

const askToOpenSettings = () => {
  return new Promise<boolean>(resolve => {
    Alert.alert(
      'Location Permission Required',
      'We need your location to show nearby providers. You can enable it in Settings.',
      [
        { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
        {
          text: 'OK',
          onPress: () => {
            Linking.openSettings();
            resolve(true);
          }
        }
      ]
    );
  });
};

interface locationProps {
  latitude: number;
  longitude: number;
}

const CASABLANCA_LOCATION: locationProps = {
  latitude: 33.583646,
  longitude: -7.622907
};

const CASABLANCA_LOCATION_OBJECT: Location.LocationObject = {
  coords: {
    latitude: CASABLANCA_LOCATION.latitude,
    longitude: CASABLANCA_LOCATION.longitude,
    altitude: null,
    accuracy: null,
    altitudeAccuracy: null,
    heading: null,
    speed: null
  },
  timestamp: 0,
  mocked: false
};

export default function useCurrentLocation() {
  const [region, setRegion] = useState<Region>({
    latitude: CASABLANCA_LOCATION.latitude,
    longitude: CASABLANCA_LOCATION.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01
  });

  const updateLocation = useCallback(async () => {
    let location: Location.LocationObject | null = null;

    // Check if location is enabled in settings
    const servicesEnabled = await Location.hasServicesEnabledAsync();
    if (!servicesEnabled) {
      await askToOpenSettings();
      location = CASABLANCA_LOCATION_OBJECT;
    }

    // Check app permissions
    const permission = await Location.getForegroundPermissionsAsync();

    if (permission.granted) {
      location = await Location.getCurrentPositionAsync({});
    } else if (permission.canAskAgain) {
      // Ask the user for permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        location = await Location.getCurrentPositionAsync({});
      } else {
        // User denied but i can ask later
        location = CASABLANCA_LOCATION_OBJECT;
      }
    } else {
      // open settings if i can not ask again
      await askToOpenSettings();
      location = CASABLANCA_LOCATION_OBJECT;
    }

    const newRegion: Region = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01
    };

    setRegion(newRegion);

    return newRegion;
  }, []);

  useEffect(() => {
    const initLocation = async () => {
      await updateLocation();
    };
    initLocation();
  }, [updateLocation]);

  return { region, updateLocation };
}
