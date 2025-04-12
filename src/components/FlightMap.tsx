
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { fetchLiveFlights, Flight } from '@/services/aviationService';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Mapbox access token
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiZGVtby1hY2NvdW50IiwiYSI6ImNrbmhuOHN2bDAwYWkydm14OG1uZ3J4ZHYifQ.sBxknAV-P2EpwBRekgJ-GA';

interface FlightMapProps {
  selectedAirline?: string;
  selectedFlight?: string;
}

const FlightMap: React.FC<FlightMapProps> = ({ selectedAirline, selectedFlight }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [flights, setFlights] = useState<Flight[]>([]);
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);

  // Function to calculate aircraft rotation based on direction
  const getRotation = (direction: number | undefined) => {
    return direction || 0;
  };

  // Function to create popup HTML
  const createPopupHTML = (flight: Flight) => {
    return `
      <div class="p-2 max-w-xs">
        <div class="font-bold text-lg">${flight.flight_iata || flight.flight_icao || 'Unknown'}</div>
        <div class="text-sm mb-2">${flight.airline_name || flight.airline_iata || 'Unknown Airline'}</div>
        <div class="grid grid-cols-2 gap-1 text-xs">
          <div class="font-semibold">From:</div>
          <div>${flight.dep_iata || 'N/A'}</div>
          <div class="font-semibold">To:</div>
          <div>${flight.arr_iata || 'N/A'}</div>
          <div class="font-semibold">Altitude:</div>
          <div>${flight.alt ? `${Math.round(flight.alt).toLocaleString()} ft` : 'N/A'}</div>
          <div class="font-semibold">Speed:</div>
          <div>${flight.speed ? `${Math.round(flight.speed)} kts` : 'N/A'}</div>
          <div class="font-semibold">Status:</div>
          <div>${flight.status || 'Unknown'}</div>
        </div>
      </div>
    `;
  };

  // Function to clear existing markers
  const clearMarkers = () => {
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
  };

  // Function to create aircraft markers
  const createMarkers = (flightsData: Flight[]) => {
    if (!map.current) return;
    
    clearMarkers();
    
    flightsData.forEach(flight => {
      if (!flight.lat || !flight.lng) return;
      
      // Create aircraft element
      const el = document.createElement('div');
      el.className = 'aircraft-marker';
      el.innerHTML = '✈️';
      el.style.fontSize = '24px';
      el.style.transform = `rotate(${getRotation(flight.dir)}deg)`;
      
      // Create the popup
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(createPopupHTML(flight));
      
      // Create and add the marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat([flight.lng, flight.lat])
        .setPopup(popup)
        .addTo(map.current);
      
      markersRef.current.push(marker);
    });
  };

  // Load flights data
  const loadFlights = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: Record<string, string> = {};
      
      if (selectedAirline) {
        params.airline_icao = selectedAirline;
      }
      
      if (selectedFlight) {
        params.flight_icao = selectedFlight;
      }
      
      const data = await fetchLiveFlights(params);
      
      if (data.length === 0) {
        setError('No active flights found right now.');
      } else {
        setFlights(data);
        setFilteredFlights(data);
        
        // Create markers for the fetched flights
        createMarkers(data);
      }
    } catch (err) {
      console.error('Error fetching flights for map:', err);
      setError('Failed to load flight data for the map. Please try again later.');
      toast.error('Failed to load flight map data');
    } finally {
      setLoading(false);
    }
  };

  // Filter flights based on search
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredFlights(flights);
      createMarkers(flights);
      return;
    }
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    const filtered = flights.filter(flight => {
      // Check flight number
      const flightNumber = flight.flight_iata || flight.flight_icao || '';
      if (flightNumber.toLowerCase().includes(lowerSearchTerm)) {
        return true;
      }
      
      // Check airline name
      const airlineName = flight.airline_name || '';
      if (airlineName.toLowerCase().includes(lowerSearchTerm)) {
        return true;
      }
      
      // Check departure/arrival airports
      const depAirport = flight.dep_iata || '';
      const arrAirport = flight.arr_iata || '';
      
      return depAirport.toLowerCase().includes(lowerSearchTerm) || 
             arrAirport.toLowerCase().includes(lowerSearchTerm);
    });
    
    setFilteredFlights(filtered);
    createMarkers(filtered);
  }, [searchTerm, flights]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;
    
    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [0, 20],
      zoom: 1.5
    });
    
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    map.current.on('load', () => {
      loadFlights();
      
      // Set up interval for data refresh every 45 seconds
      const interval = setInterval(() => {
        loadFlights();
      }, 45000);
      
      return () => clearInterval(interval);
    });
    
    return () => {
      clearMarkers();
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Search handler
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="w-full h-[70vh] relative rounded-lg overflow-hidden bg-gray-dark/60 border border-gray-light/20">
      {loading && !map.current && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-dark/80 z-10">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-purple mb-2" />
            <p className="text-gray-light">Loading flight map...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-dark/80 z-10 p-4">
          <Card className="max-w-md p-4 text-center bg-gray-dark/90 border-gray-light/20">
            <p className="mb-4 text-gray-light">{error}</p>
            <Button onClick={loadFlights} variant="outline">Try Again</Button>
          </Card>
        </div>
      )}
      
      <div className="absolute top-4 left-4 z-10 w-full max-w-xs">
        <Input
          type="text"
          placeholder="Search flights, airlines, airports..."
          className="bg-gray-dark/70 border-gray-dark text-white"
          value={searchTerm}
          onChange={handleSearch}
        />
        {searchTerm && (
          <div className="text-xs text-white/70 mt-1 bg-gray-dark/70 p-1 rounded">
            Showing {filteredFlights.length} of {flights.length} flights
          </div>
        )}
      </div>
      
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default FlightMap;
