
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { fetchMostTrackedFlights, Flight } from '@/services/aviationService';
import { Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

// Mapbox access token
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoibG92YWJsZS1haSIsImEiOiJjbHoyZnB4M3QwMTJkMnFxaHVnZjZ3b3poIn0.a-KotZQ2w1QKqifWWYK-Sw';

const FlightMap: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [flights, setFlights] = useState<Flight[]>([]);
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);
  const [selectedAircraft, setSelectedAircraft] = useState<Flight | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Function to calculate aircraft rotation based on direction
  const getRotation = (direction: number | undefined) => {
    return direction || 0;
  };

  // Function to create popup HTML
  const createPopupHTML = (flight: Flight) => {
    return `
      <div class="p-2 max-w-xs">
        <div class="font-bold text-lg">${flight.flight_icao || 'Unknown'}</div>
        <div class="text-sm mb-2">${flight.airline_name || 'Unknown operator'}</div>
        <div class="text-xs mb-2">
          ${flight.dep_iata || '???'} → ${flight.arr_iata || '???'}
        </div>
        <div class="grid grid-cols-2 gap-1 text-xs">
          <div class="font-semibold">Type:</div>
          <div>${flight.aircraft_icao || 'Unknown'}</div>
          <div class="font-semibold">Altitude:</div>
          <div>${flight.alt ? `${Math.round(flight.alt).toLocaleString()} ft` : 'N/A'}</div>
          <div class="font-semibold">Speed:</div>
          <div>${flight.speed ? `${Math.round(flight.speed)} kts` : 'N/A'}</div>
          <div class="font-semibold">Heading:</div>
          <div>${flight.dir ? `${Math.round(flight.dir)}°` : 'N/A'}</div>
        </div>
        <button class="mt-2 text-xs px-2 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 w-full details-btn">
          View Details
        </button>
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
      el.style.fontSize = '24px';
      el.style.color = '#ffffff';
      el.innerHTML = '✈️';
      
      // Apply rotation to match aircraft direction
      const rotation = getRotation(flight.dir);
      el.style.transform = `rotate(${rotation}deg)`;
      
      // Create the popup
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(createPopupHTML(flight));
      
      // Add event listener to the "View Details" button after popup is open
      popup.on('open', () => {
        setTimeout(() => {
          const detailsBtn = document.querySelector('.details-btn');
          if (detailsBtn) {
            detailsBtn.addEventListener('click', () => {
              handleFlightDetails(flight);
            });
          }
        }, 100);
      });
      
      // Create and add the marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat([flight.lng, flight.lat])
        .setPopup(popup)
        .addTo(map.current);
      
      markersRef.current.push(marker);
    });
  };

  // Load flights data
  const loadFlights = async (showToast = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await fetchMostTrackedFlights();
      
      if (data.length === 0) {
        setError('No active flights found.');
      } else {
        setFlights(data);
        setFilteredFlights(data);
        createMarkers(data);
        
        if (showToast) {
          toast.success(`Updated: ${data.length} most tracked flights`);
        }

        // Fit map bounds to show all aircraft
        if (map.current && data.length > 0) {
          const bounds = new mapboxgl.LngLatBounds();
          data.forEach(flight => {
            if (flight.lat && flight.lng) {
              bounds.extend([flight.lng, flight.lat]);
            }
          });
          map.current.fitBounds(bounds, { padding: 50 });
        }
      }
    } catch (err) {
      console.error('Error fetching flights for map:', err);
      setError('Failed to load flight data for the map. Please try again later.');
      toast.error('Failed to load flight map data');
    } finally {
      setLoading(false);
    }
  };

  const handleFlightDetails = (flight: Flight) => {
    setSelectedAircraft(flight);
    setDetailsOpen(true);
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
      const searchFields = [
        flight.flight_icao,
        flight.reg_number,
        flight.airline_name,
        flight.dep_iata,
        flight.arr_iata
      ].map(field => (field || '').toLowerCase());
      
      return searchFields.some(field => field.includes(lowerSearchTerm));
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
      zoom: 2,
      projection: 'globe'
    });
    
    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl({
      showCompass: true,
      showZoom: true,
      visualizePitch: true
    }), 'top-right');

    // Add atmosphere and fog effects
    map.current.on('style.load', () => {
      map.current?.setFog({
        color: 'rgb(186, 210, 235)',
        'high-color': 'rgb(36, 92, 223)',
        'horizon-blend': 0.02,
        'space-color': 'rgb(11, 11, 25)',
        'star-intensity': 0.6
      });
    });
    
    map.current.on('load', () => {
      loadFlights();
      
      // Set up interval for data refresh
      const interval = setInterval(() => {
        loadFlights();
      }, 60000); // Refresh every 60 seconds
      
      setRefreshInterval(interval);
    });
    
    return () => {
      clearMarkers();
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Add custom CSS
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .aircraft-marker {
        cursor: pointer;
        width: 24px;
        height: 24px;
        text-align: center;
        line-height: 24px;
        transition: transform 0.3s ease;
      }
      
      .mapboxgl-canvas {
        outline: none;
      }
      
      .mapboxgl-popup-content {
        background: rgba(26, 26, 26, 0.95);
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
      }
      
      .mapboxgl-popup-tip {
        border-top-color: rgba(26, 26, 26, 0.95) !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleRefresh = () => {
    loadFlights(true);
    toast.info('Refreshing flight data...');
  };

  return (
    <div className="w-full h-[70vh] md:h-[80vh] relative rounded-lg overflow-hidden bg-gray-dark/60 border border-gray-light/20">
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
            <Button onClick={() => loadFlights(true)} variant="outline">Try Again</Button>
          </Card>
        </div>
      )}
      
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-col gap-2 max-w-xs">
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Search flights..."
            className="bg-gray-dark/80 border-gray-dark text-white"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Button 
            variant="outline" 
            className="bg-gray-dark/80 border-gray-dark text-white"
            onClick={handleRefresh}
            title="Refresh flight data"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        {searchTerm && (
          <div className="text-xs text-white/70 bg-gray-dark/80 p-1 rounded">
            Showing {filteredFlights.length} of {flights.length} flights
          </div>
        )}
      </div>
      
      <div ref={mapContainer} className="w-full h-full" />

      {/* Flight Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="bg-gray-dark border-gray-light/20 text-white max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl">
              Flight Details
            </DialogTitle>
            <DialogDescription className="text-gray-light">
              {selectedAircraft?.flight_icao || 'Flight information'}
            </DialogDescription>
          </DialogHeader>

          {selectedAircraft && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-4">
                <div className="bg-gray-light/5 p-4 rounded-md">
                  <h3 className="text-lg font-medium mb-2">Flight Information</h3>
                  <div className="grid grid-cols-2 gap-y-2">
                    <span className="text-gray-light">Flight Number:</span>
                    <span className="font-mono">{selectedAircraft.flight_icao || 'N/A'}</span>
                    
                    <span className="text-gray-light">Operator:</span>
                    <span>{selectedAircraft.airline_name || 'Unknown'}</span>
                  </div>
                </div>

                <div className="bg-gray-light/5 p-4 rounded-md">
                  <h3 className="text-lg font-medium mb-2">Route</h3>
                  <div className="grid grid-cols-2 gap-y-2">
                    <span className="text-gray-light">From:</span>
                    <div className="flex flex-col">
                      <span>{selectedAircraft.dep_iata || 'N/A'}</span>
                      <span className="text-sm text-gray-light">{selectedAircraft.dep_name}</span>
                    </div>
                    
                    <span className="text-gray-light">To:</span>
                    <div className="flex flex-col">
                      <span>{selectedAircraft.arr_iata || 'N/A'}</span>
                      <span className="text-sm text-gray-light">{selectedAircraft.arr_name}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-light/5 p-4 rounded-md">
                  <h3 className="text-lg font-medium mb-2">Aircraft Information</h3>
                  <div className="grid grid-cols-2 gap-y-2">
                    <span className="text-gray-light">Registration:</span>
                    <span>{selectedAircraft.reg_number || 'Unknown'}</span>
                    
                    <span className="text-gray-light">Aircraft Type:</span>
                    <span>{selectedAircraft.aircraft_icao || 'Unknown'}</span>
                  </div>
                </div>

                <div className="bg-gray-light/5 p-4 rounded-md">
                  <h3 className="text-lg font-medium mb-2">Current Position</h3>
                  <div className="grid grid-cols-2 gap-y-2">
                    <span className="text-gray-light">Altitude:</span>
                    <span>{selectedAircraft.alt ? `${Math.round(selectedAircraft.alt).toLocaleString()} ft` : 'N/A'}</span>
                    
                    <span className="text-gray-light">Ground Speed:</span>
                    <span>{selectedAircraft.speed ? `${Math.round(selectedAircraft.speed)} kts` : 'N/A'}</span>
                    
                    <span className="text-gray-light">Heading:</span>
                    <span>{selectedAircraft.dir ? `${Math.round(selectedAircraft.dir)}°` : 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FlightMap;
