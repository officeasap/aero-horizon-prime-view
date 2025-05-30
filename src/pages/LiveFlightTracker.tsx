
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import FlightTracker from '@/components/FlightTracker';
import FlightMap from '@/components/FlightMap';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, List, Info, LocateFixed } from 'lucide-react';
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from '@/components/ui/button';
import { fetchNearbyAircraft, fetchLiveFlights } from '@/services/aviationService';
import { toast } from 'sonner';

const LiveFlightTracker: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load live flight data when the component mounts
  useEffect(() => {
    const loadInitialFlightData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Fetch initial flight data
        await fetchLiveFlights();
        console.log("Initial flight data loaded successfully");
      } catch (err) {
        console.error("Error loading initial flight data:", err);
        setError("Failed to load flight data. Please try again.");
        toast.error("Could not load flight data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialFlightData();
  }, []);

  const handleNearbySearch = async () => {
    try {
      setIsLoading(true);
      toast.info("Finding aircraft near your location...");
      
      if (!navigator.geolocation) {
        throw new Error("Geolocation is not supported by your browser");
      }
      
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });
      
      await fetchNearbyAircraft(position.coords.latitude, position.coords.longitude, 100);
      toast.success("Found nearby aircraft");
      // The map and list components will update with the new data
    } catch (error) {
      console.error("Error finding nearby aircraft:", error);
      toast.error("Could not access your location or find nearby aircraft");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark text-white overflow-x-hidden">
      <Header />
      
      {/* Page Title Section */}
      <section className="pt-32 pb-8 relative">
        <div className="absolute inset-0 bg-radial-gradient from-purple/10 via-transparent to-transparent z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold font-space mb-4 animate-fade-in">
              Global <span className="text-purple animate-text-glow">Flight Tracker</span>
            </h1>
            <p className="text-xl text-gray-light animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Track flights in real-time with data from the OpenSky Network
            </p>
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <section className="py-10 container mx-auto px-4">
        {error ? (
          <div className="glass-panel p-8 text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline"
              className="bg-gray-dark/50 border-gray-dark text-white hover:bg-[#8B0000]"
            >
              Retry
            </Button>
          </div>
        ) : (
          <div className="glass-panel border-2 border-[#8B0000] rounded-xl shadow-[0_4px_12px_rgba(139,0,0,0.4)] overflow-hidden transition-all duration-300 hover:shadow-[0_8px_24px_rgba(139,0,0,0.5)]">
            <Tabs defaultValue="map" className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8 bg-gray-dark/50">
                <TabsTrigger value="map" className="flex items-center gap-2 data-[state=active]:bg-[#8B0000] data-[state=active]:text-white">
                  <MapPin className="h-4 w-4" />
                  <span>Map View</span>
                </TabsTrigger>
                <TabsTrigger value="list" className="flex items-center gap-2 data-[state=active]:bg-[#8B0000] data-[state=active]:text-white">
                  <List className="h-4 w-4" />
                  <span>List View</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="map" className="mt-0 w-full">
                <div className="p-1 rounded-xl">
                  <FlightMap />
                </div>
                
                <div className="mt-4 text-sm text-gray-light text-center flex flex-col md:flex-row items-center justify-center gap-2">
                  <span>✈️ Click on an aircraft to view its details</span>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <button className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-light/10 hover:bg-gray-light/20">
                        <Info className="h-3 w-3" />
                      </button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80 bg-gray-dark border-gray-light/20 text-gray-light p-4">
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-white">About this data</h4>
                        <p className="text-xs">
                          This flight tracker displays real-time data from the OpenSky Network API. 
                          Data is refreshed every 60 seconds and includes commercial, private, and special flights 
                          currently in the air worldwide.
                        </p>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="ml-4 text-xs bg-gray-dark/50 border-gray-dark text-white hover:bg-[#8B0000] hover:text-white transition-colors"
                    onClick={handleNearbySearch}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full mr-1" />
                    ) : (
                      <LocateFixed className="h-3 w-3 mr-1" />
                    )}
                    Find nearby aircraft
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="list" className="mt-0">
                <FlightTracker />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </section>
      
      <Footer />
    </div>
  );
};

export default LiveFlightTracker;
