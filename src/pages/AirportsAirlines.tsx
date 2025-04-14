
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Search, Building2, Plane, MapPin, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  fetchAirportsAndAirlines, 
  fetchComprehensiveAirports,
  fetchComprehensiveAirlines,
  fetchAirportByIATA,
  searchAirportsByRegion,
  Airport, 
  Airline 
} from '@/services/aviationService';
import { toast } from 'sonner';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const regions = [
  { name: "Africa", code: "africa" },
  { name: "Asia", code: "asia" },
  { name: "Europe", code: "europe" },
  { name: "Middle East", code: "middle east" },
  { name: "North America", code: "north america" },
  { name: "Oceania", code: "oceania" },
  { name: "South America", code: "south america" }
];

const africanCountryCodes = [
  "DZ", "AO", "BJ", "BW", "BF", "BI", "CM", "CV", "CF", "TD", "KM", "CG", "CD", 
  "DJ", "EG", "GQ", "ER", "ET", "GA", "GM", "GH", "GN", "GW", "CI", "KE", "LS", 
  "LR", "LY", "MG", "MW", "ML", "MR", "MU", "MA", "MZ", "NA", "NE", "NG", "RW", 
  "ST", "SN", "SC", "SL", "SO", "ZA", "SS", "SD", "SZ", "TZ", "TG", "TN", "UG", 
  "ZM", "ZW"
];

