import React, { useState, useEffect } from 'react';
import { Search, Loader2, Building, Plane, AlertCircle, MapPin, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { 
  fetchAirports, 
  fetchAirlines, 
  fetchComprehensiveAirports,
  fetchComprehensiveAirlines,
  fetchAirportByIATA,
  Airport, 
  Airline 
} from '@/services/aviationService';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const africanCountryCodes = [
  "DZ", "AO", "BJ", "BW", "BF", "BI", "CM", "CV", "CF", "TD", "KM", "CG", "CD", 
  "DJ", "EG", "GQ", "ER", "ET", "GA", "GM", "GH", "GN", "GW", "CI", "KE", "LS", 
  "LR", "LY", "MG", "MW", "ML", "MR", "MU", "MA", "MZ", "NA", "NE", "NG", "RW", 
  "ST", "SN", "SC", "SL", "SO", "ZA", "SS", "SD", "SZ", "TZ", "TG", "TN", "UG", 
  "ZM", "ZW"
];

const AirportAirlineSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'airport' | 'airline'>('airport');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [airports, setAirports] = useState<Airport[]>([]);
  const [airlines, setAirlines] = useState<Airline[]>([]);
  const [displayedAirports, setDisplayedAirports] = useState<Airport[]>([]);
  const [displayedAirlines, setDisplayedAirlines] = useState<Airline[]>([]);
  const [selectedItem, setSelectedItem] = useState<Airport | Airline | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchType, selectedRegion, airports, airlines]);

  const loadInitialData = async () => {
    setIsInitialLoading(true);
    try {
      const airportData = await fetchComprehensiveAirports();
      const airlineData = await fetchComprehensiveAirlines();
      
      setAirports(airportData);
      setAirlines(airlineData);
      setDisplayedAirports(airportData.slice(0, itemsPerPage));
      setDisplayedAirlines(airlineData.slice(0, itemsPerPage));
      
      toast.success(`Loaded ${airportData.length} airports and ${airlineData.length} airlines`);
    } catch (error) {
      console.error("Error loading initial data:", error);
      toast.error("Failed to load aviation data. Please try again.");
    } finally {
      setIsInitialLoading(false);
    }
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      await loadInitialData();
      toast.success("Aviation data refreshed successfully");
    } finally {
      setIsRefreshing(false);
    }
  };

  const applyFilters = () => {
    if (searchType === 'airport') {
      let filtered = [...airports];
      
      if (selectedRegion === 'africa') {
        filtered = filtered.filter(airport => 
          africanCountryCodes.includes(airport.country_code)
        );
      }
      
      if (searchTerm) {
        filtered = filtered.filter(airport => 
          (airport.name && airport.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (airport.iata_code && airport.iata_code.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (airport.icao_code && airport.icao_code.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (airport.city && airport.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (airport.country_code && airport.country_code.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }
      
      setDisplayedAirports(filtered.slice(0, itemsPerPage));
    } else {
      let filtered = [...airlines];
      
      if (selectedRegion === 'africa') {
        filtered = filtered.filter(airline => 
          africanCountryCodes.includes(airline.country_code || '')
        );
      }
      
      if (searchTerm) {
        filtered = filtered.filter(airline => 
          (airline.name && airline.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (airline.iata_code && airline.iata_code.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (airline.icao_code && airline.icao_code.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (airline.country_name && airline.country_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (airline.country_code && airline.country_code.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }
      
      setDisplayedAirlines(filtered.slice(0, itemsPerPage));
    }
  };

  const checkForIATACode = async () => {
    const formattedSearch = searchTerm.trim().toUpperCase();
    if (/^[A-Z]{3}$/.test(formattedSearch) && searchType === 'airport') {
      setIsLoading(true);
      try {
        console.log(`Checking for IATA code: ${formattedSearch}`);
        const airport = await fetchAirportByIATA(formattedSearch);
        
        if (airport) {
          console.log(`Found airport for IATA ${formattedSearch}:`, airport);
          setDisplayedAirports([airport]);
          toast.success(`Found airport with IATA code ${formattedSearch}`);
          return true;
        } else {
          console.error(`No airport found for IATA code: ${formattedSearch}`);
          toast.error(`No airport found with IATA code "${formattedSearch}"`);
          setDisplayedAirports([]);
        }
      } catch (error) {
        console.error(`Error fetching IATA code ${formattedSearch}:`, error);
        toast.error(`Error searching for IATA code "${formattedSearch}"`);
        setDisplayedAirports([]);
      } finally {
        setIsLoading(false);
      }
    }
    return false;
  };

  const handleSearch = async () => {
    if (!searchTerm.trim() && !selectedRegion) {
      toast.info("Please enter a search term or select a region");
      return;
    }

    setIsLoading(true);
    setSearchPerformed(true);
    
    try {
      const isIATAFound = await checkForIATACode();
      
      if (!isIATAFound) {
        applyFilters();
      }
      
      if (searchType === 'airport') {
        if (displayedAirports.length === 0) {
          if (searchTerm.trim().length === 3) {
            toast.info(`No airport found with IATA code ${searchTerm.trim().toUpperCase()}`);
          } else {
            toast.info("No airports found matching your criteria");
          }
        } else {
          toast.success(`Found ${displayedAirports.length} airports`);
        }
      } else {
        if (displayedAirlines.length === 0) {
          toast.info("No airlines found matching your criteria");
        } else {
          toast.success(`Found ${displayedAirlines.length} airlines`);
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

  const handleRegionSelect = (region: string) => {
    setSelectedRegion(region);
  };

  const showMoreResults = () => {
    if (searchType === 'airport') {
      const filteredAirports = airports.filter(airport => {
        if (selectedRegion === 'africa' && !africanCountryCodes.includes(airport.country_code)) {
          return false;
        }
        
        if (searchTerm) {
          return (
            (airport.name && airport.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (airport.iata_code && airport.iata_code.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (airport.icao_code && airport.icao_code.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (airport.city && airport.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (airport.country_code && airport.country_code.toLowerCase().includes(searchTerm.toLowerCase()))
          );
        }
        
        return true;
      });
      
      setDisplayedAirports(filteredAirports.slice(0, displayedAirports.length + itemsPerPage));
    } else {
      const filteredAirlines = airlines.filter(airline => {
        if (selectedRegion === 'africa' && !africanCountryCodes.includes(airline.country_code || '')) {
          return false;
        }
        
        if (searchTerm) {
          return (
            (airline.name && airline.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (airline.iata_code && airline.iata_code.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (airline.icao_code && airline.icao_code.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (airline.country_name && airline.country_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (airline.country_code && airline.country_code.toLowerCase().includes(searchTerm.toLowerCase()))
          );
        }
        
        return true;
      });
      
      setDisplayedAirlines(filteredAirlines.slice(0, displayedAirlines.length + itemsPerPage));
    }
  };

  return (
    <section className="py-12 max-w-6xl mx-auto">
      <div className="px-4">
        <h2 className="text-2xl font-semibold font-space mb-6">
          Global Aviation Directory
          <span className="text-purple ml-2">
            {searchType === 'airport' ? 'Airports' : 'Airlines'}
          </span>
        </h2>
        
        <div className="glass-panel p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder={`Search ${searchType === 'airport' ? 'airports' : 'airlines'} by name, IATA code, city or country...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-dark/50 border-gray-dark text-white placeholder:text-gray-light focus:border-purple"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              {searchType === 'airport' && searchTerm.trim().length === 3 && (
                <p className="mt-1 text-xs text-purple-200">
                  Pro tip: 3-letter codes like NBO, EBB, LOS, DXB, JFK will perform exact IATA lookups
                </p>
              )}
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
            
            <Button
              variant="outline"
              size="icon"
              className="bg-transparent border-gray-600 hover:bg-white/5"
              onClick={refreshData}
              disabled={isRefreshing}
            >
              <RefreshCw className={cn(
                "h-4 w-4", 
                isRefreshing && "animate-spin"
              )} />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              variant={selectedRegion === '' ? "default" : "outline"}
              size="sm"
              onClick={() => handleRegionSelect('')}
              className={cn(
                selectedRegion === '' ? "bg-purple hover:bg-purple-600" : "bg-transparent border-gray-600 hover:bg-white/5"
              )}
            >
              All Regions
            </Button>
            
            <Button
              variant={selectedRegion === 'africa' ? "default" : "outline"}
              size="sm"
              onClick={() => handleRegionSelect('africa')}
              className={cn(
                selectedRegion === 'africa' ? "bg-purple hover:bg-purple-600" : "bg-transparent border-gray-600 hover:bg-white/5"
              )}
            >
              <MapPin className="h-3.5 w-3.5 mr-1" />
              Africa
            </Button>
          </div>
          
          {isInitialLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="flex flex-col items-center">
                <Loader2 className="h-12 w-12 animate-spin text-purple mb-4" />
                <p className="text-gray-light">Loading aviation database...</p>
              </div>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-purple" />
            </div>
          ) : searchType === 'airport' && displayedAirports.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-dark/70 border-b border-white/10">
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>IATA / ICAO</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Timezone</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedAirports.map((airport, index) => (
                    <TableRow 
                      key={`airport-${airport.iata_code || airport.icao_code || index}`}
                      className={cn(
                        "border-b border-white/5 hover:bg-white/5 transition-colors",
                        africanCountryCodes.includes(airport.country_code) && 'bg-purple/[0.03]'
                      )}
                    >
                      <TableCell className="font-medium">{airport.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {airport.iata_code && (
                            <span className={cn(
                              "bg-blue-900/30 text-blue-400 px-2.5 py-1 rounded text-xs",
                              africanCountryCodes.includes(airport.country_code) && "bg-purple/20 text-purple-200"
                            )}>
                              {airport.iata_code}
                            </span>
                          )}
                          {airport.icao_code && (
                            <span className="bg-gray-600/20 text-gray-200 px-2.5 py-1 rounded text-xs">
                              {airport.icao_code}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {airport.city ? `${airport.city}, ` : ''}{airport.country_code}
                      </TableCell>
                      <TableCell>{airport.timezone || 'Unknown'}</TableCell>
                      <TableCell>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="bg-transparent hover:bg-white/10"
                          onClick={() => handleItemSelect(airport)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {displayedAirports.length < airports.filter(a => 
                (selectedRegion !== 'africa' || africanCountryCodes.includes(a.country_code)) &&
                (!searchTerm || 
                  (a.name && a.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                  (a.iata_code && a.iata_code.toLowerCase().includes(searchTerm.toLowerCase())) ||
                  (a.icao_code && a.icao_code.toLowerCase().includes(searchTerm.toLowerCase())) ||
                  (a.city && a.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
                  (a.country_code && a.country_code.toLowerCase().includes(searchTerm.toLowerCase()))
                )
              ).length && (
                <div className="flex justify-center mt-4">
                  <Button 
                    variant="outline"
                    onClick={showMoreResults}
                    className="bg-transparent border-purple/50 text-purple hover:bg-purple/10"
                  >
                    Show More Results
                  </Button>
                </div>
              )}
            </div>
          ) : searchType === 'airline' && displayedAirlines.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-dark/70 border-b border-white/10">
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>IATA / ICAO</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Fleet Size</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedAirlines.map((airline, index) => (
                    <TableRow 
                      key={`airline-${airline.iata_code || airline.icao_code || index}`}
                      className={cn(
                        "border-b border-white/5 hover:bg-white/5 transition-colors",
                        africanCountryCodes.includes(airline.country_code || '') && 'bg-purple/[0.03]'
                      )}
                    >
                      <TableCell className="font-medium">{airline.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {airline.iata_code && (
                            <span className={cn(
                              "bg-blue-900/30 text-blue-400 px-2.5 py-1 rounded text-xs",
                              africanCountryCodes.includes(airline.country_code || '') && "bg-purple/20 text-purple-200"
                            )}>
                              {airline.iata_code}
                            </span>
                          )}
                          {airline.icao_code && (
                            <span className="bg-gray-600/20 text-gray-200 px-2.5 py-1 rounded text-xs">
                              {airline.icao_code}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{airline.country_name || airline.country_code || 'Unknown'}</TableCell>
                      <TableCell>{airline.fleet_size || 'Unknown'}</TableCell>
                      <TableCell>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="bg-transparent hover:bg-white/10"
                          onClick={() => handleItemSelect(airline)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {displayedAirlines.length < airlines.filter(a => 
                (selectedRegion !== 'africa' || africanCountryCodes.includes(a.country_code || '')) &&
                (!searchTerm || 
                  (a.name && a.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                  (a.iata_code && a.iata_code.toLowerCase().includes(searchTerm.toLowerCase())) ||
                  (a.icao_code && a.icao_code.toLowerCase().includes(searchTerm.toLowerCase())) ||
                  (a.country_name && a.country_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                  (a.country_code && a.country_code.toLowerCase().includes(searchTerm.toLowerCase()))
                )
              ).length && (
                <div className="flex justify-center mt-4">
                  <Button 
                    variant="outline"
                    onClick={showMoreResults}
                    className="bg-transparent border-purple/50 text-purple hover:bg-purple/10"
                  >
                    Show More Results
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-light">
              <AlertCircle className="mx-auto h-10 w-10 mb-3 text-gray-light/70" />
              <p>
                {searchPerformed ? (
                  <>
                    {searchTerm.length === 3 && searchType === 'airport' ? (
                      <>No airport found with IATA code "{searchTerm.toUpperCase()}"</>
                    ) : (
                      <>No {searchType === 'airport' ? 'airports' : 'airlines'} found matching your criteria</>
                    )}
                  </>
                ) : (
                  <>Search for {searchType === 'airport' ? 'airports' : 'airlines'} by name, code, city or country to see results.</>
                )}
              </p>
              <p className="mt-2 text-sm">
                {searchType === 'airport' 
                  ? 'Our database includes comprehensive global coverage including major African hubs.' 
                  : 'Our database includes airlines from all regions including African carriers.'}
              </p>
            </div>
          )}
        </div>
        
        {selectedItem && (
          <div className="glass-panel p-6">
            <h3 className="text-xl font-semibold mb-4">{selectedItem.name} Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {'lat' in selectedItem ? (
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
                      {selectedItem.logo && (
                        <div>
                          <div className="text-xs text-gray-light">Logo</div>
                          <img 
                            src={selectedItem.logo} 
                            alt={`${selectedItem.name} logo`} 
                            className="max-h-8 mt-1"
                            onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
                          />
                        </div>
                      )}
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
