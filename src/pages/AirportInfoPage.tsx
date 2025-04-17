
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, MapPin, Phone, Clock, Plane, Search, Info, Globe, Map, Coffee, Utensils, ShoppingBag, Wifi, AlertTriangle, Calendar } from 'lucide-react';
import AutocompleteSearch from '@/components/AutocompleteSearch';
import { SuggestResult } from '@/services/aviationService';
import { AirportDetail } from '@/components/AirportDetail';

const AirportInfoPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAirport, setSelectedAirport] = useState<SuggestResult | null>(null);

  const popularAirports = [
    {
      name: "Soekarno-Hatta International",
      code: "CGK",
      city: "Jakarta",
      country: "Indonesia",
      image: "https://plus.unsplash.com/premium_photo-1661899053056-dd86095ad33e?q=80&w=1170&auto=format&fit=crop"
    },
    {
      name: "Ngurah Rai International",
      code: "DPS",
      city: "Denpasar",
      country: "Indonesia",
      image: "https://images.unsplash.com/photo-1676560061566-a392c49d002f?q=80&w=1032&auto=format&fit=crop"
    },
    {
      name: "Changi International",
      code: "SIN",
      city: "Singapore",
      country: "Singapore",
      image: "https://images.unsplash.com/photo-1575977591528-3e27a90f0f98?q=80&w=1170&auto=format&fit=crop"
    },
    {
      name: "Kuala Lumpur International",
      code: "KUL",
      city: "Kuala Lumpur",
      country: "Malaysia",
      image: "https://images.unsplash.com/photo-1609868105325-b9b6fe8c2257?q=80&w=1170&auto=format&fit=crop"
    },
    {
      name: "Kansai International",
      code: "KIX",
      city: "Osaka",
      country: "Japan",
      image: "https://images.unsplash.com/photo-1592560738372-2c47121b75e5?q=80&w=1170&auto=format&fit=crop"
    },
    {
      name: "Incheon International",
      code: "ICN",
      city: "Seoul",
      country: "South Korea",
      image: "https://images.unsplash.com/photo-1569154934119-5ae98d0d75c4?q=80&w=1170&auto=format&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-dark text-white overflow-x-hidden">
      <Header />
      
      {/* Page Title Section */}
      <section className="pt-32 pb-12 relative">
        <div className="absolute inset-0 bg-radial-gradient from-[#8B0000]/10 via-transparent to-transparent z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold font-space mb-4 animate-fade-in">
              Informasi <span className="text-[#8B0000] animate-text-glow">Bandara</span>
            </h1>
            <h2 className="text-xl md:text-2xl font-medium font-space mb-4 animate-fade-in">
              Airport Information
            </h2>
            <p className="text-lg text-gray-light animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Temukan informasi lengkap tentang bandara di seluruh dunia, termasuk fasilitas, terminal, dan layanan.
            </p>
          </div>
        </div>
      </section>
      
      {/* Batik Pattern Divider */}
      <div className="w-full h-8 bg-[url('/lovable-uploads/e61de6be-a0a9-4504-bfe9-7416e471d743.png')] bg-repeat-x opacity-15"></div>
      
      {/* Search Section */}
      <section className="py-10 px-4 bg-[#1A1A1A]/80">
        <div className="max-w-3xl mx-auto glass-panel p-6 md:p-8 backdrop-blur-md border-[#8B0000]/30 rounded-[12px]">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-semibold mb-2">Find Airport Information</h3>
            <p className="text-gray-light">
              Search by airport name, city, or IATA code (e.g., CGK, SIN, DPS)
            </p>
          </div>
          
          <div className="flex flex-col gap-4">
            <div className="relative">
              <AutocompleteSearch 
                placeholder="Search for an airport..." 
                onSelect={setSelectedAirport}
                type="airport"
                className="w-full rounded-[14px] bg-dark border-[#8B0000]/20 text-white"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-light" />
            </div>
            
            {selectedAirport && (
              <div className="text-center">
                <Button 
                  className="bg-[#8B0000] hover:bg-[#A80000] text-white hover:shadow-[0_0_8px_#A80000]"
                >
                  <Building2 className="mr-2 h-4 w-4" />
                  View Airport Details
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Selected Airport Details or Popular Airports */}
      <section className="py-12 px-4">
        {selectedAirport ? (
          <AirportDetail airport={selectedAirport} />
        ) : (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <h3 className="text-2xl font-semibold font-space mb-3">Bandara Populer</h3>
              <h4 className="text-xl font-medium text-[#8B0000] mb-3">Popular Airports</h4>
              <p className="text-gray-light max-w-2xl mx-auto">
                Explore detailed information about these frequently visited airports in Asia Pacific.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularAirports.map((airport, index) => (
                <Card key={airport.code} className="bg-[#1A1A1A] border-[#8B0000]/20 overflow-hidden hover:shadow-[0_0_12px_#A80000] transition-all">
                  <div className="h-40 overflow-hidden">
                    <img 
                      src={airport.image} 
                      alt={airport.name}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex justify-between items-center">
                      <span>{airport.name}</span>
                      <span className="text-lg font-mono text-[#8B0000]">{airport.code}</span>
                    </CardTitle>
                    <CardDescription className="text-gray-light">
                      {airport.city}, {airport.country}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 pb-4">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-1.5">
                        <Plane className="h-3.5 w-3.5 text-[#8B0000]" />
                        <span>International</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5 text-[#8B0000]" />
                        <span>Multiple Terminals</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-[#8B0000]" />
                        <span>24/7 Operation</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <ShoppingBag className="h-3.5 w-3.5 text-[#8B0000]" />
                        <span>Duty Free</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button 
                      className="w-full bg-[#8B0000] hover:bg-[#A80000] text-white"
                      onClick={() => {
                        // Set selected airport
                        setSelectedAirport({
                          name: airport.name,
                          iata_code: airport.code,
                          city: airport.city,
                          country: airport.country
                        });
                      }}
                    >
                      <Info className="mr-2 h-4 w-4" />
                      Airport Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}
      </section>
      
      {/* Airport Services Section */}
      <section className="py-12 px-4 bg-[#1A1A1A] relative">
        <div className="absolute inset-0 bg-[url('/lovable-uploads/28f1aa86-908f-4a07-837d-7a69fa78941c.png')] bg-repeat opacity-5"></div>
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-semibold font-space mb-3">Layanan Bandara</h3>
            <h4 className="text-xl font-medium text-[#8B0000] mb-3">Airport Services</h4>
            <p className="text-gray-light max-w-2xl mx-auto">
              Discover the services and amenities available at most international airports.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-dark/30 backdrop-blur-sm border border-[#8B0000]/20 p-6 rounded-lg text-center hover:scale-105 transition-transform">
              <div className="mx-auto w-16 h-16 bg-[#8B0000]/10 rounded-full flex items-center justify-center mb-4">
                <Utensils className="h-8 w-8 text-[#8B0000]" />
              </div>
              <h5 className="font-medium mb-2">Food & Beverage</h5>
              <p className="text-sm text-gray-light">
                Local and international dining options for all tastes.
              </p>
            </div>
            
            <div className="bg-dark/30 backdrop-blur-sm border border-[#8B0000]/20 p-6 rounded-lg text-center hover:scale-105 transition-transform">
              <div className="mx-auto w-16 h-16 bg-[#8B0000]/10 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="h-8 w-8 text-[#8B0000]" />
              </div>
              <h5 className="font-medium mb-2">Shopping</h5>
              <p className="text-sm text-gray-light">
                Duty free and retail stores for your shopping needs.
              </p>
            </div>
            
            <div className="bg-dark/30 backdrop-blur-sm border border-[#8B0000]/20 p-6 rounded-lg text-center hover:scale-105 transition-transform">
              <div className="mx-auto w-16 h-16 bg-[#8B0000]/10 rounded-full flex items-center justify-center mb-4">
                <Wifi className="h-8 w-8 text-[#8B0000]" />
              </div>
              <h5 className="font-medium mb-2">Connectivity</h5>
              <p className="text-sm text-gray-light">
                Free Wi-Fi, charging stations, and business facilities.
              </p>
            </div>
            
            <div className="bg-dark/30 backdrop-blur-sm border border-[#8B0000]/20 p-6 rounded-lg text-center hover:scale-105 transition-transform">
              <div className="mx-auto w-16 h-16 bg-[#8B0000]/10 rounded-full flex items-center justify-center mb-4">
                <Coffee className="h-8 w-8 text-[#8B0000]" />
              </div>
              <h5 className="font-medium mb-2">Lounges</h5>
              <p className="text-sm text-gray-light">
                Premium lounges for comfort and relaxation before flights.
              </p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-[#8B0000] font-semibold mb-3">Need flight information?</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/flight-schedule">
                <Button variant="outline" className="bg-transparent border-[#8B0000] text-white hover:bg-[#8B0000]/10">
                  <Calendar className="mr-2 h-4 w-4" />
                  Flight Schedule
                </Button>
              </a>
              <a href="/live-flight-tracker">
                <Button variant="outline" className="bg-transparent border-[#8B0000] text-white hover:bg-[#8B0000]/10">
                  <Plane className="mr-2 h-4 w-4" />
                  Live Tracker
                </Button>
              </a>
              <a href="/flight-status">
                <Button variant="outline" className="bg-transparent border-[#8B0000] text-white hover:bg-[#8B0000]/10">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Flight Status
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default AirportInfoPage;
