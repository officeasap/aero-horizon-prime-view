
import React, { useState, useEffect } from 'react';
import { fetchAircraftInRange, fetchAircraftDetails, Flight } from '@/services/aviationService';
import { Loader2, Plane, Search, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import AutocompleteSearch from '@/components/AutocompleteSearch';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { SuggestResult } from '@/services/aviationService';

// Default coordinates for Soekarno-Hatta Airport (CGK)
const DEFAULT_LAT = -6.127;
const DEFAULT_LON = 106.653;
const DEFAULT_DIST = 200; // 200 km radius

// Extended SuggestResult interface with lat/lon properties
interface AirportSuggestResult extends SuggestResult {
  lat?: number;
  lon?: number;
}

const FlightTracker = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAirport, setSelectedAirport] = useState<AirportSuggestResult | null>(null);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [flightDetailsOpen, setFlightDetailsOpen] = useState(false);

  // Fetch flights on component mount
  useEffect(() => {
    loadFlights();
    
    // Set up interval to refresh data every 30 seconds
    const interval = setInterval(() => {
      loadFlights(false);
    }, 30000);
    
    // Store the interval ID, not the interval itself
    setRefreshInterval(interval);
    
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [selectedAirport]);

  // Filter flights based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredFlights(flights);
      return;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();
    const filtered = flights.filter(flight => {
      // Check flight number/callsign
      const flightNumber = flight.flight_iata || flight.flight_icao || '';
      if (flightNumber.toLowerCase().includes(lowerSearchTerm)) {
        return true;
      }
      
      // Check aircraft registration
      const registration = flight.reg_number || '';
      if (registration.toLowerCase().includes(lowerSearchTerm)) {
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
  }, [searchTerm, flights]);

  const loadFlights = async (showLoader = true) => {
    if (showLoader) {
      setIsLoading(true);
    }
    setError(null);
    
    try {
      // Use the coordinates from the selected airport if available, otherwise use default
      const lat = selectedAirport?.lat || DEFAULT_LAT;
      const lon = selectedAirport?.lon || DEFAULT_LON;
      const dist = DEFAULT_DIST;
      
      console.log('Fetching flights around coordinates:', { lat, lon, dist });
      const data = await fetchAircraftInRange(lat, lon, dist);
      
      if (data.length === 0) {
        setError('No active flights found in this area. Please try again later.');
        setFlights([]);
        setFilteredFlights([]);
      } else {
        setFlights(data);
        setFilteredFlights(data);
        console.log(`Successfully loaded ${data.length} flights`);
        if (!showLoader) {
          toast.success(`Updated: ${data.length} flights in range`);
        }
      }
    } catch (err) {
      console.error('Error fetching flights:', err);
      setError('Failed to load flight data. Please try again later.');
      toast.error('Failed to load flight data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAirportSelect = (item: SuggestResult) => {
    // Cast to our extended interface that includes lat/lon
    const airportItem = item as AirportSuggestResult;
    setSelectedAirport(airportItem);
    toast.success(`Selected ${item.name}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleRefresh = () => {
    loadFlights();
    toast.info('Refreshing flight data...');
  };

  const handleFlightSelect = async (flight: Flight) => {
    if (!flight.hex) {
      toast.error("Cannot fetch details: Missing aircraft identifier");
      return;
    }
    
    setSelectedFlight(flight);
    setFlightDetailsOpen(true);
    setDetailsLoading(true);
    
    try {
      const details = await fetchAircraftDetails(flight.hex);
      setSelectedFlight({...flight, ...details});
    } catch (err) {
      console.error('Error fetching flight details:', err);
      toast.error('Failed to load detailed flight information');
    } finally {
      setDetailsLoading(false);
    }
  };

  return (
    <section className="py-10 container mx-auto px-4">
      <Card className="bg-gray-dark/60 border-gray-light/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Plane className="text-purple" />
            <span>Real-Time Flight Tracker</span>
          </CardTitle>
          
          <div className="flex flex-col md:flex-row gap-4 mt-4">
            <div className="flex-1">
              <AutocompleteSearch 
                onSelect={handleAirportSelect} 
                placeholder="Search for an airport to track..."
                type="airport"
                className="w-full"
              />
            </div>
            
            <div className="relative w-full md:w-64">
              <Input
                type="text"
                placeholder="Search by callsign, registration..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="bg-gray-dark/50 border-gray-dark text-white pl-9"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-light" />
            </div>
            
            <Button
              variant="outline"
              onClick={handleRefresh}
              className="bg-gray-dark/50 border-gray-dark text-white"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-purple" />
                <span className="ml-2 text-gray-light">Loading live flight data...</span>
              </div>
              {[1, 2, 3, 4, 5].map((_, index) => (
                <div key={index} className="flex gap-4">
                  <Skeleton className="h-12 w-full bg-gray-light/10" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="py-10 text-center">
              <p className="text-gray-light">{error}</p>
              <Button 
                onClick={handleRefresh} 
                variant="outline" 
                className="mt-4"
              >
                Retry
              </Button>
            </div>
          ) : (
            <>
              {selectedAirport && (
                <div className="mb-4 p-3 bg-purple/10 rounded-md flex items-center justify-between">
                  <div>
                    <span className="text-sm text-gray-light">Showing flights around:</span>
                    <p className="font-medium">{selectedAirport.name} ({selectedAirport.iata_code})</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedAirport(null)}
                    className="text-gray-light hover:text-white"
                  >
                    Clear
                  </Button>
                </div>
              )}
              
              {filteredFlights.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-gray-light">No flights match your search criteria.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-white/5">
                        <TableHead className="text-purple w-40">Aircraft</TableHead>
                        <TableHead className="text-purple">Callsign</TableHead>
                        <TableHead className="text-purple text-right">Altitude</TableHead>
                        <TableHead className="text-purple text-right">Speed</TableHead>
                        <TableHead className="text-purple text-right">Heading</TableHead>
                        <TableHead className="text-purple text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredFlights.map((flight, index) => (
                        <TableRow 
                          key={`${flight.hex || flight.flight_icao || 'unknown'}-${index}`} 
                          className="hover:bg-white/5 cursor-pointer"
                          onClick={() => handleFlightSelect(flight)}
                        >
                          <TableCell className="font-medium">
                            <div className="flex flex-col">
                              <span>{flight.reg_number || 'Unknown'}</span>
                              <span className="text-sm text-gray-light">{flight.aircraft_icao || 'Unknown type'}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-mono">{flight.flight_icao || 'N/A'}</span>
                              <span className="text-sm text-gray-light">{flight.airline_name || 'Unknown operator'}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            {flight.alt ? `${Math.round(flight.alt).toLocaleString()} ft` : 'N/A'}
                          </TableCell>
                          <TableCell className="text-right">
                            {flight.speed ? `${Math.round(flight.speed)} kts` : 'N/A'}
                          </TableCell>
                          <TableCell className="text-right">
                            {flight.dir ? `${Math.round(flight.dir)}°` : 'N/A'}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleFlightSelect(flight);
                              }}
                              className="text-purple hover:text-white"
                            >
                              Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  <div className="text-center py-4 text-sm text-gray-light">
                    Showing {filteredFlights.length} of {flights.length} total aircraft
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Flight Details Dialog */}
      <Dialog open={flightDetailsOpen} onOpenChange={setFlightDetailsOpen}>
        <DialogContent className="bg-gray-dark border-gray-light/20 text-white max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Plane className="text-purple" />
              Aircraft Details
            </DialogTitle>
            <DialogDescription className="text-gray-light">
              {selectedFlight?.flight_icao || selectedFlight?.reg_number || 'Aircraft information'}
            </DialogDescription>
          </DialogHeader>

          {detailsLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-purple mr-2" />
              <span>Loading detailed information...</span>
            </div>
          ) : (
            selectedFlight && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-4">
                  <div className="bg-gray-light/5 p-4 rounded-md">
                    <h3 className="text-lg font-medium mb-2">Aircraft Information</h3>
                    <div className="grid grid-cols-2 gap-y-2">
                      <span className="text-gray-light">Registration:</span>
                      <span>{selectedFlight.reg_number || 'Unknown'}</span>
                      
                      <span className="text-gray-light">ICAO 24-bit:</span>
                      <span className="font-mono">{selectedFlight.hex || 'Unknown'}</span>
                      
                      <span className="text-gray-light">Aircraft Type:</span>
                      <span>{selectedFlight.aircraft_icao || 'Unknown'}</span>
                      
                      <span className="text-gray-light">Squawk:</span>
                      <span>{selectedFlight.squawk || 'None'}</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-light/5 p-4 rounded-md">
                    <h3 className="text-lg font-medium mb-2">Flight Information</h3>
                    <div className="grid grid-cols-2 gap-y-2">
                      <span className="text-gray-light">Callsign:</span>
                      <span className="font-mono">{selectedFlight.flight_icao || 'Unknown'}</span>
                      
                      <span className="text-gray-light">Operator:</span>
                      <span>{selectedFlight.airline_name || 'Unknown'}</span>
                      
                      <span className="text-gray-light">Status:</span>
                      <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400">
                        In Flight
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gray-light/5 p-4 rounded-md">
                    <h3 className="text-lg font-medium mb-2">Flight Data</h3>
                    <div className="grid grid-cols-2 gap-y-2">
                      <span className="text-gray-light">Altitude:</span>
                      <span>{selectedFlight.alt ? `${Math.round(selectedFlight.alt).toLocaleString()} ft` : 'Unknown'}</span>
                      
                      <span className="text-gray-light">Ground Speed:</span>
                      <span>{selectedFlight.speed ? `${Math.round(selectedFlight.speed)} kts` : 'Unknown'}</span>
                      
                      <span className="text-gray-light">Vertical Speed:</span>
                      <span>{selectedFlight.v_speed ? `${Math.round(selectedFlight.v_speed)} ft/min` : 'Unknown'}</span>
                      
                      <span className="text-gray-light">Heading:</span>
                      <span>{selectedFlight.dir ? `${Math.round(selectedFlight.dir)}°` : 'Unknown'}</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-light/5 p-4 rounded-md">
                    <h3 className="text-lg font-medium mb-2">Position</h3>
                    <div className="grid grid-cols-2 gap-y-2">
                      <span className="text-gray-light">Latitude:</span>
                      <span>{selectedFlight.lat ? selectedFlight.lat.toFixed(6) : 'Unknown'}</span>
                      
                      <span className="text-gray-light">Longitude:</span>
                      <span>{selectedFlight.lng ? selectedFlight.lng.toFixed(6) : 'Unknown'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default FlightTracker;
