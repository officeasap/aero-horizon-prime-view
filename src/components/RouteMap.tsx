import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { SuggestResult } from '@/services/shared/types';

interface RouteMapProps {
  origin: SuggestResult | null;
  destination: SuggestResult | null;
}

const RouteMap: React.FC<RouteMapProps> = ({ origin, destination }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [0, 0],
        zoom: 2
      });
    }

    // Update route when departure and arrival change
    if (origin?.coordinates && destination?.coordinates) {
      const route = createGeoJSON([origin.coordinates, destination.coordinates]);

      if (map.current?.getSource('route')) {
        (map.current.getSource('route') as mapboxgl.GeoJSONSource).setData(route);
      } else {
        map.current?.addSource('route', {
          type: 'geojson',
          data: route
        });

        map.current?.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#8B0000',
            'line-width': 2
          }
        });
      }

      // Add markers for departure and arrival
      if (origin.coordinates) {
        new mapboxgl.Marker()
          .setLngLat(origin.coordinates)
          .setPopup(new mapboxgl.Popup().setHTML(`<h3>${origin.name}</h3>`))
          .addTo(map.current!);
      }

      if (destination.coordinates) {
        new mapboxgl.Marker({ color: '#8B0000' })
          .setLngLat(destination.coordinates)
          .setPopup(new mapboxgl.Popup().setHTML(`<h3>${destination.name}</h3>`))
          .addTo(map.current!);
      }

      // Fit bounds to show both points
      const bounds = new mapboxgl.LngLatBounds()
        .extend(origin.coordinates)
        .extend(destination.coordinates);

      map.current?.fitBounds(bounds, {
        padding: 50
      });
    }
  }, [origin, destination]);

  const createGeoJSON = (coordinates: { lat: number; lon: number; }[]) => {
    return {
      type: "FeatureCollection",
      features: [{
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: coordinates.map(coord => [coord.lon, coord.lat])
        },
        properties: {}
      }]
    };
  };

  return (
    <div ref={mapContainer} className="h-[600px] w-full rounded-lg border border-gray-200" />
  );
};

export default RouteMap;
