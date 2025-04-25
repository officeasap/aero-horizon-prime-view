
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackgroundAircraft from '@/components/BackgroundAircraft';
import VideoBackground from '@/components/VideoBackground';
import { Plane, Calendar, Building, Map, AlertTriangle, MapPin, Cloud, Clock, Phone, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AboutSection from '@/components/AboutSection';
import CurrencyConverter from '@/components/CurrencyConverter';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import NotificationBell from '@/components/NotificationBell';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen text-white overflow-x-hidden relative w-full">
      <Header />
      
      {/* Hero Section with Video Background */}
      <section id="hero" className="relative h-[80vh] flex items-center justify-center pt-16 pb-16 w-full">
        <VideoBackground />
        <BackgroundAircraft />
        
        {/* Content */}
        <div className="w-full px-4 sm:px-8 relative z-10 content-overlay">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-space mb-4 animate-fade-in text-white">
              Real-Time <span className="text-[#8B0000] animate-text-glow">Flight Services</span>
            </h1>
            <p className="text-xl text-gray-light mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Track flights, check schedules, monitor delays, and stay updated with global weather forecasts - all in one place.
            </p>
            <div className="flex flex-wrap justify-center gap-3 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Link to="/flight-schedule">
                <Button variant="outline" className="border-white/20 hover:bg-white/5 w-full sm:w-auto rounded-[14px] hover:shadow-[0_0_8px_#A80000] bg-[#8B0000] hover:bg-[#A80000] text-white border-[#8B0000]">
                  <Calendar className="h-4 w-4 mr-2" />
                  Flight Schedule
                </Button>
              </Link>
              
              <Link to="/live-flight-tracker">
                <Button variant="outline" className="border-white/20 hover:bg-white/5 w-full sm:w-auto rounded-[14px] hover:shadow-[0_0_8px_#A80000] bg-[#8B0000] hover:bg-[#A80000] text-white border-[#8B0000]">
                  <Map className="h-4 w-4 mr-2" />
                  Live Tracker
                </Button>
              </Link>
              
              <Link to="/flight-status">
                <Button variant="outline" className="border-white/20 hover:bg-white/5 w-full sm:w-auto rounded-[14px] hover:shadow-[0_0_8px_#A80000] bg-[#8B0000] hover:bg-[#A80000] text-white border-[#8B0000]">
                  <Plane className="h-4 w-4 mr-2" />
                  Flight Status
                </Button>
              </Link>
              
              <Link to="/airports-airlines">
                <Button variant="outline" className="border-white/20 hover:bg-white/5 w-full sm:w-auto rounded-[14px] hover:shadow-[0_0_8px_#A80000] bg-[#8B0000] hover:bg-[#A80000] text-white border-[#8B0000]">
                  <Building className="h-4 w-4 mr-2" />
                  Airport Information
                </Button>
              </Link>
              
              <Link to="/aviation-info">
                <Button variant="outline" className="border-white/20 hover:bg-white/5 w-full sm:w-auto rounded-[14px] hover:shadow-[0_0_8px_#A80000] bg-[#8B0000] hover:bg-[#A80000] text-white border-[#8B0000]">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Aviation Info
                </Button>
              </Link>
              
              <Link to="/contact">
                <Button variant="outline" className="border-white/20 hover:bg-white/5 w-full sm:w-auto rounded-[14px] hover:shadow-[0_0_8px_#A80000] bg-[#8B0000] hover:bg-[#A80000] text-white border-[#8B0000]">
                  <Phone className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
              </Link>
              
              <NotificationBell variant="button" className="border-white/20 hover:bg-white/5 w-full sm:w-auto rounded-[14px] hover:shadow-[0_0_8px_#A80000] bg-[#8B0000] hover:bg-[#A80000] text-white border-[#8B0000]" />
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-12 relative z-10 bg-dark content-overlay w-full">
        <div className="w-full px-4 sm:px-8 mx-auto">
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
              <Card className="hover:bg-[#1A1A1A] transition-all duration-300 bg-[#1A1A1A] rounded-[12px] border-2 border-[#8B0000] shadow-sm">
                <CardHeader>
                  <div className="w-14 h-14 bg-[#8B0000]/20 rounded-lg flex items-center justify-center mb-4">
                    <Calendar className="text-[#8B0000] h-7 w-7 group-hover:shadow-[0_0_6px_#A80000]" />
                  </div>
                  <CardTitle>Flight Schedule</CardTitle>
                  <CardDescription className="text-white/80">
                    Check real-time flight schedules, departures, and arrivals for airports worldwide.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Link to="/flight-schedule" className="text-[#8B0000] flex items-center gap-1 hover:text-[#A80000] transition-colors hover:shadow-[0_0_6px_#A80000] group">
                    View schedules
                    <svg className="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </CardFooter>
              </Card>
              
              <Card className="hover:bg-[#1A1A1A] transition-all duration-300 bg-[#1A1A1A] rounded-[12px] border-2 border-[#8B0000] shadow-sm">
                <CardHeader>
                  <div className="w-14 h-14 bg-[#8B0000]/20 rounded-lg flex items-center justify-center mb-4">
                    <Plane className="text-[#8B0000] h-7 w-7 group-hover:shadow-[0_0_6px_#A80000]" />
                  </div>
                  <CardTitle>Live Flight Tracking</CardTitle>
                  <CardDescription className="text-white/80">
                    Track any flight in real-time with detailed route mapping, altitude, speed, and status information.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Link to="/live-flight-tracker" className="text-[#8B0000] flex items-center gap-1 hover:text-[#A80000] transition-colors hover:shadow-[0_0_6px_#A80000] group">
                    Track flights
                    <svg className="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </CardFooter>
              </Card>
              
              <Card className="hover:bg-[#1A1A1A] transition-all duration-300 bg-[#1A1A1A] rounded-[12px] border-2 border-[#8B0000] shadow-sm">
                <CardHeader>
                  <div className="w-14 h-14 bg-[#8B0000]/20 rounded-lg flex items-center justify-center mb-4">
                    <AlertTriangle className="text-[#8B0000] h-7 w-7 group-hover:shadow-[0_0_6px_#A80000]" />
                  </div>
                  <CardTitle>Flight Status</CardTitle>
                  <CardDescription className="text-white/80">
                    Monitor delays, gate changes, and real-time status updates for flights worldwide.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Link to="/flight-status" className="text-[#8B0000] flex items-center gap-1 hover:text-[#A80000] transition-colors hover:shadow-[0_0_6px_#A80000] group">
                    Check status
                    <svg className="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </CardFooter>
              </Card>
              
              <Card className="hover:bg-[#1A1A1A] transition-all duration-300 bg-[#1A1A1A] rounded-[12px] border-2 border-[#8B0000] shadow-sm">
                <CardHeader>
                  <div className="w-14 h-14 bg-[#8B0000]/20 rounded-lg flex items-center justify-center mb-4">
                    <MapPin className="text-[#8B0000] h-7 w-7 group-hover:shadow-[0_0_6px_#A80000]" />
                  </div>
                  <CardTitle>Airport & Airline Database</CardTitle>
                  <CardDescription className="text-white/80">
                    Comprehensive information on airports and airlines worldwide, including terminals, facilities, and contact details.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Link to="/airports-airlines" className="text-[#8B0000] flex items-center gap-1 hover:text-[#A80000] transition-colors hover:shadow-[0_0_6px_#A80000] group">
                    Explore database
                    <svg className="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </CardFooter>
              </Card>
              
              <Card className="hover:bg-[#1A1A1A] transition-all duration-300 bg-[#1A1A1A] rounded-[12px] border-2 border-[#8B0000] shadow-sm">
                <CardHeader>
                  <div className="w-14 h-14 bg-[#8B0000]/20 rounded-lg flex items-center justify-center mb-4">
                    <Cloud className="text-[#8B0000] h-7 w-7 group-hover:shadow-[0_0_6px_#A80000]" />
                  </div>
                  <CardTitle>Global Weather Forecast</CardTitle>
                  <CardDescription className="text-white/80">
                    Access real-time weather data for airports around the world to plan your travel better.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Link to="/global-weather" className="text-[#8B0000] flex items-center gap-1 hover:text-[#A80000] transition-colors hover:shadow-[0_0_6px_#A80000] group">
                    View weather
                    <svg className="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </CardFooter>
              </Card>
              
              <Card className="hover:bg-[#1A1A1A] transition-all duration-300 bg-[#1A1A1A] rounded-[12px] border-2 border-[#8B0000] shadow-sm">
                <CardHeader>
                  <div className="w-14 h-14 bg-[#8B0000]/20 rounded-lg flex items-center justify-center mb-4">
                    <Clock className="text-[#8B0000] h-7 w-7 group-hover:shadow-[0_0_6px_#A80000]" />
                  </div>
                  <CardTitle>World Clock</CardTitle>
                  <CardDescription className="text-white/80">
                    Track time differences across multiple cities and timezones to coordinate international flights.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Link to="/world-clock" className="text-[#8B0000] flex items-center gap-1 hover:text-[#A80000] transition-colors hover:shadow-[0_0_6px_#A80000] group">
                    View time zones
                    <svg className="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </CardFooter>
              </Card>
            </div>
            
            <div className="mt-16 text-center">
              <h3 className="text-2xl font-semibold mb-4 text-white">Need Support?</h3>
              <p className="text-gray-light mb-6 max-w-2xl mx-auto">
                Our team is ready to assist you with any questions or concerns about our flight services.
              </p>
              <Link to="/contact">
                <Button variant="outline" size="lg" className="rounded-[14px] hover:shadow-[0_0_8px_#A80000] bg-[#8B0000] hover:bg-[#A80000] text-white border-[#8B0000]">
                  <Phone className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <section className="pt-8 pb-12 relative z-10 bg-dark content-overlay w-full">
        <div className="w-full px-4 sm:px-8 mx-auto">
          <div className="max-w-3xl mx-auto">
            <CurrencyConverter />
          </div>
        </div>
      </section>
      
      <AboutSection />
      <Footer />
    </div>
  );
};

export default Index;
