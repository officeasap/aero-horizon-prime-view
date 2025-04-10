
import React from 'react';
import Header from '@/components/Header';
import FlightSchedule from '@/components/FlightSchedule';
import FlightTracker from '@/components/FlightTracker';
import DelayedFlights from '@/components/DelayedFlights';
import WeatherForecast from '@/components/WeatherForecast';
import HistoricalFlights from '@/components/HistoricalFlights';
import AboutSection from '@/components/AboutSection';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';
import { Plane, MapPin, BarChart3, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-dark text-white overflow-x-hidden">
      <Header />
      
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
              <Link to="/airports-airlines">
                <Button variant="outline" className="border-white/20 hover:bg-white/5 w-full sm:w-auto">
                  <Search className="h-4 w-4 mr-2" />
                  Search Airports
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Flight Schedule in Hero */}
          <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <FlightSchedule />
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
                  <Plane className="text-purple h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Live Flight Tracking</h3>
                <p className="text-gray-light">
                  Track any flight in real-time with detailed route mapping, altitude, speed, and status information.
                </p>
                <Link to="/live-tracker" className="text-purple flex items-center gap-1 mt-4 hover:underline">
                  Track flights
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              
              {/* Feature 2 */}
              <div className="glass-panel p-6 hover:bg-white/5 transition-all duration-300">
                <div className="w-14 h-14 bg-purple/20 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="text-purple h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Airport & Airline Database</h3>
                <p className="text-gray-light">
                  Comprehensive information on airports and airlines worldwide, including terminals, facilities, and contact details.
                </p>
                <Link to="/airports-airlines" className="text-purple flex items-center gap-1 mt-4 hover:underline">
                  Explore database
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              
              {/* Feature 3 */}
              <div className="glass-panel p-6 hover:bg-white/5 transition-all duration-300">
                <div className="w-14 h-14 bg-purple/20 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="text-purple h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Flight History & Analytics</h3>
                <p className="text-gray-light">
                  Access historical flight data and statistics to analyze past performance, delays, and trends.
                </p>
                <Link to="/flight-status" className="text-purple flex items-center gap-1 mt-4 hover:underline">
                  View analytics
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Flight Historical & Upcoming Data */}
      <HistoricalFlights />
      
      {/* Delayed Flights Section */}
      <DelayedFlights />
      
      {/* Weather Forecast Section */}
      <WeatherForecast />
      
      {/* About Section */}
      <AboutSection />
      
      {/* Contact Form Section */}
      <ContactForm />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
