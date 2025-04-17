import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Search, Loader2, ArrowUpDown, Filter, PlaneTakeoff, Building2, Info, MapPin } from 'lucide-react';
import { 
  fetchAirports, 
  fetchAirlines,
  AviationStackAirport,
  AviationStackAirline
} from '@/services/aviationStackService';
import { toast } from 'sonner';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

const AirportsAirlinesPage = () => {
  const [activeTab, setActiveTab] = useState("airports");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Airports state
  const [airports, setAirports] = useState<AviationStackAirport[]>([]);
  const [filteredAirports, setFilteredAirports] = useState<AviationStackAirport[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [selectedAirport, setSelectedAirport] = useState<AviationStackAirport | null>(null);
  const [isAirportDialogOpen, setIsAirportDialogOpen] = useState(false);
  
  // Airlines state
  const [airlines, setAirlines] = useState<AviationStackAirline[]>([]);
  const [filteredAirlines, setFilteredAirlines] = useState<AviationStackAirline[]>([]);
  const [selectedAirline, setSelectedAirline] = useState<AviationStackAirline | null>(null);
  const [isAirlineDialogOpen, setIsAirlineDialogOpen] = useState(false);

  // Load initial data on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      if (activeTab === "airports") {
        await loadAirports();
      } else {
        await loadAirlines();
      }
    };
    
    loadInitialData();
  }, [activeTab]);

  // Load airports
  const loadAirports = async (search: string = "") => {
    setIsLoading(true);
    try {
      const params: Record<string, string> = { limit: "100" };
      if (search) params.search = search;
      
      const response = await fetchAirports(params);
      
      if (response.data && response.data.length > 0) {
        setAirports(response.data);
        setFilteredAirports(response.data);
        toast.success(`Loaded ${response.data.length} airports`);
      } else {
        toast.info("No airports found for your search");
        setAirports([]);
        setFilteredAirports([]);
      }
    } catch (error) {
      console.error("Error loading airports:", error);
      toast.error("Failed to load airports. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Load airlines
  const loadAirlines = async (search: string = "") => {
    setIsLoading(true);
    try {
      const params: Record<string, string> = { limit: "100" };
      if (search) params.search = search;
      
      const response = await fetchAirlines(params);
      
      if (response.data && response.data.length > 0) {
        setAirlines(response.data);
        setFilteredAirlines(response.data);
        toast.success(`Loaded ${response.data.length} airlines`);
      } else {
        toast.info("No airlines found for your search");
        setAirlines([]);
        setFilteredAirlines([]);
      }
    } catch (error) {
      console.error("Error loading airlines:", error);
      toast.error("Failed to load airlines. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search
  const handleSearch = () => {
    if (activeTab === "airports") {
      loadAirports(searchTerm);
    } else {
      loadAirlines(searchTerm);
    }
  };

  // Handle filter as user types
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    
    if (activeTab === "airports") {
      if (!value.trim()) {
        setFilteredAirports(airports);
        return;
      }
      
      const filtered = airports.filter(airport => 
        airport.airport_name.toLowerCase().includes(value) || 
        airport.iata_code.toLowerCase().includes(value) ||
        airport.icao_code.toLowerCase().includes(value) ||
        airport.country_name.toLowerCase().includes(value)
      );
      
      setFilteredAirports(filtered);
    } else {
      if (!value.trim()) {
        setFilteredAirlines(airlines);
        return;
      }
      
      const filtered = airlines.filter(airline => 
        airline.airline_name.toLowerCase().includes(value) || 
        airline.airline_iata.toLowerCase().includes(value) ||
        (airline.airline_icao && airline.airline_icao.toLowerCase().includes(value)) ||
        (airline.airline_country && airline.airline_country.toLowerCase().includes(value))
      );
      
      setFilteredAirlines(filtered);
    }
  };

  // Handle sorting
  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ key, direction });
    
    if (activeTab === "airports") {
      const sortedData = [...filteredAirports].sort((a, b) => {
        // Type assertion and null check
        const aValue = (a as any)[key] || "";
        const bValue = (b as any)[key] || "";
        
        if (aValue < bValue) return direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return direction === 'asc' ? 1 : -1;
        return 0;
      });
      
      setFilteredAirports(sortedData);
    } else {
      const sortedData = [...filteredAirlines].sort((a, b) => {
        // Type assertion and null check
        const aValue = (a as any)[key] || "";
        const bValue = (b as any)[key] || "";
        
        if (aValue < bValue) return direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return direction === 'asc' ? 1 : -1;
        return 0;
      });
      
      setFilteredAirlines(sortedData);
    }
  };

  // Get sort indicator
  const getSortIndicator = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="ml-1 h-4 w-4 text-gray-400" />;
    }
    
    return sortConfig.direction === 'asc' 
      ? <ArrowUpDown className="ml-1 h-4 w-4 text-purple rotate-180" />
      : <ArrowUpDown className="ml-1 h-4 w-4 text-purple" />;
  };

  // Open airport detail dialog
  const handleOpenAirportDetail = (airport: AviationStackAirport) => {
    setSelectedAirport(airport);
    setIsAirportDialogOpen(true);
  };

  // Open airline detail dialog
  const handleOpenAirlineDetail = (airline: AviationStackAirline) => {
    setSelectedAirline(airline);
    setIsAirlineDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-dark text-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-12 relative">
        <div className="absolute inset-0 bg-radial-gradient from-[#4c2a90]/10 via-transparent to-transparent z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold font-space mb-4 animate-fade-in">
              Airports & <span className="text-purple animate-text-glow">Airlines</span>
            </h1>
            <p className="text-xl text-gray-light mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Explore detailed information about airports and airlines worldwide
            </p>
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <section className="py-10 container mx-auto px-4">
        <div className="border-4 border-[#8B0000] rounded-2xl shadow-[0_4px_12px_rgba(139,0,0,0.4)] overflow-hidden">
          <Tabs 
            defaultValue="airports" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="airports" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Airports</span>
                </TabsTrigger>
                <TabsTrigger value="airlines" className="flex items-center gap-2">
                  <PlaneTakeoff className="h-4 w-4" />
                  <span>Airlines</span>
                </TabsTrigger>
              </TabsList>
              
              <div className="flex gap-2 w-full md:w-auto">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    placeholder={`Search ${activeTab}...`}
                    value={searchTerm}
                    onChange={handleFilterChange}
                    className="bg-gray-dark/50 border-gray-dark text-white pl-9"
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-light" />
                </div>
                
                <Button 
                  variant="outline" 
                  onClick={handleSearch}
                  className="bg-gray-dark/50 border-gray-dark text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <TabsContent value="airports" className="mt-0">
              <Card className="bg-gray-dark/60 border-gray-light/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Building2 className="text-purple" />
                    <span>Airports Directory</span>
                  </CardTitle>
                  <CardDescription>
                    Browse {filteredAirports.length} airports from around the world
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center items-center p-12">
                      <Loader2 className="animate-spin h-8 w-8 text-purple" />
                    </div>
                  ) : filteredAirports.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-light">No airports found matching your criteria.</p>
                      <Button 
                        variant="outline" 
                        onClick={() => loadAirports()}
                        className="mt-4"
                      >
                        Load Airports
                      </Button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="hover:bg-white/5">
                            <TableHead 
                              className="cursor-pointer"
                              onClick={() => requestSort('airport_name')}
                            >
                              <div className="flex items-center">
                                Airport Name
                                {getSortIndicator('airport_name')}
                              </div>
                            </TableHead>
                            <TableHead 
                              className="cursor-pointer"
                              onClick={() => requestSort('iata_code')}
                            >
                              <div className="flex items-center">
                                IATA
                                {getSortIndicator('iata_code')}
                              </div>
                            </TableHead>
                            <TableHead 
                              className="cursor-pointer"
                              onClick={() => requestSort('icao_code')}
                            >
                              <div className="flex items-center">
                                ICAO
                                {getSortIndicator('icao_code')}
                              </div>
                            </TableHead>
                            <TableHead 
                              className="cursor-pointer"
                              onClick={() => requestSort('country_name')}
                            >
                              <div className="flex items-center">
                                Country
                                {getSortIndicator('country_name')}
                              </div>
                            </TableHead>
                            <TableHead>
                              <div className="flex items-center justify-end">
                                Details
                              </div>
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredAirports.map((airport, index) => (
                            <TableRow 
                              key={`${airport.iata_code}-${index}`}
                              className="hover:bg-white/5 cursor-pointer"
                              onClick={() => handleOpenAirportDetail(airport)}
                            >
                              <TableCell className="font-medium">{airport.airport_name}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="font-mono">
                                  {airport.iata_code}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant="secondary" className="font-mono">
                                  {airport.icao_code}
                                </Badge>
                              </TableCell>
                              <TableCell>{airport.country_name}</TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="icon">
                                  <Info className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="airlines" className="mt-0">
              <Card className="bg-gray-dark/60 border-gray-light/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <PlaneTakeoff className="text-purple" />
                    <span>Airlines Directory</span>
                  </CardTitle>
                  <CardDescription>
                    Browse {filteredAirlines.length} airlines from around the world
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center items-center p-12">
                      <Loader2 className="animate-spin h-8 w-8 text-purple" />
                    </div>
                  ) : filteredAirlines.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-light">No airlines found matching your criteria.</p>
                      <Button 
                        variant="outline" 
                        onClick={() => loadAirlines()}
                        className="mt-4"
                      >
                        Load Airlines
                      </Button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="hover:bg-white/5">
                            <TableHead 
                              className="cursor-pointer"
                              onClick={() => requestSort('airline_name')}
                            >
                              <div className="flex items-center">
                                Airline Name
                                {getSortIndicator('airline_name')}
                              </div>
                            </TableHead>
                            <TableHead 
                              className="cursor-pointer"
                              onClick={() => requestSort('airline_iata')}
                            >
                              <div className="flex items-center">
                                IATA
                                {getSortIndicator('airline_iata')}
                              </div>
                            </TableHead>
                            <TableHead 
                              className="cursor-pointer"
                              onClick={() => requestSort('airline_icao')}
                            >
                              <div className="flex items-center">
                                ICAO
                                {getSortIndicator('airline_icao')}
                              </div>
                            </TableHead>
                            <TableHead 
                              className="cursor-pointer"
                              onClick={() => requestSort('airline_country')}
                            >
                              <div className="flex items-center">
                                Country
                                {getSortIndicator('airline_country')}
                              </div>
                            </TableHead>
                            <TableHead>
                              <div className="flex items-center justify-end">
                                Details
                              </div>
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredAirlines.map((airline, index) => (
                            <TableRow 
                              key={`${airline.airline_iata}-${index}`}
                              className="hover:bg-white/5 cursor-pointer"
                              onClick={() => handleOpenAirlineDetail(airline)}
                            >
                              <TableCell className="font-medium">{airline.airline_name}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="font-mono">
                                  {airline.airline_iata}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant="secondary" className="font-mono">
                                  {airline.airline_icao || 'N/A'}
                                </Badge>
                              </TableCell>
                              <TableCell>{airline.airline_country || 'Unknown'}</TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="icon">
                                  <Info className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      {/* Airport Detail Dialog */}
      <Dialog open={isAirportDialogOpen} onOpenChange={setIsAirportDialogOpen}>
        <DialogContent className="bg-gray-dark border-gray-light/20 text-white">
          {selectedAirport && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl flex items-center gap-2">
                  <Building2 className="text-purple" />
                  {selectedAirport.airport_name}
                </DialogTitle>
                <DialogDescription className="text-gray-light">
                  {selectedAirport.iata_code} • {selectedAirport.icao_code}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-light">Location</h4>
                  <p>{selectedAirport.city_iata_code}, {selectedAirport.country_name}</p>
                  
                  <h4 className="text-sm font-semibold text-gray-light mt-4">Coordinates</h4>
                  <p>Latitude: {selectedAirport.latitude}</p>
                  <p>Longitude: {selectedAirport.longitude}</p>
                  
                  <h4 className="text-sm font-semibold text-gray-light mt-4">Time Zone</h4>
                  <p>{selectedAirport.timezone} (GMT {selectedAirport.gmt})</p>
                </div>
                
                <div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-light mb-2">Contact Information</h4>
                    <p>Phone: {selectedAirport.phone_number || 'Not available'}</p>
                    
                    <div className="mt-4 flex flex-col gap-2">
                      <Button 
                        variant="outline" 
                        className="w-full bg-gray-dark/50 border-gray-light/20"
                        onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${selectedAirport.latitude},${selectedAirport.longitude}`, '_blank')}
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        View on Google Maps
                      </Button>
                      
                      <DialogClose asChild>
                        <Button 
                          variant="outline" 
                          className="w-full bg-gray-dark/50 border-gray-light/20"
                        >
                          Close
                        </Button>
                      </DialogClose>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Airline Detail Dialog */}
      <Dialog open={isAirlineDialogOpen} onOpenChange={setIsAirlineDialogOpen}>
        <DialogContent className="bg-gray-dark border-gray-light/20 text-white">
          {selectedAirline && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl flex items-center gap-2">
                  <PlaneTakeoff className="text-purple" />
                  {selectedAirline.airline_name}
                </DialogTitle>
                <DialogDescription className="text-gray-light">
                  {selectedAirline.airline_iata} • {selectedAirline.airline_icao || 'N/A'}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-light">Information</h4>
                  <p>Country: {selectedAirline.airline_country || 'Unknown'}</p>
                  <p>Type: {selectedAirline.airline_type || 'N/A'}</p>
                  <p>Status: {selectedAirline.status || 'Unknown'}</p>
                  
                  <h4 className="text-sm font-semibold text-gray-light mt-4">Fleet</h4>
                  <p>Fleet Size: {selectedAirline.fleet_size || 'Unknown'}</p>
                  <p>Fleet Average Age: {selectedAirline.fleet_average_age || 'Unknown'} years</p>
                  
                  <h4 className="text-sm font-semibold text-gray-light mt-4">Additional Details</h4>
                  <p>Date Founded: {selectedAirline.date_founded || 'Unknown'}</p>
                  <p>Callsign: {selectedAirline.airline_callsign || 'N/A'}</p>
                </div>
                
                <div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-light mb-2">Connection Information</h4>
                    <p>IATA Accounting Prefix: {selectedAirline.iata_prefix_accounting || 'N/A'}</p>
                    
                    <div className="mt-4 flex flex-col gap-2">
                      <DialogClose asChild>
                        <Button 
                          variant="outline" 
                          className="w-full bg-gray-dark/50 border-gray-light/20"
                        >
                          Close
                        </Button>
                      </DialogClose>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default AirportsAirlinesPage;
