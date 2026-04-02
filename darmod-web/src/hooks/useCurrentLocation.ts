'use client';

import { useState, useEffect, useCallback } from 'react';

const USE_STATIC_LOCATION = true; // Toggle this to false to restore dynamic GPS location

const STATIC_LOCATION = {
  latitude: 33.60002,
  longitude: -7.50413,
};

export interface Region {
  latitude: number;
  longitude: number;
}

export default function useCurrentLocation() {
  const [region, setRegion] = useState<Region>(STATIC_LOCATION);

  const updateLocation = useCallback(async () => {
    if (USE_STATIC_LOCATION) {
      setRegion(STATIC_LOCATION);
      return STATIC_LOCATION;
    }

    if (!navigator.geolocation) {
      console.warn('Geolocation not supported');
      return STATIC_LOCATION;
    }

    return new Promise<Region>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newRegion = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setRegion(newRegion);
          resolve(newRegion);
        },
        (error) => {
          console.warn('Geolocation error:', error.message);
          resolve(STATIC_LOCATION);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  }, []);

  useEffect(() => {
    updateLocation();
  }, [updateLocation]);

  return { region, updateLocation };
}
