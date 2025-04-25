
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { SuggestResult } from '@/services/shared/types';

interface RouteMapProps {
  departure: SuggestResult | null;
  arrival: SuggestResult | null;
}

export const RouteMap: React.FC<RouteMapProps> = ({ departure, arrival }) => {
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
    if (departure?.coordinates && arrival?.coordinates) {
      const route = {
        type: 'FeatureCollection' as const,
        features: [
          {
            type: 'Feature' as const,
            geometry: {
              type: 'LineString' as const,
              coordinates: [
                departure.coordinates,
                arrival.coordinates
              ]
            },
            properties: {}
          }
        ]
      };

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
      if (departure.coordinates) {
        new mapboxgl.Marker()
          .setLngLat(departure.coordinates)
          .setPopup(new mapboxgl.Popup().setHTML(`<h3>${departure.name}</h3>`))
          .addTo(map.current!);
      }

      if (arrival.coordinates) {
        new mapboxgl.Marker({ color: '#8B0000' })
          .setLngLat(arrival.coordinates)
          .setPopup(new mapboxgl.Popup().setHTML(`<h3>${arrival.name}</h3>`))
          .addTo(map.current!);
      }

      // Fit bounds to show both points
      const bounds = new mapboxgl.LngLatBounds()
        .extend(departure.coordinates)
        .extend(arrival.coordinates);

      map.current?.fitBounds(bounds, {
        padding: 50
      });
    }
  }, [departure, arrival]);

  return (
    <div ref={mapContainer} className="h-[600px] w-full rounded-lg border border-gray-200" />
  );
};
