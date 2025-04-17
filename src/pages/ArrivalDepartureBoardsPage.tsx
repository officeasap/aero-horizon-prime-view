
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { ArrivalBoard, DepartureBoard } from '@/components/FlightBoards';
import { Check, Plane, Clock, Search, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import AutocompleteSearch from '@/components/AutocompleteSearch';
import { SuggestResult } from '@/services/aviationService';

const ArrivalDepartureBoardsPage = () => {
  const [selectedAirport, setSelectedAirport] = useState<SuggestResult | null>(null);
  const [boardType, setBoardType] = useState<'arrivals' | 'departures'>('arrivals');
  const [flightCode, setFlightCode] = useState('');

  return (
    <div className="min-h-screen bg-dark text-white overflow-x-hidden">
      <Header />
      
      {/* Page Title Section */}
      <section className="pt-32 pb-12 relative">
        <div className="absolute inset-0 bg-radial-gradient from-[#8B0000]/10 via-transparent to-transparent z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold font-space mb-4 animate-fade-in">
              Papan <span className="text-[#8B0000] animate-text-glow">Kedatangan & Keberangkatan</span>
            </h1>
            <h2 className="text-xl md:text-2xl font-medium font-space mb-4 animate-fade-in">
              Arrival & Departure Boards
            </h2>
            <p className="text-lg text-gray-light animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Selamat datang! View real-time arrivals and departures for airports worldwide.
            </p>
          </div>
        </div>
      </section>
      
      {/* Batik Pattern Divider */}
      <div className="w-full h-8 bg-[url('/lovable-uploads/e61de6be-a0a9-4504-bfe9-7416e471d743.png')] bg-repeat-x opacity-15"></div>
      
      {/* Main Content */}
      <section className="py-12 px-4 relative">
        <div className="max-w-6xl mx-auto glass-panel p-6 md:p-10 backdrop-blur-md border-[#8B0000]/30">
          <Tabs defaultValue="arrivals" className="w-full" onValueChange={(value) => setBoardType(value as 'arrivals' | 'departures')}>
            <div className="mb-8">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                <TabsTrigger 
                  value="arrivals" 
                  className={cn(
                    "flex items-center gap-2 data-[state=active]:bg-[#8B0000] data-[state=active]:text-white",
                    "data-[state=active]:shadow-[0_0_8px_#A80000]"
                  )}
                >
                  <Plane className="h-4 w-4 rotate-45" />
                  <span>Kedatangan · Arrivals</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="departures" 
                  className={cn(
                    "flex items-center gap-2 data-[state=active]:bg-[#8B0000] data-[state=active]:text-white",
                    "data-[state=active]:shadow-[0_0_8px_#A80000]"
                  )}
                >
                  <Plane className="h-4 w-4 -rotate-45" />
                  <span>Keberangkatan · Departures</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="mb-8">
              <div className="max-w-2xl mx-auto">
                <div className="flex flex-col md:flex-row items-start gap-4">
                  <div className="flex-1 w-full">
                    <p className="mb-2 text-sm text-gray-light">Airport</p>
                    <div className="relative">
                      <AutocompleteSearch 
                        placeholder="Enter airport name or code..." 
                        onSelect={setSelectedAirport}
                        type="airport"
                        className="w-full rounded-[14px] bg-[#1A1A1A] border-[#8B0000]/20 text-white"
                      />
                      <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-light" />
                    </div>
                    {selectedAirport && (
                      <div className="mt-2 text-sm">
                        <span className="bg-[#8B0000]/20 text-white px-2 py-1 rounded">
                          {selectedAirport.name} ({selectedAirport.iata_code})
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="w-full md:w-auto mt-4 md:mt-6">
                    <Button
                      className="w-full bg-[#8B0000] hover:bg-[#A80000] text-white hover:shadow-[0_0_8px_#A80000]"
                    >
                      <Search className="mr-2 h-4 w-4" />
                      View Flights
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-10 max-w-md mx-auto text-center">
              <p className="text-sm text-gray-light mb-3">or enter flight number</p>
              <div className="flex items-center justify-center gap-2">
                <InputOTP 
                  maxLength={6}
                  value={flightCode}
                  onChange={(value) => setFlightCode(value)}
                  render={({ slots }) => (
                    <InputOTPGroup className="gap-2">
                      {slots.map((slot, index) => (
                        <InputOTPSlot 
                          key={index} 
                          {...slot} 
                          className={cn(
                            "bg-[#1A1A1A] border-[#8B0000]/20 text-white w-12 h-12",
                            "focus:border-[#8B0000] focus:ring-[#8B0000]/30"
                          )}
                        />
                      ))}
                    </InputOTPGroup>
                  )}
                />
                <Button
                  variant="ghost" 
                  className="p-3 bg-[#1A1A1A] text-[#8B0000] hover:bg-[#8B0000]/10 hover:text-white"
                >
                  <Check className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <TabsContent value="arrivals" className="mt-0">
              <ArrivalBoard airport={selectedAirport?.iata_code} />
            </TabsContent>
            
            <TabsContent value="departures" className="mt-0">
              <DepartureBoard airport={selectedAirport?.iata_code} />
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      {/* Airport Info Section */}
      <section className="py-12 px-4 bg-[#1A1A1A] relative">
        <div className="absolute inset-0 bg-[url('/lovable-uploads/28f1aa86-908f-4a07-837d-7a69fa78941c.png')] bg-repeat opacity-5"></div>
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-semibold font-space mb-3">Layanan Bandara Utama</h3>
            <h4 className="text-xl font-medium text-[#8B0000] mb-3">Featured Airports</h4>
            <p className="text-gray-light max-w-2xl mx-auto">
              Check real-time flight boards for major international airports in Indonesia and around the world.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Jakarta - CGK */}
            <div className="p-6 border border-[#8B0000]/20 rounded-lg bg-dark/30 backdrop-blur-sm hover:shadow-[0_0_12px_#A80000] transition-all">
              <h5 className="font-semibold mb-2">Soekarno-Hatta International</h5>
              <p className="text-sm text-gray-light mb-3">Jakarta, Indonesia (CGK)</p>
              <div className="flex gap-3 mt-4">
                <Button 
                  size="sm" 
                  variant="outline"
                  className="text-xs bg-transparent border-gray-light text-gray-light hover:bg-white/10"
                  onClick={() => {
                    setBoardType('arrivals');
                    // Set Jakarta airport
                  }}
                >
                  <Plane className="h-3 w-3 mr-1 rotate-45" />
                  Arrivals
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="text-xs bg-transparent border-gray-light text-gray-light hover:bg-white/10"
                  onClick={() => {
                    setBoardType('departures');
                    // Set Jakarta airport
                  }}
                >
                  <Plane className="h-3 w-3 mr-1 -rotate-45" />
                  Departures
                </Button>
              </div>
            </div>
            
            {/* Bali - DPS */}
            <div className="p-6 border border-[#8B0000]/20 rounded-lg bg-dark/30 backdrop-blur-sm hover:shadow-[0_0_12px_#A80000] transition-all">
              <h5 className="font-semibold mb-2">Ngurah Rai International</h5>
              <p className="text-sm text-gray-light mb-3">Bali, Indonesia (DPS)</p>
              <div className="flex gap-3 mt-4">
                <Button 
                  size="sm" 
                  variant="outline"
                  className="text-xs bg-transparent border-gray-light text-gray-light hover:bg-white/10"
                  onClick={() => {
                    setBoardType('arrivals');
                    // Set Bali airport
                  }}
                >
                  <Plane className="h-3 w-3 mr-1 rotate-45" />
                  Arrivals
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="text-xs bg-transparent border-gray-light text-gray-light hover:bg-white/10"
                  onClick={() => {
                    setBoardType('departures');
                    // Set Bali airport
                  }}
                >
                  <Plane className="h-3 w-3 mr-1 -rotate-45" />
                  Departures
                </Button>
              </div>
            </div>
            
            {/* Singapore - SIN */}
            <div className="p-6 border border-[#8B0000]/20 rounded-lg bg-dark/30 backdrop-blur-sm hover:shadow-[0_0_12px_#A80000] transition-all">
              <h5 className="font-semibold mb-2">Changi International</h5>
              <p className="text-sm text-gray-light mb-3">Singapore (SIN)</p>
              <div className="flex gap-3 mt-4">
                <Button 
                  size="sm" 
                  variant="outline"
                  className="text-xs bg-transparent border-gray-light text-gray-light hover:bg-white/10"
                  onClick={() => {
                    setBoardType('arrivals');
                    // Set Singapore airport
                  }}
                >
                  <Plane className="h-3 w-3 mr-1 rotate-45" />
                  Arrivals
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="text-xs bg-transparent border-gray-light text-gray-light hover:bg-white/10"
                  onClick={() => {
                    setBoardType('departures');
                    // Set Singapore airport
                  }}
                >
                  <Plane className="h-3 w-3 mr-1 -rotate-45" />
                  Departures
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default ArrivalDepartureBoardsPage;
