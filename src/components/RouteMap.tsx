
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { SuggestResult } from '@/services/shared/types';

// Define the RouteMapProps interface
export interface RouteMapProps {
  departure: SuggestResult | null;
  arrival: SuggestResult | null;
}

export const RouteMap: React.FC<RouteMapProps> = ({ departure, arrival }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Initialize map when component mounts
  useEffect(() => {
    if (!mapContainer.current) return;

    // Public Mapbox token for demo purposes
    mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZS1kZXYiLCJhIjoiY2xvZ2NrNnN4MDk1NjJrcGIydHIxdHFtYyJ9.WhJj7IFPJDdRUgIGls5hWw';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [0, 20],
      zoom: 1.5
    });

    map.current.on('load', () => {
      setLoaded(true);
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  // Update map when departure or arrival changes
  useEffect(() => {
    if (!loaded || !map.current) return;
    
    // Clear previous route layers and markers
    if (map.current.getLayer('route')) {
      map.current.removeLayer('route');
    }
    if (map.current.getSource('route')) {
      map.current.removeSource('route');
    }
    
    // Remove existing markers
    const markers = document.querySelectorAll('.mapboxgl-marker');
    markers.forEach(marker => marker.remove());

    // If we have both departure and arrival, draw the route
    if (departure && arrival) {
      const depLon = departure.longitude || departure.lon;
      const depLat = departure.latitude || departure.lat;
      const arrLon = arrival.longitude || arrival.lon;
      const arrLat = arrival.latitude || arrival.lat;
      
      if (depLon && depLat && arrLon && arrLat) {
        // Add departure marker
        new mapboxgl.Marker({ color: '#8B0000' })
          .setLngLat([depLon, depLat])
          .setPopup(new mapboxgl.Popup().setHTML(`<h3>${departure.name}</h3><p>${departure.iata_code || departure.iata}</p>`))
          .addTo(map.current);
        
        // Add arrival marker
        new mapboxgl.Marker({ color: '#4c2a90' })
          .setLngLat([arrLon, arrLat])
          .setPopup(new mapboxgl.Popup().setHTML(`<h3>${arrival.name}</h3><p>${arrival.iata_code || arrival.iata}</p>`))
          .addTo(map.current);
        
        // Calculate the great arc
        const route = {
          'type': 'FeatureCollection',
          'features': [
            {
              'type': 'Feature',
              'geometry': {
                'type': 'LineString',
                'coordinates': [
                  [depLon, depLat],
                  [arrLon, arrLat]
                ]
              }
            }
          ]
        };
        
        // Add route source and layer
        map.current.addSource('route', {
          'type': 'geojson',
          'data': route
        });
        
        map.current.addLayer({
          'id': 'route',
          'source': 'route',
          'type': 'line',
          'layout': {
            'line-join': 'round',
            'line-cap': 'round'
          },
          'paint': {
            'line-color': '#8B0000',
            'line-width': 2,
            'line-opacity': 0.8
          }
        });
        
        // Fit bounds to show both points
        const bounds = new mapboxgl.LngLatBounds()
          .extend([depLon, depLat])
          .extend([arrLon, arrLat]);
        
        map.current.fitBounds(bounds, {
          padding: 80
        });
      }
    } else if (departure) {
      // If we only have departure, center on it
      const lon = departure.longitude || departure.lon;
      const lat = departure.latitude || departure.lat;
      
      if (lon && lat) {
        new mapboxgl.Marker({ color: '#8B0000' })
          .setLngLat([lon, lat])
          .setPopup(new mapboxgl.Popup().setHTML(`<h3>${departure.name}</h3><p>${departure.iata_code || departure.iata}</p>`))
          .addTo(map.current);
          
        map.current.flyTo({
          center: [lon, lat],
          zoom: 9
        });
      }
    } else if (arrival) {
      // If we only have arrival, center on it
      const lon = arrival.longitude || arrival.lon;
      const lat = arrival.latitude || arrival.lat;
      
      if (lon && lat) {
        new mapboxgl.Marker({ color: '#4c2a90' })
          .setLngLat([lon, lat])
          .setPopup(new mapboxgl.Popup().setHTML(`<h3>${arrival.name}</h3><p>${arrival.iata_code || arrival.iata}</p>`))
          .addTo(map.current);
          
        map.current.flyTo({
          center: [lon, lat],
          zoom: 9
        });
      }
    }
  }, [departure, arrival, loaded]);

  return (
    <div 
      ref={mapContainer} 
      style={{ 
        width: '100%', 
        height: '500px',
        borderRadius: '0.75rem',
        overflow: 'hidden'
      }}
      className="border border-gray-dark/50"
    >
      {!departure && !arrival && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-dark/30 z-10 backdrop-blur-sm">
          <p className="text-white text-lg font-medium">
            Select departure and/or arrival airports to view route
          </p>
        </div>
      )}
    </div>
  );
};
