
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaneIcon, Globe, AlertTriangle, Landmark, BookIcon, Route } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const AviationInfo = () => {
  return (
    <div className="min-h-screen bg-dark text-white overflow-x-hidden">
      <Header />
      
      {/* Page Title Section */}
      <section className="pt-32 pb-12 relative">
        <div className="absolute inset-0 bg-radial-gradient from-[#8B0000]/10 via-transparent to-transparent z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-space mb-4 animate-fade-in">
              <span className="text-[#8B0000] animate-text-glow">Aviation</span> Information
            </h1>
            <p className="text-lg text-gray-light animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Your comprehensive guide to aviation data, codes, and essential information
            </p>
          </div>
        </div>
      </section>
      
      {/* Batik Pattern Divider */}
      <div className="w-full h-8 bg-[url('/lovable-uploads/e61de6be-a0a9-4504-bfe9-7416e471d743.png')] bg-repeat-x opacity-15"></div>
      
      {/* Main Content */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <Tabs defaultValue="aircraft" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-8 bg-transparent">
              <TabsTrigger value="aircraft" className="bg-[#8B0000]/70 hover:bg-[#A80000] text-white data-[state=active]:bg-[#A80000] data-[state=active]:shadow-[0_0_8px_#A80000]">
                <PlaneIcon className="h-4 w-4 mr-2" />
                Aircraft
              </TabsTrigger>
              <TabsTrigger value="airlines" className="bg-[#8B0000]/70 hover:bg-[#A80000] text-white data-[state=active]:bg-[#A80000] data-[state=active]:shadow-[0_0_8px_#A80000]">
                <Globe className="h-4 w-4 mr-2" />
                Airlines
              </TabsTrigger>
              <TabsTrigger value="airports" className="bg-[#8B0000]/70 hover:bg-[#A80000] text-white data-[state=active]:bg-[#A80000] data-[state=active]:shadow-[0_0_8px_#A80000]">
                <Landmark className="h-4 w-4 mr-2" />
                Airports
              </TabsTrigger>
              <TabsTrigger value="codes" className="bg-[#8B0000]/70 hover:bg-[#A80000] text-white data-[state=active]:bg-[#A80000] data-[state=active]:shadow-[0_0_8px_#A80000]">
                <BookIcon className="h-4 w-4 mr-2" />
                IATA/ICAO
              </TabsTrigger>
              <TabsTrigger value="routes" className="bg-[#8B0000]/70 hover:bg-[#A80000] text-white data-[state=active]:bg-[#A80000] data-[state=active]:shadow-[0_0_8px_#A80000]">
                <Route className="h-4 w-4 mr-2" />
                Routes
              </TabsTrigger>
              <TabsTrigger value="taxes" className="bg-[#8B0000]/70 hover:bg-[#A80000] text-white data-[state=active]:bg-[#A80000] data-[state=active]:shadow-[0_0_8px_#A80000]">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Taxes
              </TabsTrigger>
            </TabsList>
            
            <div className="glass-panel p-6 rounded-lg border border-white/10">
              <TabsContent value="aircraft" className="mt-0">
                <h2 className="text-2xl font-bold mb-4">Aircraft Types</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {['Airbus A380', 'Boeing 747', 'Boeing 777', 'Airbus A350', 'Boeing 787', 'Airbus A330'].map((aircraft, index) => (
                    <Card key={index} className="bg-gray-dark/50 border-white/5 text-white">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <PlaneIcon className="h-5 w-5 text-[#8B0000]" />
                          {aircraft}
                        </CardTitle>
                        <CardDescription className="text-gray-light">
                          Commercial Wide-body Aircraft
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-light">Manufacturer</span>
                            <Badge variant="outline" className="bg-[#8B0000]/10 text-white border-[#8B0000]/30">
                              {aircraft.includes('Airbus') ? 'Airbus' : 'Boeing'}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-light">Category</span>
                            <Badge variant="outline" className="bg-[#8B0000]/10 text-white border-[#8B0000]/30">
                              Wide-body
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full">
                          View Specifications
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="airlines" className="mt-0">
                <h2 className="text-2xl font-bold mb-4">Airline Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { name: 'Emirates', code: 'EK', hub: 'Dubai (DXB)' },
                    { name: 'Singapore Airlines', code: 'SQ', hub: 'Singapore (SIN)' },
                    { name: 'Qatar Airways', code: 'QR', hub: 'Doha (DOH)' },
                    { name: 'Garuda Indonesia', code: 'GA', hub: 'Jakarta (CGK)' },
                    { name: 'Cathay Pacific', code: 'CX', hub: 'Hong Kong (HKG)' },
                    { name: 'ANA', code: 'NH', hub: 'Tokyo (HND/NRT)' }
                  ].map((airline, index) => (
                    <Card key={index} className="bg-gray-dark/50 border-white/5 text-white">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Globe className="h-5 w-5 text-[#8B0000]" />
                          {airline.name}
                        </CardTitle>
                        <CardDescription className="text-gray-light">
                          IATA: {airline.code}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-light">Hub</span>
                            <Badge variant="outline" className="bg-[#8B0000]/10 text-white border-[#8B0000]/30">
                              {airline.hub}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-light">Alliance</span>
                            <Badge variant="outline" className="bg-[#8B0000]/10 text-white border-[#8B0000]/30">
                              {airline.name === 'Emirates' || airline.name === 'Cathay Pacific' ? 'oneworld' : 
                               airline.name === 'Singapore Airlines' || airline.name === 'ANA' ? 'Star Alliance' : 
                               airline.name === 'Qatar Airways' ? 'oneworld' : 'SkyTeam'}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full">
                          View Airline Details
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="airports" className="mt-0">
                <h2 className="text-2xl font-bold mb-4">Airport Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { name: 'Soekarno-Hatta International Airport', code: 'CGK', city: 'Jakarta, Indonesia' },
                    { name: 'Singapore Changi Airport', code: 'SIN', city: 'Singapore' },
                    { name: 'Dubai International Airport', code: 'DXB', city: 'Dubai, UAE' },
                    { name: 'Incheon International Airport', code: 'ICN', city: 'Seoul, South Korea' },
                    { name: 'Hamad International Airport', code: 'DOH', city: 'Doha, Qatar' },
                    { name: 'Tokyo Haneda Airport', code: 'HND', city: 'Tokyo, Japan' }
                  ].map((airport, index) => (
                    <Card key={index} className="bg-gray-dark/50 border-white/5 text-white">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Landmark className="h-5 w-5 text-[#8B0000]" />
                          {airport.code}
                        </CardTitle>
                        <CardDescription className="text-gray-light">
                          {airport.name}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-light">Location</span>
                            <Badge variant="outline" className="bg-[#8B0000]/10 text-white border-[#8B0000]/30">
                              {airport.city}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-light">IATA Code</span>
                            <Badge variant="outline" className="bg-[#8B0000]/10 text-white border-[#8B0000]/30">
                              {airport.code}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full">
                          View Airport Details
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="codes" className="mt-0">
                <h2 className="text-2xl font-bold mb-4">ICAO & IATA Codes</h2>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-[#8B0000]/20 border-b border-white/10">
                        <th className="p-3 text-left">Entity</th>
                        <th className="p-3 text-left">IATA Code</th>
                        <th className="p-3 text-left">ICAO Code</th>
                        <th className="p-3 text-left">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-white/5 hover:bg-white/5">
                        <td className="p-3">Singapore Airlines</td>
                        <td className="p-3">SQ</td>
                        <td className="p-3">SIA</td>
                        <td className="p-3">The flag carrier of Singapore</td>
                      </tr>
                      <tr className="border-b border-white/5 hover:bg-white/5">
                        <td className="p-3">Garuda Indonesia</td>
                        <td className="p-3">GA</td>
                        <td className="p-3">GIA</td>
                        <td className="p-3">The national airline of Indonesia</td>
                      </tr>
                      <tr className="border-b border-white/5 hover:bg-white/5">
                        <td className="p-3">Changi Airport</td>
                        <td className="p-3">SIN</td>
                        <td className="p-3">WSSS</td>
                        <td className="p-3">Primary civilian airport for Singapore</td>
                      </tr>
                      <tr className="border-b border-white/5 hover:bg-white/5">
                        <td className="p-3">Soekarno-Hatta Airport</td>
                        <td className="p-3">CGK</td>
                        <td className="p-3">WIII</td>
                        <td className="p-3">Main airport serving Jakarta, Indonesia</td>
                      </tr>
                      <tr className="border-b border-white/5 hover:bg-white/5">
                        <td className="p-3">Boeing 777-300ER</td>
                        <td className="p-3">77W</td>
                        <td className="p-3">B77W</td>
                        <td className="p-3">Long-range wide-body aircraft</td>
                      </tr>
                      <tr className="border-b border-white/5 hover:bg-white/5">
                        <td className="p-3">Airbus A350-900</td>
                        <td className="p-3">359</td>
                        <td className="p-3">A359</td>
                        <td className="p-3">Long-range wide-body airliner</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              
              <TabsContent value="routes" className="mt-0">
                <h2 className="text-2xl font-bold mb-4">Popular Flight Routes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { from: 'Jakarta (CGK)', to: 'Singapore (SIN)', distance: '880 km', duration: '1h 45m' },
                    { from: 'Singapore (SIN)', to: 'Hong Kong (HKG)', distance: '2,570 km', duration: '3h 55m' },
                    { from: 'Jakarta (CGK)', to: 'Tokyo (NRT)', distance: '5,778 km', duration: '7h 10m' },
                    { from: 'Singapore (SIN)', to: 'London (LHR)', distance: '10,841 km', duration: '13h 30m' },
                    { from: 'Jakarta (CGK)', to: 'Dubai (DXB)', distance: '6,590 km', duration: '8h 10m' },
                    { from: 'Singapore (SIN)', to: 'Sydney (SYD)', distance: '6,291 km', duration: '7h 45m' }
                  ].map((route, index) => (
                    <Card key={index} className="bg-gray-dark/50 border-white/5 text-white">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Route className="h-5 w-5 text-[#8B0000]" />
                          {route.from} → {route.to}
                        </CardTitle>
                        <CardDescription className="text-gray-light">
                          Popular international route
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-light">Distance</span>
                            <Badge variant="outline" className="bg-[#8B0000]/10 text-white border-[#8B0000]/30">
                              {route.distance}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-light">Flight Duration</span>
                            <Badge variant="outline" className="bg-[#8B0000]/10 text-white border-[#8B0000]/30">
                              {route.duration}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full">
                          View Route Details
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="taxes" className="mt-0">
                <h2 className="text-2xl font-bold mb-4">Aviation Taxes & Fees</h2>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-[#8B0000]/20 border-b border-white/10">
                        <th className="p-3 text-left">Tax/Fee Type</th>
                        <th className="p-3 text-left">Code</th>
                        <th className="p-3 text-left">Typical Range</th>
                        <th className="p-3 text-left">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-white/5 hover:bg-white/5">
                        <td className="p-3">Passenger Service Charge</td>
                        <td className="p-3">PSC</td>
                        <td className="p-3">$15-30</td>
                        <td className="p-3">Fee for use of airport facilities</td>
                      </tr>
                      <tr className="border-b border-white/5 hover:bg-white/5">
                        <td className="p-3">Security Service Charge</td>
                        <td className="p-3">SSC</td>
                        <td className="p-3">$5-15</td>
                        <td className="p-3">Fee for security screening</td>
                      </tr>
                      <tr className="border-b border-white/5 hover:bg-white/5">
                        <td className="p-3">Value Added Tax</td>
                        <td className="p-3">VAT</td>
                        <td className="p-3">0-20%</td>
                        <td className="p-3">Government tax on services</td>
                      </tr>
                      <tr className="border-b border-white/5 hover:bg-white/5">
                        <td className="p-3">Airport Development Fee</td>
                        <td className="p-3">ADF</td>
                        <td className="p-3">$10-25</td>
                        <td className="p-3">Fee for airport infrastructure development</td>
                      </tr>
                      <tr className="border-b border-white/5 hover:bg-white/5">
                        <td className="p-3">International Departure Tax</td>
                        <td className="p-3">IDT</td>
                        <td className="p-3">$15-50</td>
                        <td className="p-3">Tax for departing a country</td>
                      </tr>
                      <tr className="border-b border-white/5 hover:bg-white/5">
                        <td className="p-3">Fuel Surcharge</td>
                        <td className="p-3">YQ/YR</td>
                        <td className="p-3">Varies</td>
                        <td className="p-3">Charge to offset fluctuating fuel costs</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default AviationInfo;
