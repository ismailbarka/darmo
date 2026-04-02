'use client';

import { useState, useEffect, useCallback } from 'react';

const CASABLANCA = {
  latitude: 33.583646,
  longitude: -7.622907,
};

export interface Region {
  latitude: number;
  longitude: number;
}

export default function useCurrentLocation() {
  const [region, setRegion] = useState<Region>(CASABLANCA);

  const updateLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      console.warn('Geolocation not supported');
      return CASABLANCA;
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
          resolve(CASABLANCA);
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
