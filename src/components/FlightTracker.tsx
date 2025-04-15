import React, { useState, useEffect } from 'react';
import { fetchLiveFlights, Flight, SuggestResult } from '@/services/aviationService';
import { Loader2, Plane, ArrowRight, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import AutocompleteSearch from '@/components/AutocompleteSearch';
import { toast } from 'sonner';

const FlightTracker = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAirport, setSelectedAirport] = useState<SuggestResult | null>(null);

  // Fetch flights on component mount
  useEffect(() => {
    const loadFlights = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // If an airport is selected, fetch flights for that airport
        const params: Record<string, string> = {};
        if (selectedAirport && selectedAirport.iata_code) {
          if (selectedAirport.type === 'airport') {
            params.dep_iata = selectedAirport.iata_code;
          }
        }
        
        console.log('Fetching flights with params:', params);
        const data = await fetchLiveFlights(params);
        
        if (data.length === 0) {
          setError('No active flights found right now. Please try again later.');
        } else {
          setFlights(data);
          setFilteredFlights(data);
          console.log(`Successfully loaded ${data.length} flights`);
        }
      } catch (err) {
        console.error('Error fetching flights:', err);
        setError('Failed to load flight data. Please try again later.');
        toast.error('Failed to load flight data');
      } finally {
        setIsLoading(false);
      }
    };

    loadFlights();
    
    // Set up interval to refresh data every 60 seconds
    const interval = setInterval(() => {
      loadFlights();
    }, 60000);
    
    return () => clearInterval(interval);
  }, [selectedAirport]);

  // Filter flights based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredFlights(flights);
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
  }, [searchTerm, flights]);

  const handleAirportSelect = (item: SuggestResult) => {
    setSelectedAirport(item);
    toast.success(`Selected ${item.name}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const getFlightStatus = (flight: Flight) => {
    if (!flight.status) return 'Unknown';
    
    switch (flight.status.toLowerCase()) {
      case 'en-route':
        return 'In Flight';
      case 'landed':
        return 'Landed';
      case 'scheduled':
        return 'Scheduled';
      case 'delayed':
        return 'Delayed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return flight.status;
    }
  };

  return (
    <section className="py-10 container mx-auto px-4">
      <Card className="bg-gray-dark/60 border-gray-light/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Plane className="text-purple" />
            <span>Live Flight Tracker</span>
          </CardTitle>
          
          <div className="flex flex-col md:flex-row gap-4 mt-4">
            <div className="flex-1">
              <AutocompleteSearch 
                onSelect={handleAirportSelect} 
                placeholder="Search for departure airport..."
                type="airport"
                className="w-full"
              />
            </div>
            
            <div className="relative w-full md:w-64">
              <Input
                type="text"
                placeholder="Search by flight #, airline, or airport..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="bg-gray-dark/50 border-gray-dark text-white pl-9"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-light" />
            </div>
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
                onClick={() => window.location.reload()} 
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
                    <span className="text-sm text-gray-light">Showing flights departing from:</span>
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
                        <TableHead className="text-purple w-40">Flight</TableHead>
                        <TableHead className="text-purple">Route</TableHead>
                        <TableHead className="text-purple text-right">Altitude</TableHead>
                        <TableHead className="text-purple text-right">Speed</TableHead>
                        <TableHead className="text-purple text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredFlights.slice(0, 50).map((flight, index) => (
                        <TableRow key={`${flight.flight_icao || flight.flight_iata || 'unknown'}-${index}`} className="hover:bg-white/5">
                          <TableCell className="font-medium">
                            <div className="flex flex-col">
                              <span>{flight.airline_name || (flight.airline_iata ? `${flight.airline_iata} Airlines` : 'Airline information unavailable')}</span>
                              <span className="text-sm text-gray-light">{flight.flight_iata || flight.flight_icao || 'Unknown'}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="font-mono">{flight.dep_iata || 'N/A'}</span>
                              <ArrowRight className="h-3 w-3 text-gray-light" />
                              <span className="font-mono">{flight.arr_iata || 'N/A'}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            {flight.alt ? `${Math.round(flight.alt).toLocaleString()} ft` : 'N/A'}
                          </TableCell>
                          <TableCell className="text-right">
                            {flight.speed ? `${Math.round(flight.speed)} kts` : 'N/A'}
                          </TableCell>
                          <TableCell className="text-right">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              flight.status === 'en-route' ? 'bg-green-500/20 text-green-400' : 
                              flight.status === 'landed' ? 'bg-blue-500/20 text-blue-400' :
                              flight.status === 'delayed' ? 'bg-amber-500/20 text-amber-400' :
                              flight.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                              'bg-gray-500/20 text-gray-400'
                            }`}>
                              {getFlightStatus(flight)}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  {filteredFlights.length > 50 && (
                    <div className="text-center py-4 text-sm text-gray-light">
                      Showing top 50 results of {filteredFlights.length} total flights
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </section>
  );
};

export default FlightTracker;
