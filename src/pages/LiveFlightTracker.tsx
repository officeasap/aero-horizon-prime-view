
import React from 'react';
import Header from '@/components/Header';
import FlightTracker from '@/components/FlightTracker';
import FlightMap from '@/components/FlightMap';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, List } from 'lucide-react';

const LiveFlightTracker = () => {
  return (
    <div className="min-h-screen bg-dark text-white overflow-x-hidden">
      <Header />
      
      {/* Page Title Section */}
      <section className="pt-32 pb-8 relative">
        <div className="absolute inset-0 bg-radial-gradient from-purple/10 via-transparent to-transparent z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold font-space mb-4 animate-fade-in">
              Live <span className="text-purple animate-text-glow">Flight Tracker</span>
            </h1>
            <p className="text-xl text-gray-light animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Track real-time aircraft positions, routes, and flight statuses across the globe.
            </p>
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <section className="py-10 container mx-auto px-4">
        <Tabs defaultValue="map" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="map" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>Map View</span>
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              <span>List View</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="map" className="mt-0 w-full">
            <div className="bg-gradient-to-b from-purple/5 to-transparent p-1 rounded-xl">
              <FlightMap />
            </div>
          </TabsContent>
          
          <TabsContent value="list" className="mt-0">
            <FlightTracker />
          </TabsContent>
        </Tabs>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LiveFlightTracker;
