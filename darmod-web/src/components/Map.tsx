'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap, Popup, useMapEvents, Circle } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { Provider } from '@/types';
import { trackEvent } from '@/services/analytics';
import { useLanguage } from '@/context/LanguageContext';
import { getCategoryColor } from '@/utils/categoryColors';

// Fix Leaflet default icon issue in Next.js
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});
function createMarkerIcon(provider: Provider): L.DivIcon {
  const color = getCategoryColor(provider.categoryId);
  const photoUrl = provider.photo || '/profile.png';

  return L.divIcon({
    className: 'professional-marker-container',
    html: `
      <div class="professional-marker" style="--marker-color: ${color}">
        <div class="marker-photo" style="background-image: url('${photoUrl}')"></div>
        <div class="marker-tip"></div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });
}

interface MapRecenterProps {
  lat: number;
  lng: number;
  zoom?: number;
}

function MapRecenter({ lat, lng, zoom }: MapRecenterProps) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], zoom ?? map.getZoom(), {
      animate: true,
      duration: 1.5,
    });
  }, [lat, lng, zoom, map]);
  return null;
}

interface MapEventsProps {
  onMoveEnd: (lat: number, lng: number) => void;
}

function MapEvents({ onMoveEnd }: MapEventsProps) {
  useMapEvents({
    moveend: (e) => {
      const { lat, lng } = e.target.getCenter();
      onMoveEnd(lat, lng);
    },
  });
  return null;
}

function UserLocationMarker() {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const map = useMap();

  useEffect(() => {
    map.locate().on('locationfound', (e) => {
      setPosition(e.latlng);
    });
  }, [map]);

  const userIcon = L.divIcon({
    className: 'user-location-marker-container',
    html: '<div class="user-location-marker"></div>',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  return position ? (
    <>
      <Circle
        center={position}
        radius={100}
        pathOptions={{
          fillColor: '#007AFF',
          fillOpacity: 0.1,
          color: '#007AFF',
          weight: 1,
          opacity: 0.2
        }}
      />
      <Marker position={position} icon={userIcon} />
    </>
  ) : null;
}

interface MapViewProps {
  center: { latitude: number; longitude: number };
  providers: Provider[];
  visibleIds: Set<number>;
  onSelectProvider: (provider: Provider) => void;
  recenterTrigger: number;
  recenterZoom?: number;
  onMapMove?: (lat: number, lng: number) => void;
}

export default function MapView({ center, providers, visibleIds, onSelectProvider, recenterTrigger, recenterZoom, onMapMove }: MapViewProps) {
  const { language, t } = useLanguage();

  const createClusterCustomIcon = (cluster: L.MarkerCluster) => {
    const count = cluster.getChildCount();
    
    return L.divIcon({
      html: `
        <div class="cluster-circle">
          <span class="cluster-count">${count}</span>
        </div>
      `,
      className: 'custom-marker-cluster',
      iconSize: L.point(40, 40),
      iconAnchor: [20, 20],
    });
  };

  return (
    <MapContainer
      key="main-map"
      id="main-map"
      center={[center.latitude, center.longitude]}
      zoom={14}
      style={{ width: '100%', height: '100%' }}
      zoomControl={false}
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
      />
      {recenterTrigger >= 0 && <MapRecenter lat={center.latitude} lng={center.longitude} zoom={recenterZoom} />}
      {onMapMove && <MapEvents onMoveEnd={onMapMove} />}
      <UserLocationMarker />
      
      <MarkerClusterGroup
        chunkedLoading={false}
        iconCreateFunction={createClusterCustomIcon}
        showCoverageOnHover={false}
        spiderfyOnMaxZoom={true}
        zoomToBoundsOnClick={true}
        disableClusteringAtZoom={18}
      >
        {providers.map((provider: Provider) => {
          if (!visibleIds.has(provider.id)) return null;
          return (
            <Marker
              key={provider.id}
              position={[provider.latitude, provider.longitude]}
              icon={createMarkerIcon(provider)}
            >
              <Popup closeButton={false} className="professional-popup">
                <div className="popup-card" onClick={() => {
                  trackEvent('map_popup_tapped', {
                    provider_id: provider.id,
                    provider_name: language === 'ar' ? `${provider.firstnameAr} ${provider.lastnameAr}` : `${provider.firstnameFr} ${provider.lastnameFr}`,
                  });
                  onSelectProvider(provider);
                }}>
                  <div className="popup-image" style={{ backgroundImage: `url(${provider.photo || '/profile.png'})` }}></div>
                  <div className="popup-info">
                    <h3 className="popup-title">
                      {language === 'ar' ? `${provider.firstnameAr} ${provider.lastnameAr}` : `${provider.firstnameFr} ${provider.lastnameFr}`}
                    </h3>
                    <div className="popup-details">
                      <span className="popup-cat">{language === 'ar' ? provider.category?.nameAr : provider.category?.nameFr}</span>
                      <span className="popup-rating">★ {provider.rating || 4.8}</span>
                    </div>
                    <div className="popup-footer">
                      <div className="popup-btn">{t('view_profile')}</div>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MarkerClusterGroup>
    </MapContainer>
  );
}
