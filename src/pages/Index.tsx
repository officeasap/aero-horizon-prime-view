
import React from 'react';
import Header from '@/components/Header';
import FlightSchedule from '@/components/FlightSchedule';
import FlightTracker from '@/components/FlightTracker';
import DelayedFlights from '@/components/DelayedFlights';
import WeatherForecast from '@/components/WeatherForecast';
import AboutSection from '@/components/AboutSection';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';
import { Plane } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
              <Button className="bg-purple hover:bg-purple-600 text-white purple-glow">
                Search Flight
              </Button>
              <Button variant="outline" className="border-white/20 hover:bg-white/5">
                View Flight Map
              </Button>
            </div>
          </div>
          
          {/* Flight Schedule in Hero */}
          <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <FlightSchedule />
          </div>
        </div>
      </section>
      
      {/* Flight Tracker Section */}
      <FlightTracker />
      
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
