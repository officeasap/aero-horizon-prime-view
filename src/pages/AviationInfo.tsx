import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Loader2, MapPin, Plane, PlaneTakeoff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fetchAirports, Airport, Airline } from '@/services/aviationService';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

const AviationInfo = () => {
  const [activeTab, setActiveTab] = useState("airports");
  const [airports, setAirports] = useState<Airport[]>([]);
  const [airlines, setAirlines] = useState<Airline[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === "airports") {
        const data = await fetchAirports();
        if (Array.isArray(data) && data.length > 0) {
          setAirports(data.slice(0, 12)); // Limit to 12 items for display
        } else {
          // Create mock data if real data is not available
          const mockAirports: Airport[] = Array(12).fill(null).map((_, index) => ({
            name: `Airport ${index + 1}`,
            iata: `AP${index}`,
            iata_code: `AP${index}`,
            icao: `ICAO${index}`,
            icao_code: `ICAO${index}`,
            city: `City ${index}`,
            country: 'Indonesia',
            country_code: 'ID',
            lat: -6.1256 + (index * 0.1),
            lon: 106.6558 + (index * 0.1),
            latitude: -6.1256 + (index * 0.1),
            longitude: 106.6558 + (index * 0.1),
            alt: 10,
            timezone: 'Asia/Jakarta'
          }));
          setAirports(mockAirports);
        }
      } else {
        // Create mock airline data based on airports
        const airlineData: Airline[] = Array(12).fill(null).map((_, index) => ({
          name: `${['Jakarta', 'Singapore', 'Kuala Lumpur', 'Bangkok', 'Manila'][index % 5]} Airlines ${index + 1}`,
          iata: `J${index}`,
          iata_code: `J${index}`,
          icao: `JAK${index}`,
          icao_code: `JAK${index}`,
          country: ['Indonesia', 'Singapore', 'Malaysia', 'Thailand', 'Philippines'][index % 5],
          country_code: ['ID', 'SG', 'MY', 'TH', 'PH'][index % 5],
        }));
        setAirlines(airlineData);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Error",
        description: "Failed to load aviation data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark text-white">
      <Header />
      
      <section className="pt-32 pb-12 relative">
        <div className="absolute inset-0 bg-radial-gradient from-[#4c2a90]/10 via-transparent to-transparent z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold font-space mb-4 animate-fade-in">
              Aviation <span className="text-[#8B0000] animate-text-glow">Info</span>
            </h1>
            <p className="text-xl text-gray-light mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Discover detailed information about global airports and airlines
            </p>
          </div>
        </div>
      </section>
      
      <section className="py-10 container mx-auto px-4">
        <Tabs 
          defaultValue="airports" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="airports" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                <span>Airports</span>
              </TabsTrigger>
              <TabsTrigger value="airlines" className="flex items-center gap-2">
                <Plane className="h-4 w-4" />
                <span>Airlines</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="airports" className="mt-0">
            {isLoading ? (
              <div className="flex justify-center items-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-[#8B0000]" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {airports.map((airport) => (
                  <div 
                    key={airport.iata || airport.iata_code || airport.name}
                    className={cn(
                      "border-2 border-[#8B0000] rounded-[18px] overflow-hidden",
                      "shadow-[0_2px_8px_rgba(139,0,0,0.3)] transition-all duration-300",
                      "hover:shadow-[0_4px_16px_rgba(139,0,0,0.5)] hover:translate-y-[-2px]",
                      "bg-gradient-to-b from-[#1A1A1A] to-[#252525]"
                    )}
                  >
                    <div className="h-[120px] bg-gradient-to-r from-[#8B0000]/20 to-transparent flex items-center justify-center">
                      <MapPin className="h-20 w-20 text-[#8B0000]/40" />
                    </div>
                    
                    <div className="p-5">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xl font-semibold text-white">{airport.name}</h3>
                        {(airport.iata || airport.iata_code) && (
                          <span className="bg-[#8B0000]/20 text-white px-2 py-1 rounded-md text-sm">
                            {airport.iata || airport.iata_code}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-300 mb-4">
                        {airport.city}, {airport.country || airport.country_code || 'Indonesia'}
                      </p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="text-sm text-gray-300">
                          <span className="text-gray-400">Timezone:</span> {airport.timezone || 'Asia/Jakarta'}
                        </div>
                        {(airport.lat || airport.latitude) && (airport.lon || airport.longitude) && (
                          <div className="text-sm text-gray-300">
                            <span className="text-gray-400">Coordinates:</span> {airport.lat || airport.latitude}, {airport.lon || airport.longitude}
                          </div>
                        )}
                      </div>
                      
                      <Button className="w-full bg-[#8B0000] hover:bg-[#A80000] text-white">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="airlines" className="mt-0">
            {isLoading ? (
              <div className="flex justify-center items-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-[#8B0000]" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {airlines.map((airline) => (
                  <div 
                    key={airline.iata || airline.iata_code || airline.name}
                    className={cn(
                      "border-2 border-[#8B0000] rounded-[18px] overflow-hidden",
                      "shadow-[0_2px_8px_rgba(139,0,0,0.3)] transition-all duration-300",
                      "hover:shadow-[0_4px_16px_rgba(139,0,0,0.5)] hover:translate-y-[-2px]",
                      "bg-gradient-to-b from-[#1A1A1A] to-[#252525]"
                    )}
                  >
                    <div className="h-[120px] bg-gradient-to-r from-[#8B0000]/20 to-transparent flex items-center justify-center">
                      <PlaneTakeoff className="h-20 w-20 text-[#8B0000]/40" />
                    </div>
                    
                    <div className="p-5">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xl font-semibold text-white">{airline.name}</h3>
                        <div className="flex space-x-2">
                          {(airline.iata || airline.iata_code) && (
                            <span className="bg-[#8B0000]/20 text-white px-2 py-1 rounded-md text-sm">
                              {airline.iata || airline.iata_code}
                            </span>
                          )}
                          {(airline.icao || airline.icao_code) && (
                            <span className="bg-[#8B0000]/20 text-white px-2 py-1 rounded-md text-sm">
                              {airline.icao || airline.icao_code}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-gray-300 mb-4">
                        Based in {airline.country || airline.country_code || 'Indonesia'}
                      </p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="text-sm text-gray-300">
                          <span className="text-gray-400">Hub:</span> Soekarno–Hatta International Airport (CGK)
                        </div>
                        <div className="text-sm text-gray-300">
                          <span className="text-gray-400">Fleet Size:</span> {Math.floor(Math.random() * 100) + 10} aircraft
                        </div>
                      </div>
                      
                      <Button className="w-full bg-[#8B0000] hover:bg-[#A80000] text-white">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </section>
      
      <Footer />
    </div>
  );
};

export default AviationInfo;
