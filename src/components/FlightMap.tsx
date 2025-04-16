import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { fetchAircraftInRange, fetchAircraftDetails, Flight } from '@/services/aviationService';
import { Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

// Mapbox access token - using a more reliable token
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoibG92YWJsZS1haSIsImEiOiJjbHoyZnB4M3QwMTJkMnFxaHVnZjZ3b3poIn0.a-KotZQ2w1QKqifWWYK-Sw';

// Default coordinates for Soekarno-Hatta Airport (CGK)
const DEFAULT_LAT = -6.127;
const DEFAULT_LON = 106.653;
const DEFAULT_DIST = 200; // 200 km radius

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
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);
  const [selectedAircraft, setSelectedAircraft] = useState<Flight | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Function to calculate aircraft rotation based on direction
  const getRotation = (direction: number | undefined) => {
    return direction || 0;
  };

  // Function to create popup HTML
  const createPopupHTML = (flight: Flight) => {
    return `
      <div class="p-2 max-w-xs">
        <div class="font-bold text-lg">${flight.flight_icao || flight.reg_number || 'Unknown'}</div>
        <div class="text-sm mb-2">${flight.airline_name || 'Unknown operator'}</div>
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
        <button class="mt-2 text-xs px-2 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 w-full details-btn" data-hex="${flight.hex || ''}">
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
          const detailsBtn = document.querySelector('.details-btn') as HTMLButtonElement;
          if (detailsBtn) {
            detailsBtn.addEventListener('click', (e) => {
              e.preventDefault();
              e.stopPropagation();
              const hex = detailsBtn.getAttribute('data-hex');
              if (hex) {
                handleFlightDetails(flight);
              }
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
      
      const data = await fetchAircraftInRange(DEFAULT_LAT, DEFAULT_LON, DEFAULT_DIST);
      console.log('Fetched aircraft data:', data);
      
      if (data.length === 0) {
        setError('No active aircraft found in this area.');
      } else {
        setFlights(data);
        setFilteredFlights(data);
        
        // Create markers for the fetched flights
        createMarkers(data);
        
        if (showToast) {
          toast.success(`Updated: ${data.length} aircraft in range`);
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

  // Fetch aircraft details
  const handleFlightDetails = async (flight: Flight) => {
    if (!flight.hex) {
      toast.error("Cannot fetch details: Missing aircraft identifier");
      return;
    }
    
    setSelectedAircraft(flight);
    setDetailsOpen(true);
    setDetailsLoading(true);
    
    try {
      const details = await fetchAircraftDetails(flight.hex);
      setSelectedAircraft({...flight, ...details});
    } catch (err) {
      console.error('Error fetching flight details:', err);
      toast.error('Failed to load detailed aircraft information');
    } finally {
      setDetailsLoading(false);
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
      // Check flight number/callsign
      const flightNumber = flight.flight_icao || '';
      if (flightNumber.toLowerCase().includes(lowerSearchTerm)) {
        return true;
      }
      
      // Check aircraft registration
      const registration = flight.reg_number || '';
      if (registration.toLowerCase().includes(lowerSearchTerm)) {
        return true;
      }
      
      // Check aircraft type
      const aircraftType = flight.aircraft_icao || '';
      if (aircraftType.toLowerCase().includes(lowerSearchTerm)) {
        return true;
      }
      
      // Check airline name
      const airlineName = flight.airline_name || '';
      if (airlineName.toLowerCase().includes(lowerSearchTerm)) {
        return true;
      }
      
      return false;
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
      center: [DEFAULT_LON, DEFAULT_LAT],
      zoom: 9,
      attributionControl: false // Hide attribution control
    });
    
    // Add discrete navigation controls without attribution
    map.current.addControl(new mapboxgl.NavigationControl({
      showCompass: true,
      showZoom: true,
      visualizePitch: false
    }), 'top-right');
    
    map.current.on('load', () => {
      console.log('Map loaded successfully');
      loadFlights();
      
      // Set up interval for data refresh every 30 seconds
      const interval = setInterval(() => {
        console.log('Refreshing flight data');
        loadFlights();
      }, 30000);
      
      // Store the interval ID, not the interval itself
      setRefreshInterval(interval);
    });
    
    // Cleanup function
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

  // Add custom CSS to ensure map container is visible
  useEffect(() => {
    // Add a style element to ensure aircraft markers work correctly
    const style = document.createElement('style');
    style.innerHTML = `
      .aircraft-marker {
        cursor: pointer;
        width: 24px;
        height: 24px;
        text-align: center;
        line-height: 24px;
      }
      
      .mapboxgl-canvas {
        outline: none;
      }
      
      .mapboxgl-ctrl-logo {
        display: none !important;
      }
      
      .mapboxgl-ctrl-attrib {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Manual refresh button handler
  const handleRefresh = () => {
    loadFlights(true);
    toast.info('Refreshing aircraft data...');
  };

  return (
    <div className="w-full h-[70vh] md:h-[80vh] relative rounded-lg overflow-hidden bg-gray-dark/60 border border-gray-light/20">
      {loading && !map.current && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-dark/80 z-10">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-purple mb-2" />
            <p className="text-gray-light">Loading aircraft map...</p>
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
            placeholder="Search aircraft..."
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
            Showing {filteredFlights.length} of {flights.length} aircraft
          </div>
        )}
        <div className="text-xs bg-gray-dark/80 p-2 rounded text-white/70">
          <p>Tracking aircraft around Soekarno-Hatta Airport (CGK)</p>
          <p>{flights.length} active aircraft in range</p>
        </div>
      </div>
      
      <div ref={mapContainer} className="w-full h-full" />

      {/* Aircraft Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="bg-gray-dark border-gray-light/20 text-white max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl">
              Aircraft Details
            </DialogTitle>
            <DialogDescription className="text-gray-light">
              {selectedAircraft?.flight_icao || selectedAircraft?.reg_number || 'Aircraft information'}
            </DialogDescription>
          </DialogHeader>

          {detailsLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-purple mr-2" />
              <span>Loading detailed information...</span>
            </div>
          ) : (
            selectedAircraft && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-4">
                  <div className="bg-gray-light/5 p-4 rounded-md">
                    <h3 className="text-lg font-medium mb-2">Aircraft Information</h3>
                    <div className="grid grid-cols-2 gap-y-2">
                      <span className="text-gray-light">Registration:</span>
                      <span>{selectedAircraft.reg_number || 'Unknown'}</span>
                      
                      <span className="text-gray-light">ICAO 24-bit:</span>
                      <span className="font-mono">{selectedAircraft.hex || 'Unknown'}</span>
                      
                      <span className="text-gray-light">Aircraft Type:</span>
                      <span>{selectedAircraft.aircraft_icao || 'Unknown'}</span>
                      
                      <span className="text-gray-light">Squawk:</span>
                      <span>{selectedAircraft.squawk || 'None'}</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-light/5 p-4 rounded-md">
                    <h3 className="text-lg font-medium mb-2">Flight Information</h3>
                    <div className="grid grid-cols-2 gap-y-2">
                      <span className="text-gray-light">Callsign:</span>
                      <span className="font-mono">{selectedAircraft.flight_icao || 'Unknown'}</span>
                      
                      <span className="text-gray-light">Operator:</span>
                      <span>{selectedAircraft.airline_name || 'Unknown'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gray-light/5 p-4 rounded-md">
                    <h3 className="text-lg font-medium mb-2">Flight Data</h3>
                    <div className="grid grid-cols-2 gap-y-2">
                      <span className="text-gray-light">Altitude:</span>
                      <span>{selectedAircraft.alt ? `${Math.round(selectedAircraft.alt).toLocaleString()} ft` : 'Unknown'}</span>
                      
                      <span className="text-gray-light">Ground Speed:</span>
                      <span>{selectedAircraft.speed ? `${Math.round(selectedAircraft.speed)} kts` : 'Unknown'}</span>
                      
                      <span className="text-gray-light">Vertical Speed:</span>
                      <span>{selectedAircraft.v_speed ? `${Math.round(selectedAircraft.v_speed)} ft/min` : 'Unknown'}</span>
                      
                      <span className="text-gray-light">Heading:</span>
                      <span>{selectedAircraft.dir ? `${Math.round(selectedAircraft.dir)}°` : 'Unknown'}</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-light/5 p-4 rounded-md">
                    <h3 className="text-lg font-medium mb-2">Position</h3>
                    <div className="grid grid-cols-2 gap-y-2">
                      <span className="text-gray-light">Latitude:</span>
                      <span>{selectedAircraft.lat ? selectedAircraft.lat.toFixed(6) : 'Unknown'}</span>
                      
                      <span className="text-gray-light">Longitude:</span>
                      <span>{selectedAircraft.lng ? selectedAircraft.lng.toFixed(6) : 'Unknown'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FlightMap;
