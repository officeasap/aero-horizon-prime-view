
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Search, Building2, Plane } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Sample airport data
const airports = [
  { name: 'Hartsfield-Jackson Atlanta International Airport', city: 'Atlanta', country: 'United States', code: 'ATL', icao: 'KATL', type: 'International' },
  { name: 'Beijing Capital International Airport', city: 'Beijing', country: 'China', code: 'PEK', icao: 'ZBAA', type: 'International' },
  { name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'United States', code: 'LAX', icao: 'KLAX', type: 'International' },
  { name: 'Dubai International Airport', city: 'Dubai', country: 'United Arab Emirates', code: 'DXB', icao: 'OMDB', type: 'International' },
  { name: 'Tokyo Haneda Airport', city: 'Tokyo', country: 'Japan', code: 'HND', icao: 'RJTT', type: 'International' },
  { name: 'London Heathrow Airport', city: 'London', country: 'United Kingdom', code: 'LHR', icao: 'EGLL', type: 'International' },
  { name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France', code: 'CDG', icao: 'LFPG', type: 'International' },
  { name: 'Singapore Changi Airport', city: 'Singapore', country: 'Singapore', code: 'SIN', icao: 'WSSS', type: 'International' },
];

// Sample airline data
const airlines = [
  { name: 'Emirates', code: 'EK', country: 'United Arab Emirates', fleet: 265, hub: 'Dubai International Airport' },
  { name: 'British Airways', code: 'BA', country: 'United Kingdom', fleet: 280, hub: 'London Heathrow Airport' },
  { name: 'Singapore Airlines', code: 'SQ', country: 'Singapore', fleet: 127, hub: 'Singapore Changi Airport' },
  { name: 'Lufthansa', code: 'LH', country: 'Germany', fleet: 279, hub: 'Frankfurt Airport' },
  { name: 'Qatar Airways', code: 'QR', country: 'Qatar', fleet: 234, hub: 'Hamad International Airport' },
  { name: 'United Airlines', code: 'UA', country: 'United States', fleet: 860, hub: 'O\'Hare International Airport' },
  { name: 'Delta Air Lines', code: 'DL', country: 'United States', fleet: 850, hub: 'Hartsfield-Jackson Atlanta International Airport' },
  { name: 'American Airlines', code: 'AA', country: 'United States', fleet: 956, hub: 'Dallas/Fort Worth International Airport' },
];

const AirportsAirlines = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('airports');
  
  const filteredAirports = airports.filter(airport => 
    airport.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    airport.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    airport.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    airport.country.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredAirlines = airlines.filter(airline => 
    airline.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    airline.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    airline.country.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
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
                  className="bg-gray-dark/50 border-gray-dark text-white placeholder:text-gray-light focus:border-purple rounded-lg pr-10 w-full"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-light h-4 w-4" />
              </div>
              
              <Tabs defaultValue="airports" className="w-full md:w-auto" onValueChange={setActiveTab}>
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
                      {filteredAirports.map((airport, index) => (
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
                            <Button variant="outline" size="sm" className="bg-transparent border-purple/50 text-purple hover:bg-purple/20">
                              View Details
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="airlines" className="mt-0">
              <div className="glass-panel overflow-hidden">
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
                      {filteredAirlines.map((airline, index) => (
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
                            <Button variant="outline" size="sm" className="bg-transparent border-purple/50 text-purple hover:bg-purple/20">
                              View Details
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 flex justify-center">
            <Button className="bg-purple hover:bg-purple-600 text-white purple-glow">
              Load More
            </Button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AirportsAirlines;
