
import React from 'react';
import Header from '@/components/Header';
import FlightTracker from '@/components/FlightTracker';
import FlightMap from '@/components/FlightMap';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, List, Info, Plane } from 'lucide-react';
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

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
              Most <span className="text-purple animate-text-glow">Tracked Flights</span>
            </h1>
            <p className="text-xl text-gray-light animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Track the world's most followed flights in real-time with live positions and detailed information.
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
            
            <div className="mt-4 text-sm text-gray-light text-center flex items-center justify-center gap-2">
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
                      This flight tracker displays real-time data for the most tracked flights worldwide. 
                      Data is refreshed every 60 seconds and includes commercial, private, and special flights 
                      that are currently being followed by users around the globe.
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
          </TabsContent>
          
          <TabsContent value="list" className="mt-0">
            <FlightTracker />
          </TabsContent>
        </Tabs>
      </section>
      
      <Footer />
    </div>
  );
};

export default LiveFlightTracker;
