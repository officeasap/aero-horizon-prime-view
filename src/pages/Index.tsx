
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackgroundAircraft from '@/components/BackgroundAircraft';
import VideoBackground from '@/components/VideoBackground';
import { Plane, MapPin, BarChart3, Search, Clock, Calendar, Cloud, AlertTriangle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AboutSection from '@/components/AboutSection';

const Index = () => {
  return (
    <div className="min-h-screen text-white overflow-x-hidden relative w-full">
      <Header />
      
      {/* Hero Section with Video Background */}
      <section id="hero" className="relative h-[80vh] flex items-center justify-center pt-16 pb-16 w-full">
        <VideoBackground />
        <BackgroundAircraft />
        
        {/* Content */}
        <div className="w-full px-8 relative z-10 content-overlay">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-space mb-4 animate-fade-in text-white">
              Real-Time <span className="text-[#8B0000] animate-text-glow">Flight Services</span>
            </h1>
            <p className="text-xl text-gray-light mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Track flights, check schedules, monitor delays, and stay updated with global weather forecasts - all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <a href="https://app.asaptracker.com" target="_blank" rel="noopener noreferrer">
                <Button variant="redGradient" size="lg" className="w-full sm:w-auto">
                  <Plane className="h-4 w-4" />
                  Sign up for free
                </Button>
              </a>
              <a href="/airports-airlines" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="border-white/20 hover:bg-white/5 w-full sm:w-auto">
                  <Search className="h-4 w-4" />
                  Search Airports
                </Button>
              </a>
              <a href="/world-clock" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="border-white/20 hover:bg-white/5 w-full sm:w-auto">
                  <Clock className="h-4 w-4" />
                  World Clock
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-12 relative z-10 bg-dark content-overlay w-full">
        <div className="w-full px-8 mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold font-space mb-4">
                Enterprise-Level <span className="text-[#8B0000]">Aviation Tools</span>
              </h2>
              <p className="text-gray-light max-w-2xl mx-auto">
                Comprehensive flight tracking and monitoring solutions for travelers, aviation professionals, and businesses.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="p-6 hover:bg-white/5 transition-all duration-300 rounded-[10px] bg-[#2E2E2E] border-2 border-[#8B0000] shadow-sm">
                <div className="w-14 h-14 bg-[#8B0000]/20 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="text-[#8B0000] h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-left text-white">Flight Schedule</h3>
                <p className="text-gray-light text-left">
                  Check real-time flight schedules, departures, and arrivals for airports worldwide.
                </p>
                <a href="/flight-schedule" target="_blank" rel="noopener noreferrer" className="text-[#8B0000] flex items-center gap-1 mt-4 hover:underline">
                  View schedules
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
              
              {/* Feature 2 */}
              <div className="p-6 hover:bg-white/5 transition-all duration-300 rounded-[10px] bg-[#2E2E2E] border-2 border-[#8B0000] shadow-sm">
                <div className="w-14 h-14 bg-[#8B0000]/20 rounded-lg flex items-center justify-center mb-4">
                  <Plane className="text-[#8B0000] h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-left text-white">Live Flight Tracking</h3>
                <p className="text-gray-light text-left">
                  Track any flight in real-time with detailed route mapping, altitude, speed, and status information.
                </p>
                <a href="/live-tracker" target="_blank" rel="noopener noreferrer" className="text-[#8B0000] flex items-center gap-1 mt-4 hover:underline">
                  Track flights
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
              
              {/* Feature 3 */}
              <div className="p-6 hover:bg-white/5 transition-all duration-300 rounded-[10px] bg-[#2E2E2E] border-2 border-[#8B0000] shadow-sm">
                <div className="w-14 h-14 bg-[#8B0000]/20 rounded-lg flex items-center justify-center mb-4">
                  <AlertTriangle className="text-[#8B0000] h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-left text-white">Flight Status</h3>
                <p className="text-gray-light text-left">
                  Monitor delays, gate changes, and real-time status updates for flights worldwide.
                </p>
                <a href="/flight-status" target="_blank" rel="noopener noreferrer" className="text-[#8B0000] flex items-center gap-1 mt-4 hover:underline">
                  Check status
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
              
              {/* Feature 4 */}
              <div className="p-6 hover:bg-white/5 transition-all duration-300 rounded-[10px] bg-[#2E2E2E] border-2 border-[#8B0000] shadow-sm">
                <div className="w-14 h-14 bg-[#8B0000]/20 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="text-[#8B0000] h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-left text-white">Airport & Airline Database</h3>
                <p className="text-gray-light text-left">
                  Comprehensive information on airports and airlines worldwide, including terminals, facilities, and contact details.
                </p>
                <a href="/airports-airlines" target="_blank" rel="noopener noreferrer" className="text-[#8B0000] flex items-center gap-1 mt-4 hover:underline">
                  Explore database
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
              
              {/* Feature 5 */}
              <div className="p-6 hover:bg-white/5 transition-all duration-300 rounded-[10px] bg-[#2E2E2E] border-2 border-[#8B0000] shadow-sm">
                <div className="w-14 h-14 bg-[#8B0000]/20 rounded-lg flex items-center justify-center mb-4">
                  <Cloud className="text-[#8B0000] h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-left text-white">Global Weather Forecast</h3>
                <p className="text-gray-light text-left">
                  Access real-time weather data for airports around the world to plan your travel better.
                </p>
                <a href="/weather" target="_blank" rel="noopener noreferrer" className="text-[#8B0000] flex items-center gap-1 mt-4 hover:underline">
                  View weather
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
              
              {/* Feature 6 */}
              <div className="p-6 hover:bg-white/5 transition-all duration-300 rounded-[10px] bg-[#2E2E2E] border-2 border-[#8B0000] shadow-sm">
                <div className="w-14 h-14 bg-[#8B0000]/20 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="text-[#8B0000] h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-left text-white">World Clock</h3>
                <p className="text-gray-light text-left">
                  Track time differences across multiple cities and timezones to coordinate international flights.
                </p>
                <a href="/world-clock" target="_blank" rel="noopener noreferrer" className="text-[#8B0000] flex items-center gap-1 mt-4 hover:underline">
                  View time zones
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
            
            {/* Contact CTA */}
            <div className="mt-16 text-center">
              <h3 className="text-2xl font-semibold mb-4 text-white">Need Support?</h3>
              <p className="text-gray-light mb-6 max-w-2xl mx-auto">
                Our team is ready to assist you with any questions or concerns about our flight services.
              </p>
              <a href="/contact" target="_blank" rel="noopener noreferrer">
                <Button variant="contact" size="lg">
                  <Phone className="h-4 w-4" />
                  Contact Us
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
      
      {/* About Section */}
      <AboutSection />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
