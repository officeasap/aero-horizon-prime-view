
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackgroundAircraft from '@/components/BackgroundAircraft';
import { Plane, MapPin, BarChart3, Search, Clock, Calendar, Cloud, AlertTriangle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AboutSection from '@/components/AboutSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-dark text-white overflow-x-hidden">
      <Header />
      <BackgroundAircraft />
      
      {/* Hero Section */}
      <section id="hero" className="pt-32 pb-16 relative">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-radial-gradient from-purple/10 via-transparent to-transparent z-0"></div>
        
        {/* Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-space mb-4 animate-fade-in">
              Real-Time <span className="text-purple animate-text-glow">Flight Services</span>
            </h1>
            <p className="text-xl text-gray-light mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Track flights, check schedules, monitor delays, and stay updated with global weather forecasts - all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <a href="https://app.asaptracker.com/signup" target="_blank" rel="noopener noreferrer">
                <Button className="bg-purple hover:bg-purple-600 text-white purple-glow w-full sm:w-auto">
                  <Plane className="h-4 w-4 mr-2" />
                  Sign up for free
                </Button>
              </a>
              <a href="/airports-airlines" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="border-white/20 hover:bg-white/5 w-full sm:w-auto">
                  <Search className="h-4 w-4 mr-2" />
                  Search Airports
                </Button>
              </a>
              <a href="/world-clock" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="border-white/20 hover:bg-white/5 w-full sm:w-auto">
                  <Clock className="h-4 w-4 mr-2" />
                  World Clock
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-12 bg-gradient-to-b from-dark to-gray-dark/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold font-space mb-4">
                Enterprise-Level <span className="text-purple">Aviation Tools</span>
              </h2>
              <p className="text-gray-light max-w-2xl mx-auto">
                Comprehensive flight tracking and monitoring solutions for travelers, aviation professionals, and businesses.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="glass-panel p-6 hover:bg-white/5 transition-all duration-300">
                <div className="w-14 h-14 bg-purple/20 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="text-purple h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Flight Schedule</h3>
                <p className="text-gray-light">
                  Check real-time flight schedules, departures, and arrivals for airports worldwide.
                </p>
                <a href="/flight-schedule" target="_blank" rel="noopener noreferrer" className="text-purple flex items-center gap-1 mt-4 hover:underline">
                  View schedules
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
              
              {/* Feature 2 */}
              <div className="glass-panel p-6 hover:bg-white/5 transition-all duration-300">
                <div className="w-14 h-14 bg-purple/20 rounded-lg flex items-center justify-center mb-4">
                  <Plane className="text-purple h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Live Flight Tracking</h3>
                <p className="text-gray-light">
                  Track any flight in real-time with detailed route mapping, altitude, speed, and status information.
                </p>
                <a href="/live-tracker" target="_blank" rel="noopener noreferrer" className="text-purple flex items-center gap-1 mt-4 hover:underline">
                  Track flights
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
              
              {/* Feature 3 */}
              <div className="glass-panel p-6 hover:bg-white/5 transition-all duration-300">
                <div className="w-14 h-14 bg-purple/20 rounded-lg flex items-center justify-center mb-4">
                  <AlertTriangle className="text-purple h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Flight Status</h3>
                <p className="text-gray-light">
                  Monitor delays, gate changes, and real-time status updates for flights worldwide.
                </p>
                <a href="/flight-status" target="_blank" rel="noopener noreferrer" className="text-purple flex items-center gap-1 mt-4 hover:underline">
                  Check status
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
              
              {/* Feature 4 */}
              <div className="glass-panel p-6 hover:bg-white/5 transition-all duration-300">
                <div className="w-14 h-14 bg-purple/20 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="text-purple h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Airport & Airline Database</h3>
                <p className="text-gray-light">
                  Comprehensive information on airports and airlines worldwide, including terminals, facilities, and contact details.
                </p>
                <a href="/airports-airlines" target="_blank" rel="noopener noreferrer" className="text-purple flex items-center gap-1 mt-4 hover:underline">
                  Explore database
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
              
              {/* Feature 5 */}
              <div className="glass-panel p-6 hover:bg-white/5 transition-all duration-300">
                <div className="w-14 h-14 bg-purple/20 rounded-lg flex items-center justify-center mb-4">
                  <Cloud className="text-purple h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Global Weather Forecast</h3>
                <p className="text-gray-light">
                  Access real-time weather data for airports around the world to plan your travel better.
                </p>
                <a href="/weather" target="_blank" rel="noopener noreferrer" className="text-purple flex items-center gap-1 mt-4 hover:underline">
                  View weather
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
              
              {/* Feature 6 */}
              <div className="glass-panel p-6 hover:bg-white/5 transition-all duration-300">
                <div className="w-14 h-14 bg-purple/20 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="text-purple h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold mb-2">World Clock</h3>
                <p className="text-gray-light">
                  Track time differences across multiple cities and timezones to coordinate international flights.
                </p>
                <a href="/world-clock" target="_blank" rel="noopener noreferrer" className="text-purple flex items-center gap-1 mt-4 hover:underline">
                  View time zones
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
            
            {/* Contact CTA */}
            <div className="mt-16 text-center">
              <h3 className="text-2xl font-semibold mb-4">Need Support?</h3>
              <p className="text-gray-light mb-6 max-w-2xl mx-auto">
                Our team is ready to assist you with any questions or concerns about our flight services.
              </p>
              <a href="/contact" target="_blank" rel="noopener noreferrer">
                <Button className="bg-purple hover:bg-purple-600 text-white purple-glow">
                  <Phone className="h-4 w-4 mr-2" />
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