const AirportsAirlines = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('airports');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [airportData, setAirportData] = useState<Airport[]>([]);
  const [airlineData, setAirlineData] = useState<Airline[]>([]);
  const [filteredAirports, setFilteredAirports] = useState<Airport[]>([]);
  const [filteredAirlines, setFilteredAirlines] = useState<Airline[]>([]);
  const [page, setPage] = useState(1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const itemsPerPage = 15;
  
  useEffect(() => {
    loadComprehensiveData();
  }, []);
  
  useEffect(() => {
    if (activeTab === 'airports') {
      applyFilters();
    } else {
      filterAirlines();
    }
  }, [activeTab, selectedRegion, airportData, airlineData, page]);
  
  const loadComprehensiveData = async () => {
    setInitialLoading(true);
    try {
      const airports = await fetchComprehensiveAirports();
      setAirportData(airports);
      setFilteredAirports(airports.slice(0, itemsPerPage));
      
      const airlines = await fetchComprehensiveAirlines();
      setAirlineData(airlines);
      setFilteredAirlines(airlines.slice(0, itemsPerPage));
      
      toast.success(`Loaded ${airports.length} airports and ${airlines.length} airlines`);
    } catch (error) {
      console.error("Error loading comprehensive data:", error);
      toast.error("Failed to load comprehensive aviation data");
    } finally {
      setInitialLoading(false);
    }
  };
  
  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      await loadComprehensiveData();
      toast.success("Aviation data refreshed successfully");
    } finally {
      setIsRefreshing(false);
    }
  };
  
  const applyFilters = () => {
    setLoading(true);
    try {
      let filtered = [...airportData];
      
      if (searchTerm) {
        filtered = filtered.filter(airport => 
          (airport.name && airport.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (airport.iata_code && airport.iata_code.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (airport.icao_code && airport.icao_code.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (airport.city && airport.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (airport.country_code && airport.country_code.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }
      
      if (selectedRegion === 'africa') {
        filtered = filtered.filter(airport => 
          africanCountryCodes.includes(airport.country_code)
        );
      } else if (selectedRegion) {
        filtered = filtered.filter(airport => {
          const countryCode = airport.country_code?.toLowerCase() || '';
          const city = airport.city?.toLowerCase() || '';
          const name = airport.name.toLowerCase();
          
          return countryCode.includes(selectedRegion.toLowerCase()) || 
                 city.includes(selectedRegion.toLowerCase()) || 
                 name.includes(selectedRegion.toLowerCase());
        });
      }
      
      setFilteredAirports(filtered.slice(0, page * itemsPerPage));
      
      if (filtered.length === 0 && searchTerm && searchPerformed) {
        toast.info("No airports found matching your criteria");
      }
    } finally {
      setLoading(false);
    }
  };
  
  const filterAirlines = () => {
    setLoading(true);
    try {
      let filtered = [...airlineData];
      
      if (searchTerm) {
        filtered = filtered.filter(airline => 
          (airline.name && airline.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (airline.iata_code && airline.iata_code.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (airline.icao_code && airline.icao_code.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (airline.country_name && airline.country_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (airline.country_code && airline.country_code.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }
      
      if (selectedRegion === 'africa') {
        filtered = filtered.filter(airline => 
          africanCountryCodes.includes(airline.country_code || '')
        );
      } else if (selectedRegion) {
        filtered = filtered.filter(airline => {
          const countryCode = airline.country_code?.toLowerCase() || '';
          const countryName = airline.country_name?.toLowerCase() || '';
          
          return countryCode.includes(selectedRegion.toLowerCase()) || 
                 countryName.includes(selectedRegion.toLowerCase());
        });
      }
      
      setFilteredAirlines(filtered.slice(0, page * itemsPerPage));
      
      if (filtered.length === 0 && searchTerm && searchPerformed) {
        toast.info("No airlines found matching your criteria");
      }
    } finally {
      setLoading(false);
    }
  };
  
  const checkForIATACode = async () => {
    // Check if the search term matches IATA code format (3 letters)
    const formattedSearch = searchTerm.trim().toUpperCase();
    if (/^[A-Z]{3}$/.test(formattedSearch) && activeTab === 'airports') {
      setLoading(true);
      try {
        console.log(`Checking for IATA code: ${formattedSearch}`);
        const airport = await fetchAirportByIATA(formattedSearch);
        
        if (airport) {
          console.log(`Found airport for IATA ${formattedSearch}:`, airport);
          setFilteredAirports([airport]);
          toast.success(`Found airport with IATA code ${formattedSearch}`);
          return true;
        }
      } catch (error) {
        console.error(`Error fetching IATA code ${formattedSearch}:`, error);
      } finally {
        setLoading(false);
      }
    }
    return false;
  };
  
  const handleSearch = async () => {
    setPage(1);
    setSearchPerformed(true);
    
    // First check if it's an IATA code search
    const isIATAFound = await checkForIATACode();
    if (!isIATAFound) {
      // If not an IATA code or no results found, do regular filtering
      if (activeTab === 'airports') {
        applyFilters();
      } else {
        filterAirlines();
      }
    }
  };
  
  const handleRegionSelect = (region: string) => {
    setSelectedRegion(region);
    setPage(1);
  };
  
  const handleSelect = (value: string) => {
    setSearchTerm(value);
    setShowSuggestions(false);
    setPage(1);
    
    if (activeTab === 'airports') {
      applyFilters();
    } else {
      filterAirlines();
    }
  };
  
  const loadMore = () => {
    setPage(prev => prev + 1);
  };
  
  const viewDetails = (type: string, id: string) => {
    toast.info(`Viewing details for ${type} ${id}`);
  };
  
  const getSearchSuggestions = () => {
    if (!searchTerm) return [];
    
    if (activeTab === 'airports') {
      return airportData
        .filter(airport => 
          (airport.name && airport.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (airport.iata_code && airport.iata_code.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (airport.icao_code && airport.icao_code.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        .slice(0, 7);
    } else {
      return airlineData
        .filter(airline => 
          (airline.name && airline.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (airline.iata_code && airline.iata_code.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (airline.icao_code && airline.icao_code.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        .slice(0, 7);
    }
  };
  
  const displayedAirportsCount = filteredAirports.length;
  const totalAirportsCount = activeTab === 'airports' && searchTerm ? 
    airportData.filter(airport => 
      (airport.name && airport.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (airport.iata_code && airport.iata_code.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (airport.icao_code && airport.icao_code.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (airport.city && airport.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (airport.country_code && airport.country_code.toLowerCase().includes(searchTerm.toLowerCase()))
    ).length : 
    airportData.length;
  
  const displayedAirlinesCount = filteredAirlines.length;
  const totalAirlinesCount = activeTab === 'airlines' && searchTerm ? 
    airlineData.filter(airline => 
      (airline.name && airline.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (airline.iata_code && airline.iata_code.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (airline.icao_code && airline.icao_code.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (airline.country_name && airline.country_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (airline.country_code && airline.country_code.toLowerCase().includes(searchTerm.toLowerCase()))
    ).length : 
    airlineData.length;
  
  const hasMoreAirports = displayedAirportsCount < totalAirportsCount;
  const hasMoreAirlines = displayedAirlinesCount < totalAirlinesCount;
  
  return (
    <div className="min-h-screen bg-dark text-white overflow-x-hidden">
      <Header />
      
      <section className="pt-32 pb-8 relative">
        <div className="absolute inset-0 bg-radial-gradient from-purple/10 via-transparent to-transparent z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold font-space mb-4 animate-fade-in">
              Global <span className="text-purple animate-text-glow">Aviation</span> Directory
            </h1>
            <p className="text-xl text-gray-light animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Comprehensive database of global airports and airlines, including key African hubs and other regions.
            </p>
          </div>
        </div>
      </section>
      
      <section className="py-8 w-full max-w-6xl mx-auto">
        <div className="px-4">
          <div className="glass-panel p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4">
              <Popover open={showSuggestions} onOpenChange={setShowSuggestions}>
                <PopoverTrigger asChild>
                  <div className="relative w-full md:w-auto flex-1">
                    <Input
                      type="text"
                      placeholder={`Search ${activeTab === 'airports' ? 'airports' : 'airlines'} by name, IATA code, city or country...`}
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        if (e.target.value) {
                          setShowSuggestions(true);
                        } else {
                          setShowSuggestions(false);
                        }
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      className="bg-gray-dark/50 border-gray-dark text-white placeholder:text-gray-light focus:border-purple rounded-lg pr-10 w-full"
                    />
                    <button 
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-light hover:text-white"
                      onClick={handleSearch}
                    >
                      <Search className="h-4 w-4" />
                    </button>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-full md:w-[350px] bg-gray-dark border-gray-600" align="start">
                  <Command className="bg-gray-dark">
                    <CommandInput 
                      placeholder={`Search ${activeTab === 'airports' ? 'airports' : 'airlines'}...`} 
                      value={searchTerm}
                      onValueChange={setSearchTerm}
                      className="border-none text-white placeholder:text-gray-light"
                    />
                    <CommandList className="text-white">
                      <CommandEmpty className="py-2 px-4 text-gray-light">
                        {(/^[A-Za-z]{3}$/.test(searchTerm.trim())) ? 
                          "Press Enter to search for this IATA code" : 
                          "No results found"
                        }
                      </CommandEmpty>
                      <CommandGroup>
                        {getSearchSuggestions().map((item: any, index) => (
                          <CommandItem 
                            key={`${activeTab === 'airports' ? item.icao_code : item.icao_code}-${index}`} 
                            className="flex items-center px-4 py-2 hover:bg-purple/20 cursor-pointer"
                            onSelect={() => handleSelect(activeTab === 'airports' ? item.iata_code : item.iata_code)}
                          >
                            <div className="flex flex-col">
                              <span className="font-medium">{item.name}</span>
                              <span className="text-sm text-gray-light flex items-center gap-1">
                                {activeTab === 'airports' ? (
                                  <>
                                    <Building2 className="h-3 w-3" /> 
                                    {item.iata_code || 'N/A'} / {item.icao_code || 'N/A'} - {item.city || 'N/A'}, {item.country_code || 'N/A'}
                                  </>
                                ) : (
                                  <>
                                    <Plane className="h-3 w-3" /> 
                                    {item.iata_code || 'N/A'} - {item.country_name || item.country_code || 'N/A'}
                                  </>
                                )}
                              </span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              
              <div className="flex items-center gap-2">
                <Tabs 
                  defaultValue="airports" 
                  className="w-full md:w-auto" 
                  value={activeTab}
                  onValueChange={setActiveTab}
                >
                  <TabsList className="bg-gray-dark/50">
                    <TabsTrigger value="airports" className="data-[state=active]:bg-purple">
                      <Building2 className="h-4 w-4 mr-2" />
                      Airports
                    </TabsTrigger>
                    <TabsTrigger value="airlines" className="data-[state=active]:bg-purple">
                      <Plane className="h-4 w-4 mr-2" />
                      Airlines
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                
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
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <Button
                variant={selectedRegion === '' ? "default" : "outline"}
                size="sm"
                onClick={() => handleRegionSelect('')}
              >
                All Regions
              </Button>
              
              <Button
                variant={selectedRegion === 'africa' ? "default" : "outline"}
                size="sm"
                onClick={() => handleRegionSelect('africa')}
              >
                <MapPin className="h-3.5 w-3.5 mr-1" />
                Africa
              </Button>
              
              {regions.filter(r => r.code !== 'africa').map(region => (
                <Button
                  key={region.code}
                  variant={selectedRegion === region.code ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleRegionSelect(region.code)}
                >
                  {region.name}
                </Button>
              ))}
            </div>
            
            <div className="text-sm text-gray-light mb-4">
              {activeTab === 'airports' ? (
                <p>Displaying {filteredAirports.length} of {totalAirportsCount} airports
                  {selectedRegion && ` in ${regions.find(r => r.code === selectedRegion)?.name || selectedRegion}`}
                  {searchTerm && ` matching "${searchTerm}"`}
                </p>
              ) : (
                <p>Displaying {filteredAirlines.length} of {totalAirlinesCount} airlines
                  {selectedRegion && ` in ${regions.find(r => r.code === selectedRegion)?.name || selectedRegion}`}
                  {searchTerm && ` matching "${searchTerm}"`}
                </p>
              )}
              {activeTab === 'airports' && searchTerm.trim().length === 3 && (
                <p className="mt-1 text-purple-200">
                  <span className="font-medium">Pro tip:</span> Enter a 3-letter IATA code (e.g., NBO, EBB, LOS, DXB, JFK) and press search for exact airport lookup
                </p>
              )}
            </div>
          </div>
          
          <Tabs defaultValue="airports" className="w-full" value={activeTab}>
            <TabsContent value="airports" className="mt-0">
              <div className="glass-panel overflow-hidden">
                {initialLoading ? (
                  <div className="flex flex-col justify-center items-center p-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple mb-4"></div>
                    <p className="text-gray-light">Loading comprehensive airport database...</p>
                  </div>
                ) : loading && page === 1 ? (
                  <div className="flex justify-center items-center p-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple"></div>
                  </div>
                ) : (
                  <div className="relative overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-gray-dark/50 text-xs md:text-sm font-medium text-gray-light border-b border-white/10">
                        <tr>
                          <th className="px-4 py-3">Airport Name</th>
                          <th className="px-4 py-3">IATA Code</th>
                          <th className="px-4 py-3">ICAO Code</th>
                          <th className="px-4 py-3">Location</th>
                          <th className="px-4 py-3">Type</th>
                          <th className="px-4 py-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        {filteredAirports.length > 0 ? (
                          filteredAirports.map((airport, index) => (
                            <tr key={`${airport.iata_code || airport.icao_code || index}`} className={cn(
                              "border-b border-white/5 hover:bg-white/5 transition-colors",
                              index % 2 === 0 ? 'bg-white/[0.02]' : '',
                              africanCountryCodes.includes(airport.country_code) && 'bg-purple/[0.03]'
                            )}>
                              <td className="px-4 py-3 font-medium">{airport.name}</td>
                              <td className="px-4 py-3">
                                <span className={cn(
                                  "px-2 py-1 rounded-full text-xs font-medium",
                                  africanCountryCodes.includes(airport.country_code) 
                                    ? "bg-purple/20 text-purple-200" 
                                    : "bg-blue-900/30 text-blue-400"
                                )}>
                                  {airport.iata_code || 'N/A'}
                                </span>
                              </td>
                              <td className="px-4 py-3">{airport.icao_code || 'N/A'}</td>
                              <td className="px-4 py-3">
                                {airport.city ? `${airport.city}, ` : ''}
                                {airport.country_code || 'Unknown'}
                              </td>
                              <td className="px-4 py-3">
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-900/30 text-green-400">
                                  International
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="bg-transparent border-purple/50 text-purple hover:bg-purple/20"
                                  onClick={() => viewDetails('airport', airport.iata_code || airport.icao_code || '')}
                                >
                                  View Details
                                </Button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="px-4 py-8 text-center text-gray-light">
                              <AlertCircle className="mx-auto h-8 w-8 mb-2 text-gray-light/70" />
                              {searchPerformed ? (
                                <>
                                  {searchTerm.length === 3 ? (
                                    <>No airport found with IATA code "{searchTerm.toUpperCase()}"</>
                                  ) : (
                                    <>No airports found matching your search criteria</>
                                  )}
                                </>
                              ) : (
                                <>Use the search box above to find airports</>
                              )}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="airlines" className="mt-0">
              <div className="glass-panel overflow-hidden">
                {initialLoading ? (
                  <div className="flex flex-col justify-center items-center p-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple mb-4"></div>
                    <p className="text-gray-light">Loading comprehensive airline database...</p>
                  </div>
                ) : loading && page === 1 ? (
                  <div className="flex justify-center items-center p-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple"></div>
                  </div>
                ) : (
                  <div className="relative overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-gray-dark/50 text-xs md:text-sm font-medium text-gray-light border-b border-white/10">
                        <tr>
                          <th className="px-4 py-3">Airline Name</th>
                          <th className="px-4 py-3">IATA Code</th>
                          <th className="px-4 py-3">ICAO Code</th>
                          <th className="px-4 py-3">Country</th>
                          <th className="px-4 py-3">Fleet Size</th>
                          <th className="px-4 py-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        {filteredAirlines.length > 0 ? (
                          filteredAirlines.map((airline, index) => (
                            <tr key={`${airline.iata_code || airline.icao_code || index}`} className={cn(
                              "border-b border-white/5 hover:bg-white/5 transition-colors",
                              index % 2 === 0 ? 'bg-white/[0.02]' : '',
                              africanCountryCodes.includes(airline.country_code || '') && 'bg-purple/[0.03]'
                            )}>
                              <td className="px-4 py-3 font-medium">{airline.name}</td>
                              <td className="px-4 py-3">
                                <span className={cn(
                                  "px-2 py-1 rounded-full text-xs font-medium",
                                  africanCountryCodes.includes(airline.country_code || '') 
                                    ? "bg-purple/20 text-purple-200" 
                                    : "bg-blue-900/30 text-blue-400"
                                )}>
                                  {airline.iata_code || 'N/A'}
                                </span>
                              </td>
                              <td className="px-4 py-3">{airline.icao_code || 'N/A'}</td>
                              <td className="px-4 py-3">{airline.country_name || airline.country_code || 'Unknown'}</td>
                              <td className="px-4 py-3">{airline.fleet_size || 'N/A'}</td>
                              <td className="px-4 py-3">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="bg-transparent border-purple/50 text-purple hover:bg-purple/20"
                                  onClick={() => viewDetails('airline', airline.iata_code || airline.icao_code || '')}
                                >
                                  View Details
                                </Button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="px-4 py-8 text-center text-gray-light">
                              <AlertCircle className="mx-auto h-8 w-8 mb-2 text-gray-light/70" />
                              No airlines found matching your search criteria
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 flex justify-center">
            {(activeTab === 'airports' && hasMoreAirports) || 
             (activeTab === 'airlines' && hasMoreAirlines) ? (
              <Button 
                variant="default"
                onClick={loadMore}
                disabled={loading}
              >
                {loading && page > 1 ? (
                  <span className="flex items-center">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </span>
                ) : 'Load More'}
              </Button>
            ) : (
              <Button 
                className="bg-gray-dark/50 text-gray-light cursor-not-allowed"
                disabled={true}
              >
                All Results Loaded
              </Button>
            )}
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default AirportsAirlines;

