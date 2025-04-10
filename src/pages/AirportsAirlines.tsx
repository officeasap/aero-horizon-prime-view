
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Search, Building2, Plane } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { fetchAirportsAndAirlines } from '@/services/aviationService';
import { toast } from 'sonner';

// Sample airport data for fallback
const airports = [
  { name: 'Hartsfield-Jackson Atlanta International Airport', city: 'Atlanta', country: 'United States', code: 'ATL', icao: 'KATL', type: 'International' },
  { name: 'Beijing Capital International Airport', city: 'Beijing', country: 'China', code: 'PEK', icao: 'ZBAA', type: 'International' },
  { name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'United States', code: 'LAX', icao: 'KLAX', type: 'International' },
  { name: 'Dubai International Airport', city: 'Dubai', country: 'United Arab Emirates', code: 'DXB', icao: 'OMDB', type: 'International' },
  { name: 'Tokyo Haneda Airport', city: 'Tokyo', country: 'Japan', code: 'HND', icao: 'RJTT', type: 'International' },
  { name: 'London Heathrow Airport', city: 'London', country: 'United Kingdom', code: 'LHR', icao: 'EGLL', type: 'International' },
  { name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France', code: 'CDG', icao: 'LFPG', type: 'International' },
  { name: 'Singapore Changi Airport', city: 'Singapore', country: 'Singapore', code: 'SIN', icao: 'WSSS', type: 'International' },
  // Asian airports
  { name: 'Soekarno-Hatta International Airport', city: 'Jakarta', country: 'Indonesia', code: 'CGK', icao: 'WIII', type: 'International' },
  { name: 'Ngurah Rai International Airport', city: 'Denpasar', country: 'Indonesia', code: 'DPS', icao: 'WADD', type: 'International' },
  { name: 'Incheon International Airport', city: 'Seoul', country: 'South Korea', code: 'ICN', icao: 'RKSI', type: 'International' },
  { name: 'Hong Kong International Airport', city: 'Hong Kong', country: 'China', code: 'HKG', icao: 'VHHH', type: 'International' },
];

// Sample airline data for fallback
const airlines = [
  { name: 'Emirates', code: 'EK', country: 'United Arab Emirates', fleet: 265, hub: 'Dubai International Airport' },
  { name: 'British Airways', code: 'BA', country: 'United Kingdom', fleet: 280, hub: 'London Heathrow Airport' },
  { name: 'Singapore Airlines', code: 'SQ', country: 'Singapore', fleet: 127, hub: 'Singapore Changi Airport' },
  { name: 'Lufthansa', code: 'LH', country: 'Germany', fleet: 279, hub: 'Frankfurt Airport' },
  { name: 'Qatar Airways', code: 'QR', country: 'Qatar', fleet: 234, hub: 'Hamad International Airport' },
  { name: 'United Airlines', code: 'UA', country: 'United States', fleet: 860, hub: 'O\'Hare International Airport' },
  { name: 'Delta Air Lines', code: 'DL', country: 'United States', fleet: 850, hub: 'Hartsfield-Jackson Atlanta International Airport' },
  { name: 'American Airlines', code: 'AA', country: 'United States', fleet: 956, hub: 'Dallas/Fort Worth International Airport' },
  // Asian airlines
  { name: 'Garuda Indonesia', code: 'GA', country: 'Indonesia', fleet: 142, hub: 'Soekarno-Hatta International Airport' },
  { name: 'AirAsia', code: 'AK', country: 'Malaysia', fleet: 255, hub: 'Kuala Lumpur International Airport' },
  { name: 'Cathay Pacific', code: 'CX', country: 'Hong Kong', fleet: 155, hub: 'Hong Kong International Airport' },
  { name: 'Japan Airlines', code: 'JL', country: 'Japan', fleet: 167, hub: 'Tokyo Narita Airport' },
];

const AirportsAirlines = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('airports');
  const [loading, setLoading] = useState(false);
  const [airportData, setAirportData] = useState(airports);
  const [airlineData, setAirlineData] = useState(airlines);
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;
  
  useEffect(() => {
    // Initial search with empty term
    handleSearch();
  }, [activeTab]);
  
  const handleSearch = async () => {
    setLoading(true);
    try {
      // In a real app, this would be an API call to search for airports/airlines
      // For now, we'll simulate with sample data
      const results = await fetchAirportsAndAirlines(searchTerm);
      
      if (results.length === 0) {
        // If API returns no results, fallback to sample data
        if (activeTab === 'airports') {
          const filteredAirports = airports.filter(airport => 
            airport.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            airport.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            airport.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
            airport.country.toLowerCase().includes(searchTerm.toLowerCase())
          );
          setAirportData(filteredAirports);
          
          if (filteredAirports.length === 0) {
            toast.info("No airports found matching your search.");
          }
        } else {
          const filteredAirlines = airlines.filter(airline => 
            airline.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            airline.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            airline.country.toLowerCase().includes(searchTerm.toLowerCase())
          );
          setAirlineData(filteredAirlines);
          
          if (filteredAirlines.length === 0) {
            toast.info("No airlines found matching your search.");
          }
        }
      } else {
        // Process API results
        toast.success(`Found ${results.length} results for "${searchTerm}"`);
      }
    } catch (error) {
      console.error("Error searching:", error);
      toast.error("Failed to search. Using sample data instead.");
      
      // Fallback to sample data
      if (activeTab === 'airports') {
        const filteredAirports = airports.filter(airport => 
          airport.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          airport.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          airport.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          airport.country.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setAirportData(filteredAirports);
      } else {
        const filteredAirlines = airlines.filter(airline => 
          airline.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          airline.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          airline.country.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setAirlineData(filteredAirlines);
      }
    } finally {
      setLoading(false);
      setPage(1); // Reset to first page when searching
    }
  };
  
  const loadMore = async () => {
    setLoading(true);
    try {
      setPage(prev => prev + 1);
      toast.success("Loading more results...");
      
      // In a real app, this would fetch the next page of results
      // For now, we'll simulate with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // No additional data to load in our sample app
      toast.info("All available data has been loaded.");
    } catch (error) {
      console.error("Error loading more data:", error);
      toast.error("Failed to load more data. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const viewDetails = (type: string, id: string) => {
    toast.info(`Viewing details for ${type} ${id}`);
    // In a real app, this would navigate to a details page or open a modal
  };
  
  // Calculate paginated data
  const paginatedAirports = airportData.slice(0, page * itemsPerPage);
  const paginatedAirlines = airlineData.slice(0, page * itemsPerPage);
  
  const hasMoreAirports = paginatedAirports.length < airportData.length;
  const hasMoreAirlines = paginatedAirlines.length < airlineData.length;
  
  return (
    <div className="min-h-screen bg-dark text-white overflow-x-hidden">
      <Header />
      
      {/* Page Title Section */}
      <section className="pt-32 pb-8 relative">
        <div className="absolute inset-0 bg-radial-gradient from-purple/10 via-transparent to-transparent z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold font-space mb-4 animate-fade-in">
              Airports & <span className="text-purple animate-text-glow">Airlines</span>
            </h1>
            <p className="text-xl text-gray-light animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Comprehensive database of global airports and airlines with detailed information.
            </p>
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <section className="py-8 w-full max-w-6xl mx-auto">
        <div className="px-4">
          <div className="glass-panel p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-auto flex-1">
                <Input
                  type="text"
                  placeholder={`Search ${activeTab === 'airports' ? 'airports' : 'airlines'}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
            </div>
          </div>
          
          {/* Airlines & Airports Content */}
          <Tabs defaultValue="airports" className="w-full" value={activeTab}>
            <TabsContent value="airports" className="mt-0">
              <div className="glass-panel overflow-hidden">
                {loading && page === 1 ? (
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
                        {paginatedAirports.length > 0 ? (
                          paginatedAirports.map((airport, index) => (
                            <tr key={airport.code} className={cn(
                              "border-b border-white/5 hover:bg-white/5 transition-colors",
                              index % 2 === 0 ? 'bg-white/[0.02]' : ''
                            )}>
                              <td className="px-4 py-3 font-medium">{airport.name}</td>
                              <td className="px-4 py-3">{airport.code}</td>
                              <td className="px-4 py-3">{airport.icao}</td>
                              <td className="px-4 py-3">{airport.city}, {airport.country}</td>
                              <td className="px-4 py-3">
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-900/30 text-blue-400">
                                  {airport.type}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="bg-transparent border-purple/50 text-purple hover:bg-purple/20"
                                  onClick={() => viewDetails('airport', airport.code)}
                                >
                                  View Details
                                </Button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="px-4 py-8 text-center text-gray-light">
                              No airports found matching your search criteria
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
                {loading && page === 1 ? (
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
                          <th className="px-4 py-3">Country</th>
                          <th className="px-4 py-3">Fleet Size</th>
                          <th className="px-4 py-3">Main Hub</th>
                          <th className="px-4 py-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        {paginatedAirlines.length > 0 ? (
                          paginatedAirlines.map((airline, index) => (
                            <tr key={airline.code} className={cn(
                              "border-b border-white/5 hover:bg-white/5 transition-colors",
                              index % 2 === 0 ? 'bg-white/[0.02]' : ''
                            )}>
                              <td className="px-4 py-3 font-medium">{airline.name}</td>
                              <td className="px-4 py-3">{airline.code}</td>
                              <td className="px-4 py-3">{airline.country}</td>
                              <td className="px-4 py-3">{airline.fleet}</td>
                              <td className="px-4 py-3">{airline.hub}</td>
                              <td className="px-4 py-3">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="bg-transparent border-purple/50 text-purple hover:bg-purple/20"
                                  onClick={() => viewDetails('airline', airline.code)}
                                >
                                  View Details
                                </Button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="px-4 py-8 text-center text-gray-light">
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
                className="bg-purple hover:bg-purple-600 text-white purple-glow"
                onClick={loadMore}
                disabled={loading}
              >
                {loading && page > 1 ? (
                  <span className="flex items-center">
                    <span className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></span>
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
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AirportsAirlines;
