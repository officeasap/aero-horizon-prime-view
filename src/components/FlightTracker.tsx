
import React, { useState, useEffect } from 'react';
import { MapPin, Plane, Info, Filter, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { 
  fetchLiveFlights, 
  fetchFlightStatus, 
  fetchSuggestions,
  Flight,
  SuggestResult 
} from '@/services/aviationService';
import { toast } from 'sonner';
import AutocompleteSearch from './AutocompleteSearch';

// Sample flight tracking data for fallback
const sampleFlightData = [
  { id: 'BA189', from: 'London', to: 'New York', airline: 'British Airways', aircraft: 'Boeing 777-300ER', altitude: '36,000 ft', speed: '560 mph', progress: 72 },
  { id: 'SQ322', from: 'Singapore', to: 'Paris', airline: 'Singapore Airlines', aircraft: 'Airbus A380-800', altitude: '39,000 ft', speed: '590 mph', progress: 45 },
  { id: 'EK241', from: 'Dubai', to: 'Sydney', airline: 'Emirates', aircraft: 'Airbus A380-800', altitude: '38,000 ft', speed: '570 mph', progress: 30 },
  { id: 'AA100', from: 'New York', to: 'London', airline: 'American Airlines', aircraft: 'Boeing 777-200ER', altitude: '35,000 ft', speed: '540 mph', progress: 85 },
];

// Helper function to format flight data from API
const formatFlightData = (flight: Flight) => {
  // Calculate a pseudo-progress based on departure and current time
  // This is an approximation since we don't have full flight path data
  const calculateProgress = () => {
    if (!flight.dep_time_utc || !flight.arr_time_utc) return 50;
    
    const now = new Date();
    const departure = new Date(flight.dep_time_utc);
    const arrival = new Date(flight.arr_time_utc);
    
    const totalDuration = arrival.getTime() - departure.getTime();
    const elapsed = now.getTime() - departure.getTime();
    
    if (elapsed < 0) return 0;
    if (elapsed > totalDuration) return 100;
    
    return Math.round((elapsed / totalDuration) * 100);
  };
  
  return {
    id: flight.flight_iata || 'Unknown',
    from: flight.dep_name || flight.dep_city || flight.dep_iata || 'Unknown',
    to: flight.arr_name || flight.arr_city || flight.arr_iata || 'Unknown',
    airline: flight.airline_name || 'Unknown Airline',
    aircraft: flight.aircraft_icao || 'Information unavailable',
    altitude: flight.alt ? `${flight.alt} ft` : 'Data unavailable',
    speed: flight.speed ? `${flight.speed} mph` : 'Data unavailable',
    progress: calculateProgress(),
    lat: flight.lat,
    lng: flight.lng,
    direction: flight.dir,
    raw: flight
  };
};

const FlightTracker: React.FC = () => {
  const [selectedFlight, setSelectedFlight] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'map' | 'list'>('map');
  const [flights, setFlights] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [flightSearchQuery, setFlightSearchQuery] = useState('');
  const [selectedAirport, setSelectedAirport] = useState<SuggestResult | null>(null);
  const [searchBy, setSearchBy] = useState<'flight' | 'airport'>('flight');

  useEffect(() => {
    // Load initial flight data
    loadFlights();
  }, []);

  const loadFlights = async () => {
    setLoading(true);
    try {
      // Get live flights with positions
      const data = await fetchLiveFlights({ limit: "25" });
      
      // Format the flight data
      const formattedData = data.map(formatFlightData);
      
      // If we don't get enough data from the API, supplement with sample data
      if (formattedData.length < 2) {
        setFlights(sampleFlightData);
        
        if (formattedData.length === 0) {
          toast.info("Using sample data - API didn't return live flight results");
        } else {
          setFlights([...formattedData, ...sampleFlightData.slice(0, 4 - formattedData.length)]);
        }
      } else {
        setFlights(formattedData);
      }
    } catch (error) {
      console.error("Error loading flights:", error);
      toast.error("Failed to load flight data. Using sample data instead.");
      
      // Fallback to sample data
      setFlights(sampleFlightData);
    } finally {
      setLoading(false);
    }
  };

  const handleFlightSearch = async () => {
    if (!flightSearchQuery.trim()) {
      toast.info("Please enter a flight number to search");
      return;
    }
    
    setLoading(true);
    try {
      // Try to get the flight status by IATA code
      const flight = await fetchFlightStatus(flightSearchQuery.trim().toUpperCase());
      
      if (!flight) {
        toast.error(`No flight found with number ${flightSearchQuery}`);
        return;
      }
      
      const formattedFlight = formatFlightData(flight);
      
      // Check if we already have this flight in our list
      const existingIndex = flights.findIndex(f => f.id === formattedFlight.id);
      
      if (existingIndex !== -1) {
        // Update existing flight
        const updatedFlights = [...flights];
        updatedFlights[existingIndex] = formattedFlight;
        setFlights(updatedFlights);
      } else {
        // Add new flight to the top of the list
        setFlights([formattedFlight, ...flights]);
      }
      
      // Select the flight automatically
      setSelectedFlight(formattedFlight.id);
      
      toast.success(`Found flight ${formattedFlight.id}`);
    } catch (error) {
      console.error("Error searching flight:", error);
      toast.error("Failed to search for flights. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAirportSearch = async () => {
    if (!selectedAirport) {
      toast.info("Please select an airport to search");
      return;
    }
    
    setLoading(true);
    try {
      // Get flights departing from the selected airport
      let data: Flight[] = [];
      if (selectedAirport.iata_code) {
        data = await fetchLiveFlights({ dep_iata: selectedAirport.iata_code });
      }
      
      if (data.length === 0) {
        toast.info(`No active flights found from ${selectedAirport.name}`);
        return;
      }
      
      const formattedData = data.map(formatFlightData);
      setFlights(formattedData);
      
      toast.success(`Found ${formattedData.length} flights from ${selectedAirport.name}`);
    } catch (error) {
      console.error("Error searching airport:", error);
      toast.error("Failed to search for flights. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const viewFlightDetails = (flightId: string) => {
    setSelectedFlight(flightId);
    toast.info(`Viewing details for flight ${flightId}`);
  };

  return (
    <section id="tracker" className="py-12 w-full max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row items-start justify-between gap-8 px-4">
        <div className="w-full md:w-1/3">
          <div className="flex items-center gap-2 mb-6">
            <Plane className="text-purple h-6 w-6" />
            <h2 className="text-2xl font-semibold font-space">Flight Tracker</h2>
          </div>
          
          <div className="glass-panel p-4 mb-6">
            <div className="flex mb-4 gap-2">
              <Button
                variant={searchBy === 'flight' ? 'default' : 'outline'}
                size="sm"
                className={cn(
                  searchBy === 'flight' 
                    ? "bg-purple hover:bg-purple-600 text-white" 
                    : "bg-transparent border-gray-light text-gray-light hover:text-white"
                )}
                onClick={() => setSearchBy('flight')}
              >
                Flight Number
              </Button>
              <Button
                variant={searchBy === 'airport' ? 'default' : 'outline'}
                size="sm"
                className={cn(
                  searchBy === 'airport' 
                    ? "bg-purple hover:bg-purple-600 text-white" 
                    : "bg-transparent border-gray-light text-gray-light hover:text-white"
                )}
                onClick={() => setSearchBy('airport')}
              >
                Airport
              </Button>
            </div>
            
            <div className="flex flex-col gap-4 mb-4">
              {searchBy === 'flight' ? (
                <>
                  <Input
                    type="text"
                    placeholder="Enter flight number (e.g., BA189)"
                    value={flightSearchQuery}
                    onChange={(e) => setFlightSearchQuery(e.target.value.toUpperCase())}
                    className="bg-gray-dark/50 border-gray-dark text-white placeholder:text-gray-light focus:border-purple"
                    onKeyDown={(e) => e.key === 'Enter' && handleFlightSearch()}
                  />
                  
                  <Button 
                    className="w-full bg-purple hover:bg-purple-600 text-white purple-glow"
                    onClick={handleFlightSearch}
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
                    Search Flight
                  </Button>
                </>
              ) : (
                <>
                  <div>
                    <AutocompleteSearch 
                      placeholder="Search airport by name or code" 
                      onSelect={setSelectedAirport}
                      type="airport"
                    />
                    {selectedAirport && (
                      <div className="mt-2 text-sm">
                        <span className="bg-purple/20 text-purple-200 px-2 py-1 rounded">
                          {selectedAirport.name} ({selectedAirport.iata_code})
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    className="w-full bg-purple hover:bg-purple-600 text-white purple-glow"
                    onClick={handleAirportSearch}
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
                    Search Airport
                  </Button>
                </>
              )}
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Active Flights</h3>
              <button 
                className="text-purple flex items-center gap-1 text-sm"
                onClick={loadFlights}
                disabled={loading}
              >
                {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Filter size={14} />}
                Refresh
              </button>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple"></div>
              </div>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {flights.length > 0 ? (
                  flights.map((flight) => (
                    <button
                      key={flight.id}
                      className={cn(
                        "w-full text-left p-3 rounded-lg transition-all duration-300",
                        selectedFlight === flight.id 
                          ? "bg-purple/20 border border-purple/40" 
                          : "bg-white/5 border border-white/10 hover:bg-white/10"
                      )}
                      onClick={() => setSelectedFlight(flight.id)}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{flight.id}</span>
                        <span className="text-xs px-2 py-1 rounded-full bg-purple/20 text-purple-200">In Air</span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-gray-light text-sm mt-1">
                        <span>{flight.from}</span>
                        <Plane size={12} className="rotate-90 mx-1" />
                        <span>{flight.to}</span>
                      </div>
                      
                      <div className="mt-2">
                        <div className="h-1.5 w-full bg-gray-dark/60 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-purple-700 to-purple rounded-full"
                            style={{ width: `${flight.progress}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs mt-1">
                          <span>{flight.progress}%</span>
                          <span>{flight.airline}</span>
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-center text-gray-light py-4">
                    No active flights found. Try searching for a specific flight.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="w-full md:w-2/3">
          <div className="flex gap-2 mb-4">
            <Button
              variant={activeTab === 'map' ? 'default' : 'outline'}
              className={cn(
                activeTab === 'map' 
                  ? "bg-purple hover:bg-purple-600 text-white" 
                  : "bg-transparent border-gray-light text-gray-light hover:text-white"
              )}
              onClick={() => setActiveTab('map')}
            >
              Map View
            </Button>
            <Button
              variant={activeTab === 'list' ? 'default' : 'outline'}
              className={cn(
                activeTab === 'list' 
                  ? "bg-purple hover:bg-purple-600 text-white" 
                  : "bg-transparent border-gray-light text-gray-light hover:text-white"
              )}
              onClick={() => setActiveTab('list')}
            >
              List View
            </Button>
          </div>
          
          {activeTab === 'map' ? (
            <div className="glass-panel p-0 overflow-hidden rounded-2xl h-[400px] relative">
              {/* World map visualization */}
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center opacity-30"></div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-dark/80 to-transparent"></div>
              
              {/* Loading indicator */}
              {loading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple"></div>
                </div>
              ) : (
                /* Flight routes visualization */
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg text-gray-light">Interactive flight map visualization</span>
                </div>
              )}
              
              {/* Flight information panel */}
              {selectedFlight && !loading && (
                <div className="absolute bottom-4 left-4 right-4 glass-panel p-4 bg-panel/90">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-lg">
                        {flights.find(f => f.id === selectedFlight)?.id} • {flights.find(f => f.id === selectedFlight)?.airline}
                      </h4>
                      <div className="flex items-center text-sm mt-1">
                        <MapPin size={14} className="text-purple mr-1" />
                        <span>
                          {flights.find(f => f.id === selectedFlight)?.from} to {flights.find(f => f.id === selectedFlight)?.to}
                        </span>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="bg-transparent border-purple/50 text-purple hover:bg-purple/20"
                      onClick={() => viewFlightDetails(selectedFlight)}
                    >
                      <Info size={14} className="mr-1" /> Details
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                    <div className="bg-white/5 p-2 rounded-lg">
                      <div className="text-xs text-gray-light">Aircraft</div>
                      <div className="font-medium">{flights.find(f => f.id === selectedFlight)?.aircraft}</div>
                    </div>
                    <div className="bg-white/5 p-2 rounded-lg">
                      <div className="text-xs text-gray-light">Altitude</div>
                      <div className="font-medium">{flights.find(f => f.id === selectedFlight)?.altitude}</div>
                    </div>
                    <div className="bg-white/5 p-2 rounded-lg">
                      <div className="text-xs text-gray-light">Speed</div>
                      <div className="font-medium">{flights.find(f => f.id === selectedFlight)?.speed}</div>
                    </div>
                    <div className="bg-white/5 p-2 rounded-lg">
                      <div className="text-xs text-gray-light">Progress</div>
                      <div className="font-medium">{flights.find(f => f.id === selectedFlight)?.progress}%</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-panel overflow-hidden">
              {loading ? (
                <div className="flex justify-center items-center p-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple"></div>
                </div>
              ) : (
                <div className="relative overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-dark/50 text-xs md:text-sm font-medium text-gray-light border-b border-white/10">
                      <tr>
                        <th className="px-4 py-3">Flight</th>
                        <th className="px-4 py-3">Route</th>
                        <th className="px-4 py-3">Airline</th>
                        <th className="px-4 py-3">Aircraft</th>
                        <th className="px-4 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {flights.length > 0 ? (
                        flights.map((flight) => (
                          <tr 
                            key={flight.id} 
                            className={cn(
                              "border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer",
                              selectedFlight === flight.id ? "bg-purple/10" : ""
                            )}
                            onClick={() => setSelectedFlight(flight.id)}
                          >
                            <td className="px-4 py-3 font-medium">{flight.id}</td>
                            <td className="px-4 py-3">{flight.from} → {flight.to}</td>
                            <td className="px-4 py-3">{flight.airline}</td>
                            <td className="px-4 py-3">{flight.aircraft}</td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-900/30 text-green-400">
                                In Air ({flight.progress}%)
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-4 py-6 text-center text-gray-light">
                            No flights found. Try searching for a specific flight.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FlightTracker;
