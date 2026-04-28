import { useState } from "react";
import type { Region } from "@/hooks/useCurrentLocation";

interface UseMapStateParams {
  region: Region;
  updateLocation: () => Promise<Region>;
}

interface MapCenter {
  lat: string;
  lng: string;
}

export default function useMapState({
  region,
  updateLocation,
}: UseMapStateParams) {
  const [mapCenter, setMapCenter] = useState<MapCenter | null>(null);
  const [recenterTrigger, setRecenterTrigger] = useState(0);

  const lat = mapCenter?.lat || region.latitude.toString();
  const lng = mapCenter?.lng || region.longitude.toString();

  const handleMapMove = (lat: number, lng: number) => {
    setMapCenter({
      lat: lat.toString(),
      lng: lng.toString(),
    });
  };

  const handleLocateMe = async () => {
    await updateLocation();
    setMapCenter(null);
    setRecenterTrigger((trigger) => trigger + 1);
  };

  return {
    lat,
    lng,
    recenterTrigger,
    handleMapMove,
    handleLocateMe,
  };
}
