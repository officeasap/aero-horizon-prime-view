
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Airport, Airline } from '@/services/aviationService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Building, Plane, Globe, AlertTriangle, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const AviationInfo = () => {
  const [activeTab, setActiveTab] = useState('airports');
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Define mock airports data that matches the Airport type
  const mockAirports: Airport[] = [
    {
      id: "jfk",
      name: "John F. Kennedy International Airport",
      iata: "JFK",
      icao: "KJFK",
      city: "New York",
      country: "United States",
      lat: 40.6413,
      lon: -73.7781,
      alt: 13,
      timezone: "America/New_York"
    },
    {
      id: "lhr",
      name: "London Heathrow Airport",
      iata: "LHR",
      icao: "EGLL",
      city: "London",
      country: "United Kingdom",
      lat: 51.4700,
      lon: -0.4543,
      alt: 83,
      timezone: "Europe/London"
    },
    {
      id: "cdg",
      name: "Charles de Gaulle Airport",
      iata: "CDG",
      icao: "LFPG",
      city: "Paris",
      country: "France",
      lat: 49.0097,
      lon: 2.5479,
      alt: 119,
      timezone: "Europe/Paris"
    },
    {
      id: "hnd",
      name: "Tokyo Haneda Airport",
      iata: "HND",
      icao: "RJTT",
      city: "Tokyo",
      country: "Japan",
      lat: 35.5494,
      lon: 139.7798,
      alt: 35,
      timezone: "Asia/Tokyo"
    },
    {
      id: "dxb",
      name: "Dubai International Airport",
      iata: "DXB",
      icao: "OMDB",
      city: "Dubai",
      country: "United Arab Emirates",
      lat: 25.2528,
      lon: 55.3644,
      alt: 62,
      timezone: "Asia/Dubai"
    },
    {
      id: "syd",
      name: "Sydney Kingsford Smith Airport",
      iata: "SYD",
      icao: "YSSY",
      city: "Sydney",
      country: "Australia",
      lat: -33.9399,
      lon: 151.1753,
      alt: 21,
      timezone: "Australia/Sydney"
    }
  ];

  // Define mock airlines data
  const mockAirlines: Airline[] = [
    {
      name: "American Airlines",
      iata_code: "AA",
      icao_code: "AAL",
      country_code: "US",
      country_name: "United States",
      callsign: "AMERICAN",
      fleet_size: 884,
      fleet_average_age: 10.7
    },
    {
      name: "Delta Air Lines",
      iata_code: "DL",
      icao_code: "DAL",
      country_code: "US",
      country_name: "United States",
      callsign: "DELTA",
      fleet_size: 750,
      fleet_average_age: 14.5
    },
    {
      name: "United Airlines",
      iata_code: "UA",
      icao_code: "UAL",
      country_code: "US",
      country_name: "United States",
      callsign: "UNITED",
      fleet_size: 810,
      fleet_average_age: 16.1
    },
    {
      name: "Lufthansa",
      iata_code: "LH",
      icao_code: "DLH",
      country_code: "DE",
      country_name: "Germany",
      callsign: "LUFTHANSA",
      fleet_size: 279,
      fleet_average_age: 11.4
    },
    {
      name: "British Airways",
      iata_code: "BA",
      icao_code: "BAW",
      country_code: "GB",
      country_name: "United Kingdom",
      callsign: "SPEEDBIRD",
      fleet_size: 257,
      fleet_average_age: 12.9
    }
  ];

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    // Simulate search delay
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-dark text-white">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-6">Aviation Information</h1>
        
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Input 
              type="text" 
              placeholder="Search for airports or airlines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-dark/50 border-gray-dark focus:border-purple"
            />
            <Button 
              className="bg-purple hover:bg-purple-600"
              onClick={handleSearch}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </>
              )}
            </Button>
          </div>
          
          <Tabs defaultValue="airports" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="airports" className="data-[state=active]:bg-purple data-[state=active]:text-white">
                <Building className="mr-2 h-4 w-4" />
                Airports
              </TabsTrigger>
              <TabsTrigger value="airlines" className="data-[state=active]:bg-purple data-[state=active]:text-white">
                <Plane className="mr-2 h-4 w-4" />
                Airlines
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="airports">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockAirports.map((airport) => (
                  <Card key={airport.id} className="bg-gray-dark/50 border-gray-dark">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex justify-between items-center">
                        <span className="truncate">{airport.name}</span>
                        <span className="bg-purple/20 text-purple-200 px-2 py-0.5 rounded text-xs font-mono">
                          {airport.iata}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm space-y-1 text-gray-light">
                        <p>ICAO: <span className="text-white">{airport.icao}</span></p>
                        <p>Location: <span className="text-white">{airport.city}, {airport.country}</span></p>
                        <p>Coordinates: <span className="text-white">{airport.lat.toFixed(4)}, {airport.lon.toFixed(4)}</span></p>
                        <p>Timezone: <span className="text-white">{airport.timezone}</span></p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="airlines">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockAirlines.map((airline) => (
                  <Card key={airline.iata_code} className="bg-gray-dark/50 border-gray-dark">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex justify-between items-center">
                        <span className="truncate">{airline.name}</span>
                        <span className="bg-purple/20 text-purple-200 px-2 py-0.5 rounded text-xs font-mono">
                          {airline.iata_code}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm space-y-1 text-gray-light">
                        <p>ICAO: <span className="text-white">{airline.icao_code}</span></p>
                        <p>Country: <span className="text-white">{airline.country_name}</span></p>
                        <p>Callsign: <span className="text-white">{airline.callsign}</span></p>
                        <p>Fleet: <span className="text-white">{airline.fleet_size} aircraft (avg. age {airline.fleet_average_age} years)</span></p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="text-center py-4 text-gray-light">
          <p className="flex items-center justify-center gap-2">
            <AlertTriangle className="h-4 w-4" /> 
            Note: This is sample aviation data for demonstration purposes only
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AviationInfo;
