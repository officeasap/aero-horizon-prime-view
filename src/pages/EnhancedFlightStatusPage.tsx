
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Plane, Search, AlertTriangle, Clock, Calendar, MapPin, RotateCcw, Filter, Loader2 } from 'lucide-react';
import AutocompleteSearch from '@/components/AutocompleteSearch';
import { SuggestResult } from '@/services/aviationService';
import DelayedFlights from '@/components/DelayedFlights';
import HistoricalFlights from '@/components/HistoricalFlights';
import { cn } from '@/lib/utils';

const EnhancedFlightStatusPage = () => {
  const [searchMode, setSearchMode] = useState<'number' | 'route'>('number');
  const [flightNumber, setFlightNumber] = useState('');
  const [departureAirport, setDepartureAirport] = useState<SuggestResult | null>(null);
  const [arrivalAirport, setArrivalAirport] = useState<SuggestResult | null>(null);
  const [flightDate, setFlightDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeDelayType, setActiveDelayType] = useState<'all' | 'weather' | 'technical' | 'operational'>('all');

  const handleSearch = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      // In a real app, this would call the API with the search parameters
      setLoading(false);
      // Navigate to flight status detail page
      if (searchMode === 'number' && flightNumber) {
        window.location.href = `/flight/${flightNumber}`;
      }
    }, 1500);
  };

  const handleSwapAirports = () => {
    const temp = departureAirport;
    setDepartureAirport(arrivalAirport);
    setArrivalAirport(temp);
  };

  return (
    <div className="min-h-screen bg-dark text-white overflow-x-hidden">
      <Header />
      
      {/* Page Title Section */}
      <section className="pt-32 pb-12 relative">
        <div className="absolute inset-0 bg-radial-gradient from-[#8B0000]/10 via-transparent to-transparent z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold font-space mb-4 animate-fade-in">
              Status <span className="text-[#8B0000] animate-text-glow">Penerbangan</span>
            </h1>
            <h2 className="text-xl md:text-2xl font-medium font-space mb-4 animate-fade-in">
              Flight Status
            </h2>
            <p className="text-lg text-gray-light animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Periksa status penerbangan Anda. Monitor delays, gate changes, and real-time status updates for flights worldwide.
            </p>
          </div>
        </div>
      </section>
      
      {/* Batik Pattern Divider */}
      <div className="w-full h-8 bg-[url('/lovable-uploads/e61de6be-a0a9-4504-bfe9-7416e471d743.png')] bg-repeat-x opacity-15"></div>
      
      {/* Search Controls */}
      <section className="py-10 px-4 bg-[#1A1A1A]/80">
        <div className="max-w-4xl mx-auto glass-panel p-6 md:p-8 backdrop-blur-md border-[#8B0000]/30">
          <Tabs defaultValue="number" onValueChange={(v) => setSearchMode(v as 'number' | 'route')} className="w-full">
            <TabsList className="grid w-full max-w-sm mx-auto grid-cols-2 mb-6">
              <TabsTrigger 
                value="number" 
                className="data-[state=active]:bg-[#8B0000] data-[state=active]:text-white"
              >
                <Plane className="h-4 w-4 mr-2" />
                By Flight Number
              </TabsTrigger>
              <TabsTrigger 
                value="route" 
                className="data-[state=active]:bg-[#8B0000] data-[state=active]:text-white"
              >
                <MapPin className="h-4 w-4 mr-2" />
                By Route
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="number" className="mt-0">
              <div className="max-w-lg mx-auto">
                <div className="mb-4">
                  <label htmlFor="flight-number" className="block text-sm font-medium mb-1">
                    Flight Number (e.g. GA123, SQ956)
                  </label>
                  <div className="relative">
                    <Input
                      id="flight-number"
                      placeholder="Enter flight number"
                      className="bg-dark border-[#8B0000]/20 text-white placeholder-gray-light"
                      value={flightNumber}
                      onChange={(e) => setFlightNumber(e.target.value.toUpperCase())}
                    />
                    <Plane className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-light" />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="flight-date" className="block text-sm font-medium mb-1">
                    Date (Optional)
                  </label>
                  <div className="relative">
                    <Input
                      id="flight-date"
                      type="date"
                      className="bg-dark border-[#8B0000]/20 text-white"
                      value={flightDate}
                      onChange={(e) => setFlightDate(e.target.value)}
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-light" />
                  </div>
                </div>
                
                <div className="text-center mt-6">
                  <Button 
                    className="bg-[#8B0000] hover:bg-[#A80000] text-white hover:shadow-[0_0_8px_#A80000]"
                    onClick={handleSearch}
                    disabled={!flightNumber.trim() || loading}
                  >
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="mr-2 h-4 w-4" />
                    )}
                    Check Flight Status
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="route" className="mt-0">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Departure Airport
                  </label>
                  <AutocompleteSearch 
                    placeholder="Enter airport name or code" 
                    onSelect={setDepartureAirport}
                    type="airport"
                    className="bg-dark border-[#8B0000]/20 text-white"
                  />
                  {departureAirport && (
                    <div className="mt-2 text-sm">
                      <span className="bg-[#8B0000]/20 text-white px-2 py-1 rounded">
                        {departureAirport.name} ({departureAirport.iata_code})
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-center">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full bg-white/5 hover:bg-white/10"
                    onClick={handleSwapAirports}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Arrival Airport
                  </label>
                  <AutocompleteSearch 
                    placeholder="Enter airport name or code" 
                    onSelect={setArrivalAirport}
                    type="airport"
                    className="bg-dark border-[#8B0000]/20 text-white"
                  />
                  {arrivalAirport && (
                    <div className="mt-2 text-sm">
                      <span className="bg-[#8B0000]/20 text-white px-2 py-1 rounded">
                        {arrivalAirport.name} ({arrivalAirport.iata_code})
                      </span>
                    </div>
                  )}
                </div>
                
                <div>
                  <label htmlFor="route-flight-date" className="block text-sm font-medium mb-1">
                    Date (Optional)
                  </label>
                  <div className="relative">
                    <Input
                      id="route-flight-date"
                      type="date"
                      className="bg-dark border-[#8B0000]/20 text-white"
                      value={flightDate}
                      onChange={(e) => setFlightDate(e.target.value)}
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-light" />
                  </div>
                </div>
                
                <div className="text-center mt-6">
                  <Button 
                    className="bg-[#8B0000] hover:bg-[#A80000] text-white hover:shadow-[0_0_8px_#A80000]"
                    onClick={handleSearch}
                    disabled={!departureAirport || !arrivalAirport || loading}
                  >
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="mr-2 h-4 w-4" />
                    )}
                    Find Flights
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      {/* Recent Flight Status */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-semibold font-space">Recently Delayed Flights</h3>
            <div className="flex gap-2 overflow-x-auto pb-2">
              <Button 
                variant="outline" 
                size="sm"
                className={cn(
                  "bg-transparent text-xs",
                  activeDelayType === 'all' 
                    ? "border-[#8B0000] text-white bg-[#8B0000]/10" 
                    : "border-gray-light text-gray-light hover:bg-white/5"
                )}
                onClick={() => setActiveDelayType('all')}
              >
                All Delays
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className={cn(
                  "bg-transparent text-xs",
                  activeDelayType === 'weather' 
                    ? "border-[#8B0000] text-white bg-[#8B0000]/10" 
                    : "border-gray-light text-gray-light hover:bg-white/5"
                )}
                onClick={() => setActiveDelayType('weather')}
              >
                Weather
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className={cn(
                  "bg-transparent text-xs",
                  activeDelayType === 'technical' 
                    ? "border-[#8B0000] text-white bg-[#8B0000]/10" 
                    : "border-gray-light text-gray-light hover:bg-white/5"
                )}
                onClick={() => setActiveDelayType('technical')}
              >
                Technical
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className={cn(
                  "bg-transparent text-xs",
                  activeDelayType === 'operational' 
                    ? "border-[#8B0000] text-white bg-[#8B0000]/10" 
                    : "border-gray-light text-gray-light hover:bg-white/5"
                )}
                onClick={() => setActiveDelayType('operational')}
              >
                Operational
              </Button>
            </div>
          </div>
          
          <div className="mb-12">
            <DelayedFlights filterType={activeDelayType} />
          </div>
          
          <div className="mb-12">
            <h3 className="text-2xl font-semibold font-space mb-6">Flight Status Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-[#1A1A1A] border-[#8B0000]/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">On-Time Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-green-400">84%</div>
                  <p className="text-sm text-gray-light mt-1">
                    of flights today are on schedule
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-[#1A1A1A] border-[#8B0000]/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Average Delay</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-yellow-400">42<span className="text-xl">min</span></div>
                  <p className="text-sm text-gray-light mt-1">
                    average delay time for affected flights
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-[#1A1A1A] border-[#8B0000]/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Flight Cancellations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-red-400">3%</div>
                  <p className="text-sm text-gray-light mt-1">
                    of scheduled flights have been cancelled
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div>
            <HistoricalFlights />
          </div>
        </div>
      </section>
      
      {/* Information Section */}
      <section className="py-12 px-4 bg-[#1A1A1A] relative">
        <div className="absolute inset-0 bg-[url('/lovable-uploads/28f1aa86-908f-4a07-837d-7a69fa78941c.png')] bg-repeat opacity-5"></div>
        <div className="max-w-4xl mx-auto relative">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold font-space mb-3">Informasi Status Penerbangan</h3>
            <h4 className="text-xl font-medium text-[#8B0000] mb-3">Flight Status Information</h4>
          </div>
          
          <div className="space-y-6">
            <div className="bg-dark/30 border border-[#8B0000]/20 rounded-lg p-5">
              <div className="flex items-start">
                <div className="bg-[#8B0000]/10 p-3 rounded-full mr-4">
                  <AlertTriangle className="h-6 w-6 text-[#8B0000]" />
                </div>
                <div>
                  <h5 className="font-medium mb-2">Understanding Flight Delays</h5>
                  <p className="text-gray-light text-sm">
                    Flight delays can occur for various reasons including weather conditions, technical issues, 
                    air traffic congestion, and operational challenges. Airlines typically update status information 
                    as soon as delays are confirmed.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-dark/30 border border-[#8B0000]/20 rounded-lg p-5">
              <div className="flex items-start">
                <div className="bg-[#8B0000]/10 p-3 rounded-full mr-4">
                  <Clock className="h-6 w-6 text-[#8B0000]" />
                </div>
                <div>
                  <h5 className="font-medium mb-2">Status Update Frequency</h5>
                  <p className="text-gray-light text-sm">
                    Flight status information is typically updated every 5 minutes. However, during disruptions 
                    or severe weather events, updates may be less frequent. We recommend checking regularly for 
                    the most current information.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-dark/30 border border-[#8B0000]/20 rounded-lg p-5">
              <div className="flex items-start">
                <div className="bg-[#8B0000]/10 p-3 rounded-full mr-4">
                  <Filter className="h-6 w-6 text-[#8B0000]" />
                </div>
                <div>
                  <h5 className="font-medium mb-2">Status Definitions</h5>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div className="flex items-center">
                      <span className="h-3 w-3 bg-green-400 rounded-full mr-2"></span>
                      <span className="text-sm">On Time: Flight is operating as scheduled</span>
                    </div>
                    <div className="flex items-center">
                      <span className="h-3 w-3 bg-yellow-400 rounded-full mr-2"></span>
                      <span className="text-sm">Delayed: Flight is delayed by any amount of time</span>
                    </div>
                    <div className="flex items-center">
                      <span className="h-3 w-3 bg-blue-400 rounded-full mr-2"></span>
                      <span className="text-sm">Boarding: Passengers are boarding the aircraft</span>
                    </div>
                    <div className="flex items-center">
                      <span className="h-3 w-3 bg-red-500 rounded-full mr-2"></span>
                      <span className="text-sm">Cancelled: Flight has been cancelled</span>
                    </div>
                    <div className="flex items-center">
                      <span className="h-3 w-3 bg-purple-400 rounded-full mr-2"></span>
                      <span className="text-sm">In Air: Flight is currently in the air</span>
                    </div>
                    <div className="flex items-center">
                      <span className="h-3 w-3 bg-gray-400 rounded-full mr-2"></span>
                      <span className="text-sm">Landed: Flight has arrived at destination</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default EnhancedFlightStatusPage;
