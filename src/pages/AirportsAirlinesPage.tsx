import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Search, Loader2, ArrowUpDown, Filter, PlaneTakeoff, Building2, Info, MapPin } from 'lucide-react';
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
import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { 
  fetchAirports, 
  fetchComprehensiveAirports, 
  fetchAirlines,
  fetchComprehensiveAirlines
} from '@/services/aviationService';
import type { Airport, Airline } from '@/services/shared/types';

const ITEMS_PER_PAGE = 25;

const AirportsAirlinesPage = () => {
  const [activeTab, setActiveTab] = useState("airports");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const [airports, setAirports] = useState<Airport[]>([]);
  const [filteredAirports, setFilteredAirports] = useState<Airport[]>([]);
  const [displayedAirports, setDisplayedAirports] = useState<Airport[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null);
  const [isAirportDialogOpen, setIsAirportDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [airlines, setAirlines] = useState<Airline[]>([]);
  const [filteredAirlines, setFilteredAirlines] = useState<Airline[]>([]);
  const [displayedAirlines, setDisplayedAirlines] = useState<Airline[]>([]);
  const [selectedAirline, setSelectedAirline] = useState<Airline | null>(null);
  const [isAirlineDialogOpen, setIsAirlineDialogOpen] = useState(false);
  const [airlineCurrentPage, setAirlineCurrentPage] = useState(1);
  const [airlineTotalPages, setAirlineTotalPages] = useState(1);

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

  useEffect(() => {
    if (activeTab === "airports") {
      const total = Math.ceil(filteredAirports.length / ITEMS_PER_PAGE);
      setTotalPages(total || 1);
      updateDisplayedAirports(currentPage);
    } else {
      const total = Math.ceil(filteredAirlines.length / ITEMS_PER_PAGE);
      setAirlineTotalPages(total || 1);
      updateDisplayedAirlines(airlineCurrentPage);
    }
  }, [filteredAirports, filteredAirlines, currentPage, airlineCurrentPage, activeTab]);

  const updateDisplayedAirports = (page: number) => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setDisplayedAirports(filteredAirports.slice(startIndex, endIndex));
  };

  const updateDisplayedAirlines = (page: number) => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setDisplayedAirlines(filteredAirlines.slice(startIndex, endIndex));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAirlinePageChange = (page: number) => {
    setAirlineCurrentPage(page);
  };

  const loadAirports = async (search: string = "") => {
    setIsLoading(true);
    try {
      let airportData: Airport[] = [];
      
      if (search) {
        airportData = await fetchAirports({ search: search });
      } else {
        airportData = await fetchComprehensiveAirports();
      }
      
      if (airportData && airportData.length > 0) {
        setAirports(airportData);
        setFilteredAirports(airportData);
        setCurrentPage(1);
        toast.success(`Loaded ${airportData.length} airports`);
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

  const loadAirlines = async (search: string = "") => {
    setIsLoading(true);
    try {
      let airlineData: Airline[] = [];
      
      if (search) {
        airlineData = await fetchAirlines({ search: search });
      } else {
        airlineData = await fetchComprehensiveAirlines();
      }
      
      if (airlineData && airlineData.length > 0) {
        setAirlines(airlineData);
        setFilteredAirlines(airlineData);
        setAirlineCurrentPage(1);
        toast.success(`Loaded ${airlineData.length} airlines`);
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

  const handleSearch = () => {
    if (activeTab === "airports") {
      loadAirports(searchTerm);
    } else {
      loadAirlines(searchTerm);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    
    if (activeTab === "airports") {
      if (!value.trim()) {
        setFilteredAirports(airports);
        return;
      }
      
      const filtered = airports.filter(airport => 
        airport.name.toLowerCase().includes(value) || 
        (airport.iata_code && airport.iata_code.toLowerCase().includes(value)) ||
        (airport.icao_code && airport.icao_code.toLowerCase().includes(value)) ||
        (airport.country_code && airport.country_code.toLowerCase().includes(value)) ||
        (airport.city && airport.city.toLowerCase().includes(value))
      );
      
      setFilteredAirports(filtered);
      setCurrentPage(1);
    } else {
      if (!value.trim()) {
        setFilteredAirlines(airlines);
        return;
      }
      
      const filtered = airlines.filter(airline => 
        airline.name.toLowerCase().includes(value) || 
        (airline.iata_code && airline.iata_code.toLowerCase().includes(value)) ||
        (airline.icao_code && airline.icao_code.toLowerCase().includes(value)) ||
        (airline.country_code && airline.country_code.toLowerCase().includes(value))
      );
      
      setFilteredAirlines(filtered);
      setAirlineCurrentPage(1);
    }
  };

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ key, direction });
    
    if (activeTab === "airports") {
      const sortedData = [...filteredAirports].sort((a, b) => {
        const aValue = (a as any)[key] || "";
        const bValue = (b as any)[key] || "";
        
        if (aValue < bValue) return direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return direction === 'asc' ? 1 : -1;
        return 0;
      });
      
      setFilteredAirports(sortedData);
    } else {
      const sortedData = [...filteredAirlines].sort((a, b) => {
        const aValue = (a as any)[key] || "";
        const bValue = (b as any)[key] || "";
        
        if (aValue < bValue) return direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return direction === 'asc' ? 1 : -1;
        return 0;
      });
      
      setFilteredAirlines(sortedData);
    }
  };

  const getSortIndicator = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="ml-1 h-4 w-4 text-gray-400" />;
    }
    
    return sortConfig.direction === 'asc' 
      ? <ArrowUpDown className="ml-1 h-4 w-4 text-purple rotate-180" />
      : <ArrowUpDown className="ml-1 h-4 w-4 text-purple" />;
  };

  const handleOpenAirportDetail = (airport: Airport) => {
    setSelectedAirport(airport);
    setIsAirportDialogOpen(true);
  };

  const handleOpenAirlineDetail = (airline: Airline) => {
    setSelectedAirline(airline);
    setIsAirlineDialogOpen(true);
  };

  const renderPaginationItems = (currentPage: number, totalPages: number, onPageChange: (page: number) => void) => {
    const items = [];
    const maxPageDisplay = 5;
    
    items.push(
      <PaginationItem key="first">
        <PaginationLink 
          isActive={currentPage === 1} 
          onClick={() => onPageChange(1)}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );
    
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);
    
    if (currentPage <= 3) {
      endPage = Math.min(maxPageDisplay, totalPages - 1);
    } else if (currentPage >= totalPages - 2) {
      startPage = Math.max(2, totalPages - maxPageDisplay + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      if (i === 1 || i === totalPages) continue;
      
      items.push(
        <PaginationItem key={i}>
          <PaginationLink 
            isActive={currentPage === i} 
            onClick={() => onPageChange(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    if (totalPages > 1) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink 
            isActive={currentPage === totalPages} 
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };

  return (
    <div className="min-h-screen bg-dark text-white">
      <Header />
      
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
                    <>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="hover:bg-white/5">
                              <TableHead 
                                className="cursor-pointer"
                                onClick={() => requestSort('name')}
                              >
                                <div className="flex items-center">
                                  Airport Name
                                  {getSortIndicator('name')}
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
                                onClick={() => requestSort('country_code')}
                              >
                                <div className="flex items-center">
                                  Country
                                  {getSortIndicator('country_code')}
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
                            {displayedAirports.map((airport, index) => (
                              <TableRow 
                                key={`${airport.iata_code || airport.icao_code || index}-${index}`}
                                className="hover:bg-white/5 cursor-pointer"
                                onClick={() => handleOpenAirportDetail(airport)}
                              >
                                <TableCell className="font-medium">{airport.name}</TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="font-mono">
                                    {airport.iata_code || 'N/A'}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="secondary" className="font-mono">
                                    {airport.icao_code || 'N/A'}
                                  </Badge>
                                </TableCell>
                                <TableCell>{airport.country || airport.country_code || 'Unknown'}</TableCell>
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
                      
                      {totalPages > 1 && (
                        <Pagination className="mt-4">
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious 
                                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                aria-disabled={currentPage === 1}
                                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                              />
                            </PaginationItem>
                            
                            {renderPaginationItems(currentPage, totalPages, handlePageChange)}
                            
                            <PaginationItem>
                              <PaginationNext 
                                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                aria-disabled={currentPage === totalPages}
                                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                              />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      )}
                    </>
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
                    <>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="hover:bg-white/5">
                              <TableHead 
                                className="cursor-pointer"
                                onClick={() => requestSort('name')}
                              >
                                <div className="flex items-center">
                                  Airline Name
                                  {getSortIndicator('name')}
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
                                onClick={() => requestSort('country_code')}
                              >
                                <div className="flex items-center">
                                  Country
                                  {getSortIndicator('country_code')}
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
                            {displayedAirlines.map((airline, index) => (
                              <TableRow 
                                key={`${airline.iata_code || airline.icao_code || index}-${index}`}
                                className="hover:bg-white/5 cursor-pointer"
                                onClick={() => handleOpenAirlineDetail(airline)}
                              >
                                <TableCell className="font-medium">{airline.name}</TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="font-mono">
                                    {airline.iata_code || 'N/A'}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="secondary" className="font-mono">
                                    {airline.icao_code || 'N/A'}
                                  </Badge>
                                </TableCell>
                                <TableCell>{airline.country_name || airline.country_code || 'Unknown'}</TableCell>
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
                      
                      {airlineTotalPages > 1 && (
                        <Pagination className="mt-4">
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious 
                                onClick={() => handleAirlinePageChange(Math.max(1, airlineCurrentPage - 1))}
                                aria-disabled={airlineCurrentPage === 1}
                                className={airlineCurrentPage === 1 ? "pointer-events-none opacity-50" : ""}
                              />
                            </PaginationItem>
                            
                            {renderPaginationItems(airlineCurrentPage, airlineTotalPages, handleAirlinePageChange)}
                            
                            <PaginationItem>
                              <PaginationNext 
                                onClick={() => handleAirlinePageChange(Math.min(airlineTotalPages, airlineCurrentPage + 1))}
                                aria-disabled={airlineCurrentPage === airlineTotalPages}
                                className={airlineCurrentPage === airlineTotalPages ? "pointer-events-none opacity-50" : ""}
                              />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      <Dialog open={isAirportDialogOpen} onOpenChange={setIsAirportDialogOpen}>
        <DialogContent className="bg-gray-dark border-gray-light/20 text-white">
          {selectedAirport && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl flex items-center gap-2">
                  <Building2 className="text-purple" />
                  {selectedAirport.name}
                </DialogTitle>
                <DialogDescription className="text-gray-light">
                  {selectedAirport.iata_code || 'N/A'} • {selectedAirport.icao_code || 'N/A'}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-light">Location</h4>
                  <p>{selectedAirport.city || 'Unknown'}, {selectedAirport.country || selectedAirport.country_code || 'Unknown'}</p>
                  
                  <h4 className="text-sm font-semibold text-gray-light mt-4">Coordinates</h4>
                  <p>Latitude: {selectedAirport.lat}</p>
                  <p>Longitude: {selectedAirport.lon}</p>
                  
                  <h4 className="text-sm font-semibold text-gray-light mt-4">Time Zone</h4>
                  <p>{selectedAirport.timezone || 'Unknown'}</p>
                </div>
                
                <div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-light mb-2">Additional Information</h4>
                    <p>Altitude: {selectedAirport.alt || 'Not available'} ft</p>
                    
                    <div className="mt-4 flex flex-col gap-2">
                      <Button 
                        variant="outline" 
                        className="w-full bg-gray-dark/50 border-gray-light/20"
                        onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${selectedAirport.lat},${selectedAirport.lon}`, '_blank')}
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
      
      <Dialog open={isAirlineDialogOpen} onOpenChange={setIsAirlineDialogOpen}>
        <DialogContent className="bg-gray-dark border-gray-light/20 text-white">
          {selectedAirline && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl flex items-center gap-2">
                  <PlaneTakeoff className="text-purple" />
                  {selectedAirline.name}
                </DialogTitle>
                <DialogDescription className="text-gray-light">
                  {selectedAirline.iata_code || 'N/A'} • {selectedAirline.icao_code || 'N/A'}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-light">Information</h4>
                  <p>Country: {selectedAirline.country_name || selectedAirline.country_code || 'Unknown'}</p>
                  <p>IATA Code: {selectedAirline.iata_code || 'N/A'}</p>
                  <p>ICAO Code: {selectedAirline.icao_code || 'N/A'}</p>
                </div>
                
                <div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-light mb-2">Additional Details</h4>
                    <p>Callsign: {selectedAirline.callsign || 'Unknown'}</p>
                    
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
