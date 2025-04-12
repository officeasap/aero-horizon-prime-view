
import React, { useState } from 'react';
import { Search, Loader2, Building, Plane, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { fetchAirports, fetchAirlines, Airport, Airline } from '@/services/aviationService';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AirportAirlineSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'airport' | 'airline'>('airport');
  const [isLoading, setIsLoading] = useState(false);
  const [airports, setAirports] = useState<Airport[]>([]);
  const [airlines, setAirlines] = useState<Airline[]>([]);
  const [selectedItem, setSelectedItem] = useState<Airport | Airline | null>(null);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast.error("Please enter a search term");
      return;
    }

    setIsLoading(true);
    try {
      if (searchType === 'airport') {
        const data = await fetchAirports({
          name: searchTerm.trim(),
          limit: "25"
        });
        
        setAirports(data);
        setAirlines([]);
        
        if (data.length === 0) {
          toast.info("No airports found matching your search");
        } else {
          toast.success(`Found ${data.length} airports`);
        }
      } else {
        const data = await fetchAirlines({
          name: searchTerm.trim(),
          limit: "25"
        });
        
        setAirlines(data);
        setAirports([]);
        
        if (data.length === 0) {
          toast.info("No airlines found matching your search");
        } else {
          toast.success(`Found ${data.length} airlines`);
        }
      }
    } catch (error) {
      console.error(`Error searching for ${searchType}s:`, error);
      toast.error(`Failed to search for ${searchType}s. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleItemSelect = (item: Airport | Airline) => {
    setSelectedItem(item);
    toast.success(`Selected ${searchType}: ${item.name}`);
  };

  return (
    <section className="py-12 max-w-6xl mx-auto">
      <div className="px-4">
        <h2 className="text-2xl font-semibold font-space mb-6">Airport & Airline Information</h2>
        
        <div className="glass-panel p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                type="text"
                placeholder={`Search ${searchType === 'airport' ? 'airports' : 'airlines'} by name or code`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-dark/50 border-gray-dark text-white placeholder:text-gray-light focus:border-purple"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-transparent border-gray-light text-gray-light hover:text-white min-w-32">
                  {searchType === 'airport' ? (
                    <>
                      <Building className="mr-2 h-4 w-4" />
                      Airports
                    </>
                  ) : (
                    <>
                      <Plane className="mr-2 h-4 w-4" />
                      Airlines
                    </>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-dark border-gray-600 text-white">
                <DropdownMenuLabel>Search Type</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-600" />
                <DropdownMenuItem 
                  className={cn(
                    "cursor-pointer hover:bg-white/10",
                    searchType === 'airport' && "bg-white/5 text-purple-200"
                  )}
                  onClick={() => setSearchType('airport')}
                >
                  <Building className="mr-2 h-4 w-4" />
                  Airports
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={cn(
                    "cursor-pointer hover:bg-white/10",
                    searchType === 'airline' && "bg-white/5 text-purple-200"
                  )}
                  onClick={() => setSearchType('airline')}
                >
                  <Plane className="mr-2 h-4 w-4" />
                  Airlines
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button 
              className="bg-purple hover:bg-purple-600 text-white"
              onClick={handleSearch}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
              Search
            </Button>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-purple" />
            </div>
          ) : airports.length > 0 || airlines.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-dark/70 border-b border-white/10">
                  <tr>
                    {searchType === 'airport' ? (
                      <>
                        <th className="px-4 py-3 text-left">Name</th>
                        <th className="px-4 py-3 text-left">IATA / ICAO</th>
                        <th className="px-4 py-3 text-left">Location</th>
                        <th className="px-4 py-3 text-left">Timezone</th>
                        <th className="px-4 py-3 text-left">Actions</th>
                      </>
                    ) : (
                      <>
                        <th className="px-4 py-3 text-left">Name</th>
                        <th className="px-4 py-3 text-left">IATA / ICAO</th>
                        <th className="px-4 py-3 text-left">Country</th>
                        <th className="px-4 py-3 text-left">Fleet Size</th>
                        <th className="px-4 py-3 text-left">Actions</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {searchType === 'airport' ? (
                    airports.map((airport, index) => (
                      <tr 
                        key={`airport-${airport.iata_code}-${index}`}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="px-4 py-3">{airport.name}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {airport.iata_code && (
                              <span className="bg-blue-900/30 text-blue-400 px-2.5 py-1 rounded text-xs">
                                {airport.iata_code}
                              </span>
                            )}
                            {airport.icao_code && (
                              <span className="bg-purple/20 text-purple-200 px-2.5 py-1 rounded text-xs">
                                {airport.icao_code}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {airport.city_code && `${airport.city_code}, `}{airport.country_code}
                        </td>
                        <td className="px-4 py-3">{airport.timezone || 'Unknown'}</td>
                        <td className="px-4 py-3">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="bg-transparent hover:bg-white/10"
                            onClick={() => handleItemSelect(airport)}
                          >
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    airlines.map((airline, index) => (
                      <tr 
                        key={`airline-${airline.iata_code}-${index}`}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="px-4 py-3">{airline.name}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {airline.iata_code && (
                              <span className="bg-blue-900/30 text-blue-400 px-2.5 py-1 rounded text-xs">
                                {airline.iata_code}
                              </span>
                            )}
                            {airline.icao_code && (
                              <span className="bg-purple/20 text-purple-200 px-2.5 py-1 rounded text-xs">
                                {airline.icao_code}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">{airline.country_name || airline.country_code || 'Unknown'}</td>
                        <td className="px-4 py-3">{airline.fleet_size || 'Unknown'}</td>
                        <td className="px-4 py-3">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="bg-transparent hover:bg-white/10"
                            onClick={() => handleItemSelect(airline)}
                          >
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-light">
              <AlertCircle className="mx-auto h-10 w-10 mb-3 text-gray-light/70" />
              <p>Search for {searchType === 'airport' ? 'airports' : 'airlines'} by name or code to see results.</p>
            </div>
          )}
        </div>
        
        {selectedItem && (
          <div className="glass-panel p-6">
            <h3 className="text-xl font-semibold mb-4">{selectedItem.name} Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {'lat' in selectedItem ? (
                // Airport details
                <>
                  <div className="bg-white/5 p-4 rounded-lg">
                    <h4 className="text-sm text-gray-light mb-2">Identification</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-xs text-gray-light">IATA</div>
                        <div className="font-medium">{selectedItem.iata_code || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-light">ICAO</div>
                        <div className="font-medium">{selectedItem.icao_code || 'N/A'}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 p-4 rounded-lg">
                    <h4 className="text-sm text-gray-light mb-2">Location</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-xs text-gray-light">City</div>
                        <div className="font-medium">{selectedItem.city || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-light">Country</div>
                        <div className="font-medium">{selectedItem.country_code || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-light">Latitude</div>
                        <div className="font-medium">{selectedItem.lat}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-light">Longitude</div>
                        <div className="font-medium">{selectedItem.lng}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 p-4 rounded-lg">
                    <h4 className="text-sm text-gray-light mb-2">Information</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-xs text-gray-light">Timezone</div>
                        <div className="font-medium">{selectedItem.timezone || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-light">Phone</div>
                        <div className="font-medium">{selectedItem.phone || 'N/A'}</div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-xs text-gray-light">Website</div>
                        <div className="font-medium truncate">
                          {selectedItem.website ? (
                            <a 
                              href={selectedItem.website.startsWith('http') ? selectedItem.website : `https://${selectedItem.website}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-purple hover:underline"
                            >
                              {selectedItem.website}
                            </a>
                          ) : 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                // Airline details
                <>
                  <div className="bg-white/5 p-4 rounded-lg">
                    <h4 className="text-sm text-gray-light mb-2">Identification</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-xs text-gray-light">IATA</div>
                        <div className="font-medium">{selectedItem.iata_code || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-light">ICAO</div>
                        <div className="font-medium">{selectedItem.icao_code || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-light">Callsign</div>
                        <div className="font-medium">{selectedItem.callsign || 'N/A'}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 p-4 rounded-lg">
                    <h4 className="text-sm text-gray-light mb-2">Fleet</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-xs text-gray-light">Fleet Size</div>
                        <div className="font-medium">{selectedItem.fleet_size || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-light">Avg. Fleet Age</div>
                        <div className="font-medium">
                          {selectedItem.fleet_average_age ? `${selectedItem.fleet_average_age} years` : 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 p-4 rounded-lg col-span-1 md:col-span-2">
                    <h4 className="text-sm text-gray-light mb-2">Location</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-xs text-gray-light">Country</div>
                        <div className="font-medium">{selectedItem.country_name || selectedItem.country_code || 'N/A'}</div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <div className="flex justify-center mt-6">
              <Button 
                className="bg-purple hover:bg-purple-600 text-white"
                onClick={() => setSelectedItem(null)}
              >
                Close Details
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AirportAirlineSearch;
